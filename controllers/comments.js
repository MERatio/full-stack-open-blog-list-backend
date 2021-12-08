const commentsRouter = require('express').Router({ mergeParams: true });
const userExtractor = require('../utils/userExtractor');
const Comment = require('../models/comment');
const Blog = require('../models/blog');

commentsRouter.post('/', userExtractor, async (request, response) => {
	const body = request.body;
	if (body.content === undefined) {
		return response.status(400).json({ error: 'content is missing' });
	}

	const blog = await Blog.findById(request.params.blogId);
	const comment = new Comment({
		content: body.content,
		blog: blog._id,
	});

	const savedComment = await comment.save();
	blog.comments = blog.comments.concat(savedComment._id);
	await blog.save();

	response.status(201).json(savedComment);
});

module.exports = commentsRouter;
