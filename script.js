"use strict";

const Planner = {
  days: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
  data: { tasks: {}, mottos: {}, tags: {} },

  init() {
    this.board = document.getElementById("board");
    this.loadData();
    this.renderBoard();
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

  renderBoard() {
    this.board.innerHTML = "";
    this.days.forEach((day) => {
      const col = document.createElement("div");
      col.className = "day-column";

      const title = document.createElement("h2");
      title.textContent = day;
      col.appendChild(title);

      const mottoInput = document.createElement("input");
      mottoInput.className = "motto-input";
      mottoInput.placeholder = "Motto";
      mottoInput.value = this.data.mottos[day] || "";
      mottoInput.addEventListener("change", () => {
        this.data.mottos[day] = mottoInput.value;
        this.saveData();
      });
      col.appendChild(mottoInput);

      const tagContainer = document.createElement("div");
      tagContainer.className = "tag-container";
      const tagList = document.createElement("div");
      tagList.className = "tag-list";
      const updateTags = () => {
        tagList.innerHTML = "";
        (this.data.tags[day] || []).forEach((t, i) => {
          const span = document.createElement("span");
          span.className = "tag";
          span.textContent = t;
          span.addEventListener("click", () => {
            this.data.tags[day].splice(i, 1);
            updateTags();
            this.saveData();
          });
          tagList.appendChild(span);
        });
      };
      updateTags();

      const tagInput = document.createElement("input");
      tagInput.className = "tag-input";
      tagInput.placeholder = "Tag";
      const tagBtn = document.createElement("button");
      tagBtn.textContent = "+";
      tagBtn.className = "add-tag-btn";
      tagBtn.addEventListener("click", () => {
        const val = tagInput.value.trim();
        if (!val) return;
        if (!this.data.tags[day]) this.data.tags[day] = [];
        this.data.tags[day].push(val);
        tagInput.value = "";
        updateTags();
        this.saveData();
      });

      tagContainer.appendChild(tagList);
      tagContainer.appendChild(tagInput);
      tagContainer.appendChild(tagBtn);
      col.appendChild(tagContainer);

      const table = document.createElement("table");
      table.className = "hour-table";
      for (let h = 1; h <= 24; h++) {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.textContent = h;
        const td = document.createElement("td");
        const taskInput = document.createElement("input");
        taskInput.className = "task-input";
        taskInput.value =
          this.data.tasks[day] && this.data.tasks[day][h] ? this.data.tasks[day][h] : "";
        taskInput.addEventListener("change", () => {
          if (!this.data.tasks[day]) this.data.tasks[day] = {};
          this.data.tasks[day][h] = taskInput.value;
          this.saveData();
        });
        td.appendChild(taskInput);
        tr.appendChild(th);
        tr.appendChild(td);
        table.appendChild(tr);
      }
      col.appendChild(table);

      this.board.appendChild(col);
    });
  },
};

document.addEventListener("DOMContentLoaded", () => Planner.init());
