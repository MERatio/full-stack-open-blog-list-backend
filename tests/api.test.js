const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Blog = require('../models/blog');
const testHelper = require('./testHelper');

const api = supertest(app);

jest.setTimeout(10000);

beforeEach(async () => {
	await Blog.deleteMany();
	await Blog.insertMany(testHelper.blogs);
});

describe('when there is initial blogs saved', () => {
	test('content type is JSON', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('correct amount of blogs are returned', async () => {
		const response = await api.get('/api/blogs');
		expect(response.body).toHaveLength(testHelper.blogs.length);
	});

	test('contains a specific blog', async () => {
		const response = await api.get('/api/blogs');
		const blogsTitles = response.body.map((blogTitle) => blogTitle.title);
		expect(blogsTitles).toContain(testHelper.blogs[0].title);
	});
});

describe("blog's unique identifier", () => {
	test('is not _id', async () => {
		const response = await api.get('/api/blogs');
		expect(response.body[0]._id).not.toBeDefined();
	});

	test('is id', async () => {
		const response = await api.get('/api/blogs');
		expect(response.body[0].id).toBeDefined();
	});
});

describe("blog's creation", () => {
	test('creates a blog if data is valid', async () => {
		const blogTitle = 'testTitle';
		const blog = {
			title: blogTitle,
			author: 'testAuthor',
			url: 'http://example.com',
			likes: 1,
		};

		await api
			.post('/api/blogs')
			.send(blog)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blogs = await testHelper.blogsInDb();
		expect(blogs.length).toBe(testHelper.blogs.length + 1);

		const blogsTitles = blogs.map((blog) => blog.title);
		expect(blogsTitles).toContain(blogTitle);
	});
});

describe('likes property missing from request body', () => {
	test('creates a blog with likes property default to 0', async () => {
		const blogTitle = 'testTitle';
		const blog = {
			title: blogTitle,
			author: 'testAuthor',
			url: 'http://example.com',
		};

		const response = await api
			.post('/api/blogs')
			.send(blog)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blogs = await testHelper.blogsInDb();
		expect(blogs.length).toBe(testHelper.blogs.length + 1);

		const blogsTitles = blogs.map((blog) => blog.title);
		expect(blogsTitles).toContain(blogTitle);

		expect(response.body.likes).toBe(0);
	});
});

afterAll(() => {
	mongoose.connection.close();
});
