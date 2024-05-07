const firebaseConfig = {
  apiKey: "AIzaSyCxP4z5MqELT80SdawLrw6sn84byS72bh0",
  authDomain: "task-management-2993c.firebaseapp.com",
  databaseURL: "https://task-management-2993c-default-rtdb.firebaseio.com",
  projectId: "task-management-2993c",
  storageBucket: "task-management-2993c.appspot.com",
  messagingSenderId: "1019215501513",
  appId: "1:1019215501513:web:c0458b7c3fb47831b1d518",
  measurementId: "G-8921N42TN4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Listening to load event on window
// Reading the number of tasks stored in the database
var totalItems;
var maxCode;
var code;
window.addEventListener("load", function () {
  console.log("Complete Window LOADED");
  firebase
    .database()
    .ref("TotalTasks")
    .on("value", function (snapshot) {
      totalItems = snapshot.val().totalItems;
      maxCode = snapshot.val().maxCode;
      console.log("The total Items are : " + totalItems);
      if (totalItems > 0 && document.getElementById("info") != null) {
        document.getElementById("info").remove();
      }
      if (totalItems === 0) {
        firebase.database().ref("TotalTasks").update({
          maxCode: 0,
        });
      }
    });
});

// Function to change the status of a task -> whether the task is pending or complete
// Features :-
// change the color from gray to green and vice versa for tick mark on the extreme right side
// change the color and disabled attribute for edit button
// show or hide the innerHTML of element with status id
function changeStatus(code) {
  var status;
  firebase
    .database()
    .ref("TaskList/" + code)
    .on("value", function (snapshot) {
      status = snapshot.val().status;
    });

  if (status === "pending") {
    firebase
      .database()
      .ref("TaskList/" + code)
      .update({
        status: "completed",
      });
    document.getElementById(code).querySelector("#done").style.color =
      "#00b200";
    document.getElementById(code).querySelector("#editbtn").disabled = true;
    document
      .getElementById(code)
      .querySelector("#editbtn").style.backgroundColor =
      "rgba(116, 116, 116, 0.671)";
    document.getElementById(code).querySelector("#status").innerHTML = `
            <i class="far fa-check-circle"></i> Completed
            `;
  } else {
    firebase
      .database()
      .ref("TaskList/" + code)
      .update({
        status: "pending",
      });
    document.getElementById(code).querySelector("#done").style.color = "gray";
    document.getElementById(code).querySelector("#editbtn").disabled = false;
    if (
      document.getElementById(code).querySelector("#editbtn").style
        .removeProperty
    ) {
      document
        .getElementById(code)
        .querySelector("#editbtn")
        .style.removeProperty("background-color");
    } else {
      document
        .getElementById(code)
        .querySelector("#editbtn")
        .style.removeAttribute("background-color");
    }
    document.getElementById(code).querySelector("#status").innerHTML = "";
  }
}

// function invoked by Edit button
// Features
// transfer data from the cards to the form
// scroll the page to where the from is visible
// remove the add task button
// add update task and cancel task buttons
function editData(c) {
  // Displaying data in form
  document.getElementById("task").value = document
    .getElementById(c)
    .querySelector(".data")
    .querySelector(".Task").innerHTML;
  document.getElementById("desc").value = document
    .getElementById(c)
    .querySelector(".data")
    .querySelector(".desc").innerHTML;
  document.getElementById("createTask").scrollIntoView();
  if (document.getElementById("addTask") !== null) {
    document.getElementById("addTask").remove();
  }
  document.getElementById("form-btns").innerHTML = `
    <button class="button update" id = "updateTask" onclick = "updateData('${c}')">󠀫󠀫<i class="fas fa-sync-alt"></i> UPDATE TASK</button>
    <button class="button cancel" id = "cancelTask" onclick = "cancelUpdation()"><i class="fas fa-ban"></i> CANCEL</button>
    `;
}

// Funtion invoked by update button
// Reads the data from the form -> updates it in the database -> clears the fields, deletes update and cancel btns and adds the add btn
// -> display the updated info in the tasks bar
function updateData(c) {
  var updatedTask = document.getElementById("task").value;
  var updatedDesc = document.getElementById("desc").value;
  firebase
    .database()
    .ref("TaskList/" + c)
    .update({
      task: updatedTask,
      desc: updatedDesc,
    });

  // Clearing fields and removing buttons update and cancel and replacing Add btn
  document.getElementById("task").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("updateTask").remove();
  document.getElementById("cancelTask").remove();
  document.getElementById("form-btns").innerHTML = `
    <button type="submit" class="button add" id = "addTask" >󠀫󠀫<i class="fas fa-plus"></i> ADD TASK</button>
    `;

  // Updating the task in the side bar
  document
    .getElementById(c)
    .querySelector(".data")
    .querySelector(".Task").innerHTML = updatedTask;
  document
    .getElementById(c)
    .querySelector(".data")
    .querySelector(".desc").innerHTML = updatedDesc;
}

// function invoked by cancel button
// removes the data from the fields -> removes update and cancel btns -> adds add btn
function cancelUpdation() {
  document.getElementById("task").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("updateTask").remove();
  document.getElementById("cancelTask").remove();
  document.getElementById("form-btns").innerHTML = `
    <button type="submit" class="button add" id = "addTask" >󠀫󠀫<i class="fas fa-plus"></i> ADD TASK</button>
    `;
}

// function invoked by delete btn
// removes the task from the database and taskbar -> updates the total number of tasks in the database
function deleteData(c) {
  firebase
    .database()
    .ref("TaskList/" + c)
    .remove();
  document.getElementById(c).remove();
  console.log(totalItems);
  firebase
    .database()
    .ref("TotalTasks")
    .update({
      totalItems: totalItems - 1,
    });
  console.log(totalItems);
}

// function invoked by add btn
// function to store the task entered by the user in the database
// read and clear the fields->store the task in DB with a unique code->update the total tasks in DB->
// show the task under taskbar in form of a card
function storeTask(event) {
  event.preventDefault();

  // Get data entered by the USER
  var task = document.getElementById("task").value;
  var desc = document.getElementById("desc").value;
  document.getElementById("task").value = "";
  document.getElementById("desc").value = "";
  console.log({ task, desc });

  code = totalItems;
  if (totalItems < maxCode) {
    code = maxCode + 1;
  }
  // Store data in firebase
  firebase
    .database()
    .ref("TaskList/" + code)
    .set({
      task: task,
      desc: desc,
      status: "pending",
    });

  // Update number of tasks in database
  firebase
    .database()
    .ref("TotalTasks")
    .update({
      totalItems: totalItems + 1,
      maxCode: maxCode + 1,
    });

  if (document.getElementById("info") !== null) {
    document.getElementById("info").remove();
  }

  // Show the data in the body in form of card
  document.getElementById("tasks-header").insertAdjacentHTML(
    "afterend",
    `<div class="Task-item" id="${code}">
    <div class="data" id="${task}">
        <button id="done" class="done" onclick = "changeStatus('${code}')"><i class="far fa-check-circle"></i></button>
        <h2 class="Task">${task}</h2>
        <p class="desc">${desc}</p>
        <small id = "status"></small>
    </div>
    <hr>
    <div class="buttons">
        <button class="button edit" id="editbtn" onclick = "editData('${code}')"><i class="fas fa-edit"></i> EDIT TASK</button>
        <button class="button delete" id="deletebtn" onclick = "deleteData('${code}')">
        <i class="fas fa-trash-alt"></i>DELETE TASK</button>
    </div>
    
    </div>`
  );
}

// Reading the data from the database
var data;
firebase
  .database()
  .ref("TaskList")
  .on("value", function (snapshot) {
    data = snapshot.val();
    console.log("This is data speaking from open");
    console.log(data);
  });

// function invoked by show all btn
// if no tasks available then display "No pending tasks"
// Remove any tasks if displayed inside the task bar
// read the data from the DB and display in form of cards
// adjust the color and disabled attribute of the buttons based on whether the task is completed or not
function showAll() {
  console.log("This is data speaking from within showAll()");
  console.log(data);
  if (data === null && document.getElementById("info") == null) {
    document.getElementById("tasks-header").insertAdjacentHTML(
      "afterend",
      `<div class="no-task-info" id = "info">
            <i class="fas fa-info-circle"></i>
            No pending tasks
        </div>`
    );
  }
  if (data === null && document.getElementById("info") !== null) {
    document.getElementById("info").remove();
    document.getElementById("tasks-header").insertAdjacentHTML(
      "afterend",
      `<div class="no-task-info" id = "info">
            <i class="fas fa-info-circle"></i>
            No pending tasks
        </div>`
    );
  }
  document.querySelectorAll(".Task-item").forEach((element) => {
    element.remove();
  });

  for (code in data) {
    var code = code;
    var task = data[code]["task"];
    var desc = data[code]["desc"];
    var status = data[code]["status"];

    var color;
    if (status === "pending") {
      color = "gray";
    } else {
      color = "#00b200";
    }

    // Show the data in the body in form of card
    document.getElementById("tasks-header").insertAdjacentHTML(
      "afterend",
      `<div class="Task-item" id="${code}">
        <div class="data" id="${task}">
            <button id="done" class="done" style="color : ${color}" onclick = "changeStatus('${code}')"><i class="far fa-check-circle"></i></button>
            <h2 class="Task">${task}</h2>
            <p class="desc">${desc}</p>
            <small id = "status"></small>
        </div>
        <hr>
        <div class="buttons">
            <button class="button edit" id="editbtn" onclick = "editData('${code}')"><i class="fas fa-edit"></i> EDIT TASK</button>
            <button class="button delete" id="deletebtn" onclick = "deleteData('${code}')"><i class="fas fa-trash-alt"></i> DELETE TASK</button>
        </div>
        
        </div>`
    );

    if (status === "pending") {
      document.getElementById(code).querySelector("#editbtn").disabled = false;
      if (
        document.getElementById(code).querySelector("#editbtn").style
          .removeProperty
      ) {
        document
          .getElementById(code)
          .querySelector("#editbtn")
          .style.removeProperty("background-color");
      } else {
        document
          .getElementById(code)
          .querySelector("#editbtn")
          .style.removeAttribute("background-color");
      }
      document.getElementById(code).querySelector("#status").innerHTML = "";
    } else {
      document.getElementById(code).querySelector("#editbtn").disabled = true;
      document
        .getElementById(code)
        .querySelector("#editbtn").style.backgroundColor =
        "rgba(116, 116, 116, 0.671)";
      document.getElementById(code).querySelector("#status").innerHTML = `
            <i class="far fa-check-circle"></i> Completed
            `;
    }
  }
}

// Function invoked by Delete all btn
// confirm if the user wants to delete all the tasks permanently or not
// If yes then clear the database and delete all the tasks from the page.
function deleteAll() {
  var option = false;
  if (totalItems === 0 && document.getElementById("info") === null) {
    document.getElementById("tasks-header").insertAdjacentHTML(
      "afterend",
      `<div class="no-task-info" id = "info">
            <i class="fas fa-info-circle"></i>
            No pending tasks
        </div>`
    );
  }
  if (totalItems !== 0) {
    option = confirm(
      "The tasks will be permanently deleted. Do you want to continue?"
    );
    if (option === true) {
      firebase.database().ref("TaskList").remove();
      document.querySelectorAll(".Task-item").forEach((element) => {
        element.remove();
      });
      firebase.database().ref("TotalTasks").update({
        totalItems: 0,
        maxCode: 0,
      });
      document.getElementById("tasks-header").insertAdjacentHTML(
        "afterend",
        `<div class="no-task-info" id = "info">
                <i class="fas fa-info-circle"></i>
                All items deleted
            </div>`
      );
    }
  }
}
