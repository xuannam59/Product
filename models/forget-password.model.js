const mongoose = require("mongoose");

const forgetPasswordSchema = new mongoose.Schema({
  email: String,
  otp: Number,
  expireAt: {
    type: Date,
    expires: 300,
  },
}, {
  timestamps: true,
});

const ForgetPassword = mongoose.model("ForgetPassword", forgetPasswordSchema, "forgetPasswords");

module.exports = ForgetPassword;