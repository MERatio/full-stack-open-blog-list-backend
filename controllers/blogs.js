const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { title, url } = request.body;
  if (title === undefined && url === undefined) {
    return response.status(400).end();
  }
  const blog = new Blog(request.body);
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const deletedBlog = await Blog.findByIdAndRemove(request.params.id);
  if (!deletedBlog) {
    const error = new Error("Person's phonebook info is already deleted");
    error.name = 'NotFound';
    throw error;
  } else {
    response.status(204).end();
  }
});

module.exports = blogsRouter;
