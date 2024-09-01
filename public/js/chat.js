import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// file-upload-with-preview
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
  multiple: true,
  maxFileCount: 6
});
// End file-upload-with-preview

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    const images = upload.cachedFileArray;

    console.log(images);

    if (content || images.length > 0) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content,
        images: images
      });
      e.target.elements.content.value = "";
      upload.resetPreviewPanel(); // clear all selected images
    }
  })
}
// End CLIENT_SEND_MESSAGE

// SERVER_RETURE_MESSAGE
socket.on("SERVER_RETURE_MESSAGE", (data) => {
  const body = document.querySelector(".chat .inner-body");
  const myId = document.querySelector(".chat[my-id]").getAttribute("my-id");
  const div = document.createElement("div");
  let htmlFullName = "";
  let htmlContent = "";
  let htmlImages = "";

  if (myId == data.user_id) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name" >${data.fullName}</div>`
  }

  if (data.content) {
    htmlContent = `<div class="inner-content" >${data.content}</div>`
  }

  if (data.images.length > 0) {
    htmlImages += `<div class="inner-images"> `
    for (let image of data.images) {
      htmlImages += `<img src=${image}>`
    }
    htmlImages += `</div>`
  }

  div.innerHTML = `
  ${htmlFullName}
  ${htmlContent}
  ${htmlImages}
  `
  const gallery = new Viewer(div);
  const elementListTyping = body.querySelector(".inner-list-typing");
  body.insertBefore(div, elementListTyping);
  socket.emit("CLIENT_SEND_TYPING", "hidden");
  body.scrollTop = body.scrollHeight;
})
// End SERVER_RETURE_MESSAGE

// Scroll bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End Scroll bottom

// Emoji

// Show Popup
const buttonIcon = document.querySelector('.button-icon');
if (buttonIcon) {
  const tooltip = document.querySelector('.tooltip');
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.onclick = () => {
    tooltip.classList.toggle('shown');
  }
}
// End Show Popup

// Function Show Typing 
var timeout;
const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");

  clearTimeout(timeout);

  timeout = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 3000);
}
// end Function Show Typing 

// Insert icon to chat
const emojiPicker = document.querySelector('emoji-picker');
if (emojiPicker) {
  const inputChat = document.querySelector(".chat .inner-form input[name='content']");
  emojiPicker.addEventListener('emoji-click', (event) => {
    const icon = event.detail.unicode;
    inputChat.value += icon;
    var end = inputChat.value.length;
    inputChat.setSelectionRange(end, end);
    inputChat.focus();
    showTyping();
  });
}
// End Insert icon to chat
// End Emoji

// Typing
const inputChat = document.querySelector(".chat .inner-form input[name='content']");
if (inputChat) {
  inputChat.addEventListener("keyup", (e) => {
    let value = e.target.value;
    console.log(value);
    if (value != "") {
      showTyping();
    } else {
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}

// end Typing

// SERVER_RETURE_TYPING 
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    if (data.type == "show") {
      const existTyping = elementListTyping.querySelector(`[user-id= '${data.user_id}']`);
      const inputChat = document.querySelector(".chat .inner-form input[name='content']");

      if (!existTyping) {
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.user_id);

        boxTyping.innerHTML = `
      <div div class="inner-name" >${data.fullName}</div>
        <div class="inner-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
    `;
        elementListTyping.appendChild(boxTyping);
        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    } else {
      const boxTypingRemove = elementListTyping.querySelector(`[user-id= '${data.user_id}']`);
      if (boxTypingRemove) {
        elementListTyping.removeChild(boxTypingRemove);
      }
    }
  })
}
// End SERVER_RETURE_TYPING 

// Viewer-js
const bodyPreviewImage = document.querySelector(".chat .inner-body");
if (bodyPreviewImage) {
  const gallery = new Viewer(bodyPreviewImage);
}
// End Viewer-js