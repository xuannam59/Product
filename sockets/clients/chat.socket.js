const Chat = require("../../models/chat.model");

const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

module.exports = (req, res) => {
  const userId = res.locals.user.id;
  const userFullName = res.locals.user.fullName
  const roomChatId = req.params.roomChatId;

  _io.once('connection', (socket) => {
    socket.join(roomChatId);

    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      const images = [];

      // Push link iamges into array
      for (let imageBuffer of data.images) {
        const link = await uploadToCloudinary(imageBuffer);
        images.push(link);
      }

      // Lưu vào database
      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: images,
        room_chat_id: roomChatId,
      });
      await chat.save();

      // Trả về client
      _io.to(roomChatId).emit("SERVER_RETURE_MESSAGE", {
        user_id: userId,
        fullName: userFullName,
        content: data.content,
        images: images,
        room_chat_id: roomChatId,
      });

    });

    // CLIENT_SEND_TYPING
    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: userFullName,
        type: type
      });
    })
    // End CLIENT_SEND_TYPING
  });
} 