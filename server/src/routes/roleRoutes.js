const express = require('express');
const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  assignRole,
} = require('../controllers/roleController');
const { protect, authorize, can } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { createRoleRules, updateRoleRules } = require('../validators/roleValidators');

const router = express.Router();

// Allow admin/superadmin with appropriate permissions to manage roles
router.use(protect, authorize('admin', 'superadmin'));

router.route('/')
  .get(getRoles)  // Any authenticated admin/superadmin can list roles
  .post(can('roles', 'write'), createRoleRules, validate, createRole);

router.route('/:id')
  .put(can('roles', 'write'), updateRoleRules, validate, updateRole)
  .delete(can('roles', 'delete'), deleteRole);

router.post('/assign', authorize('superadmin'), assignRole);

module.exports = router;
