import { getCourses, addCourse } from '../api/courseApi.js';
import { renderCourses } from '../ui/renderCourses.js';

export function coursesPage(app) {
  app.innerHTML = `
    <div class="container">
      <div class="title">Courses</div>

      <div class="row">
        <input id="title" placeholder="Course Title" />
        <input id="duration" placeholder="Duration (e.g. 3 months)" />
        <button id="addBtn">Add</button>
      </div>

      <div id="status"></div>

      <div id="list"></div>
    </div>
  `;

  const list = document.getElementById('list');
  const status = document.getElementById('status');
  const btn = document.getElementById('addBtn');

  async function load() {
    status.textContent = "Loading courses...";
    try {
      const data = await getCourses();
      renderCourses(list, data);
      status.textContent = "";
    } catch (err) {
      status.textContent = "Failed to load courses";
    }
  }

  btn.onclick = async () => {
    const title = document.getElementById('title').value.trim();
    const duration = document.getElementById('duration').value.trim();

    if (!title || !duration) {
      status.textContent = "Fill all fields";
      return;
    }

    btn.disabled = true;
    btn.textContent = "Adding...";

    await addCourse({ title, duration });

    document.getElementById('title').value = "";
    document.getElementById('duration').value = "";

    await load();

    btn.disabled = false;
    btn.textContent = "Add";
  };

  load();
}