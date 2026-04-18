/**
 * <app-sidebar> – Reusable sidebar Web Component
 *
 * Usage: drop <app-sidebar></app-sidebar> inside a .layout div.
 * The component reads window.location.pathname to auto-highlight
 * the active nav link — no extra configuration required.
 *
 * Required in every page that uses this component:
 *   <link rel="stylesheet" href="../css/sidebar.css" />
 *   <script src="../js/sidebar.js"></script>
 */
class AppSidebar extends HTMLElement {
  connectedCallback() {
    const page = window.location.pathname.split("/").pop() || "dashboard.html";

    const links = [
      { href: "dashboard.html", label: "Dashboard" },
      { href: "profile.html",   label: "Profile"   },
      { href: "grades.html",    label: "Grades"    },
      { href: "courses.html",   label: "Courses"   },
    ];

    const navItems = links
      .map(({ href, label }) => {
        const active = page === href ? " active" : "";
        return `<li><a href="${href}" class="nav-link${active}">${label}</a></li>`;
      })
      .join("\n");

    this.innerHTML = `
      <div class="sidebar" id="appSidebar">
        <div class="bar-wrapper">
          <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu">&#9776;</button>
          <h3>Student Panel</h3>
          <nav class="nav" aria-label="Portal navigation">
            <ul>
              ${navItems}
              <li><a href="login.html" class="nav-link">Logout</a></li>
            </ul>
          </nav>
        </div>
      </div>
    `;

    // Mobile toggle
    const btn     = this.querySelector("#menuToggle");
    const sidebar = this.querySelector("#appSidebar");

    btn.addEventListener("click", () => {
      const isOpen = sidebar.classList.toggle("open");
      btn.textContent = isOpen ? "\u2716" : "\u2630";
    });

    // Close sidebar when a link is clicked on mobile
    this.querySelectorAll(".nav-link").forEach((a) => {
      a.addEventListener("click", () => {
        sidebar.classList.remove("open");
        btn.textContent = "\u2630";
      });
    });
  }
}

customElements.define("app-sidebar", AppSidebar);
