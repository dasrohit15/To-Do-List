const addTaskBtn = document.getElementById("addTaskBtn");
const taskModal = document.getElementById("taskModal");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const cancelBtn = document.getElementById("cancelBtn");
const taskList = document.getElementById("taskList");
const modalTitle = document.getElementById("modalTitle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editIndex = null;

// Open Modal
addTaskBtn.addEventListener("click", () => {
  taskModal.style.display = "flex";
  modalTitle.textContent = "Add New Task";
  editIndex = null;
  clearModalFields();
});

// Close Modal
cancelBtn.addEventListener("click", () => {
  taskModal.style.display = "none";
});

// Save Task
saveTaskBtn.addEventListener("click", () => {
  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const priority = document.getElementById("taskPriority").value;
  const date = document.getElementById("taskDate").value;

  if (!title) {
    alert("Please enter a task title");
    return;
  }

  const taskData = {
    title,
    description,
    priority,
    date,
    completed: false,
  };

  if (editIndex !== null) {
    tasks[editIndex] = taskData;
  } else {
    tasks.push(taskData);
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  taskModal.style.display = "none";
});

// Render Tasks
function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (filter === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (filter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-card";

    li.innerHTML = `
      <div class="task-header">
        <h3>${task.title}</h3>
        <div class="actions">
          <button onclick="editTask(${index})">✏️</button>
          <button onclick="deleteTask(${index})">🗑️</button>
          <input type="checkbox" ${
            task.completed ? "checked" : ""
          } onclick="toggleComplete(${index})">
        </div>
      </div>
      <p class="task-description">${task.description}</p>
      <div>
        <span class="priority ${task.priority}">${task.priority}</span>
        <span>📅 ${task.date || "No Date"}</span>
      </div>
    `;

    taskList.appendChild(li);
  });

  document.getElementById("allCount").textContent = tasks.length;
  document.getElementById("activeCount").textContent = tasks.filter(
    (t) => !t.completed
  ).length;
  document.getElementById("completedCount").textContent = tasks.filter(
    (t) => t.completed
  ).length;
}

// Edit Task
window.editTask = (index) => {
  editIndex = index;
  const task = tasks[index];
  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskDescription").value = task.description;
  document.getElementById("taskPriority").value = task.priority;
  document.getElementById("taskDate").value = task.date;
  modalTitle.textContent = "Edit Task";
  taskModal.style.display = "flex";
};

// Delete Task
window.deleteTask = (index) => {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
};

// Toggle Complete
window.toggleComplete = (index) => {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
};

// Tab Filtering
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    renderTasks(tab.dataset.filter);
  });
});

function clearModalFields() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskPriority").value = "medium";
  document.getElementById("taskDate").value = "";
}

// Initial Render
renderTasks();
