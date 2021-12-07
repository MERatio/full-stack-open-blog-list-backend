const commentsRouter = require('express').Router({ mergeParams: true });
const Comment = require('../models/comment');

module.exports = commentsRouter;
