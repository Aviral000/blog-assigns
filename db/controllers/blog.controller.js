const { createBlogPost, getAllBlogPosts, updateBlogPost, deleteBlogPost, likeToggle, viewsToggle, createComments, getBlogComments } = require('../services/blog.service');

exports.createBlog = async (req, res) => {
  try {
    const newBlog = await createBlogPost(req.body, req.params);
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await getAllBlogPosts();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const updatedBlog = await updateBlogPost(req.params.id, req.body);
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    await deleteBlogPost(req.params.id, req.user);
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.likes = async (req, res) => {
  try {
    const blogLike = await likeToggle(req.params, req.body);
    res.status(200).json(blogLike);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

exports.views = async (req, res) => {
  try {
    const blogLike = await viewsToggle(req.params, req.body);
    res.status(200).json(blogLike);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

exports.createComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const newComment = await createComments(blogId, userId, content);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBlogComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await getBlogComments(blogId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};