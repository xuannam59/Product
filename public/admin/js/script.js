// Button Status
const buttonsStatus = document.querySelectorAll("[button-status]");
if (buttonsStatus.length > 0) {
  let url = new URL(window.location.href);

  buttonsStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      if (status) {
        url.searchParams.set("status", status);
      }
      else {
        url.searchParams.delete("status");
      }
      window.location.href = url.href;
    })
  })
}
// End Button Status

// Form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;

    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}
// End from search

// Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination.length > 0) {
  let url = new URL(window.location.href);

  buttonPagination.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      console.log(page)

      url.searchParams.set("page", page);
      window.location.href = url.href;
    })
  })
}
// End pagination

// Checkbox multi
const checkboxMuli = document.querySelector("[checkbox-multi]");
if (checkboxMuli) {
  const inputCheckAll = checkboxMuli.querySelector("input[name='checkall']");
  const inputsCheck = checkboxMuli.querySelectorAll("input[name='id']");
  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsCheck.forEach(input => {
        input.checked = true;
      })
    } else {
      inputsCheck.forEach(input => {
        input.checked = false;
      })
    }
  })

  inputsCheck.forEach(input => {
    input.addEventListener("click", () => {
      const coutChecked = checkboxMuli.querySelectorAll("input[name='id']:checked").length;
      if (coutChecked === inputsCheck.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    })
  })
}
// End Checkbox multi

// from submit
const fromChangeMulti = document.querySelector("[form-change-multi]");
if (fromChangeMulti) {
  fromChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkboxMuli = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkboxMuli.querySelectorAll("input[name='id']:checked");

    const typeChange = e.target.elements.type.value;


    if (inputsChecked.length > 0) {
      if (typeChange == "delete-all") {
        const isConfirm = confirm("Bạn chắc chắc muốn xoá?");
        if (!isConfirm) {
          return;
        }
      }
      let ids = [];
      const inputsId = fromChangeMulti.querySelector("input[name='ids']");
      inputsChecked.forEach(input => {
        const id = input.value;
        if (typeChange === "change-position") {
          const positon = input
            .closest("tr")
            .querySelector("input[name='position']").value;
          ids.push(`${id}-${positon}`);
        } else {
          ids.push(id);
        }
      })
      inputsId.value = ids.join(", ");

      fromChangeMulti.submit();
    } else {
      alert("Choose one record");
    }
  })
}
// end from submit

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

// Preview image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
  uploadImageInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  })
  const imageClose = uploadImage.querySelector(".image-close");
  if (imageClose) {
    imageClose.addEventListener("click", () => {
      uploadImageInput.value = "";
      uploadImagePreview.src = "";
    })
  }
}
// End Preview image

// Sort product
const sort = document.querySelector("[sort]");
if (sort) {
  let url = new URL(window.location.href);

  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");
  // arrange product by sort
  sortSelect.addEventListener("change", e => {
    const value = e.target.value;
    const [sortKey, sortValue] = value.split("-");

    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);

    window.location.href = url.href;
  })
  // Clear arrange product
  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    window.location.href = url.href;
  })
  // Selected option
  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");
  if (sortKey && sortValue) {
    const stringSort = `${sortKey}-${sortValue}`;
    const optionSelect = sortSelect.querySelector(`option[value='${stringSort}']`);
    optionSelect.selected = true;
  }
}
// End sort Product