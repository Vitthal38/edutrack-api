(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://edutrack-api.onrender.com`,t=`edutrack_token`,n=`edutrack_user`,r={getToken(){return localStorage.getItem(t)},getUser(){let e=localStorage.getItem(n);try{return e?JSON.parse(e):null}catch{return null}},isAuthenticated(){return!!this.getToken()},isAdmin(){return this.getUser()?.role===`Admin`},login(e,r){localStorage.setItem(t,e),localStorage.setItem(n,JSON.stringify(r))},logout(){localStorage.removeItem(t),localStorage.removeItem(n)}},i=class extends Error{constructor(e,{status:t,data:n}={}){super(e),this.name=`ApiError`,this.status=t,this.data=n}};async function a(t,{method:n=`GET`,body:a,headers:o={}}={}){let s=r.getToken(),c=s?{Authorization:`Bearer ${s}`}:{},l=await fetch(`${e}${t}`,{method:n,headers:{"Content-Type":`application/json`,...c,...o},body:a?JSON.stringify(a):void 0});if(l.status===401&&!t.startsWith(`/api/auth/`))throw r.logout(),window.location.href=`/login`,new i(`Session expired`,{status:401});let u=l.headers.get(`content-type`)?.includes(`application/json`)?await l.json().catch(()=>null):await l.text();if(!l.ok)throw new i(u&&u.message||`Request failed: ${l.status}`,{status:l.status,data:u});return u}var o={get:e=>a(e),post:(e,t)=>a(e,{method:`POST`,body:t}),put:(e,t)=>a(e,{method:`PUT`,body:t}),del:e=>a(e,{method:`DELETE`})},s={list:()=>o.get(`/api/students`),create:e=>o.post(`/api/students`,e),remove:e=>o.del(`/api/students/${e}`)},c={list:()=>o.get(`/api/courses`),create:e=>o.post(`/api/courses`,e),remove:e=>o.del(`/api/courses/${e}`)},l={list:()=>o.get(`/api/enrollments`),create:e=>o.post(`/api/enrollments`,e),remove:e=>o.del(`/api/enrollments/${e}`)};function u(e,{students:t,courses:n,enrollments:r}){e.innerHTML=`
    <section class="page dashboard">
      <h1>Dashboard</h1>

      <div class="stats-grid">
        ${p(`Students`,t.length,`/students`)}
        ${p(`Courses`,n.length,`/courses`)}
        ${p(`Enrollments`,r.length,`/enrollments`)}
      </div>

      <div class="dashboard-columns">
        <div class="dashboard-col">
          <h2>Recent students</h2>
          ${m(t.slice(-5).reverse(),e=>e.name)}
        </div>
        <div class="dashboard-col">
          <h2>Recent courses</h2>
          ${m(n.slice(-5).reverse(),e=>`${e.name} (${e.enrolledCount}/${e.seats})`)}
        </div>
      </div>
    </section>
  `}function d(e){e.innerHTML=`
    <section class="page dashboard">
      <h1>Dashboard</h1>
      <div class="stats-grid">
        <div class="stat-card skeleton"></div>
        <div class="stat-card skeleton"></div>
        <div class="stat-card skeleton"></div>
      </div>
    </section>
  `}function f(e,t){e.innerHTML=`
    <section class="page dashboard">
      <h1>Dashboard</h1>
      <p class="error">Failed to load dashboard: ${h(t)}</p>
      <button id="retry-dashboard">Retry</button>
    </section>
  `}function p(e,t,n){return`
    <a class="stat-card" href="${n}" data-link>
      <span class="stat-label">${e}</span>
      <span class="stat-value">${t}</span>
    </a>
  `}function m(e,t){return e.length?`<ul class="recent-list">${e.map(e=>`<li>${h(t(e))}</li>`).join(``)}</ul>`:`<p class="empty">Nothing yet.</p>`}function h(e=``){return String(e).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}async function g(e){d(e);try{let[t,n,r]=await Promise.all([s.list(),c.list(),l.list()]);u(e,{students:t,courses:n,enrollments:r})}catch(t){f(e,t.message),e.querySelector(`#retry-dashboard`)?.addEventListener(`click`,()=>g(e))}}var _;function v(){return _||(_=document.createElement(`div`),_.className=`toast-container`,document.body.appendChild(_),_)}function y(e,t=`info`,n=3e3){let r=v(),i=document.createElement(`div`);i.className=`toast toast-${t}`,i.textContent=e,r.appendChild(i),requestAnimationFrame(()=>i.classList.add(`toast-visible`)),setTimeout(()=>{i.classList.remove(`toast-visible`),i.addEventListener(`transitionend`,()=>i.remove(),{once:!0}),setTimeout(()=>i.remove(),500)},n)}var b={success:e=>y(e,`success`),error:e=>y(e,`error`,5e3),info:e=>y(e,`info`)};function x(e,t=`Loading…`){e.innerHTML=`
    <div class="loading">
      <div class="spinner" aria-hidden="true"></div>
      <p>${t}</p>
    </div>
  `}function S(e,t,n){e.innerHTML=`
    <div class="error-state">
      <p class="error">${t}</p>
      ${n?`<button id="retry-btn">Retry</button>`:``}
    </div>
  `,n&&e.querySelector(`#retry-btn`)?.addEventListener(`click`,n)}function C(e,t){e.innerHTML=`
    <section class="page">
      <h1>Students</h1>

      <form id="student-form" class="student-form">
        <input name="name"  placeholder="Full name" required />
        <input name="email" placeholder="Email" type="email" required />
        <input name="age"   placeholder="Age" type="number" min="1" max="120" />
        <input name="course" placeholder="Course (optional)" />
        <button type="submit">Add student</button>
        <p class="form-error" hidden></p>
      </form>

      <div id="student-list-slot">
        ${T(t)}
      </div>
    </section>
  `}function w(e,t){e.innerHTML=T(t)}function T(e){return e.length?`
    <table class="student-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Age</th>
          <th>Course</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${e.map(e=>`
          <tr data-id="${e.id}">
            <td>${E(e.name)}</td>
            <td>${E(e.email)}</td>
            <td>${e.age??`—`}</td>
            <td>${E(e.course??`—`)}</td>
            <td>
              <button data-action="delete" data-id="${e.id}" class="btn-danger">
                Delete
              </button>
            </td>
          </tr>
        `).join(``)}
      </tbody>
    </table>
  `:`<p class="empty">No students yet. Add one above.</p>`}function E(e=``){return String(e).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}var D={required:e=>e==null||String(e).trim()===``?`Required`:null,email:e=>!e||/^\S+@\S+\.\S+$/.test(e)?null:`Invalid email`,minLength:e=>t=>!t||String(t).length>=e?null:`Min ${e} chars`,maxLength:e=>t=>!t||String(t).length<=e?null:`Max ${e} chars`,min:e=>t=>t==null||Number(t)>=e?null:`Min ${e}`,max:e=>t=>t==null||Number(t)<=e?null:`Max ${e}`};function O(e,t){let n={};for(let[r,i]of Object.entries(t))for(let t of i){let i=t(e[r]);if(i){n[r]=i;break}}return{valid:Object.keys(n).length===0,errors:n}}function k(e,{onSuccess:t,onError:n}={}){if(!e)return;let r=e.querySelector(`.form-error`),a=e.querySelector(`button[type="submit"]`);e.addEventListener(`submit`,async r=>{r.preventDefault(),c();let a=new FormData(e),u={name:a.get(`name`)?.trim(),email:a.get(`email`)?.trim(),age:a.get(`age`)?Number(a.get(`age`)):null,course:a.get(`course`)?.trim()||null},{valid:d,errors:f}=O(u,{name:[D.required,D.maxLength(100)],email:[D.required,D.email],age:[D.min(1),D.max(120)]});if(!d){let e=Object.values(f)[0];o(e);return}l(!0);try{let n=await s.create(u);e.reset(),t?.(n)}catch(e){let t=e instanceof i?e.message:`Failed to add student`;o(t),n?.(t)}finally{l(!1)}});function o(e){r&&(r.textContent=e,r.hidden=!1)}function c(){r&&(r.hidden=!0,r.textContent=``)}function l(e){a&&(a.disabled=e,a.textContent=e?`Adding…`:`Add student`)}}async function A(e){x(e,`Loading students…`);let t;try{t=await s.list()}catch(t){S(e,t.message,()=>A(e));return}C(e,t);let n=e.querySelector(`#student-form`),r=e.querySelector(`#student-list-slot`);k(n,{onSuccess:async e=>{b.success(`Added ${e.name}`),w(r,await s.list())},onError:e=>b.error(e)}),r.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-action="delete"]`);if(!t||!confirm(`Delete this student?`))return;let n=Number(t.dataset.id);try{await s.remove(n),w(r,await s.list()),b.success(`Student deleted`)}catch(e){let t=e instanceof i?e.message:`Delete failed`;b.error(t)}})}function j(e,t){e.innerHTML=`
    <section class="page">
      <h1>Courses</h1>

      <form id="course-form" class="course-form">
        <input name="name"     placeholder="Course name" required />
        <input name="category" placeholder="Category (e.g. Backend)" />
        <input name="duration" placeholder="Duration (e.g. 6 weeks)" />
        <input name="seats"    type="number" min="1" max="500" value="30" placeholder="Seats" />
        <button type="submit">Add course</button>
        <p class="form-error" hidden></p>
      </form>

      <div id="course-list-slot">
        ${N(t)}
      </div>
    </section>
  `}function M(e,t){e.innerHTML=N(t)}function N(e){return e.length?`
    <ul class="course-list">
      ${e.map(e=>{let t=e.enrolledCount??0,n=e.seats??0,r=n>0&&t>=n;return`
          <li class="course-card" data-id="${e.id}">
            <div class="course-card-body">
              <h3>${P(e.name)}</h3>
              <p class="course-meta">
                ${P(e.category??`Uncategorized`)} · ${P(e.duration??`Flexible`)}
              </p>
              <p class="course-seats ${r?`is-full`:``}">
                ${t} / ${n} enrolled ${r?`(full)`:``}
              </p>
            </div>
            <button data-action="delete" data-id="${e.id}" class="btn-danger">
              Delete
            </button>
          </li>
        `}).join(``)}
    </ul>
  `:`<p class="empty">No courses yet. Add one above.</p>`}function P(e=``){return String(e).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}async function F(e){x(e,`Loading courses…`);let t;try{t=await c.list()}catch(t){S(e,t.message,()=>F(e));return}j(e,t);let n=e.querySelector(`#course-form`),r=e.querySelector(`#course-list-slot`);n.addEventListener(`submit`,async e=>{e.preventDefault();let t=n.querySelector(`.form-error`),a=n.querySelector(`button[type="submit"]`);t.hidden=!0;let o=new FormData(n),s={name:o.get(`name`)?.trim(),category:o.get(`category`)?.trim()||null,duration:o.get(`duration`)?.trim()||null,seats:Number(o.get(`seats`))||30};if(!s.name){t.textContent=`Course name is required`,t.hidden=!1;return}if(s.seats<1||s.seats>500){t.textContent=`Seats must be between 1 and 500`,t.hidden=!1;return}a.disabled=!0,a.textContent=`Adding…`;try{await c.create(s),n.reset(),M(r,await c.list()),b.success(`Added "${s.name}"`)}catch(e){let n=e instanceof i?e.message:`Failed to add course`;t.textContent=n,t.hidden=!1,b.error(n)}finally{a.disabled=!1,a.textContent=`Add course`}}),r.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-action="delete"]`);if(!t||!confirm(`Delete this course? Enrollments for it will also be removed.`))return;let n=Number(t.dataset.id);try{await c.remove(n),M(r,await c.list()),b.success(`Course deleted`)}catch(e){let t=e instanceof i?e.message:`Delete failed`;b.error(t)}})}function I(e,{enrollments:t,students:n,courses:r}){e.innerHTML=`
    <section class="page">
      <h1>Enrollments</h1>

      <form id="enrollment-form" class="enrollment-form">
        <select name="studentId" required>
          <option value="">Select student…</option>
          ${n.map(e=>`
            <option value="${e.id}">${B(e.name)}</option>
          `).join(``)}
        </select>

        <select name="courseId" required>
          <option value="">Select course…</option>
          ${r.map(e=>{let t=e.enrolledCount??0,n=e.seats??0,r=n>0&&t>=n;return`
              <option value="${e.id}" ${r?`disabled`:``}>
                ${B(e.name)} (${t}/${n})${r?` — full`:``}
              </option>
            `}).join(``)}
        </select>

        <button type="submit">Enroll</button>
        <p class="form-error" hidden></p>
      </form>

      <div id="enrollment-list-slot">
        ${R(t)}
      </div>
    </section>
  `}function L(e,t){e.innerHTML=R(t)}function R(e){return e.length?`
    <table class="enrollment-table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Course</th>
          <th>Category</th>
          <th>Enrolled on</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${e.map(e=>`
          <tr data-id="${e.id}">
            <td>${B(e.studentName??`—`)}</td>
            <td>${B(e.courseName??`—`)}</td>
            <td>${B(e.category??`—`)}</td>
            <td>${z(e.enrolledAt)}</td>
            <td>
              <button data-action="delete" data-id="${e.id}" class="btn-danger">
                Remove
              </button>
            </td>
          </tr>
        `).join(``)}
      </tbody>
    </table>
  `:`<p class="empty">No enrollments yet.</p>`}function z(e){if(!e)return`—`;try{return new Date(e).toLocaleDateString()}catch{return`—`}}function B(e=``){return String(e).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}async function V(e){x(e,`Loading enrollments…`);let t,n,r;try{[t,n,r]=await Promise.all([s.list(),c.list(),l.list()])}catch(t){S(e,t.message,()=>V(e));return}I(e,{enrollments:r,students:t,courses:n});let a=e.querySelector(`#enrollment-form`),o=e.querySelector(`#enrollment-list-slot`);a.addEventListener(`submit`,async e=>{e.preventDefault();let t=a.querySelector(`.form-error`),n=a.querySelector(`button[type="submit"]`);t.hidden=!0;let r=new FormData(a),s={studentId:Number(r.get(`studentId`)),courseId:Number(r.get(`courseId`))};if(!s.studentId||!s.courseId){t.textContent=`Please pick both a student and a course`,t.hidden=!1;return}n.disabled=!0,n.textContent=`Enrolling…`;try{await l.create(s),a.reset(),L(o,await l.list()),b.success(`Student enrolled`)}catch(e){let n=e instanceof i?e.message:`Enrollment failed`;t.textContent=n,t.hidden=!1,b.error(n)}finally{n.disabled=!1,n.textContent=`Enroll`}}),o.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-action="delete"]`);if(!t||!confirm(`Remove this enrollment?`))return;let n=Number(t.dataset.id);try{await l.remove(n),L(o,await l.list()),b.success(`Enrollment removed`)}catch(e){let t=e instanceof i?e.message:`Delete failed`;b.error(t)}})}var H={login:e=>o.post(`/api/auth/login`,e),register:e=>o.post(`/api/auth/register`,e)};function U(e){e.innerHTML=`
    <section class="auth-page">
      <div class="auth-card">
        <h1>Welcome back</h1>
        <p class="auth-subtitle">Sign in to your EduTrack account</p>

        <form id="login-form" class="auth-form">
          <input name="email" type="email" placeholder="Email" required autofocus />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Sign in</button>
          <p class="form-error" hidden></p>
        </form>

        <p class="auth-footer">
          Don't have an account? <a href="/register" data-link>Create one</a>
        </p>

        <div class="auth-hint">
          <strong>Demo admin:</strong> admin@edutrack.com / admin123
        </div>
      </div>
    </section>
  `;let t=e.querySelector(`#login-form`),n=t.querySelector(`.form-error`),a=t.querySelector(`button[type="submit"]`);t.addEventListener(`submit`,async e=>{e.preventDefault(),n.hidden=!0;let o=new FormData(t),s={email:o.get(`email`).trim(),password:o.get(`password`)};a.disabled=!0,a.textContent=`Signing in…`;try{let{token:e,user:t}=await H.login(s);r.login(e,t),b.success(`Welcome, ${t.name}`),window.location.href=`/`}catch(e){n.textContent=e instanceof i?e.message:`Login failed`,n.hidden=!1}finally{a.disabled=!1,a.textContent=`Sign in`}})}function W(e){e.innerHTML=`
    <section class="auth-page">
      <div class="auth-card">
        <h1>Create account</h1>
        <p class="auth-subtitle">Sign up for EduTrack</p>

        <form id="register-form" class="auth-form">
          <input name="name" placeholder="Full name" required autofocus />
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password (min 6 chars)" minlength="6" required />
          <button type="submit">Create account</button>
          <p class="form-error" hidden></p>
        </form>

        <p class="auth-footer">
          Already have an account? <a href="/login" data-link>Sign in</a>
        </p>
      </div>
    </section>
  `;let t=e.querySelector(`#register-form`),n=t.querySelector(`.form-error`),a=t.querySelector(`button[type="submit"]`);t.addEventListener(`submit`,async e=>{e.preventDefault(),n.hidden=!0;let o=new FormData(t),s={name:o.get(`name`).trim(),email:o.get(`email`).trim(),password:o.get(`password`)};a.disabled=!0,a.textContent=`Creating…`;try{let{token:e,user:t}=await H.register(s);r.login(e,t),b.success(`Welcome, ${t.name}`),window.location.href=`/`}catch(e){n.textContent=e instanceof i?e.message:`Registration failed`,n.hidden=!1}finally{a.disabled=!1,a.textContent=`Create account`}})}var G={"/":g,"/students":A,"/courses":F,"/enrollments":V,"/login":U,"/register":W},K=[`/login`,`/register`];function q(e){let t=()=>{let n=location.pathname;if(!r.isAuthenticated()&&!K.includes(n))return history.replaceState({},``,`/login`),t();if(r.isAuthenticated()&&K.includes(n))return history.replaceState({},``,`/`),t();J(),(G[n]??X)(e),Y(n)};window.addEventListener(`popstate`,t),document.body.addEventListener(`click`,e=>{if(e.target.closest(`[data-logout]`)){e.preventDefault(),r.logout(),window.location.href=`/login`;return}let n=e.target.closest(`a[data-link]`);if(!n)return;e.preventDefault();let i=n.getAttribute(`href`);i&&i!==location.pathname&&(history.pushState({},``,i),t())}),t()}function J(){let e=document.querySelector(`.navbar`);if(!e)return;let t=r.isAuthenticated(),n=r.getUser();if(!t){e.innerHTML=`<a href="/login" class="navbar-brand" data-link>EduTrack</a>`;return}e.innerHTML=`
    <a href="/" class="navbar-brand" data-link>EduTrack</a>
    <a href="/" class="navbar-link" data-link>Dashboard</a>
    <a href="/students" class="navbar-link" data-link>Students</a>
    <a href="/courses" class="navbar-link" data-link>Courses</a>
    <a href="/enrollments" class="navbar-link" data-link>Enrollments</a>
    <div class="navbar-spacer"></div>
    <span class="navbar-user">
      ${Z(n.name)}
      <span class="navbar-role">${n.role}</span>
    </span>
    <a href="#" class="navbar-link" data-logout>Logout</a>
  `}function Y(e){document.querySelectorAll(`.navbar-link`).forEach(t=>{let n=t.getAttribute(`href`);t.classList.toggle(`active`,n===e)})}function X(e){e.innerHTML=`
    <section class="page">
      <h1>404</h1>
      <p>Page not found.</p>
      <a href="/" data-link>Go home</a>
    </section>
  `}function Z(e=``){return String(e).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}q(document.querySelector(`#app`));
//# sourceMappingURL=index-Cu89JxZJ.js.map