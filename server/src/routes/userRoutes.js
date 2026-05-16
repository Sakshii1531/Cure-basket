const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize, can } = require('../middlewares/authMiddleware');

router.use(protect, authorize('admin', 'superadmin'));

router.get('/', can('users', 'read'), getUsers);
router.get('/:id', can('users', 'read'), getUser);
router.put('/:id', can('users', 'write'), updateUser);
router.delete('/:id', can('users', 'delete'), deleteUser);

module.exports = router;
