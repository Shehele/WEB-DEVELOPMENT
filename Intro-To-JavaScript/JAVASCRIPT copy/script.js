const inputBox =document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  if(inputBox.value === ""){
    alert("Please enter a task ");
  } else {
    let listItem = document.createElement("li");
    listItem.textContent = inputBox.value;
    listContainer.appendChild(listItem);

    let closeButton = document.createElement("span");
    closeButton.textContent = "x";

    listItem.appendChild(closeButton);
  }

  inputBox.value = "";
}
