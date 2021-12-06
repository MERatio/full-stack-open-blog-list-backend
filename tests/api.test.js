const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const testHelper = require('./testHelper');

jest.setTimeout(100000);

const api = supertest(app);

let johnToken;

beforeEach(async () => {
	await User.deleteMany();
	await User.insertMany(testHelper.users);

	const response = await api
		.post('/api/login')
		.send({ username: 'JohnDoe', password: 'password' });
	johnToken = response.body.token;

	await Blog.deleteMany();
	await Blog.insertMany(testHelper.blogs);

	await Comment.deleteMany();
	await Comment.insertMany(testHelper.comments);
});

describe('users', () => {
	describe('GET /users', () => {
		test('content type is JSON', async () => {
			await api
				.get('/api/users')
				.expect(200)
				.expect('Content-Type', /application\/json/);
		});

		test('correct amount of users are returned', async () => {
			const response = await api.get('/api/users');
			expect(response.body).toHaveLength(testHelper.users.length);
		});

		test('contains a specific user', async () => {
			const response = await api.get('/api/users');
			const usernames = response.body.map((user) => user.username);
			expect(usernames).toContain(testHelper.users[0].username);
		});

		test('contains populated blogs', async () => {
			const response = await api.get('/api/users');
			expect(response.body[0].blogs[0].id).toBeDefined();
		});
	});

	describe('POST /', () => {
		test('fails if username is not given', async () => {
			const usersAtStart = await testHelper.usersInDb();

			const newUser = {
				name: 'testName',
				password: 'password',
			};

			const response = await api
				.post('/api/users')
				.send(newUser)
				.expect(400)
				.expect('Content-Type', /application\/json/);

			expect(response.body.error).toContain(
				'User validation failed: username: Path `username` is required.'
			);

			const usersAtEnd = await testHelper.usersInDb();
			expect(usersAtEnd).toHaveLength(usersAtStart.length);

			const usernames = usersAtEnd.map((user) => user.username);
			expect(usernames).not.toContain(newUser.username);
		});

		test('fails if password is not given', async () => {
			const usersAtStart = await testHelper.usersInDb();

			const newUser = {
				username: 'testUsername',
				name: 'testName',
			};

			const response = await api
				.post('/api/users')
				.send(newUser)
				.expect(400)
				.expect('Content-Type', /application\/json/);

			expect(response.body.error).toContain(
				'password must be atleast 3 characters long'
			);

			const usersAtEnd = await testHelper.usersInDb();
			expect(usersAtEnd).toHaveLength(usersAtStart.length);

			const usernames = usersAtEnd.map((user) => user.username);
			expect(usernames).not.toContain(newUser.username);
		});

		test('fails if password is not atleast 3 characters long', async () => {
			const usersAtStart = await testHelper.usersInDb();

			const newUser = {
				username: 'testUsername',
				name: 'testName',
				password: 'pa',
			};

			const response = await api
				.post('/api/users')
				.send(newUser)
				.expect(400)
				.expect('Content-Type', /application\/json/);

			expect(response.body.error).toContain(
				'password must be atleast 3 characters long'
			);

			const usersAtEnd = await testHelper.usersInDb();
			expect(usersAtEnd).toHaveLength(usersAtStart.length);

			const usernames = usersAtEnd.map((user) => user.username);
			expect(usernames).not.toContain(newUser.username);
		});

		test('succeeds with a fresh username', async () => {
			const usersAtStart = await testHelper.usersInDb();

			const newUser = {
				username: 'testUsername',
				name: 'testName',
				password: 'password',
			};

			await api
				.post('/api/users')
				.send(newUser)
				.expect(200)
				.expect('Content-Type', /application\/json/);

			const usersAtEnd = await testHelper.usersInDb();
			expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

			const usernames = usersAtEnd.map((user) => user.username);
			expect(usernames).toContain(newUser.username);
		});

		test('fails with proper statuscode and message if username already taken', async () => {
			const usersAtStart = await testHelper.usersInDb();

			const newUser = {
				username: 'JohnDoe',
				name: 'John Doe',
				password: 'password',
			};

			const response = await api
				.post('/api/users')
				.send(newUser)
				.expect(400)
				.expect('Content-Type', /application\/json/);

			expect(response.body.error).toContain('`username` to be unique');

			const usersAtEnd = await testHelper.usersInDb();
			expect(usersAtEnd).toHaveLength(usersAtStart.length);
		});
	});

	describe('PUT /:userId', () => {
		test('fetch individual user info', async () => {
			const user = testHelper.users[0];
			const response = await api.get(`/api/users/${user._id}`);
			expect(response.body.id).toBe(user._id);
		});
	});
});

describe('login', () => {
	describe('POST /', () => {
		test('fails if username is invalid', async () => {
			const response = await api
				.post('/api/login')
				.send({ username: 'invalidUsername', password: 'password' })
				.expect(401)
				.expect('Content-Type', /application\/json/);

			expect(response.body.error).toBe('Invalid username or password');
		});

		test('fails if password is invalid', async () => {
			const response = await api
				.post('/api/login')
				.send({ username: 'JohnDoe', password: 'invalidPassword' })
				.expect(401)
				.expect('Content-Type', /application\/json/);

			expect(response.body.error).toBe('Invalid username or password');
		});

		test('succeeds if username and password matches', async () => {
			const response = await api
				.post('/api/login')
				.send({ username: 'JohnDoe', password: 'password' })
				.expect(200)
				.expect('Content-Type', /application\/json/);
			const body = response.body;

			expect(body.token).toBeDefined();
			expect(body.username).toBeDefined();
			expect(body.name).toBeDefined();
		});
	});
});

describe('blogs', () => {
	describe('GET /', () => {
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
			const blogsTitles = response.body.map((blog) => blog.title);
			expect(blogsTitles).toContain(testHelper.blogs[0].title);
		});

		test('contains populated user', async () => {
			const response = await api.get('/api/blogs');
			expect(response.body[0].user.id).toBeDefined();
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

	describe('POST /', () => {
		test('creates a blog if data and token is valid', async () => {
			const blogTitle = 'testTitle';
			const blog = {
				title: blogTitle,
				author: 'testAuthor',
				url: 'http://example.com',
				likes: 1,
			};

			const response = await api
				.post('/api/blogs')
				.set('Authorization', `Bearer ${johnToken}`)
				.send(blog)
				.expect(201)
				.expect('Content-Type', /application\/json/);

			const blogs = await testHelper.blogsInDb();
			expect(blogs.length).toBe(testHelper.blogs.length + 1);

			const blogsTitles = blogs.map((blog) => blog.title);
			expect(blogsTitles).toContain(blogTitle);

			const john = await User.findOne({ username: 'JohnDoe' });
			const johnBlogsStringIds = john.blogs.map((blog) => blog._id.toString());
			expect(johnBlogsStringIds).toContain(response.body.id);
		});

		test('fails if token is missing or invalid', async () => {
			const blogTitle = 'testTitle';
			const blog = {
				title: blogTitle,
				author: 'testAuthor',
				url: 'http://example.com',
				likes: 1,
			};

			const response = await api
				.post('/api/blogs')
				.send(blog)
				.expect(401)
				.expect('Content-Type', /application\/json/);

			expect(response.body.error).toBe('invalid token');

			const blogs = await testHelper.blogsInDb();
			expect(blogs.length).toBe(testHelper.blogs.length);

			const blogsTitles = blogs.map((blog) => blog.title);
			expect(blogsTitles).not.toContain(blogTitle);
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
					.set('Authorization', `Bearer ${johnToken}`)
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

		describe('title and url properties missing from request body', () => {
			test('responds with status code 400 Bad Request', async () => {
				const blog = {
					author: 'testAuthor',
					likes: 1,
				};

				await api
					.post('/api/blogs')
					.set('Authorization', `Bearer ${johnToken}`)
					.send(blog)
					.expect(400);
			});
		});
	});

	describe('GET /:blogId', () => {
		test('fetch individual blog info', async () => {
			const blog = testHelper.blogs[0];
			const response = await api.get(`/api/blogs/${blog._id}`);
			expect(response.body.id).toBe(blog._id);
		});
	});

	describe('PUT /:blogId', () => {
		const blogNewTitle = 'updatedTitle';
		const blogNewData = {
			title: blogNewTitle,
			author: 'updatedAuthor',
			url: 'https://example.com',
			likes: 2,
		};

		test('updates a blog if id is valid', async () => {
			const blogsAtTheStart = await testHelper.blogsInDb();
			const blogAtTheStart = blogsAtTheStart[0];

			await api
				.put(`/api/blogs/${blogAtTheStart.id}`)
				.send(blogNewData)
				.expect(200);

			const blogsAtTheEnd = await testHelper.blogsInDb();
			const blogsTitles = blogsAtTheEnd.map((blog) => blog.title);
			expect(blogsTitles).not.toContain(blogAtTheStart.title);
			expect(blogsTitles).toContain(blogNewTitle);
		});

		test('fails if blog does not exist', async () => {
			await api
				.put(`/api/blogs/${await testHelper.nonExistingId()}`)
				.send(blogNewData)
				.expect(404);
		});

		test('fails if id is invalid', async () => {
			await api.put(`/api/blogs/123456789`).send(blogNewData).expect(400);
		});
	});

	describe('DELETE /:blogId', () => {
		let blogsAtTheStart;
		let blogToDelete;

		beforeAll(async () => {
			blogsAtTheStart = await testHelper.blogsInDb();
			blogToDelete = blogsAtTheStart[0];
		});

		test("deletes a blog if id is valid and token is valid and from the blog's user", async () => {
			const john = await User.findOne({ username: 'JohnDoe' });
			const johnBlogsStringIds = john.blogs.map((blog) => blog._id.toString());
			expect(johnBlogsStringIds).toContain(blogToDelete.id);

			const response = await api
				.delete(`/api/blogs/${blogToDelete.id}`)
				.set('Authorization', `Bearer ${johnToken}`)
				.expect(204);

			const blogsAtTheEnd = await testHelper.blogsInDb();
			expect(blogsAtTheEnd.length).toBe(testHelper.blogs.length - 1);

			const blogsTitles = blogsAtTheEnd.map((blog) => blog.title);
			expect(blogsTitles).not.toContain(blogToDelete.title);

			expect(johnBlogsStringIds).not.toContain(response.body.id);
		});

		test('fails if blog does not exist', async () => {
			await api
				.delete(`/api/blogs/${await testHelper.nonExistingId()}`)
				.set('Authorization', `Bearer ${johnToken}`)
				.expect(404);
		});

		test('fails if id is invalid', async () => {
			await api
				.delete(`/api/blogs/123456789`)
				.set('Authorization', `Bearer ${johnToken}`)
				.expect(400);
		});

		test('fails if token is missing', async () => {
			const response = await api
				.delete(`/api/blogs/${blogToDelete.id}`)
				.expect(401);

			expect(response.body.error).toBe('invalid token');
		});

		test('fails if token is not from the user of the blog', async () => {
			const loginResponse = await api
				.post('/api/login')
				.send({ username: 'JaneDoe', password: 'password' });
			const janeToken = loginResponse.body.token;

			const deleteBlogResponse = await api
				.delete(`/api/blogs/${blogToDelete.id}`)
				.set('Authorization', `Bearer ${janeToken}`)
				.expect(401);

			expect(deleteBlogResponse.body.error).toBe(
				'unauthorize to delete the blog'
			);
		});
	});
});

describe('comments', () => {
	describe('GET /', () => {
		test('get individual comment', async () => {
			const response = await api.get('/api/comments');

			expect(response.body.length).toBe(6);
			expect(response.body[0].content).toBeDefined();
		});
	});
});

afterAll(() => {
	mongoose.connection.close();
});
