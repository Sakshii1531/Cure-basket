const express = require('express');
const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  assignRole,
} = require('../controllers/roleController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { createRoleRules, updateRoleRules } = require('../validators/roleValidators');

const router = express.Router();

// All role management routes require superadmin
router.use(protect, authorize('superadmin'));

router.route('/').get(getRoles).post(createRoleRules, validate, createRole);
router.route('/:id').put(updateRoleRules, validate, updateRole).delete(deleteRole);
router.post('/assign', assignRole);

module.exports = router;
