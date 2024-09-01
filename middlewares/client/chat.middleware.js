const RoomsChat = require("../../models/rooms-chat.model");

module.exports.isAccess = async (req, res, next) => {
  const roomChatId = req.params.roomChatId;
  const userId = res.locals.user.id;

  const exsitUserinRoomChat = await RoomsChat.findOne({
    _id: roomChatId,
    "users.user_id": userId,
    deleted: false
  });

  if (exsitUserinRoomChat) {
    next();
  } else {
    res.redirect("/");
  };
}