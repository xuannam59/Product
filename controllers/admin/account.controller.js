const Role = require("../../models/roles.model");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const md5 = require('md5');
const system = require("../../config/system");


// [GET] admin/accounts
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  }


  const records = await Account.find(find).select("-password -token");

  for (const record of records) {
    const roles = await Role.findOne({
      _id: record.role_id,
      deleted: false
    })
    record.role = roles;
  }


  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  })
}

// [GET] admin/accounts/create
module.exports.create = async (req, res) => {

  const roles = await Role.find({
    deleted: false
  })

  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo tài khoản",
    roles: roles,
  })
}

// [POST] admin/accounts/create
module.exports.createPost = async (req, res) => {

  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
  })

  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
    res.redirect("back");
  } else {
    req.body.password = md5(req.body.password);

    const account = new Account(req.body);
    account.save();

    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}

// [GET] admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      _id: id,
      deleted: false
    }

    const record = await Account.findOne(find);
    const roles = await Role.find({
      deleted: false
    })
    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      roles: roles,
      record: record,
    })
  } catch (error) {
    req.flash("error", "Lấy dữ liệu thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }

}

// [POST] admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const emailExist = await Account.findOne({
      _id: { $ne: id },
      email: req.body.email,
      deleted: false,
    })


    if (emailExist) {
      req.flash("error", `Email ${req.body.email} đã tồn tại`);
      res.redirect("back");
      return;
    }
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    await Account.updateOne({ _id: id }, req.body);

    req.flash("success", "Cập nhập thành công!");
  } catch (error) {
    req.flash("error", "Cập nhập thất bại!");
  }

  res.redirect(`back`);
}
