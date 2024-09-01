const md5 = require("md5");

const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forget-password.model");
const Cart = require("../../models/cart.model");

const generate = require("../../helpers/generate");
const sendMailHelpers = require("../../helpers/sendMail");

// [GET] /user/register
module.exports.register = (req, res) => {
  const user = res.locals.user;
  if (user) {
    res.redirect("/");
    return;
  }

  res.render("client/pages/user/register", {
    pagetitle: "Đăng ký tài khoản"
  })
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const email = req.body.email;

  const existUser = await User.findOne({
    email: email
  })
  if (existUser) {
    req.flash("error", "Email này đã tồn tại!");
    res.redirect("back");
    return;
  }

  req.body.password = md5(req.body.password);

  const user = new User(req.body);
  await user.save();

  res.redirect("/user/login");
}

// [GET] /user/login
module.exports.login = (req, res) => {
  const user = res.locals.user;
  if (user) {
    res.redirect("/");
    return;
  }
  res.render("client/pages/user/login", {
    pagetitle: "Đăng nhập"
  });
}
// [POST] /user/loginPost
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
  });
  if (!user) {
    req.flash("error", "Email này không tồn tại!");
    res.redirect("back");
    return;
  }
  if (md5(password) != user.password) {
    req.flash("error", "Mật khẩu sai vui lòng nhập lại!");
    res.redirect("back");
    return;
  }

  if (user.status == "close") {
    req.flash("error", "Tài khoản này đã bị khoá vui lòng liên hệ admin!");
    res.redirect("back");
    return;
  }


  const card = await Cart.findOne({ user_id: user.id });

  if (card) {
    res.cookie("cartId", card.id);
  } else {
    const cartId = req.cookies.cartId;
    await Cart.updateOne({ _id: cartId }, { user_id: user.id });
  }

  res.cookie("tokenUser", user.tokenUser);
  await User.updateOne({
    tokenUser: user.tokenUser
  }, {
    statusOnline: "online"
  })

  _io.once('connection', (socket) => {
    socket.broadcast.emit("SERVER_RETURN_STATUS_ONLINE", {
      userId: user.id,
      statusOnline: "online"
    })
  });

  res.redirect("/")
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  await User.updateOne({
    tokenUser: req.cookies.tokenUser,
  }, {
    statusOnline: "offline"
  })

  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser,
  })

  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_STATUS_ONLINE", {
      userId: user.id,
      statusOnline: "offline"
    })
  });

  res.clearCookie("tokenUser");
  res.clearCookie("cartId");
  res.redirect("/user/login");
}

// [GET] /user/foret-password
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forget-password", {
    pageTitle: "Lấy lại mật khẩu",
  })
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false
  })

  const existForgot = await ForgotPassword.findOne({
    email: email,
  })

  if (existForgot) {
    res.redirect(`/user/password/otp?email=${email}`);
    return;
  }

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }

  //lưu thông tin vào database
  const otp = generate.generateRandomNumber(6);
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now()
  }
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // Xứ lý giử OTP qua email
  const subject = "Mã xác nhận OTP";
  const html = `
    Mã xác nhận OTP : <b>${otp}</b>.Tuyệt đối không cung cấp mã OTP cho bất kì ai để tránh kẻ gian đánh cắp tài khoản.Thời gian sử dụng trong 3 phút.
  `
  sendMailHelpers.sendMail(email, subject, html);


  res.redirect(`/user/password/otp?email=${email}`);
}

// [GET] /user/password/otp
module.exports.otpPassword = (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email,
  })
}

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  // mã OTP không tồn tại
  if (!result) {
    req.flash("error", "Mã OTP không hợp lệ");
    res.redirect("back");
    return;
  }

  // Mã OTP tồn tại
  const user = await User.findOne({
    email: email
  });

  // set cookie tokenUser
  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
}

// [GET] /user/password/reset
module.exports.resetPassword = (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đặt lại mật khẩu"
  })
}

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;
  const password = md5(req.body.password);

  try {
    await User.updateOne({
      tokenUser: tokenUser
    }, {
      password: password
    });

    res.redirect("/");
  } catch (error) {
    req.flash("error", "Đã có lỗi xảy ra");
    res.redirect("back");
  }
}

// [GET] /user/infor
module.exports.infor = (req, res) => {

  res.render("client/pages/user/infor", {
    pageTitle: "Thông tin tài khoản"
  })
}