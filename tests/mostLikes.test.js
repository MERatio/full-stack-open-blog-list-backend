const listHelper = require('../utils/list_helper');
const { blogs } = require('./testHelper');

const authorWithMostLikes = {
	author: 'Edsger W. Dijkstra',
	likes: 17,
};

describe('most likes', () => {
	test('of empty list is undefined', () => {
		const result = listHelper.mostLikes([]);
		expect(result).toEqual(undefined);
	});

	test('when list has only one blog, equals the likes of that', () => {
		const blog = {
			author: blogs[0].author,
			likes: blogs[0].likes,
		};
		const result = listHelper.mostLikes([blogs[0]]);
		expect(result).toEqual(blog);
	});

	test('of a bigger list is calculated right', () => {
		const result = listHelper.mostLikes(blogs);
		expect(result).toEqual(authorWithMostLikes);
	});
});
