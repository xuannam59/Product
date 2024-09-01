const Product = require("../../models/product.model");

const productHelperes = require("../../helpers/product");

// [GET] /
module.exports.index = async (req, res) => {
  // Lấy ra sản phẩm nổi bật
  const productsPeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active"
  }).limit(6);

  const newProductPeatured = productHelperes.newPriceProducts(productsPeatured);

  // Hết lấy ra sản phẩm nổi bật

  // Lẩy ra sản phẩm mới
  const products = await Product.find({
    deleted: false,
    status: "active"
  }).sort({ position: "desc" }).limit(6);
  const newProducts = productHelperes.newPriceProducts(products);
  // Hết Lẩy ra sản phẩm mới

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsPeatured: newProductPeatured,
    newProducts: newProducts
  });
}