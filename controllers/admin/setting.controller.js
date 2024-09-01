const SettingGeneral = require("../../models/setting-general.model");

module.exports.general = async (req, res) => {
  const record = await SettingGeneral.findOne({});

  res.render("admin/pages/settings/general", {
    pageTitle: "Cài đặt chung",
    settingGeneral: record,
  });
}

module.exports.generalPatch = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});

  if (settingGeneral) {
    await SettingGeneral.updateOne({
      _id: settingGeneral.id
    }, req.body);
  } else {
    const record = new SettingGeneral(req.body);
    await record.save();
  }


  req.flash("success", "Cập nhập cài đặt thành công!");
  res.redirect("back");
}