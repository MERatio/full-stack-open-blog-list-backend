const listHelper = require('../utils/list_helper');
const blogs = require('./blogs');

const lastMostLikedBlog = blogs[2];

describe('favorite blog', () => {
	test('of empty list is undefined', () => {
		const result = listHelper.favoriteBlog([]);
		expect(result).toEqual(undefined);
	});

	test('when list has only one blog, equals the likes of that', () => {
		const result = listHelper.favoriteBlog([blogs[0]]);
		expect(result).toEqual(blogs[0]);
	});

	test('of a bigger list is calculated right', () => {
		const result = listHelper.favoriteBlog(blogs);
		expect(result).toEqual(lastMostLikedBlog);
	});
});
