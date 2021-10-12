require('express-async-errors');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const errorHandler = require('./utils/errorHandler');

morgan.token('body', (request) => JSON.stringify(request.body));
app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :body',
		{ skip: () => process.env.NODE_ENV === 'test' }
	)
);

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);

app.use(errorHandler);

module.exports = app;
