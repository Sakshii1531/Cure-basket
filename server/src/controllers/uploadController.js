const cloudinary = require('../config/cloudinary');
const sanitizeError = require('../utils/sanitizeError');

const fs = require('fs');
const path = require('path');

const uploadBuffer = (buffer, folder, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto', ...options },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });

// @desc    Upload a single image/file to Cloudinary
// @route   POST /api/upload
// @access  Private
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    const folder = req.query.folder || 'cure-basket';
    
    try {
      const result = await uploadBuffer(req.file.buffer, folder);
      return res.status(200).json({ success: true, url: result.secure_url, public_id: result.public_id });
    } catch (cloudinaryError) {
      console.warn('Cloudinary upload failed, falling back to local storage:', cloudinaryError.message);
      
      const uploadDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const ext = path.extname(req.file.originalname) || '.png';
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const filePath = path.join(uploadDir, filename);
      
      fs.writeFileSync(filePath, req.file.buffer);
      
      const localUrl = `/uploads/${filename}`;
      
      return res.status(200).json({ success: true, url: localUrl, public_id: filename });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};

exports.uploadBuffer = uploadBuffer;
