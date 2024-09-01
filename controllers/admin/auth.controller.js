const Account = require("../../models/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");
const system = require("../../config/system");

// [GET] admin/auth/login
module.exports.login = async (req, res) => {
  const token = req.cookies.token;

  const user = await Account.findOne({ token: token });
  if (user) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    return;
  }

  res.clearCookie("token");
  res.render("admin/pages/auth/login", {
    pageTitle: "Đăng nhập",
  })
};

// [POST] admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email
  const password = md5(req.body.password)

  const user = await Account.findOne({
    email: email,
    deleted: false
  })


  if (!user) {
    req.flash("error", "email không hơp lệ!");
    res.redirect("back");
    return;
  }

  if (password != user.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
    return;
  }

  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khoá!");
    res.redirect("back");
    return;
  }

  res.cookie("token", user.token);
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};

// [GET] admin/auth/logout
module.exports.logout = (req, res) => {

  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};