const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Blog = require('../models/blog');

const passwordHash = bcrypt.hashSync('password', 10);

const generateObjectIdArray = (length) => {
	let arr = [];
	for (let i = 0; i < length; i++) {
		arr = [...arr, ObjectId().toString()];
	}
	return arr;
};

const blogsIds = generateObjectIdArray(6);

const users = [
	{
		_id: ObjectId().toString(),
		username: 'JohnDoe',
		name: 'John Doe',
		passwordHash,
		blogs: blogsIds,
		__v: 0,
	},
	{
		_id: ObjectId().toString(),
		username: 'JaneDoe',
		name: 'Jane Doe',
		passwordHash,
		blogs: [],
		__v: 0,
	},
];

const blogs = [
	{
		_id: blogsIds[0],
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 7,
		user: users[0]._id,
		__v: 0,
	},
	{
		_id: blogsIds[1],
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url:
			'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5,
		user: users[0]._id,
		__v: 0,
	},
	{
		_id: blogsIds[2],
		title: 'Canonical string reduction',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		likes: 12,
		user: users[0]._id,
		__v: 0,
	},
	{
		_id: blogsIds[3],
		title: 'First class tests',
		author: 'Robert C. Martin',
		url:
			'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
		likes: 10,
		user: users[0]._id,
		__v: 0,
	},
	{
		_id: blogsIds[4],
		title: 'TDD harms architecture',
		author: 'Robert C. Martin',
		url:
			'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
		likes: 0,
		user: users[0]._id,
		__v: 0,
	},
	{
		_id: blogsIds[5],
		title: 'Type wars',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
		likes: 2,
		user: users[0]._id,
		__v: 0,
	},
];

const usersInDb = async () => {
	const users = await User.find({});
	return users.map((user) => user.toJSON());
};

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map((blog) => blog.toJSON());
};

const nonExistingId = async () => {
	const blog = new Blog({
		title: 'dummyTitle',
		author: 'dummyAuthor',
		url: 'http://example.com',
		likes: 1,
	});
	await blog.save();
	await blog.remove();

	return blog._id.toString();
};

module.exports = { users, blogs, usersInDb, blogsInDb, nonExistingId };
