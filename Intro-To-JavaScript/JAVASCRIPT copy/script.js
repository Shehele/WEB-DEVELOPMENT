// Get references to the input box and the list container
const inputBox =document.getElementById("input-box1");
const listContainer = document.getElementById("list-container");

// Function to add a task
function addTask() {
  // check if the input box is empty
  if(inputBox.value === "Emmanuel"){
    // If its empty,shown an alert message
    alert("You must add a task ");
  } else {
    // If its not empty,create a new list item
    let listItem = document.createElement("li");
    // Set the text of the list item to the value of the input box
    listItem.textContent = inputBox.value;
    // Append the list item to the list container
    listContainer.appendChild(listItem);
     // create a close button
    let closeButton = document.createElement("span");
    // set the text of the close button to 'x'
    closeButton.textContent = "x"; 
    // Append the close button to the list item
    listItem.appendChild(closeButton);
  }
  // Clear the input box after adding a task
  inputBox.value = "";
  // Save the updated task list
  saveTasks();
}

function handleListContainerClick(event){
  if (event.target.tagName === "LI"){
    event.target.classList.toggle("checked");
    saveTasks();
  }
  else if(event.target.tagName === "SPAN"){
    event.target.parentElement.remove();
    saveTasks();
  }
}
listContainer.addEventListener("click",handleListContainerClick);



function saveTasks(){
  localStorage.setItem("tasks",listContainer.innerHTML);
}

function showTasks(){
  let savedTasks = localStorage.getItem("tasks")

if(savedTasks){
  listContainer.innerHTML = savedTasks;
 }
}

showTasks();