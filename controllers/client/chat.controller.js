const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

const chatSocket = require("../../sockets/clients/chat.socket");

// [GET] /chats/:roomChatId
module.exports.index = async (req, res) => {
  const roomChatId = req.params.roomChatId;


  // SocketIO
  chatSocket(req, res);

  // Lấy data trả ra ngoài giao diện
  const chats = await Chat.find({
    deleted: false,
    room_chat_id: roomChatId
  });

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
    }).select("fullName");

    chat.infoUser = infoUser;
  }

  // render giao diện
  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
  })
}