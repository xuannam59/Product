const User = require("../../models/user.model");

const usersSocket = require("../../sockets/clients/users.socket");

// [GET] users/not-friend
module.exports.notFriend = async (req, res) => {
  const userId = res.locals.user.id;
  const requestFriends = res.locals.user.requestFriends;
  const acceptFriends = res.locals.user.acceptFriends;
  const friendsList = res.locals.user.friendsList.map(user => user.userId);

  // Socket users
  usersSocket(res);

  const users = await User.find({
    $and: [
      { _id: { $ne: userId } }, // not equal
      { _id: { $nin: requestFriends } }, // not in
      { _id: { $nin: acceptFriends } }, // not in
      { _id: { $nin: friendsList } }, // not in
    ],
    status: "active",
    deleted: false,
  }).select("id avatar fullName");

  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users
  })
}

// [GET] users/request
module.exports.request = async (req, res) => {
  const requestFriends = res.locals.user.requestFriends;

  // Socket users
  usersSocket(res);


  const users = await User.find({
    _id: { $in: requestFriends },
    status: "active",
    deleted: false
  }).select("id fullName avatar");

  res.render("client/pages/users/request", {
    pageTitle: "Lời mời đã gửi",
    users: users
  });
}

// [GET] users/accept
module.exports.accpet = async (req, res) => {
  const accpetFriends = res.locals.user.acceptFriends;

  // socket users
  usersSocket(res);


  const users = await User.find({
    _id: { $in: accpetFriends },
    status: "active",
    deleted: false
  }).select("id fullName avatar");

  res.render("client/pages/users/accpet", {
    pageTitle: "Lời mời kết bạn",
    users: users,
  })
}

// [GET] users/friends
module.exports.friends = async (req, res) => {
  const friendsListId = res.locals.user.friendsList.map(user => user.userId);
  const friendsList = res.locals.user.friendsList;

  // Socket User
  usersSocket(res);


  const users = await User.find({
    _id: { $in: friendsListId },
    status: "active",
    deleted: false
  }).select("id fullName avatar statusOnline");

  for (const user of users) {
    const infoFriend = friendsList.find(friend => friend.userId === user.id);
    user.infoFriend = infoFriend;
  }

  res.render("client/pages/users/friends", {
    pageTitle: "Danh sách bạn bè",
    users: users
  })
}