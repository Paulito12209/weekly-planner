const days = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
let data = {
  tasks: {},    // tasks[day][hour]
  mottos: {},   // mottos[day]
  streaks: []   // {text,cat,tag}
};

function loadData() {
  const saved = localStorage.getItem('plannerData');
  if (saved) {
    try { data = JSON.parse(saved); } catch(e) {}
  }
}

function saveData() {
  localStorage.setItem('plannerData', JSON.stringify(data));
}

const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const content = document.getElementById('content');

menuBtn.addEventListener('click', () => {
  menu.classList.toggle('open');
});

menu.addEventListener('click', e => {
  if (e.target.dataset.page) {
    showPage(e.target.dataset.page);
    menu.classList.remove('open');
  }
});

function showPage(page) {
  if (page === 'days') return showDays();
  if (page === 'motto') return showMotto();
  if (page === 'streaks') return showStreaks();
  return showToday();
}

function showToday() {
  const todayIndex = new Date().getDay(); // 0=Sunday
  const day = days[(todayIndex + 6) % 7];
  showDayDetail(day);
}

function showDays() {
  content.innerHTML = '';
  const wrapper = document.createElement('div');
  days.forEach(d => {
    const tile = document.createElement('div');
    tile.className = 'day-tile';
    tile.textContent = d;
    tile.addEventListener('click', () => showDayDetail(d));
    wrapper.appendChild(tile);
  });
  content.appendChild(wrapper);
}

function showDayDetail(day) {
  content.innerHTML = '';
  const heading = document.createElement('h2');
  heading.textContent = day;
  content.appendChild(heading);

  const addWrapper = document.createElement('div');
  const input = document.createElement('input');
  input.placeholder = 'Neue Aufgabe';
  const hourSelect = document.createElement('select');
  for (let h=0; h<24; h++) {
    const op = document.createElement('option');
    op.value = h;
    op.textContent = h + ':00';
    hourSelect.appendChild(op);
  }
  const addBtn = document.createElement('button');
  addBtn.textContent = 'Hinzufügen';
  addBtn.addEventListener('click', () => {
    const hour = hourSelect.value;
    const text = input.value.trim();
    if (text) {
      if (!data.tasks[day]) data.tasks[day] = {};
      data.tasks[day][hour] = text;
      saveData();
      showDayDetail(day);
    }
  });
  addWrapper.appendChild(input);
  addWrapper.appendChild(hourSelect);
  addWrapper.appendChild(addBtn);
  content.appendChild(addWrapper);

  const table = document.createElement('table');
  table.className = 'hour-table';
  for (let h=0; h<24; h++) {
    const row = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = h + ':00';
    const td = document.createElement('td');
    td.className = 'tasks-col';
    const txt = data.tasks[day] && data.tasks[day][h] ? data.tasks[day][h] : '';
    td.textContent = txt;
    td.draggable = true;
    td.addEventListener('dragstart', ev => {
      ev.dataTransfer.setData('text/plain', td.textContent);
      td.textContent = '';
      if (data.tasks[day]) delete data.tasks[day][h];
    });
    td.addEventListener('dragover', ev => ev.preventDefault());
    td.addEventListener('drop', ev => {
      ev.preventDefault();
      const text = ev.dataTransfer.getData('text/plain');
      td.textContent = text;
      if (!data.tasks[day]) data.tasks[day] = {};
      data.tasks[day][h] = text;
      saveData();
    });
    row.appendChild(th); row.appendChild(td); table.appendChild(row);
  }
  content.appendChild(table);
}

function showMotto() {
  content.innerHTML = '';
  days.forEach(d => {
    const tile = document.createElement('div');
    tile.className = 'day-tile';
    const label = document.createElement('label');
    label.textContent = d;
    const input = document.createElement('input');
    input.value = data.mottos[d] || '';
    input.placeholder = 'Motto';
    input.addEventListener('change', () => {
      data.mottos[d] = input.value;
      saveData();
    });
    tile.appendChild(label);
    tile.appendChild(input);
    content.appendChild(tile);
  });
}

function showStreaks() {
  content.innerHTML = '';
  const addInp = document.createElement('input');
  addInp.placeholder = 'Aufgabe';
  const catInp = document.createElement('input');
  catInp.placeholder = 'Kategorie';
  const tagInp = document.createElement('input');
  tagInp.placeholder = 'Tag';
  const addBtn = document.createElement('button');
  addBtn.textContent = 'Hinzufügen';
  addBtn.addEventListener('click', () => {
    if (addInp.value.trim()) {
      data.streaks.push({text:addInp.value,cat:catInp.value,tag:tagInp.value});
      saveData();
      showStreaks();
    }
  });
  content.appendChild(addInp);
  content.appendChild(catInp);
  content.appendChild(tagInp);
  content.appendChild(addBtn);

  const grid = document.createElement('div');
  grid.className = 'streak-grid';
  data.streaks.forEach(s => {
    const card = document.createElement('div');
    card.className = 'streak-card';
    card.innerHTML = `<strong>${s.text}</strong><br>${s.cat}<br>${s.tag}`;
    grid.appendChild(card);
  });
  content.appendChild(grid);
}

loadData();
showToday();
