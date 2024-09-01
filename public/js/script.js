// show alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const alertClose = showAlert.querySelector("[alert-close]");
  const time = parseInt(showAlert.getAttribute("data-time"));
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
  if (alertClose) {
    alertClose.addEventListener("click", () => {
      showAlert.classList.add("alert-hidden");
    })
  }
}
// end show alert