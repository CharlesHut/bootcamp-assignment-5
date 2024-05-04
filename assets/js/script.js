let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
  // if nextId does not exist in localStorage, set it to 1
  if (nextId === null) {
    nextId = 1;
    // otherwise, increment it by 1
  } else {
    nextId++;
  }
  // save nextId to localStorage
  localStorage.setItem('nextId', JSON.stringify(nextId));
  return nextId;
}

// Function to create a task card element
function createTaskCard(task) {
  const card = document.createElement("div");
  card.classList.add("task-card");
  card.classList.add("draggable");
  const taskId = generateTaskId();
  //card.dataset.taskId = taskId;
  card.setAttribute("data-task-id",taskId)
  const title = document.createElement("h3");
  title.textContent = task.title;

  const description = document.createElement("p");
  description.textContent = task.description;

  const dueDate = document.createElement("p");
  dueDate.textContent = "Due: " + task.dueDate;

  const completeButton = document.createElement("button");
  completeButton.textContent = "Complete";
  completeButton.addEventListener("click", () => {
    card.classList.add("completed");
  });

  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(dueDate);
  card.appendChild(completeButton);

  const taskListContainer = $("#todo-cards");
  taskListContainer.append(card);
  console.log(card);

  // Make the card draggable
  $(".draggable").draggable({
    opacity: 0.7,
    zIndex: 100,

    helper: function (e) {
      const original = $(e.target).hasClass("ui-draggable")
        ? $(e.target)
        : $(e.target).closest(".ui-draggable");

      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

// Function to render the task list
function renderTaskList() {
  const taskListContainer = $("#task-list");
  taskListContainer.empty();

  taskList.forEach((task) => {
    createTaskCard(task);
  
  });
}

// Function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const title = $("#task-title").val();
  const description = $("#task-description").val();
  const dueDate = $("#task-due-date").val();

  if (!title || !description || !dueDate) {
    alert("Please fill out all fields.");
    return;
  }

  const newTask = {
    id: nextId,
    title: title,
    description: description,
    dueDate: dueDate,
  };

  taskList.push(newTask);
  nextId++;

  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", nextId);

  renderTaskList();

  $("#task-title").val("");
  $("#task-description").val("");
  $("#task-due-date").val("");

  $("#addTaskModal").modal("hide");
}

$("#add-task-form").on("submit", handleAddTask);
// Function to handle deleting a task
function handleDeleteTask(taskId) {
  taskList = taskList.filter((task) => task.id !== taskId);

  localStorage.setItem("tasks", JSON.stringify(taskList));

  renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.attr("data-task-id");
  const newStatus = $(this).attr("data-status");

  const task = taskList.find((task) => task.id === taskId);
  if (task) {
    task.status = newStatus;

    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList();
  }
}
$("#add-task-form").on("submit", handleAddTask);
// Initialize the page on document ready
$(document).ready(function () {
  renderTaskList();

  // Initialize modal form submission
  $("#add-task-form").on("submit", handleAddTask);
  $("#myModal").modal({
    // Options
  });
  // Make swim lanes droppable
  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
  });

  // Initialize date picker for due date field
  $('#taskDueDate').datepicker({
    changeMonth: true,
    changeYear: true,
  });
});

