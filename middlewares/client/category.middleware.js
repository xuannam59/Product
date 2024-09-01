const createTreeHelpers = require("../../helpers/createTree");

const ProductCategory = require("../../models/product-category.model");

module.exports.category = async (req, res, next) => {
  const find = {
    deleted: false,
  }

  const productsCategory = await ProductCategory.find(find);

  const newProductsCategory = createTreeHelpers.tree(productsCategory);

  res.locals.layoutProductsCategory = newProductsCategory

  next();
}