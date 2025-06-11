const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const progress = document.getElementById('progress');
const counter = document.getElementById('counter');
const message = document.getElementById('message');

let todos = [];

function renderTodos() {
  list.innerHTML = '';
  let doneCount = 0;

  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    if (todo.done) li.classList.add('done');

    const span = document.createElement('span');
    span.textContent = todo.text;

    const actions = document.createElement('div');
    actions.classList.add('task-actions');

    const checkBtn = document.createElement('button');
    checkBtn.innerHTML = todo.done ? '✔' : '○';
    checkBtn.classList.add('check');
    checkBtn.onclick = () => {
      todos[index].done = !todos[index].done;
      renderTodos();
    };

    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✎';
    editBtn.classList.add('edit');
    editBtn.onclick = () => {
      const newText = prompt('Edit task:', todo.text);
      if (newText !== null && newText.trim() !== '') {
        todos[index].text = newText.trim();
        renderTodos();
      }
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑';
    deleteBtn.classList.add('delete');
    deleteBtn.onclick = () => {
      todos.splice(index, 1);
      renderTodos();
    };

    actions.append(checkBtn, editBtn, deleteBtn);
    li.append(span, actions);
    list.appendChild(li);

    if (todo.done) doneCount++;
  });

  // Update progress bar
  const percent = todos.length ? (doneCount / todos.length) * 100 : 0;
  progress.style.width = `${percent}%`;
  counter.textContent = `${doneCount} / ${todos.length}`;
  message.textContent = percent === 100 ? "Great Job!" : doneCount > 0 ? "Keep it Up!" : "Let's get started!";
}

addBtn.onclick = () => {
  const text = input.value.trim();
  if (text === '') return;
  todos.push({ text, done: false });
  input.value = '';
  renderTodos();
};

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

// Initial render
renderTodos();
