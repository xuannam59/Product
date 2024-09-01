const User = require("../../models/user.model");
const RoomsChat = require("../../models/rooms-chat.model");

module.exports = async (res) => {
  const userIdA = res.locals.user.id

  _io.once("connection", (socket) => {
    // Khi A gửi yêu cầu cho B
    socket.on("CLIENT_ADD_FRIEND", async (userIdB) => {
      // add id of B into requestFriends of A
      const exsitBinA = await User.findOne({
        _id: userIdA,
        requestFriends: userIdB,
      });

      if (!exsitBinA) {
        await User.updateOne({
          _id: userIdA,
        }, {
          $push: { requestFriends: userIdB },
        });
      }

      // add id of A into acceptFriends of B
      const exsitAinB = await User.findOne({
        _id: userIdB,
        acceptFriends: userIdA,
      });

      if (!exsitAinB) {
        await User.updateOne({
          _id: userIdB
        }, {
          $push: { acceptFriends: userIdA },
        });
      }

      // reture the length of acceptFriends
      const infoB = await User.findOne({
        _id: userIdB
      });
      const lengthAcceptFriends = infoB.acceptFriends.length;
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userIdB,
        lengthAcceptFriends: lengthAcceptFriends
      })

      // get infor of A and reture the info to acceptFriend page B
      const infoA = await User.findOne({
        _id: userIdA
      }).select("id fullName avatar");
      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userId: userIdB,
        infoA: infoA
      })

      // server reture User id add friend
      socket.broadcast.emit("SERVER_RETURN_USER_ID_ADD_FRIEND", {
        userIdB: userIdB,
        userIdA: userIdA
      });
    });

    // Khi A huỷ gửi yêu cầu cho B
    socket.on("CLIENT_CANCEL_FRIEND", async (userIdB) => {

      // delete id of B from requestFriends of A
      const exsitBinA = await User.findOne({
        _id: userIdA,
        requestFriends: userIdB,
      });
      if (exsitBinA) {
        await User.updateOne({
          _id: userIdA
        }, {
          $pull: { requestFriends: userIdB }
        });
      }

      // delete id of A from acceptFriends of B
      const exsitAinB = await User.findOne({
        _id: userIdB,
        acceptFriends: userIdA
      })

      if (exsitAinB) {
        await User.updateOne({
          _id: userIdB,
        }, {
          $pull: { acceptFriends: userIdA }
        });
      }

      // reture the length of acceptFriends
      const infoB = await User.findOne({
        _id: userIdB
      })
      const lengthAcceptFriends = infoB.acceptFriends.length;
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userIdB,
        lengthAcceptFriends: lengthAcceptFriends
      })

      // server reture Id of A to B 
      socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
        userIdB: userIdB,
        userIdA: userIdA
      });
    });

    // Khi A từ chối lời kết bạn với B
    socket.on("CLIENT_REFUSE_FRIEND", async (userIdB) => {
      // remove B's Id from acceptFriends A 
      const exsitBinA = await User.findOne({
        _id: userIdA,
        acceptFriends: userIdB
      });

      if (exsitBinA) {
        await User.updateOne({
          _id: userIdA
        }, {
          $pull: { acceptFriends: userIdB }
        })
      }
      // remove A's id from requestFriends B
      const exsitAinB = await User.findOne({
        _id: userIdB,
        requestFriends: userIdA,
      });
      if (exsitAinB) {
        await User.updateOne({
          _id: userIdB
        }, {
          $pull: { requestFriends: userIdA }
        });
      }

      // reture the length acceptFriend
      const info = await User.findOne({
        _id: userIdA,
      });
      const lengthAcceptFriends = info.acceptFriends.length;
      socket.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userIdA,
        lengthAcceptFriends: lengthAcceptFriends
      })

    });

    // khi A Chấp nhận lời kết bạn với B
    socket.on("CLIENT_ACCEPT_FRIEND", async (userIdB) => {

      // Check exsit
      const exsitAinB = await User.findOne({
        _id: userIdB,
        requestFriends: userIdA
      });

      const exsitBinA = await User.findOne({
        _id: userIdA,
        acceptFriends: userIdB
      });

      // Creat roomChat
      let roomChat;
      if (exsitAinB && exsitBinA) {
        const dataChat = {
          typeRoom: "friends",
          users: [
            {
              user_id: userIdA,
              role: "superAdmin"
            },
            {
              user_id: userIdB,
              role: "superAdmin"
            }
          ]
        }

        roomChat = new RoomsChat(dataChat);
        await roomChat.save();
      }

      // remove B's Id from acceptFriends A and add B's id to A's friendsList
      if (exsitBinA) {
        await User.updateOne({
          _id: userIdA,
        }, {
          $push: {
            friendsList: {
              userId: userIdB,
              roomChatId: roomChat.id,
            }
          },
          $pull: { acceptFriends: userIdB }
        });
      }

      // remove A's id from requestFriends B and add A's id to B's friendsList
      if (exsitAinB) {
        await User.updateOne({
          _id: userIdB
        }, {
          $push: {
            friendsList: {
              userId: userIdA,
              roomChatId: roomChat.id,
            }
          },
          $pull: { requestFriends: userIdA }
        });
      }

      // reture the length acceptFriend
      const info = await User.findOne({
        _id: userIdA,
      });
      const lengthAcceptFriends = info.acceptFriends.length;
      socket.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userIdA,
        lengthAcceptFriends: lengthAcceptFriends
      })
    });
  });
}