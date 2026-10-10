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
  blogs.sort((a, b) => parseFloat(b.likes) - parseFloat(a.likes));
  return blogs[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
