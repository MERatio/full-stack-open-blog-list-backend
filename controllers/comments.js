const commentsRouter = require('express').Router({ mergeParams: true });
const Comment = require('../models/comment');

commentsRouter.get('/', async (request, response) => {
  const comments = await Comment.find({ blog: request.params.blogId });
  response.json(comments);
});

module.exports = commentsRouter;
