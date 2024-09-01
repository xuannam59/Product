module.exports = (query) => {
  let objectSreach = {
    keyword: ""
  }

  if (query.keyword) {
    objectSreach.keyword = query.keyword

    const regex = new RegExp(objectSreach.keyword, "i");
    objectSreach.regex = regex
  }

  return objectSreach;
}