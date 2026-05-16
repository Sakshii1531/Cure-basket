const Settings = require('../models/Settings');

const ALLOWED_TYPES = ['bank_contact', 'dispense'];

exports.getSettings = async (req, res) => {
  const { type } = req.params;
  if (!ALLOWED_TYPES.includes(type)) {
    return res.status(400).json({ success: false, error: 'Unknown settings type' });
  }

  try {
    const settings = await Settings.findOne({ type });
    res.status(200).json({ success: true, data: settings ? settings.data : null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  const { type } = req.params;
  if (!ALLOWED_TYPES.includes(type)) {
    return res.status(400).json({ success: false, error: 'Unknown settings type' });
  }

  try {
    let payload = { ...req.body };

    // Never persist a plaintext secret key — strip it and store only a flag
    if (type === 'dispense' && payload.secretKey !== undefined) {
      if (payload.secretKey && payload.secretKey !== '••••••••••••••') {
        payload.secretKeySet = true;
      }
      delete payload.secretKey;
    }

    const settings = await Settings.findOneAndUpdate(
      { type },
      { data: payload, updatedAt: Date.now() },
      { new: true, upsert: true, runValidators: false }
    );

    res.status(200).json({ success: true, data: settings.data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
