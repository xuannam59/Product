// Change Status item
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path")
  buttonsChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      let statusChange = statusCurrent === "active" ? "inactive" : "active";

      const action = path + `/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.action = action;

      formChangeStatus.submit();
    })
  })
}
// End change status item

// Delete item
const buttonDeleteItem = document.querySelectorAll("[button-delete]");
const formDeleteItem = document.querySelector("#form-delete-item");
if (buttonDeleteItem.length > 0) {
  const path = formDeleteItem.getAttribute("data-path")
  buttonDeleteItem.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("bạn chắc chắn muốn xoá chứ?");

      if (isConfirm) {
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=DELETE`;
        formDeleteItem.action = action;

        formDeleteItem.submit();
      }
    })
  })
}
// End Delete item