const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const userExtractor = require('../utils/userExtractor');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body;
  if (body.title === undefined && body.url === undefined) {
    return response.status(400).json({ error: 'title and url is missing' });
  }

  const user = request.user;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.put('/:blogId', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.blogId,
    request.body,
    { new: true, runValidators: true }
  );
  if (!updatedBlog) {
    const error = new Error('Blog not found');
    error.name = 'NotFound';
    throw error;
  } else {
    response.json(updatedBlog);
  }
});

blogsRouter.delete('/:blogId', userExtractor, async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.blogId);
  if (!blogToDelete) {
    const error = new Error('Blog not found');
    error.name = 'NotFound';
    throw error;
  }

  const user = request.user;
  if (blogToDelete.user.toString() !== user._id.toString()) {
    return response
      .status(401)
      .json({ error: 'unauthorize to delete the blog' });
  }

  await Blog.findByIdAndRemove(request.params.blogId);
  user.blogs = user.blogs.filter(
    (blogId) => blogId.toString() !== blogToDelete._id.toString()
  );
  await user.save();

  response.status(204).end();
});

module.exports = blogsRouter;
