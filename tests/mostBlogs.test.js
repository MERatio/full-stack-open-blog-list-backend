const listHelper = require('../utils/list_helper');
const { blogs } = require('./testHelper');

const mostBlogsObj = {
	author: 'Robert C. Martin',
	blogs: 3,
};

describe('most blogs', () => {
	test('of empty list is undefined', () => {
		const result = listHelper.mostBlogs([]);
		expect(result).toEqual(undefined);
	});

	test('when list has only one blog, equals the likes of that', () => {
		const blog = {
			author: blogs[0].author,
			blogs: 1,
		};
		const result = listHelper.mostBlogs([blogs[0]]);
		expect(result).toEqual(blog);
	});

	test('of a bigger list is calculated right', () => {
		const result = listHelper.mostBlogs(blogs);
		expect(result).toEqual(mostBlogsObj);
	});
});
