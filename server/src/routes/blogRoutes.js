const express = require('express');
const router = express.Router();
const { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { protect, can } = require('../middlewares/authMiddleware');

router.get('/', getBlogs);
router.get('/:id', getBlog);

router.use(protect);
router.post('/', can('blogs', 'write'), createBlog);
router.put('/:id', can('blogs', 'write'), updateBlog);
router.delete('/:id', can('blogs', 'delete'), deleteBlog);

module.exports = router;
