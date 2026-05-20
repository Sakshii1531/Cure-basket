const express = require('express');
const router = express.Router();
const { getBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protect, authorize, can } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { createBannerRules, updateBannerRules } = require('../validators/bannerValidators');

// Public: fetch active banners (e.g. ?position=main&active=true)
router.get('/', getBanners);

// Admin-only routes
router.use(protect, authorize('admin', 'superadmin'));
router.post('/', can('banners', 'write'), createBannerRules, validate, createBanner);
router.put('/:id', can('banners', 'write'), updateBannerRules, validate, updateBanner);
router.delete('/:id', can('banners', 'delete'), deleteBanner);

module.exports = router;
