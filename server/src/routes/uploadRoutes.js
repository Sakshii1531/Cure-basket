const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();

router.post('/', protect, upload.single('file'), uploadImage);

module.exports = router;
