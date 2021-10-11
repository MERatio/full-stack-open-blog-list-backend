const dummy = (blogs) => 1; // eslint-disable-line no-unused-vars

const totalLikes = (blogs) => blogs.reduce((prev, cur) => prev + cur.likes, 0);

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }
  const mostLikedBlog = blogs.reduce((prev, cur) =>
    cur.likes > prev.likes ? cur : prev
  );
  return mostLikedBlog;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }
  const map = {};
  let authorWithMostBlogs = blogs[0].author;
  let blogsOfAuthorWithMostBlogs = 1;
  for (const blog of blogs) {
    const author = blog.author;
    if (map[author] === undefined) {
      map[author] = 1;
    } else {
      map[author]++;
    }
    if (map[author] > blogsOfAuthorWithMostBlogs) {
      authorWithMostBlogs = author;
      blogsOfAuthorWithMostBlogs = map[author];
    }
  }
  return {
    author: authorWithMostBlogs,
    blogs: blogsOfAuthorWithMostBlogs,
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }
  const map = {};
  let authorWithMostLikes = blogs[0].author;
  let highestLikes = blogs[0].likes;
  for (const blog of blogs) {
    const author = blog.author;
    if (map[author] === undefined) {
      map[author] = blog.likes;
    } else {
      map[author] += blog.likes;
    }
    if (map[author] > highestLikes) {
      authorWithMostLikes = author;
      highestLikes = map[author];
    }
  }
  return {
    author: authorWithMostLikes,
    likes: highestLikes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
