const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers, unsubscribe, deleteSubscriber } = require('../controllers/subscriberController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/', protect, authorize('admin', 'superadmin'), getSubscribers);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteSubscriber);

module.exports = router;
