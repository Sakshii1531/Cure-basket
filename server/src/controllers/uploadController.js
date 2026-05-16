const cloudinary = require('../config/cloudinary');

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
    const result = await uploadBuffer(req.file.buffer, folder);
    res.status(200).json({ success: true, url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.uploadBuffer = uploadBuffer;
