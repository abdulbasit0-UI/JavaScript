let taskItems = [];
localStorage.setItem("taskItemsRef", JSON.stringify(taskItems));
function renderTask(task) {
  const tasks = document.querySelector(".tasks");
  const taskItem = document.querySelector(`[data-key='${task.id}']`);
  let isCompleted = null;

  if (task.deleted) {
    taskItem.remove();
  }

  const node = document.createElement("div");

  node.setAttribute("class", `card-box card`);
  node.setAttribute("data-key", task.id);

  node.innerHTML = `
  <div class="card-body" >
  ${(isCompleted = task.completed
    ? '<span class="badge bg-success">Completed</span>'
    : "")}
    <h4>${task.title}</h4>
    <p>
        ${task.description}
    </p>
  </div>
    <div class="card-footer">
    <button class="delete-btn btn btn-danger">Delete</button>
    <button class="update-btn btn btn-success task-completed">
      Mark Completed
    </button>
    </div>
  `;

  if (taskItem) {
    tasks.replaceChild(node, taskItem);
  } else {
    tasks.append(node);
  }
}

if (taskItems.length < 0) {
  const taskEmpty = document.querySelector(".task-empty");

  taskEmpty.innerHTML`
      <div>
          <h1>Start Adding tasks Now</h1>
      </div>
      `;
}

function addTaskItem(title, description) {
  const task = {
    title: title,
    description: description,
    completed: false,
    id: Date.now(),
  };

  taskItems.push(task);
  renderTask(task);
}

const form = document.querySelector(".form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const heading = document.querySelector(".input-heading");
  const description = document.querySelector(".input-description");
  const error = document.querySelector(".error");
  const textHeading = heading.value.trim();
  const textdesc = description.value.trim();

  if (textHeading !== "" && textdesc !== "") {
    addTaskItem(textHeading, textdesc);
    heading.value = "";
    description.value = "";
  } else if (textHeading == "" && textdesc !== "") {
    error.innerHTML = `
    <div class="alert alert-danger" role="alert">
    The Heading field is required!
  </div>
    `;
  } else if (textHeading !== "" && textdesc == "") {
    error.innerHTML = `
    <div class="alert alert-danger" role="alert">
    The Description field is required!
  </div>
    `;
  } else if (textHeading == "" && textdesc == "") {
    error.innerHTML = `
    <div class="alert alert-danger" role="alert">
    The Heading and Description field is required!
  </div>
    `;
  }
});

function completeTask(key) {
  const index = taskItems.findIndex((item) => item.id === Number(key));
  taskItems[index].completed = !taskItems[index].completed;
  renderTask(taskItems[index]);
}

function deleteTask(key) {
  const index = taskItems.findIndex((item) => item.id === Number(key));
  const task = {
    deleted: true,
    ...taskItems[index],
  };
  taskItems.filter((item) => item.id !== Number(key));
  renderTask(task);
}

const tasks = document.querySelector(".tasks");

tasks.addEventListener("click", (event) => {
  if (event.target.classList.contains("update-btn")) {
    const taskKey = event.target.parentElement.parentElement.dataset.key;
    completeTask(taskKey);
  }

  if (event.target.classList.contains("delete-btn")) {
    const taskKey = event.target.parentElement.parentElement.dataset.key;
    deleteTask(taskKey);
  }
});

const le = document.querySelector(".tasks");
const sortable = new Sortable.create(le, {
  group: "shared", // set both lists to same group
  animation: 150,
  sort: false,
  multiDrag: true, // Enable multi-drag
  selectedClass: "selected", // The class applied to the selected items
  fallbackTolerance: 3, // So that we can select items on mobile
});

const completedTasks = document.querySelector(".completed-tasks");

completedTasks.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const taskKey = event.target.parentElement.parentElement.dataset.key;
    deleteTask(taskKey);
  }
});

const completedTasksList = new Sortable.create(completedTasks, {
  group: "shared", // set both lists to same group
  animation: 150,
  sort: false,
});

document.addEventListener("DOMContentLoaded", () => {
  const ref = localStorage.getItem("taskItemsRef");
  if (ref) {
    taskItems = JSON.parse(ref);
    taskItems.forEach((item) => {
      renderTask(item);
    });
  }
});
