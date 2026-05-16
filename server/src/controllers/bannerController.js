const Banner = require('../models/Banner');

exports.getBanners = async (req, res) => {
  try {
    const filter = {};
    if (req.query.position) filter.position = req.query.position;
    if (req.query.active === 'true') filter.isActive = true;

    const banners = await Banner.find(filter).sort('order -createdAt');
    res.status(200).json({ success: true, count: banners.length, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, data: banner });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!banner) return res.status(404).json({ success: false, error: 'Banner not found' });
    res.status(200).json({ success: true, data: banner });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, error: 'Banner not found' });
    await banner.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
