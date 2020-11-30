const storage = window.localStorage;

const todosList = document.querySelector('#todos');
const todoTitle = document.querySelector('#todoTitle');

let todos = [];

const todoSorter = (t1, t2) =>
  t1.done && t2.done ? 0 : t1.done && !t2.done ? 1 : -1;

// const todoSorter = (t1, t2) => 1;

class TodoApp {
  todos = [];

  constructor() {
    this.getTodos();
    this.updateUI();

    todoTitle.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        this.addTodo();
      }
    });
  }

  updateUI() {
    todosList.innerHTML = '';

    for (const todo of this.todos) {
      this.addTodoToUI(todo);
    }
  }

  getTodos() {
    const todoIds = JSON.parse(storage.getItem('todos'));
    if (!todoIds) return;

    this.todos = todoIds.map((id) => JSON.parse(storage.getItem(id)));
    this.sortTodos();
  }

  addTodo() {
    const title = todoTitle.value;
    if (!title) return;

    todoTitle.value = '';

    const id = this.randomString();

    const todoObj = {
      title,
      id,
      done: false,
      createdAt: new Date(),
    };

    this.todos.push(todoObj);
    this.sortTodos();

    this.saveTodos();
    this.addTodoToUI(todoObj);
  }

  addTodoToUI(todo) {
    const { id, title, createdAt, done } = todo;

    const div = document.createElement('div');
    div.id = id;
    div.classList.add('todo');

    if (done) div.classList.add('done');

    const p = document.createElement('p');
    p.id = `${id}-p`;
    p.textContent = title;

    const actionsDiv = document.createElement('div');
    actionsDiv.id = 'actionsDiv';

    const deleteButton = document.createElement('span');
    deleteButton.classList.add('action');
    deleteButton.onclick = () => this.deleteTodo(id);
    deleteButton.innerHTML = '<i class="material-icons">delete</i>';

    const markDoneButton = document.createElement('span');
    markDoneButton.classList.add('action');
    markDoneButton.onclick = () => this.toggleTodoDone(id);
    markDoneButton.innerHTML = `
      <i class="material-icons" id="${id}-mdi">${
      done ? 'done' : 'horizontal_rule'
    }</i>
    `;

    actionsDiv.appendChild(deleteButton);
    actionsDiv.appendChild(markDoneButton);

    /* const span = document.createElement('span');
    span.id = `${id}-span`;
    span.innerText = this.formatDate(createdAt); */

    div.appendChild(p);
    div.appendChild(actionsDiv);
    // div.appendChild(span);

    todosList.appendChild(div);
  }

  removeTodoFromUI(id) {
    for (const child of todosList.children) {
      if (child.id === id) {
        todosList.removeChild(child);
      }
    }
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.sortTodos();

    storage.removeItem(id);
    this.saveTodos();

    this.removeTodoFromUI(id);
  }

  toggleTodoDone(id) {
    const currentTodo = this.todos.find((todo) => todo.id === id);
    if (!currentTodo) return;

    this.todos = this.todos.map((todo) => {
      if (todo.id === id) todo.done = !todo.done;
      return todo;
    });

    this.saveTodos();

    document.getElementById(`${id}-mdi`).innerHTML = `${
      currentTodo.done ? 'done' : 'horizontal_rule'
    }`;
    const classList = document.getElementById(`${id}`).classList;

    if (currentTodo.done) classList.add('done');
    else classList.remove('done');
  }

  saveTodos() {
    this.todos.forEach((todo) => {
      storage.setItem(todo.id, JSON.stringify(todo));
    });
    storage.setItem('todos', JSON.stringify(this.todos.map((todo) => todo.id)));
  }

  sortTodos() {
    this.todos = this.todos.sort(todoSorter);
  }

  clearTodos() {
    this.todos.forEach((todo) => {
      this.deleteTodo(todo.id);
    });
  }

  randomString(len = 32) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789-_'.split('');
    let str = '';

    for (let i of Array(len).keys()) {
      const idx = Math.floor(Math.random() * chars.length);
      const letter = chars[idx];
      str += Math.random() >= 0.5 ? letter : letter.toUpperCase();
    }

    return str;
  }

  formatDate(date) {
    date = new Date(date);

    const yr = date.getFullYear().toString().substring(2);
    const mth = date.getMonth() + 1;
    const day = date.getDate();

    const hr = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const sec = String(date.getSeconds()).padStart(2, '0');

    return `${hr}:${min}:${sec} ${day}/${mth}/${yr}`;
  }
}

function $(id) {
  return document.getElementById(id);
}

const todoApp = new TodoApp();
