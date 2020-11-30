const storage = window.localStorage;

const todosList = document.querySelector('#todos');
const todoTitle = document.querySelector('#todoTitle');

let todos = [];

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
      const { id, title, createdAt, done } = todo;

      const div = document.createElement('div');
      div.id = id;
      if (done) div.classList.add('done');

      const p = document.createElement('p');
      p.id = `${id}-p`;
      p.textContent = title;

      const button = document.createElement('button');
      button.onclick = () => this.deleteTodo(id);
      button.textContent = '-';

      const button1 = document.createElement('button');
      button1.onclick = () => this.toggleTodoDone(id);
      button1.textContent = done ? 'v' : '^';

      const span = document.createElement('span');
      span.id = `${id}-span`;
      span.innerText = createdAt;

      div.appendChild(p);
      div.appendChild(button);
      div.appendChild(button1);
      div.appendChild(span);

      todosList.appendChild(div);
    }
  }

  getTodos() {
    const todoIds = JSON.parse(storage.getItem('todos'));
    if (!todoIds) return;

    this.todos = todoIds
      .map((id) => JSON.parse(storage.getItem(id)))
      .sort((t1, t2) =>
        t1.done && t2.done ? 0 : t1.done && !t2.done ? 1 : -1
      );
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

    storage.setItem(id, JSON.stringify(todoObj));
    this.saveTodos();

    this.updateUI();
  }

  deleteTodo(id) {
    console.log(id);
    this.todos = this.todos.filter((todo) => todo.id !== id);

    storage.removeItem(id);
    this.saveTodos();

    this.updateUI();
  }

  toggleTodoDone(id) {
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) todo.done = !todo.done;
      return todo;
    });

    this.saveTodos();
    this.updateUI();
  }

  saveTodos() {
    this.todos.forEach((todo) => {
      storage.setItem(todo.id, JSON.stringify(todo));
    });
    storage.setItem('todos', JSON.stringify(this.todos.map((todo) => todo.id)));
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
}

const todoApp = new TodoApp();
