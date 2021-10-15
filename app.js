require('express-async-errors');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./utils/config');
const tokenExtractor = require('./utils/tokenExtractor');
const errorHandler = require('./utils/errorHandler');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const blogsRouter = require('./controllers/blogs');

morgan.token('body', (request) => JSON.stringify(request.body));
app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :body',
		{ skip: () => process.env.NODE_ENV === 'test' }
	)
);

mongoose.connect(config.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);

app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/blogs', blogsRouter);

app.use(errorHandler);

module.exports = app;
