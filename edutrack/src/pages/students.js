import { getStudents, addStudent } from '../api/studentApi.js';
import { renderStudents } from '../ui/render.js';

export function studentsPage(app) {
  app.innerHTML = `
    <div class="container">
      <div class="title">Students</div>

      <div class="row">
        <input id="name" placeholder="Name" />
        <input id="email" placeholder="Email" />
        <input id="age" type="number" placeholder="Age" />
        <button id="addBtn">Add</button>
      </div>

      <div id="status" style="margin-bottom:10px;color:#8b949e;"></div>

      <div id="list"></div>
    </div>
  `;

  const list = document.getElementById('list');
  const status = document.getElementById('status');
  const btn = document.getElementById('addBtn');

  // 🔄 Load students
  async function load() {
    status.textContent = "Loading students...";
    try {
      const data = await getStudents();
      renderStudents(list, data);
      status.textContent = "";
    } catch (err) {
      console.error(err);
      status.textContent = "Failed to load students";
    }
  }

  // ➕ Add student
  btn.onclick = async () => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const age = parseInt(document.getElementById('age').value);

    // ❌ Validation
    if (name.length < 3) {
      status.textContent = "Name must be at least 3 characters";
      return;
    }

    if (!email.includes("@")) {
      status.textContent = "Invalid email";
      return;
    }

    if (!age || age < 5 || age > 100) {
      status.textContent = "Invalid age";
      return;
    }

    // 🔥 Loading state
    btn.disabled = true;
    btn.textContent = "Adding...";
    status.textContent = "";

    try {
      await addStudent({ name, email, age });

      // clear inputs
      document.getElementById('name').value = "";
      document.getElementById('email').value = "";
      document.getElementById('age').value = "";

      await load();
    } catch (err) {
      console.error(err);
      status.textContent = "Failed to add student";
    }

    btn.disabled = false;
    btn.textContent = "Add";
  };

  load();
}