const Blog = require('../models/blog.model');
const Comment = require("../models/comment.model");

const createBlogPost = async (blogData, authorId) => {
    try {
      const newBlog = new Blog({
        ...blogData,
        author: authorId.id,
      });
      return await newBlog.save();
    } catch (error) {
      throw new Error('Failed to create a new blog post');
    }
  }

  const getAllBlogPosts = async () => {
    try {
      const blogs = await Blog.find({}).populate('author', 'username').exec();
      return blogs;
    } catch (error) {
      throw new Error('Failed to fetch blog posts');
    }
  }

  const updateBlogPost = async (id, blogData) => {
    try {
      const blog = await Blog.findByIdAndUpdate(
        id,
        blogData,
        { new: true }
      );

      if (!blog) {
        throw new Error('Blog post not found');
      }

      return blog;
    } catch (error) {
      throw new Error('Failed to update the blog post');
    }
  }

  const deleteBlogPost = async (id) => {
    try {
      const blog = await Blog.findById(id);

      if (!blog) {
        throw new Error('Blog post not found');
      }

      await blog.remove();
    } catch (error) {
      throw new Error('Failed to delete the blog post');
    }
  }

  const likeToggle = async (params, body) => {
    try {
      const { type } = body;
      const blog = await Blog.findById(params.id);
  
      if (!blog) {
        throw new Error('Blog post not found');
      }
  
      if (type === "increase") {
        blog.likes += 1;
      } else if (type === "decrease" && blog.likes > 0) {
        blog.likes -= 1;
      } else {
        throw new Error('Invalid type for like toggle');
      }
  
      return await blog.save();
    } catch (error) {
      throw new Error('Failed to toggle like on the blog post');
    }
  }

  const viewsToggle = async (params, body) => {
    try {
      const blog = await Blog.findById(params.id);

      if(!blog) {
        throw new Error('Blog post not found');
      }

      blog.views += 1;

      const savedBlog = await blog.save();
      return savedBlog;
    } catch (error) {
      throw new Error('Failed to toggle views on the blog post');
    }
  }

  const getBlogPostById = async (id) => {
    try {
      const blog = await Blog.findById(id).populate('author', 'username').exec();
      return blog;
    } catch (error) {
      throw new Error('Failed to fetch the blog post');
    }
  }

  const createComments = async (blogId, userId, content) => {
    try {
      const blog = await Blog.findById(blogId);
  
      if (!blog) {
        throw new Error('Blog post not found');
      }
  
      const newComment = await Comment.create({
        content: content,
        author: userId,
        blog: blogId
      })

      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        { $push: { comments: newComment._id } },
        { new: true, useFindAndModify: false }
      );
  
      return [newComment, updatedBlog];
    } catch (error) {
      throw new Error('Failed to create a new comment');
    }
  };
  
  const getBlogComments = async (blogId) => {
    try {
      const blog = await Blog.findById(blogId).populate('comments');
  
      if (!blog) {
        throw new Error('Blog post not found');
      }
  
      return blog.comments;
    } catch (error) {
      throw new Error('Failed to fetch comments for the blog post');
    }
  };
  
  module.exports = {
    createBlogPost,
    getAllBlogPosts,
    updateBlogPost,
    deleteBlogPost,
    getBlogPostById,
    viewsToggle,
    likeToggle,
    createComments,
    getBlogComments
  };