// handles the friend sending feature
const listBtnAddFriends = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriends.length > 0) {
  listBtnAddFriends.forEach((btn) => {
    btn.addEventListener("click", () => {
      const boxUser = btn.closest(".box-user");
      boxUser.classList.add("add");

      const userIdB = btn.getAttribute("btn-add-friend");

      socket.emit("CLIENT_ADD_FRIEND", userIdB);
    })
  })
}
//  End handles the friend sending feature

// handle the unfriend feature
const listBtnCancelFriends = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriends.length > 0) {
  listBtnCancelFriends.forEach((btn) => {
    btn.addEventListener("click", () => {
      const boxUser = btn.closest(".box-user");
      boxUser.classList.remove("add");

      const userIdB = btn.getAttribute("btn-cancel-friend");

      socket.emit("CLIENT_CANCEL_FRIEND", userIdB);
    })
  })
}
// End handle the unfriend feature


// Handls the friend refusal feature
const DeleteUser = (btn) => {
  btn.addEventListener("click", () => {
    const boxUser = btn.closest(".box-user");
    boxUser.classList.add("refuse");

    const userIdB = btn.getAttribute("btn-refuse-friend");

    socket.emit("CLIENT_REFUSE_FRIEND", userIdB);
  })
}
const listBtnRefuseFriends = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriends.length > 0) {
  listBtnRefuseFriends.forEach(btn => {
    DeleteUser(btn);
  })
}
// End handls the friend refusal feature

// handle the friend accpet feature
const acceptUser = (btn) => {
  btn.addEventListener("click", () => {
    const boxUser = btn.closest(".box-user");
    boxUser.classList.add("accepted");

    const userIdB = btn.getAttribute("btn-accept-friend");
    socket.emit("CLIENT_ACCEPT_FRIEND", userIdB);
  })
}
const listBtnAcceptFriends = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriends) {
  listBtnAcceptFriends.forEach(btn => {
    acceptUser(btn);
  })
}
// End handle the friend accpet feature

// handle real time

// upgrade quantity accept Friend
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
  const badgeUsersAccept = document.querySelector(`[badge-users-accept='${data.userId}']`);
  if (badgeUsersAccept) {
    badgeUsersAccept.innerHTML = data.lengthAcceptFriends
  }
})

//SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  // show the info in the acceptFriend page when have any people
  const dataUserAccept = document.querySelector(`.row[data-user-accept='${data.userId}']`);
  if (dataUserAccept) {
    const newBoxUser = document.createElement("div");
    newBoxUser.classList.add("col-4");
    newBoxUser.setAttribute("user_id", data.infoA._id);

    newBoxUser.innerHTML = `
      <div class="box-user">
        <div class="inner-avatar"><img src=${data.infoA.avatar ? data.infoA.avatar : "/images/logoUser.png"} alt=${data.infoA.fullName}></div>
        <div class="inner-info">
          <div class="inner-name">${data.infoA.fullName}</div>
          <div class="inner-buttons">
            <button class="btn btn-sm btn-primary mr-1" btn-accept-friend=${data.infoA._id}>Chấp nhận</button>
            <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend=${data.infoA._id}>Xóa</button>
            <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend="" disabled="">Đã xóa</button>
            <button class="btn btn-sm btn-primary mr-1" btn-accepted-friend="" disabled="">Đã chấp nhận</button>
          </div>
        </div>
      </div>
      `;
    dataUserAccept.appendChild(newBoxUser);

    // handle event accpet
    const btnAcceptFriend = newBoxUser.querySelector("[btn-accept-friend]");
    acceptUser(btnAcceptFriend);

    // handle event refuse
    const btnRefuseFriend = newBoxUser.querySelector("[btn-refuse-friend]");
    DeleteUser(btnRefuseFriend);
  }

  // remove the info of A in the notFriend page of B
  const dataUserNotFriend = document.querySelector(`.row[data-user-not-friend='${data.userId}']`);
  if (dataUserNotFriend) {
    const boxRemoveUser = dataUserNotFriend.querySelector(`[user_id='${data.infoA._id}']`);
    if (boxRemoveUser) {
      dataUserNotFriend.removeChild(boxRemoveUser);
    }
  }
})

// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
  // remove the info of A in the acceptFriend page of B
  const dataUserAccept = document.querySelector(`.row[data-user-accept='${data.userIdB}']`);
  if (dataUserAccept) {
    const boxRemoveUser = dataUserAccept.querySelector(`[user_id='${data.userIdA}']`);
    if (boxRemoveUser) {
      dataUserAccept.removeChild(boxRemoveUser);
    }
  }
})

// SERVER_RETURN_STATUS_ONLINE
socket.on("SERVER_RETURN_STATUS_ONLINE", (data) => {
  const dataUserFriends = document.querySelector("[data-user-friends]");
  if (dataUserFriends) {
    const boxUser = dataUserFriends.querySelector(`[user_id='${data.userId}']`);
    if (boxUser) {
      boxInnerStatus = boxUser.querySelector("[status]");
      boxInnerStatus.setAttribute("status", data.statusOnline);
    }
  }
})


// end handle real time