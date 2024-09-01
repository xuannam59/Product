const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  user_id: String,
  content: String,
  images: Array,
  room_chat_id: String,
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Chat = mongoose.model("Chat", chatSchema, "chats");

module.exports = Chat;