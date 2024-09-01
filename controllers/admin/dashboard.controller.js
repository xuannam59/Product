const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const User = require("../../models/user.model");
const Account = require("../../models/account.model");

// [GET] /adimin/dashboard
module.exports.dashboard = async (req, res) => {
  const statistic = {
    categoryProduct: {
      quantily: 0,
      active: 0,
      inactive: 0,
    },
    product: {
      quantily: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      quantily: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      quantily: 0,
      active: 0,
      inactive: 0,
    },
  };

  statistic.categoryProduct.quantily = await ProductCategory.countDocuments({
    deleted: false,
  });
  statistic.categoryProduct.active = await ProductCategory.countDocuments({
    deleted: false,
    status: "active"
  });
  statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
    deleted: false,
    status: "inactive"
  });

  statistic.product.quantily = await Product.countDocuments({
    deleted: false,
  });
  statistic.product.active = await Product.countDocuments({
    deleted: false,
    status: "active"
  });
  statistic.product.inactive = await Product.countDocuments({
    deleted: false,
    status: "inactive"
  });

  statistic.user.quantily = await User.countDocuments({
    deleted: false,
  });
  statistic.user.active = await User.countDocuments({
    deleted: false,
    status: "active"
  });
  statistic.user.inactive = await User.countDocuments({
    deleted: false,
    status: "inactive"
  });

  statistic.account.quantily = await Account.countDocuments({
    deleted: false,
  });
  statistic.account.active = await Account.countDocuments({
    deleted: false,
    status: "active"
  });
  statistic.account.inactive = await Account.countDocuments({
    deleted: false,
    status: "inactive"
  });

  console.log(statistic);

  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang tổng quan",
    statistic: statistic,
  });
}