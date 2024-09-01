// Deleted button
const buttonDeleteRole = document.querySelectorAll("button[button-delete]");
const formDeleteRole = document.querySelector("#form-delete-role");
if (buttonDeleteRole.length > 0) {
  buttonDeleteRole.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("You really want to delete");
      if (isConfirm) {
        const id = button.getAttribute("data-id");
        const path = formDeleteRole.getAttribute("data-path");
        const action = `${path}/${id}?_method=DELETE`;

        formDeleteRole.action = action;
        formDeleteRole.submit();
      }
    })
  })
}
// End deleted button

// update permission
const tablePremission = document.querySelector("[table-permission]");
if (tablePremission) {
  const buttonSubmit = document.querySelector("[button-submit]");
  buttonSubmit.addEventListener("click", e => {
    const roles = [];
    const rows = tablePremission.querySelectorAll("tr[data-name]");

    rows.forEach(row => {
      const dataName = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");
      if (dataName == "id") {
        inputs.forEach(input => {
          roles.push({
            id: input.value,
            permissions: []
          })
        })
      } else {
        const checked = row.querySelectorAll("input");
        checked.forEach((item, index) => {
          if (item.checked) {
            roles[index].permissions.push(dataName);
          }
        })
      }
    })
    const formChangePermissions = document.querySelector("[form-change-permissions]");
    const input = formChangePermissions.querySelector("input[name='roles']");
    input.value = JSON.stringify(roles);
    formChangePermissions.submit();
  })
}
// end update permission

// Data Default
const divRecords = document.querySelector("[data-records]");
if (divRecords) {
  const records = JSON.parse(divRecords.getAttribute("data-records"));
  records.forEach((record, index) => {
    const permissions = record.permissions;

    permissions.forEach(premission => {
      const rows = tablePremission.querySelector(`tr[data-name='${premission}']`);
      const input = rows.querySelectorAll("input")[index];
      input.checked = true;
    })
  })
}
// End Data Default