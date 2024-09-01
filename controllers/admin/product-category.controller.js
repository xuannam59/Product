const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const filterStatusHelpers = require("../../helpers/filter-status");
const searchHelpers = require("../../helpers/sreach");
const paginationHelpers = require("../../helpers/pagination");
const createTreeHelpers = require("../../helpers/createTree");

//[GET] admin/product-category
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  // filter  
  let filterStatus = filterStatusHelpers(req.query);
  if (req.query.status) {
    find.status = req.query.status;
  }
  // end filter

  // search
  let objectSearch = searchHelpers(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  // end search

  // pagination
  const countProducts = await ProductCategory.countDocuments(find);
  const objectPagination = paginationHelpers({
    currentPage: 1,
    limitItem: 5,
  },
    req.query,
    countProducts
  );
  // end pagination

  const records = await ProductCategory.find(find)

  const newRecords = createTreeHelpers.tree(records);

  res.render("admin/pages/products-category/index", {
    pageTitle: "Trang danh mục sản phẩm",
    records: newRecords,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });
};

//[GET] admin/product-category/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false
  };


  const records = await ProductCategory.find(find);
  const newRecords = createTreeHelpers.tree(records);

  res.render("admin/pages/products-category/create", {
    pageTitle: "Trang tạo danh mục sản phẩm",
    records: newRecords,
  });
};

//[POST] admin/product-category/create
module.exports.createPost = async (req, res) => {
  try {
    if (req.body.position == "") {
      const countProducts = await ProductCategory.countDocuments();
      req.body.position = countProducts + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }
    const product = new ProductCategory(req.body);
    await product.save();
    req.flash("success", " Tạo danh mục sản phẩm thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  } catch (error) {
    req.flash("error", "Tạo danh mục sản phẩm thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

//[GET] admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      _id: id,
      deleted: false,
    }
    const data = await ProductCategory.findOne(find);

    const records = await ProductCategory.find({ deleted: false });
    const newRecords = createTreeHelpers.tree(records);

    res.render("admin/pages/products-category/edit", {
      pageTitle: "Trang sửa danh mục sản phẩm",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    req.flash("error", "Lấy dữ liệu thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }

};

//[PATCH] admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position);

    await ProductCategory.updateOne({ _id: id }, req.body)
    req.flash("success", "Cập nhập danh mục thành công!");
    res.redirect("back");
  } catch (error) {
    req.flash("errer", "Cập nhập danh mục thất bại!");
    res.redirect("back");
  }
}