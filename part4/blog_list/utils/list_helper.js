var _ = require('lodash');

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, iter) => {
    return sum + iter.likes
  }
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  blogs.sort((a, b) => parseFloat(b.likes) - parseFloat(a.likes))
  return blogs[0]
}

const mostBlogs = (blogs) => {

  let authorArray = new Array()
  blogs.forEach(function(blog) {
    authorArray.push(blog.author)
  })

  let blogCounts  = _.countBy(authorArray)
  let blogAuthorPairs = _.toPairs(blogCounts)
  let result = _.max(blogAuthorPairs)

  return {author: result[0], blogs: result[1]}
}

const mostLikes = (blogs) => {

  let authorLikes = _.reduce(blogs, function(result, value, key) {
    (result[value.author] || (result[value.author] = 0))
    result[value.author] += value.likes
    return result;
  }, []);

  const entries = Object.entries(authorLikes)
  const sortedByLikes= entries.sort((a, b) => b[1] - a[1])

  return {author: sortedByLikes[0][0], likes: sortedByLikes[0][1]}

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
