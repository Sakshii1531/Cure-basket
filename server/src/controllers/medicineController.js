const mongoose = require('mongoose');
const XLSX = require('xlsx');
const Medicine = require('../models/Medicine');
const Category = require('../models/Category');
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

// @desc    Validate stock of medicines in cart
// @route   POST /api/medicines/validate-stock
// @access  Public
exports.validateStock = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items to validate' });
    }

    const { isStockUnavailable, isQuantityInsufficient } = require('../utils/stockUtils');

    const medicineIds = items.map(item => item.medicine);
    const medicines = await Medicine.find({ _id: { $in: medicineIds } });
    const medicineMap = Object.fromEntries(medicines.map(m => [m._id.toString(), m]));

    const errors = {};
    let globalMessage = '';

    for (const item of items) {
      const medId = item.medicine?.toString();
      const med = medicineMap[medId];

      if (!med || isStockUnavailable(med)) {
        errors[medId] = {
          status: 'out_of_stock',
          message: 'This medicine is currently out of stock.',
          available: 0
        };
        if (!globalMessage) {
          globalMessage = 'Medicine is out of stock';
        }
      } else if (isQuantityInsufficient(med, item.quantity)) {
        errors[medId] = {
          status: 'insufficient',
          message: `Only ${med.stock} units available`,
          available: med.stock
        };
        if (!globalMessage) {
          globalMessage = `Only ${med.stock} units available`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: globalMessage,
        error: globalMessage,
        errors
      });
    }

    return res.status(200).json({
      success: true,
      message: 'All items are in stock'
    });
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
  'title':            'title',
  'category':         'category',        // resolved by name
  'price label':      'priceLabel',
  'pack size':        'packSize',
  'quantity options': 'quantityOptions', // comma-separated → [Number]
  'price per unit':   'pricePerUnit',
  'total price':      'totalPrice',
  'old price':        'oldPrice',
  'discount':         'discount',
  'description':      'description',
  'precautions':      'precautions',     // plain text → [{ label, status, description }]
  'side effects':     'sideEffects',
  'how to use':       'howToUse',
  'sku':              'sku',
  'generic for':      'genericFor',
  'active ingredient':'activeIngredient',
  'manufacturer':     'manufacturer',
  'country origin':   'countryOrigin',
  'uses':             'uses',
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

function buildMedicineDoc(row, categoryId) {
  const doc = {
    title:            row.title,
    category:         categoryId,
    packSize:         row.packSize,
    pricePerUnit:     parseFloat(row.pricePerUnit) || 0,
    totalPrice:       parseFloat(row.totalPrice) || 0,
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

  if (row.oldPrice)  doc.oldPrice  = parseFloat(row.oldPrice);
  if (row.discount)  doc.discount  = parseFloat(row.discount);
  if (row.sku)       doc.sku       = parseInt(row.sku, 10);

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
      return res.status(400).json({ success: false, error: 'Excel file must have a "Title" column' });
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
      if (!row.packSize) {
        errors.push({ row: rowNum, error: `Row "${row.title}": Missing required field: Pack Size` });
        continue;
      }

      // Duplicate check: title + packSize combination
      const exists = await Medicine.exists({
        title:    { $regex: new RegExp(`^${row.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        packSize: { $regex: new RegExp(`^${row.packSize.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
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
