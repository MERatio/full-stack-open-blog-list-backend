const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { title, url } = request.body;
  if (title === undefined && url === undefined) {
    return response.status(400).json({ error: 'title and url is missing' });
  }
  const blog = new Blog(request.body);
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body
  );
  if (!updatedBlog) {
    const error = new Error('Blog not found');
    error.name = 'NotFound';
    throw error;
  } else {
    response.json(updatedBlog);
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  const deletedBlog = await Blog.findByIdAndRemove(request.params.id);
  if (!deletedBlog) {
    const error = new Error('Blog not found');
    error.name = 'NotFound';
    throw error;
  } else {
    response.status(204).end();
  }
});

module.exports = blogsRouter;
