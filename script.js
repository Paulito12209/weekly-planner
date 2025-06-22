const days = [
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
  'Sonntag'
];

const storageKey = 'weekTasks';
let tasks = {};

function loadTasks() {
  const data = localStorage.getItem(storageKey);
  if (data) {
    try {
      tasks = JSON.parse(data);
    } catch (e) {
      tasks = {};
    }
  }
}

function saveTasks() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function addTask(day, text) {
  if (!tasks[day]) {
    tasks[day] = [];
  }
  tasks[day].push(text);
  saveTasks();
}

function removeTask(day, index) {
  if (tasks[day]) {
    tasks[day].splice(index, 1);
    saveTasks();
  }
}

function renderPlanner() {
  const planner = document.getElementById('planner');
  planner.innerHTML = '';

  days.forEach(day => {
    const container = document.createElement('div');
    container.className = 'day';

    const header = document.createElement('h2');
    header.textContent = day;
    container.appendChild(header);

    const list = document.createElement('ul');
    (tasks[day] || []).forEach((taskText, idx) => {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.textContent = taskText;

      const btn = document.createElement('button');
      btn.textContent = '✕';
      btn.addEventListener('click', () => {
        removeTask(day, idx);
        renderPlanner();
      });

      li.appendChild(span);
      li.appendChild(btn);
      list.appendChild(li);
    });
    container.appendChild(list);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Neue Aufgabe';
    container.appendChild(input);

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Hinzufügen';
    addBtn.addEventListener('click', () => {
      if (input.value.trim() !== '') {
        addTask(day, input.value.trim());
        input.value = '';
        renderPlanner();
      }
    });
    container.appendChild(addBtn);

    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        addBtn.click();
      }
    });

    planner.appendChild(container);
  });
}

loadTasks();
renderPlanner();
