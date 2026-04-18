// /**
//  * dashboard.js
//  * ─────────────────────────────────────────────────────────────────
//  * 1. Auth guard – redirects to login if no session found.
//  * 2. Populates the welcome banner with the student's name.
//  * 3. Populates the quick-stat cards with stored data.
//  *
//  * Session data is expected to be stored in sessionStorage (or
//  * localStorage as fallback) under the key "acadexUser" as a JSON
//  * object:  { name, gpa, courses, notifications }
//  *
//  * After a successful login, auth.js (or the login handler) should
//  * call:
//  *   sessionStorage.setItem("acadexUser", JSON.stringify({ name, gpa, courses, notifications }));
//  * ─────────────────────────────────────────────────────────────────
//  */

// (function () {
//   "use strict";

//   /* ── 1. Auth Guard ────────────────────────────────────────────── */
//   const raw =
//     sessionStorage.getItem("acadexUser") ||
//     localStorage.getItem("acadexUser");

//   if (!raw) {
//     // No session – send to login
//     window.location.replace("login.html");
//     return;
//   }

//   /* ── 2. Parse user data ───────────────────────────────────────── */
//   let user;
//   try {
//     user = JSON.parse(raw);
//   } catch {
//     // Corrupted data – clear and redirect
//     sessionStorage.removeItem("acadexUser");
//     localStorage.removeItem("acadexUser");
//     window.location.replace("login.html");
//     return;
//   }

//   /* ── 3. Populate Welcome Banner ──────────────────────────────── */
//   const nameEl = document.getElementById("studentName");
//   if (nameEl && user.name) {
//     nameEl.textContent = user.name;
//   }

//   /* ── 4. Populate Stat Cards ──────────────────────────────────── */
//   const gpaEl = document.getElementById("statGpaValue");
//   if (gpaEl && user.gpa !== undefined) {
//     gpaEl.textContent = parseFloat(user.gpa).toFixed(2);
//   }

//   const coursesEl = document.getElementById("statCoursesValue");
//   if (coursesEl && user.courses !== undefined) {
//     coursesEl.textContent = user.courses;
//   }

//   const notifsEl = document.getElementById("statNotifsValue");
//   if (notifsEl && user.notifications !== undefined) {
//     notifsEl.textContent = user.notifications;
//   }

//   /* ── 5. Time-of-day greeting ─────────────────────────────────── */
//   const greetingEl = document.querySelector(".welcome-label");
//   if (greetingEl) {
//     const hour = new Date().getHours();
//     let greeting;
//     if (hour < 12)      greeting = "Good morning ☀️";
//     else if (hour < 17) greeting = "Good afternoon 👋";
//     else                greeting = "Good evening 🌙";
//     greetingEl.textContent = greeting;
//   }
// })();
