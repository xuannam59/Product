const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const productHelperes = require("../../helpers/product");
const productCategoryHelperes = require("../../helpers/product-category");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: 'active',
    deleted: false
  })
    .sort({ position: "desc" });

  const newProduct = productHelperes.newPriceProducts(products);

  res.render("client/pages/products/index.pug", {
    pageTitle: "Sản Phẩm",
    products: newProduct,
  });
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slugProduct;
    const find = {
      slug: slug,
      deleted: false,
      status: "active"
    }
    const product = await Product.findOne(find);

    if (product.product_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        deleted: false,
        status: "active"
      })

      product.category = category;
    }

    product.priceNew = productHelperes.newPriceProduct(product);

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    req.flash("error", "Không tồn tại sản phẩm đó");
    res.redirect("/products");
  }
}

// [GET] /products/: slugCategory
module.exports.category = async (req, res) => {
  try {
    const slug = req.params.slugCategory;
    const category = await ProductCategory.findOne({
      slug: slug,
      deleted: false,
      status: "active"
    })

    const listSubCategory = await productCategoryHelperes.getSubCategory(category.id);
    const listSubCategoryId = listSubCategory.map(item => item.id);

    const products = await Product.find({
      product_category_id: { $in: [category.id, ...listSubCategoryId] },
      status: "active",
      deleted: false,
    }).sort({ position: "desc" });

    const newProduct = productHelperes.newPriceProducts(products);

    res.render("client/pages/products/category.pug", {
      pageTitle: category.title,
      products: newProduct,
    });
  } catch (error) {
    req.flash("error", "Không tồn tại danh mục!");
    // res.redirect("/products");
  }

}