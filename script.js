// To-Do List Management System
// Tasks are saved in the browser using Local Storage.

const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const errorMessage = document.getElementById("errorMessage");

let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
let currentFilter = "all";

// Show today's date.
document.getElementById("today").textContent = new Date().toLocaleDateString(
  "en-IN",
  { day: "numeric", month: "short", year: "numeric" }
);

// Save tasks to browser storage.
function saveTasks() {
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

// Add a new task.
function addTask() {
  const taskName = taskInput.value.trim();

  if (taskName === "") {
    errorMessage.textContent = "Please enter a task before adding.";
    taskInput.focus();
    return;
  }

  tasks.push({
    id: Date.now(),
    name: taskName,
    completed: false
  });

  taskInput.value = "";
  errorMessage.textContent = "";
  saveTasks();
  renderTasks();
  taskInput.focus();
}

// Mark a task as completed or pending.
function toggleTask(taskId) {
  tasks = tasks.map(function (task) {
    if (task.id === taskId) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

// Delete a task.
function deleteTask(taskId) {
  tasks = tasks.filter(function (task) {
    return task.id !== taskId;
  });

  saveTasks();
  renderTasks();
}

// Display tasks based on the selected filter.
function renderTasks() {
  taskList.innerHTML = "";

  const visibleTasks = tasks.filter(function (task) {
    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  visibleTasks.forEach(function (task) {
    const listItem = document.createElement("li");
    listItem.className = task.completed ? "task-item completed" : "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task as completed");
    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
    });

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.name;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      deleteTask(task.id);
    });

    listItem.append(checkbox, taskText, deleteButton);
    taskList.appendChild(listItem);
  });

  const completedTotal = tasks.filter(function (task) {
    return task.completed;
  }).length;
  const pendingTotal = tasks.length - completedTotal;

  document.getElementById("totalCount").textContent = tasks.length;
  document.getElementById("pendingCount").textContent = pendingTotal;
  document.getElementById("completedCount").textContent = completedTotal;

  emptyMessage.hidden = visibleTasks.length !== 0;
  taskList.hidden = visibleTasks.length === 0;
}

// Filter button actions.
document.querySelectorAll(".filter").forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;

    document.querySelectorAll(".filter").forEach(function (filterButton) {
      filterButton.classList.remove("active");
    });

    button.classList.add("active");
    renderTasks();
  });
});

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

renderTasks();
