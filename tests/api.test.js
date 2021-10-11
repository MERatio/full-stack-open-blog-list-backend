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

afterAll(() => {
	mongoose.connection.close();
});
