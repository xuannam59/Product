module.exports.create = (req, res, next) => {
  if (!req.body.title) {
    req.flash('error', "Vui Lòng nhập tiêu đề");
    res.redirect("back");
    return;
  }

  next();
}