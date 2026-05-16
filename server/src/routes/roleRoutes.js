const express = require('express');
const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  assignRole,
} = require('../controllers/roleController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// All role management routes require superadmin
router.use(protect, authorize('superadmin'));

router.route('/').get(getRoles).post(createRole);
router.route('/:id').put(updateRole).delete(deleteRole);
router.post('/assign', assignRole);

module.exports = router;
