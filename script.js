"use strict";

const Planner = {
  days: [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
  ],
  data: { tasks: {}, mottos: {}, streaks: [] },

  init() {
    this.menuBtn = document.getElementById("menuBtn");
    this.menu = document.getElementById("menu");
    this.content = document.getElementById("content");

    this.menuBtn.addEventListener("click", () =>
      this.menu.classList.toggle("open")
    );

    this.menu.addEventListener("click", (e) => {
      if (e.target.dataset.page) {
        this.showPage(e.target.dataset.page);
        this.menu.classList.remove("open");
      }
    });

    this.loadData();
    this.showToday();
  },

  loadData() {
    const saved = localStorage.getItem("plannerData");
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        // ignore corrupted data
      }
    }
  },

  saveData() {
    localStorage.setItem("plannerData", JSON.stringify(this.data));
  },

  showPage(page) {
    if (page === "days") return this.showDays();
    if (page === "motto") return this.showMotto();
    if (page === "streaks") return this.showStreaks();
    return this.showToday();
  },

  showToday() {
    const todayIndex = new Date().getDay();
    const day = this.days[(todayIndex + 6) % 7];
    this.showDayDetail(day);
  },

  showDays() {
    this.content.innerHTML = "";
    const wrapper = document.createElement("div");
    this.days.forEach((d) => {
      const tile = document.createElement("div");
      tile.className = "day-tile";
      tile.textContent = d;
      tile.addEventListener("click", () => this.showDayDetail(d));
      wrapper.appendChild(tile);
    });
    this.content.appendChild(wrapper);
  },

  showDayDetail(day) {
    this.content.innerHTML = "";
    const heading = document.createElement("h2");
    heading.textContent = day;
    this.content.appendChild(heading);

    const addWrapper = document.createElement("div");
    const input = document.createElement("input");
    input.placeholder = "Neue Aufgabe";
    const hourSelect = document.createElement("select");
    for (let h = 0; h < 24; h++) {
      const op = document.createElement("option");
      op.value = h;
      op.textContent = `${h}:00`;
      hourSelect.appendChild(op);
    }
    const addBtn = document.createElement("button");
    addBtn.textContent = "Hinzufügen";
    addBtn.addEventListener("click", () => {
      const hour = hourSelect.value;
      const text = input.value.trim();
      if (text) {
        if (!this.data.tasks[day]) this.data.tasks[day] = {};
        this.data.tasks[day][hour] = text;
        this.saveData();
        this.showDayDetail(day);
      }
    });
    addWrapper.appendChild(input);
    addWrapper.appendChild(hourSelect);
    addWrapper.appendChild(addBtn);
    this.content.appendChild(addWrapper);

    const table = document.createElement("table");
    table.className = "hour-table";
    for (let h = 0; h < 24; h++) {
      const row = document.createElement("tr");
      const th = document.createElement("th");
      th.textContent = `${h}:00`;
      const td = document.createElement("td");
      td.className = "tasks-col";
      const txt =
        this.data.tasks[day] && this.data.tasks[day][h]
          ? this.data.tasks[day][h]
          : "";
      td.textContent = txt;
      td.draggable = true;
      td.addEventListener("dragstart", (ev) => {
        ev.dataTransfer.setData("text/plain", td.textContent);
        td.textContent = "";
        if (this.data.tasks[day]) delete this.data.tasks[day][h];
      });
      td.addEventListener("dragover", (ev) => ev.preventDefault());
      td.addEventListener("drop", (ev) => {
        ev.preventDefault();
        const text = ev.dataTransfer.getData("text/plain");
        td.textContent = text;
        if (!this.data.tasks[day]) this.data.tasks[day] = {};
        this.data.tasks[day][h] = text;
        this.saveData();
      });
      row.appendChild(th);
      row.appendChild(td);
      table.appendChild(row);
    }
    this.content.appendChild(table);
  },

  showMotto() {
    this.content.innerHTML = "";
    this.days.forEach((d) => {
      const tile = document.createElement("div");
      tile.className = "day-tile";
      const label = document.createElement("label");
      label.textContent = d;
      const input = document.createElement("input");
      input.value = this.data.mottos[d] || "";
      input.placeholder = "Motto";
      input.addEventListener("change", () => {
        this.data.mottos[d] = input.value;
        this.saveData();
      });
      tile.appendChild(label);
      tile.appendChild(input);
      this.content.appendChild(tile);
    });
  },

  showStreaks() {
    this.content.innerHTML = "";
    const addInp = document.createElement("input");
    addInp.placeholder = "Aufgabe";
    const catInp = document.createElement("input");
    catInp.placeholder = "Kategorie";
    const tagInp = document.createElement("input");
    tagInp.placeholder = "Tag";
    const addBtn = document.createElement("button");
    addBtn.textContent = "Hinzufügen";
    addBtn.addEventListener("click", () => {
      if (addInp.value.trim()) {
        this.data.streaks.push({
          text: addInp.value,
          cat: catInp.value,
          tag: tagInp.value,
        });
        this.saveData();
        this.showStreaks();
      }
    });
    this.content.appendChild(addInp);
    this.content.appendChild(catInp);
    this.content.appendChild(tagInp);
    this.content.appendChild(addBtn);

    const grid = document.createElement("div");
    grid.className = "streak-grid";
    this.data.streaks.forEach((s) => {
      const card = document.createElement("div");
      card.className = "streak-card";
      card.innerHTML = `<strong>${s.text}</strong><br>${s.cat}<br>${s.tag}`;
      grid.appendChild(card);
    });
    this.content.appendChild(grid);
  },
};

document.addEventListener("DOMContentLoaded", () => Planner.init());
