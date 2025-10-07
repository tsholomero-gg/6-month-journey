// Simple To-Do list with add, toggle complete, delete, clear and persistence (localStorage)

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyMsg = document.getElementById('empty');
const clearSelectedBtn = document.getElementById('clear-selected');
const clearAllBtn = document.getElementById('clear-all');

const STORAGE_KEY = 'todos_v1';
let todos = []; // each todo: { id: string, text: string, completed: boolean }

// --- Initialization: load from localStorage and render ---
loadTodos();
renderTodos();

// --- Form submit: add new todo ---
form.addEventListener('submit', (e) =>{
    e.preventDefault();
    const text = input.value.trim();
    if(!text) return; //ignore empty input
    addTodo(text);
    input.value = '';
    input.focus();
});

// --- Add todo to array and re-render & save ---
function addTodo(text) {
    const todo = {
        id: Date.now().toString(), text, completed: false
    };
    todos.push(todo);
    console.log(todo);
    saveAndRender();
}

// --- Render function: build list items from todos array ---
function renderTodos() {
    list.innerHTML = "" // clear current list
    
    if(todos.length === 0) {
        emptyMsg.style.display = 'block';
    }else{
        emptyMsg.style.display = 'none';
    }

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (todo.completed ? ' completed' : '');
        li.dataset.id = todo.id;

        // left side: checkbox + text
        const left = document.createElement('div');
        left.className = 'left';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;

        const span = document.createElement('span');
        span.className = 'text';
        // assign text safely to avoid XSS
        span.textContent = todo.text;

        const dateSpan = document.createElement("span");
        const readableDate = new Date(parseInt(todo.id)).toLocaleString();
        dateSpan.textContent = " (" + readableDate + ")";
        dateSpan.style.color = "gray";
        dateSpan.style.fontSize = "12px";
        dateSpan.style.marginLeft = "10px";

        left.appendChild(checkbox);
        left.appendChild(span);

        // delete button
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.setAttribute('aria-label', 'Delete task');
        delBtn.textContent = '×';

        // compose li
        li.appendChild(left);
        li.appendChild(dateSpan);
        li.appendChild(delBtn);
        list.appendChild(li);
    });
}

// --- Event delegation: checkbox change (toggle completed) ---
list.addEventListener('change', (e) => {
  if (e.target.matches('input[type="checkbox"]')) {
    const li = e.target.closest('li');
    const id = li.dataset.id;
    const checked = e.target.checked;
    toggleTodoCompleted(id, checked);
  }
});

// --- Event delegation: delete button click ---
list.addEventListener('click', (e) => {
  if (e.target.matches('.delete-btn')) {
    const id = e.target.closest('li').dataset.id;
    deleteTodo(id);
  }
});

// --- Toggle completed flag for todo ---
function toggleTodoCompleted(id, completed) {
  const idx = todos.findIndex(t => t.id === id);
  if (idx > -1) {
    todos[idx].completed = !!completed;
    saveAndRender();
  }
}

// --- Delete a todo by id ---
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveAndRender();
}

// --- Clear completed tasks ---
clearSelectedBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.completed);
  saveAndRender();
});

// --- Clear all tasks (confirm) ---
clearAllBtn.addEventListener('click', () => {
  if (todos.length === 0) return;
  if (confirm('Clear all tasks?')) {
    todos = [];
    saveAndRender();
  }
});

// --- Persistence helpers ---
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  const raw = localStorage.getItem(STORAGE_KEY);
  todos = raw ? JSON.parse(raw) : [];
}

// --- convenience: save & render ---
function saveAndRender() {
  saveTodos();
  renderTodos();
}