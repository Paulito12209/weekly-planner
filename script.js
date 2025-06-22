const days = [
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
  'Sonntag'
];

const storageKey = 'plannerData';
let data = {};

function initDay(day) {
  if (!data[day]) {
    const hours = {};
    for (let h = 1; h <= 24; h++) {
      hours[h] = '';
    }
    data[day] = { motto: '', tags: [], hours };
  }
}

function loadData() {
  const raw = localStorage.getItem(storageKey);
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch (e) {
      data = {};
    }
  }
  days.forEach(initDay);
}

function saveData() {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function createInput(value, placeholder, className, onInput) {
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = placeholder;
  if (className) input.className = className;
  input.value = value;
  input.addEventListener('input', onInput);
  return input;
}

function renderPlanner() {
  const planner = document.getElementById('planner');
  planner.innerHTML = '';

  days.forEach(day => {
    initDay(day);
    const col = document.createElement('div');
    col.className = 'day';

    const header = document.createElement('h2');
    header.textContent = day;
    col.appendChild(header);

    // Motto
    const mottoInput = createInput(
      data[day].motto,
      'Tagesmotto',
      'motto-input',
      () => {
        data[day].motto = mottoInput.value;
        saveData();
      }
    );
    col.appendChild(mottoInput);

    // Tags
    const tagContainer = document.createElement('div');
    tagContainer.className = 'tags';

    function renderTags() {
      tagContainer.innerHTML = '';
      data[day].tags.forEach((tag, idx) => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        const btn = document.createElement('button');
        btn.textContent = '✕';
        btn.addEventListener('click', () => {
          data[day].tags.splice(idx, 1);
          saveData();
          renderTags();
        });
        span.appendChild(btn);
        tagContainer.appendChild(span);
      });
    }
    renderTags();
    col.appendChild(tagContainer);

    const tagInput = createInput('', 'Tag hinzufügen', 'tag-input', () => {});
    tagInput.addEventListener('keypress', e => {
      if (e.key === 'Enter' && tagInput.value.trim() !== '') {
        data[day].tags.push(tagInput.value.trim());
        tagInput.value = '';
        saveData();
        renderTags();
      }
    });
    col.appendChild(tagInput);

    // Hours
    for (let h = 1; h <= 24; h++) {
      const hourRow = document.createElement('div');
      hourRow.className = 'hour';

      const label = document.createElement('label');
      label.textContent = h;
      hourRow.appendChild(label);

      const hourInput = createInput(
        data[day].hours[h] || '',
        '',
        '',
        () => {
          data[day].hours[h] = hourInput.value;
          saveData();
        }
      );
      hourRow.appendChild(hourInput);

      col.appendChild(hourRow);
    }

    planner.appendChild(col);
  });
}

loadData();
renderPlanner();
