const RoomChat = require("../../models/rooms-chat.model");
const User = require("../../models/user.model");

// [GET] /rooms-chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const listRoomChat = await RoomChat.find({
    "users.user_id": userId,
    typeRoom: "group",
    deleted: false,
  }).select("id title avatar");

  res.render("client/pages/rooms-chat/index", {
    pageTitle: "Danh sách phòng chat",
    listRoomChat: listRoomChat
  });
}

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendsList = res.locals.user.friendsList;


  for (const friend of friendsList) {
    const infoFriend = await User.findOne({
      _id: friend.userId
    }).select("fullName avatar");
    friend.infoFriend = infoFriend;
  }

  res.render("client/pages/rooms-chat/create", {
    pagaTitle: "Tạo phòng",
    friendsList: friendsList,
  });
}

//[POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const userId = res.locals.user.id;
  const title = req.body.title;
  const usersId = req.body.usersId;

  const dataRoom = {
    title: title,
    typeRoom: "group",
    users: [],
  }

  if (typeof (usersId) == "object") {
    for (const userId of usersId) {
      dataRoom.users.push(
        {
          user_id: userId,
          role: "member"
        }
      );
    }
  } else {
    dataRoom.users = [
      {
        user_id: usersId,
        role: "member"
      }
    ]
  }

  dataRoom.users.push(
    {
      user_id: userId,
      role: "superAdmin"
    }
  );

  const roomChat = new RoomChat(dataRoom);
  await roomChat.save();

  res.redirect(`/chat/${roomChat._id}`);
}