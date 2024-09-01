const Product = require("../../models/product.model");
const productsHelpers = require("../../helpers/product");

// [GET] /search
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;

  let newProducts = [];

  if (keyword) {
    const regex = new RegExp(keyword, "i");
    const products = await Product.find({
      title: regex,
      status: "active",
      deleted: false
    })

    newProducts = productsHelpers.newPriceProducts(products);
  }


  res.render("client/pages/search/index", {
    pageTitle: "Tìm kiếm",
    keyword: keyword,
    products: newProducts
  })
}