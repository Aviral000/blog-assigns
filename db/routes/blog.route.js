const router = require("express").Router();
const { createBlog, getAllBlogs, updateBlog, deleteBlog, likes, views, createComment, getBlogComment } = require('../controllers/blog.controller');

const passport = require("passport");
const authenticate = passport.authenticate('jwt', { session: false });

router.post('/:id/create', authenticate, createBlog);
router.get('/', getAllBlogs);
router.put('/update/:id', authenticate, updateBlog);
router.delete('/delete/:id', authenticate, deleteBlog);
router.patch("/:id/views", views);
router.patch("/:id/likes", authenticate, likes);
router.post('/:blogId/comments', authenticate, createComment);
router.get('/:blogId/comments', getBlogComment);

module.exports = router;