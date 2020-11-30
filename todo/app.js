// Võtame window.localStorage muutuja storage alla, et oleks mugavam kasutada.
const storage = window.localStorage;

/**
 * Võtame HTML DOM-ist todo-de nimekirja ning tekstivälja objektid.
 * DOM ehk Document Object Model
 */
const todosList = document.querySelector('#todos');
const todoTitle = document.querySelector('#todoTitle');

const addTodoButton = document.querySelector('#addTodoButton');
const clearTodosButton = document.querySelector('#clearTodosButton');

/**
 * Todode sortimise predikaat
 * Hetkel on sorteerimine vaid lehe laadimisel, muidu
 * igal uuendusel tuleks ka DOM-i uuendada ja see ei näe animatsioonidega hea välja.
 * Hetkel sorteerime lihtsalt nii, et tehtud todod oleksid teistest all
 */
const todoSorter = (t1, t2) =>
  t1.done && t2.done ? 0 : t1.done && !t2.done ? -1 : 1;

class TodoApp {
  todos = [];

  constructor() {
    // Toome salvestatud todod ja paneme kasutajaliidesele
    this.getTodos();
    this.initUI();

    // Lisame tekstiväljale 'keydown' üritusekuulaja, et enter-nupu vajutamisel saaks automaatselt todo lisada.
    todoTitle.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        // Enter === 13
        e.preventDefault();
        this.addTodo();
      }
    });

    // Lisame nuppudele vajutamisel jooksutatavad funktsioonid kuna kodu.ut.ee ei lae javascripti õigesti ning HTML-ist ei saa näiteks pomodoro.addTodo() kutsuda.
    addTodoButton.addEventListener('click', this.addTodo.bind(this));
    clearTodosButton.addEventListener('click', this.clearTodos.bind(this));
  }

  initUI() {
    // Kasutajaliidese esialgne ülesehitus
    todosList.innerHTML = '';

    // Lisame kõik todod DOM-i
    this.todos.forEach((todo) => this.addTodoToUI(todo));
  }

  getTodos() {
    /**
     * Mälust kõikide todode toomine.
     * Algselt toome kõik todode IDd, et need hiljem ükshaaval üles leida.
     * Kui millegi tõttu see puudub, siis edasi ei lähe.
     */
    const todoIds = JSON.parse(storage.getItem('todos'));
    if (!todoIds) return;

    // Paneme iga ID vastavusse sellele vastava todo objektiga ja sorteerime need
    this.todos = todoIds.map((id) => JSON.parse(storage.getItem(id)));
    this.sortTodos();
  }

  addTodo() {
    // Võtame tekstiväljast todo pealkirja; kui see puudub, edasi ei lähe.
    const title = todoTitle.value;
    if (!title) return;

    todoTitle.value = ''; // Tühjendame tekstivälja

    /**
     * Genereerime juhusliku sõne todo IDks,
     * et todosid saaks indekseerida ja salvestada.
     * On väga väike võimalus, et kaks IDd kattuvad,
     * kuid siis kirjutatakse vana todo lihtsalt üle ning programm kokku ei jookse.
     */
    const id = this.randomString();

    // Koostame todo objekti
    const todoObj = {
      title,
      id,
      done: false,
      createdAt: new Date(),
    };

    // Lisame todo kõikide todode järjendisse
    this.todos.push(todoObj);

    // Salvestame todod ning lisame uue todo kasutajaliidesesse
    this.saveTodos();
    this.addTodoToUI(todoObj);
  }

  addTodoToUI(todo) {
    // Destruktureerime todo objekti
    const { id, title, done } = todo;

    // Loome todo jaoks div-i
    const todoDiv = document.createElement('div');
    todoDiv.id = id;
    todoDiv.classList.add('todo');

    // Kui todo on tehtud, anname div-le klassi done
    if (done) todoDiv.classList.add('done');

    // Todo sisu tekst
    const p = document.createElement('p');
    p.id = `${id}-p`;
    p.textContent = title;

    // Siia div-i lähevad kustutamise ja tehtuks märkimise nupud
    const actionsDiv = document.createElement('div');
    actionsDiv.id = 'actionsDiv';

    // Kustutamise nupp, mille vajutamisel kustutatakse ID järgi etteantud todo
    const deleteButton = document.createElement('span');
    deleteButton.classList.add('action');
    deleteButton.onclick = () => this.deleteTodo(id);
    deleteButton.innerHTML = '<i class="material-icons">delete</i>';

    // Tehtuks märkimise nupp, mille vajutamisel ID järgi märgitakse todo tehtuks
    const markDoneButton = document.createElement('span');
    markDoneButton.classList.add('action');
    markDoneButton.onclick = () => this.toggleTodoDone(id);
    markDoneButton.innerHTML = `
      <i class="material-icons" id="${id}-mdi">${
      done ? 'done' : 'horizontal_rule'
    }</i>
    `;

    // Lisame nupud nuppude div-i
    actionsDiv.appendChild(deleteButton);
    actionsDiv.appendChild(markDoneButton);

    // Lisame nuppude div-i todo div-i
    todoDiv.appendChild(p);
    todoDiv.appendChild(actionsDiv);

    // Lisame todo kõige üles
    todosList.prepend(todoDiv);
  }

  removeTodoFromUI(id) {
    // Otsime todo DOM-i todo nimekirjast üles todo etteantud ID-ga ja eemaldame selle kasutajaliideselt
    for (const child of todosList.children)
      if (child.id === id) todosList.removeChild(child);
  }

  deleteTodo(id) {
    // Eemdaldame todo kõikideset tododest ning eemdaldame ka selle salvestatud objekti
    this.todos = this.todos.filter((todo) => todo.id !== id);
    storage.removeItem(id);

    // Salvestame ülejäänud todod ning eemaldame selle todo kasutajaliideselt
    this.saveTodos();
    this.removeTodoFromUI(id);
  }

  toggleTodoDone(id) {
    // Uuendame ainult etteantud IDga todod ning salvestame kõik
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) todo.done = !todo.done;
      return todo;
    });

    this.saveTodos();

    // Võtame hetkel muudetud todo
    const currentTodo = this.todos.find((todo) => todo.id === id);

    const doneIcon = $(`${id}-mdi`);
    const todoDiv = $(`${id}`);

    // Uuendame vastavalt ikooni ning tehtuks märgitust div-l
    doneIcon.innerHTML = `${currentTodo.done ? 'done' : 'horizontal_rule'}`;
    if (currentTodo.done) todoDiv.classList.add('done');
    else todoDiv.classList.remove('done');
  }

  saveTodos() {
    // Salvestame iga todo eraldi kirje (ID suhtes) alla ning hiljem kõikide todode IDd ühe kirje alla
    this.todos.forEach((todo) =>
      storage.setItem(todo.id, JSON.stringify(todo))
    );
    storage.setItem('todos', JSON.stringify(this.todos.map((todo) => todo.id)));
  }

  sortTodos() {
    // Sorteerime todod predikaadi alusel
    this.todos = this.todos.sort(todoSorter);
  }

  clearTodos() {
    // Tühjendame (kustutame) kõik todod
    this.todos.forEach((todo) => this.deleteTodo(todo.id));
  }

  randomString(len = 32) {
    // Teeme lubatud karakteritest järjendi
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789-_'.split('');
    let str = '';

    // Genereerime len arvu erinevaid karaktereid
    for (let _ of Array(len).keys()) {
      // Võtame juhusliku numbri [1, chars.length];
      const idx = Math.floor(Math.random() * chars.length);
      const letter = chars[idx]; // Suvaline karakter
      // ~50% tõenäosus, et teeme tähe suureks (ID varieeruvuse jaoks)
      str += Math.random() >= 0.5 ? letter : letter.toUpperCase();
    }

    return str;
  }
}

function $(id) {
  // Abifunktsioon elementide otsimiseks
  return document.getElementById(id);
}

// Loome uue TodoApp-i, et loogikat kasutada
const todoApp = new TodoApp();
