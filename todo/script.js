let todoItems = [];

localStorage.setItem("todoItemsRef", JSON.stringify(todoItems));

function renderToDoList(todo) {
  const list = document.querySelector(".js-todo-list");
  const item = document.querySelector(`[data-key='${todo.id}']`);

  if (todo.deleted) {
    item.remove();
    if (todoItems.length === 0) list.innerHTML = "";
    return;
  }

  const isChecked = todo.completed ? "done" : "";
  const node = document.createElement("li");
  node.setAttribute("class", `todo-item ${isChecked}`);
  node.setAttribute("data-key", todo.id);
  node.innerHTML = `
  <input id="${todo.id}" type="checkbox">
  <label for="${todo.id}" class="tick js-tick"></label>
  <span>${todo.text}</span>
    <button type="button" class="delete-todo js-delete-todo">
        Delete
    </button>
  `;

  if (item) {
    list.replaceChild(node, item);
  } else {
    list.append(node);
  }
}

function addToDoItem(text) {
  const todo = {
    text: text,
    completed: false,
    id: Date.now(),
  };

  todoItems.push(todo);
  renderToDoList(todo);
}

function toggleDone(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));

  todoItems[index].completed = !todoItems[index].completed;
  renderToDoList(todoItems[index]);
}

function deleteTodo(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));
  const todo = {
    deleted: true,
    ...todoItems[index],
  };
  todoItems = todoItems.filter((item) => item.id !== Number(key));
  renderToDoList(todo);
}

// select the form elements
const form = document.querySelector(".form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector(".todo-input");
  const text = input.value.trim();
  if (text !== "") {
    addToDoItem(text);
    input.value = "";
    input.focus();
  }
});

const list = document.querySelector(".js-todo-list");
list.addEventListener("click", (event) => {
  if (event.target.classList.contains("js-tick")) {
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey);
  }

  if (event.target.classList.contains("js-delete-todo")) {
    const itemKey = event.target.parentElement.dataset.key;
    deleteTodo(itemKey);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const ref = localStorage.getItem("todoItemsRef");
  if (ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach((t) => {
      renderToDoList(t);
    });
  }
});
