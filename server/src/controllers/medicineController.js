const mongoose = require('mongoose');
const XLSX = require('xlsx');
const Medicine = require('../models/Medicine');
const Category = require('../models/Category');
const SearchQuery = require('../models/SearchQuery');
const { clearCache } = require('../middlewares/cacheMiddleware');
const sanitizeError = require('../utils/sanitizeError');

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Public
exports.getMedicines = async (req, res, next) => {
  try {
    let query;

    // Explicit allowlist of fields that may be used as filters — prevents MongoDB operator injection
    const ALLOWED_FILTERS = ['status', 'category', 'brand', 'isBestSeller', 'isNewAndBest', 'prescription'];
    const BOOLEAN_FILTERS = new Set(['isBestSeller', 'isNewAndBest']);
    const filter = {};
    for (const key of ALLOWED_FILTERS) {
      if (req.query[key] !== undefined) {
        if (BOOLEAN_FILTERS.has(key)) {
          filter[key] = req.query[key] === 'true';
        } else {
          filter[key] = req.query[key];
        }
      }
    }

    // Extract search query (prioritizing q/search/name[regex] keys)
    let searchVal = '';
    if (req.query.q) {
      searchVal = req.query.q;
    } else if (req.query.search) {
      searchVal = req.query.search;
    } else if (req.query['name[regex]']) {
      searchVal = req.query['name[regex]'];
    } else if (req.query.name) {
      searchVal = typeof req.query.name === 'string' ? req.query.name : (req.query.name.regex || '');
    }

    if (searchVal) {
      const cleanSearch = String(searchVal).trim();
      if (cleanSearch) {
        // Track user search query asynchronously if length is >= 3
        if (cleanSearch.length >= 3) {
          SearchQuery.findOneAndUpdate(
            { query: cleanSearch.toLowerCase() },
            {
              $inc: { count: 1 },
              $setOnInsert: { originalQuery: cleanSearch },
              updatedAt: new Date()
            },
            { upsert: true }
          ).catch((err) => console.error('Error tracking search query:', err));
        }

        const words = cleanSearch.split(/\s+/).filter(Boolean);
        if (words.length > 0) {
          const Brand = require('../models/Brand');
          // Resolve categories and brands that match the clean search string
          const [matchedCats, matchedBrands] = await Promise.all([
            Category.find({ name: { $regex: cleanSearch, $options: 'i' } }).select('_id').lean(),
            Brand.find({ name: { $regex: cleanSearch, $options: 'i' } }).select('_id').lean()
          ]);

          const catIds = matchedCats.map(c => c._id);
          const brandIds = matchedBrands.map(b => b._id);

          filter.$and = words.map(word => {
            const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Handle spacing variation for dosage/strength units (e.g. 5mg -> 5\s*mg)
            const fuzzyWord = escapedWord.replace(/(\d+)([a-zA-Z]+)/g, '$1\\s*$2')
                                         .replace(/([a-zA-Z]+)(\d+)/g, '$1\\s*$2');
            const pattern = new RegExp(fuzzyWord, 'i');

            const orConditions = [
              { title: { $regex: pattern } },
              { name: { $regex: pattern } },
              { genericFor: { $regex: pattern } },
              { activeIngredient: { $regex: pattern } },
              { description: { $regex: pattern } }
            ];

            if (catIds.length > 0) {
              orConditions.push({ category: { $in: catIds } });
            }
            if (brandIds.length > 0) {
              orConditions.push({ brand: { $in: brandIds } });
            }

            return { $or: orConditions };
          });
        }
      }
    }

    query = Medicine.find(filter).populate('category brand');

    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Medicine.countDocuments(filter);

    query = query.skip(startIndex).limit(limit);

    const medicines = await query;

    const pagination = {};
    if (endIndex < total) pagination.next = { page: page + 1, limit };
    if (startIndex > 0)  pagination.prev = { page: page - 1, limit };

    res.status(200).json({ success: true, count: medicines.length, pagination, data: medicines });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Get single medicine
// @route   GET /api/medicines/:id
// @access  Public
exports.getMedicine = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ success: false, error: 'Medicine not found' });
  }
  try {
    const medicine = await Medicine.findById(req.params.id).populate('category brand');
    if (!medicine) return res.status(404).json({ success: false, error: 'Medicine not found' });
    res.status(200).json({ success: true, data: medicine });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Create new medicine
// @route   POST /api/medicines
// @access  Private/Admin
exports.createMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.create(req.body);
    await clearCache('/api/medicines');
    res.status(201).json({ success: true, data: medicine });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Update medicine
// @route   PUT /api/medicines/:id
// @access  Private/Admin
exports.updateMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!medicine) return res.status(404).json({ success: false, error: 'Medicine not found' });
    await clearCache('/api/medicines');
    res.status(200).json({ success: true, data: medicine });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Delete medicine
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
exports.deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ success: false, error: 'Medicine not found' });
    await medicine.deleteOne();
    await clearCache('/api/medicines');
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// ─── Excel column → schema field mapping ─────────────────────────────────────
const COLUMN_MAP = {
  'title':             'title',
  'name':              'title',
  'medicine name':     'title',
  'med name':          'title',
  
  'category':          'category',
  'price label':       'priceLabel',
  
  'pack size':         'packSize',
  'packsize':          'packSize',
  'packaging':         'packSize',
  
  'quantity options':  'quantityOptions',
  'quantityoptions':   'quantityOptions',
  
  'price per unit':    'pricePerUnit',
  'priceperunit':      'pricePerUnit',
  'price':             'pricePerUnit',
  
  'total price':       'totalPrice',
  'totalprice':        'totalPrice',
  
  'old price':         'oldPrice',
  'oldprice':          'oldPrice',
  'mrp':               'oldPrice',
  
  'discount':          'discount',
  'description':       'description',
  
  'precautions':       'precautions',
  'safety advice':     'precautions',
  'safetyadvice':      'precautions',
  
  'side effects':      'sideEffects',
  'sideeffects':       'sideEffects',
  
  'how to use':        'howToUse',
  'howtouse':          'howToUse',
  
  'sku':               'sku',
  
  'generic for':       'genericFor',
  'genericfor':        'genericFor',
  'generic name':      'genericFor',
  'genericname':       'genericFor',
  
  'active ingredient': 'activeIngredient',
  'activeingredient':  'activeIngredient',
  'medicine salt':     'activeIngredient',
  'medicinesalt':      'activeIngredient',
  'salt composition':  'activeIngredient',
  'saltcomposition':   'activeIngredient',
  
  'manufacturer':      'manufacturer',
  
  'country origin':    'countryOrigin',
  'countryorigin':     'countryOrigin',
  'country of origin': 'countryOrigin',
  'countryoforigin':   'countryOrigin',
  
  'uses':              'uses',
};

function normalizeHeader(h) {
  return String(h).trim().toLowerCase();
}

function parseRow(rawRow, headerMap) {
  const row = {};
  for (const [colIndex, field] of Object.entries(headerMap)) {
    row[field] = rawRow[colIndex] !== undefined ? String(rawRow[colIndex]).trim() : '';
  }
  return row;
}

function parsePrice(val) {
  if (val === undefined || val === null || val === '') return 0;
  const clean = String(val).replace(/[^\d.]/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

function buildMedicineDoc(row, categoryId) {
  const pricePerUnit = parsePrice(row.pricePerUnit);
  const doc = {
    title:            row.title,
    category:         categoryId,
    packSize:         row.packSize || '1 Pack',
    pricePerUnit:     pricePerUnit,
    totalPrice:       parsePrice(row.totalPrice) || pricePerUnit || 0,
    priceLabel:       row.priceLabel || 'USD',
    quantityOptions:  row.quantityOptions
      ? row.quantityOptions.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n) && n > 0)
      : [1],
    description:      row.description || undefined,
    sideEffects:      row.sideEffects || undefined,
    howToUse:         row.howToUse || undefined,
    uses:             row.uses || undefined,
    genericFor:       row.genericFor || undefined,
    activeIngredient: row.activeIngredient || undefined,
    manufacturer:     row.manufacturer || undefined,
    countryOrigin:    row.countryOrigin || undefined,
  };

  if (row.oldPrice)  doc.oldPrice  = parsePrice(row.oldPrice);
  if (row.discount)  doc.discount  = parsePrice(row.discount);
  if (row.sku)       doc.sku       = parseInt(String(row.sku).replace(/[^\d]/g, ''), 10) || undefined;

  // Map precautions plain text into the structured array format
  if (row.precautions) {
    doc.precautions = [{ label: 'General', status: 'Caution', description: row.precautions }];
  }

  return doc;
}

// @desc    Bulk upload medicines from Excel
// @route   POST /api/medicines/bulk-upload
// @access  Private/Admin
exports.bulkUploadMedicines = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Please upload an Excel file (.xlsx or .xls)' });
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    if (rows.length < 2) {
      return res.status(400).json({ success: false, error: 'Excel file must have a header row and at least one data row' });
    }

    // Build header → field index map
    const headers = rows[0];
    const headerMap = {}; // colIndex → fieldName
    for (let i = 0; i < headers.length; i++) {
      const norm = normalizeHeader(headers[i]);
      if (COLUMN_MAP[norm]) headerMap[i] = COLUMN_MAP[norm];
    }

    if (!Object.values(headerMap).includes('title')) {
      return res.status(400).json({ success: false, error: 'Excel file must have a "Title" or "Name" column' });
    }

    // Pre-load all categories for name lookup (case-insensitive)
    const categories = await Category.find({}).lean();
    const categoryByName = {};
    for (const cat of categories) {
      categoryByName[cat.name.trim().toLowerCase()] = cat._id;
    }

    const dataRows = rows.slice(1);
    let inserted = 0;
    let skipped = 0;
    const errors = [];

    for (let i = 0; i < dataRows.length; i++) {
      const rawRow = dataRows[i];

      // Skip completely empty rows
      if (rawRow.every(cell => String(cell).trim() === '')) continue;

      const row = parseRow(rawRow, headerMap);
      const rowNum = i + 2; // 1-based, accounting for header

      if (!row.title) {
        errors.push({ row: rowNum, error: 'Missing required field: Title' });
        continue;
      }

      const packSize = row.packSize || '1 Pack';

      // Duplicate check: title + packSize combination
      const exists = await Medicine.exists({
        title:    { $regex: new RegExp(`^${row.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        packSize: { $regex: new RegExp(`^${packSize.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      });
      if (exists) {
        skipped++;
        continue;
      }

      // Resolve category
      let categoryId = null;
      if (row.category) {
        categoryId = categoryByName[row.category.toLowerCase()];
        if (!categoryId) {
          try {
            const newCat = await Category.create({ name: row.category });
            categoryId = newCat._id;
            categoryByName[row.category.toLowerCase()] = categoryId;
          } catch (catErr) {
            errors.push({ row: rowNum, error: `Row "${row.title}": Category "${row.category}" not found and could not be created: ${sanitizeError(catErr)}` });
            continue;
          }
        }
      } else {
        errors.push({ row: rowNum, error: `Row "${row.title}": Missing required field: Category` });
        continue;
      }

      try {
        const doc = buildMedicineDoc(row, categoryId);
        await Medicine.create(doc);
        inserted++;
      } catch (err) {
        errors.push({ row: rowNum, error: `Row "${row.title}": ${sanitizeError(err)}` });
      }
    }

    await clearCache('/api/medicines');

    res.status(200).json({
      success: true,
      summary: { inserted, skipped, errors: errors.length },
      errors,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Get top popular searches
// @route   GET /api/medicines/popular-searches
// @access  Public
exports.getPopularSearches = async (req, res, next) => {
  try {
    const popular = await SearchQuery.find()
      .sort({ count: -1, updatedAt: -1 })
      .limit(10)
      .select('originalQuery count -_id');

    res.status(200).json({
      success: true,
      data: popular.map(item => item.originalQuery)
    });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};
