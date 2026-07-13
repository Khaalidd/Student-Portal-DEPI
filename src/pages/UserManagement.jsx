import { useState } from "react";

const imgUserProfile = "https://www.figma.com/api/mcp/asset/85366406-af28-409f-9953-d29e020f2975";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "grid" },
  { label: "My Courses", icon: "book" },
  { label: "Grades", icon: "star" },
  { label: "Schedule", icon: "calendar" },
  { label: "Notifications", icon: "bell" },
  { label: "Settings", icon: "gear" },
];

const USERS = [
  { name: "Jane Smith", email: "jane.smith@eduportal.edu", role: "Student", status: "Active", lastLogin: "2 hours ago", initials: "JS" },
  { name: "Michael Roberts", email: "m.roberts@eduportal.edu", role: "Instructor", status: "Active", lastLogin: "Yesterday", initials: "MR" },
  { name: "Alice Lee", email: "alice.lee@eduportal.edu", role: "Student", status: "Inactive", lastLogin: "Oct 12, 2023", initials: "AL" },
  { name: "Admin User", email: "admin@eduportal.edu", role: "Admin", status: "Active", lastLogin: "Just now", initials: "AU" },
];

function Icon({ name, size = 18 }) {
  const c = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "grid": return (<svg {...c}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>);
    case "book": return (<svg {...c}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>);
    case "star": return (<svg {...c}><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9 12 2" /></svg>);
    case "calendar": return (<svg {...c}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>);
    case "bell": return (<svg {...c}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>);
    case "gear": return (<svg {...c}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>);
    case "search": return (<svg {...c}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
    case "apps": return (<svg {...c}><circle cx="5" cy="5" r="1.5" /><circle cx="12" cy="5" r="1.5" /><circle cx="19" cy="5" r="1.5" /><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /><circle cx="5" cy="19" r="1.5" /><circle cx="12" cy="19" r="1.5" /><circle cx="19" cy="19" r="1.5" /></svg>);
    case "chevron-down": return (<svg {...c}><polyline points="6 9 12 15 18 9" /></svg>);
    case "filter": return (<svg {...c}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>);
    case "download": return (<svg {...c}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>);
    case "edit": return (<svg {...c}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>);
    case "dots": return (<svg {...c}><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>);
    case "chevron-left": return (<svg {...c}><polyline points="15 18 9 12 15 6" /></svg>);
    case "chevron-right": return (<svg {...c}><polyline points="9 18 15 12 9 6" /></svg>);
    case "plus": return (<svg {...c}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>);
    case "menu": return (<svg {...c}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>);
    default: return null;
  }
}

export default function UserManagement() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [checked, setChecked] = useState({});

  function toggleRow(name) {
    setChecked((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  return (
    <div className="um-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .um-page { display: flex; min-height: 100vh; background: #F9F9FF; font-family: 'Inter', Arial, sans-serif; }

        .um-sidebar { width: 260px; background: #fff; border-right: 1px solid #BDC9C6; display: flex; flex-direction: column; flex-shrink: 0; }
        .um-logo-row { display: flex; align-items: center; gap: 16px; padding: 24px; }
        .um-logo-box { width: 40px; height: 40px; border-radius: 8px; background: #005C55; flex-shrink: 0; }
        .um-brand { color: #005C55; font-weight: 700; font-size: 24px; line-height: 32px; margin: 0; }
        .um-brand-sub { color: #3E4947; font-weight: 600; font-size: 12px; margin: 0; }
        .um-nav { padding: 16px 12px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .um-nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #3E4947; border-left: 4px solid transparent; cursor: pointer; }
        .um-nav-item.active { font-weight: 700; color: #005C55; background: rgba(0,92,85,0.1); border-left: 4px solid #005C55; padding-left: 12px; }

        .um-main-col { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .um-header { height: 64px; border-bottom: 1px solid #BDC9C6; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; background: rgba(249,249,255,0.8); backdrop-filter: blur(6px); gap: 24px; }
        .um-menu-btn { display: none; background: none; border: none; color: #3E4947; cursor: pointer; }
        .um-search-wrap { position: relative; flex: 1 0 0; min-width: 0; max-width: 420px; }
        .um-search-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #6B7280; }
        .um-search-input { width: 100%; box-sizing: border-box; padding: 11px 16px 11px 40px; border-radius: 9999px; border: 1px solid #BDC9C6; background: #F0F3FF; font-size: 16px; color: #111C2D; outline: none; }
        .um-header-icons { display: flex; align-items: center; gap: 16px; flex-shrink: 0; color: #3E4947; }
        .um-avatar-sm { width: 32px; height: 32px; border-radius: 50%; border: 1px solid #BDC9C6; object-fit: cover; }

        .um-main { max-width: 1280px; padding: 24px; width: 100%; box-sizing: border-box; display: flex; flex-direction: column; gap: 20px; }
        .um-top-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .um-h1 { font-size: 28px; font-weight: 700; color: #111C2D; margin: 0; }
        .um-subtitle { color: #3E4947; font-size: 14px; margin: 6px 0 0; }
        .um-add-btn { background: #005C55; color: #fff; border: none; border-radius: 8px; padding: 10px 18px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; white-space: nowrap; }

        .um-filter-bar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .um-filter-search { flex: 1; min-width: 200px; position: relative; }
        .um-filter-input { width: 100%; box-sizing: border-box; padding: 9px 12px 9px 36px; border-radius: 8px; border: 1px solid #BDC9C6; background: #fff; font-size: 14px; color: #111C2D; outline: none; }
        .um-filter-icon-abs { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #6B7280; }
        .um-select { padding: 9px 32px 9px 12px; border-radius: 8px; border: 1px solid #BDC9C6; background: #fff; font-size: 14px; color: #3E4947; outline: none; cursor: pointer; }
        .um-icon-btn { width: 36px; height: 36px; border-radius: 8px; border: 1px solid #BDC9C6; background: #fff; color: #3E4947; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }

        .um-table-card { background: #fff; border: 1px solid #BDC9C6; border-radius: 12px; overflow: hidden; }
        .um-table-scroll { overflow-x: auto; }
        .um-table { width: 100%; border-collapse: collapse; min-width: 640px; }
        .um-table th { text-align: left; font-size: 11px; font-weight: 700; color: #3E4947; text-transform: uppercase; letter-spacing: 0.4px; padding: 12px 16px; border-bottom: 1px solid #EEF1F0; background: #fff; }
        .um-table td { padding: 14px 16px; border-bottom: 1px solid #EEF1F0; font-size: 13px; color: #111C2D; vertical-align: middle; }
        .um-table tr:last-child td { border-bottom: none; }
        .um-user-cell { display: flex; align-items: center; gap: 10px; }
        .um-user-avatar { width: 30px; height: 30px; border-radius: 50%; background: #DEE8FF; color: #005C55; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 11px; flex-shrink: 0; }
        .um-user-name { font-weight: 600; margin: 0; }
        .um-user-email { font-size: 11px; color: #3E4947; margin: 0; }
        .um-role-pill { display: inline-block; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; background: #EEF0F5; color: #4B5563; white-space: nowrap; }
        .um-role-pill.admin { background: rgba(0,92,85,0.14); color: #005C55; }
        .um-status { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; }
        .um-status-dot { width: 7px; height: 7px; border-radius: 50%; }
        .um-status.active .um-status-dot { background: #059669; }
        .um-status.active { color: #059669; }
        .um-status.inactive .um-status-dot { background: #9CA3AF; }
        .um-status.inactive { color: #6B7280; }
        .um-actions-cell { display: flex; align-items: center; gap: 8px; }
        .um-row-btn { background: none; border: none; color: #6B7280; cursor: pointer; padding: 4px; display: flex; }
        .um-checkbox { width: 16px; height: 16px; accent-color: #005C55; cursor: pointer; }

        .um-table-footer { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; font-size: 12px; color: #3E4947; }
        .um-pagination { display: flex; align-items: center; gap: 4px; }
        .um-page-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid #BDC9C6; background: #fff; color: #3E4947; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; font-weight: 600; }
        .um-page-btn.active { background: #005C55; border-color: #005C55; color: #fff; }

        .um-overlay { display: none; }

        @media (max-width: 900px) {
          .um-table th:nth-child(5), .um-table td:nth-child(5) { display: none; }
        }

        @media (max-width: 640px) {
          .um-sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; transform: translateX(-100%); transition: transform 0.2s ease; box-shadow: 2px 0 12px rgba(0,0,0,0.15); }
          .um-sidebar.open { transform: translateX(0); }
          .um-menu-btn { display: block; }
          .um-overlay.open { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 40; }
          .um-header { padding: 0 12px; }
          .um-main { padding: 16px; }
          .um-h1 { font-size: 22px; }
          .um-add-btn { width: 100%; justify-content: center; }
          .um-top-row { flex-direction: column; align-items: stretch; }
          .um-table th:nth-child(4), .um-table td:nth-child(4) { display: none; }
        }
      `}</style>

      <div className={`um-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />

      <aside className={`um-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="um-logo-row">
          <div className="um-logo-box" />
          <div>
            <p className="um-brand">EduPortal</p>
            <p className="um-brand-sub">Student Management</p>
          </div>
        </div>
        <nav className="um-nav">
          {NAV_ITEMS.map((item) => {
            const active = item.label === "Settings";
            return (
              <div key={item.label} className={`um-nav-item ${active ? "active" : ""}`}>
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="um-main-col">
        <header className="um-header">
          <button className="um-menu-btn" onClick={() => setMenuOpen(true)}>
            <Icon name="menu" size={20} />
          </button>
          <div className="um-search-wrap">
            <span className="um-search-icon"><Icon name="search" /></span>
            <input className="um-search-input" placeholder="Search accounts..." />
          </div>
          <div className="um-header-icons">
            <Icon name="bell" size={18} />
            <Icon name="apps" size={18} />
            <img className="um-avatar-sm" src={imgUserProfile} alt="User profile" />
          </div>
        </header>

        <main className="um-main">
          <div className="um-top-row">
            <div>
              <h1 className="um-h1">User Management</h1>
              <p className="um-subtitle">Manage students, instructors, and administrative accounts.</p>
            </div>
            <button className="um-add-btn"><Icon name="plus" size={16} /> Add New User</button>
          </div>

          <div className="um-filter-bar">
            <div className="um-filter-search">
              <span className="um-filter-icon-abs"><Icon name="search" size={14} /></span>
              <input className="um-filter-input" placeholder="Filter by name or email" />
            </div>
            <select className="um-select" defaultValue="All Roles">
              <option>All Roles</option>
              <option>Student</option>
              <option>Instructor</option>
              <option>Admin</option>
            </select>
            <select className="um-select" defaultValue="Status">
              <option>Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <button className="um-icon-btn"><Icon name="filter" size={16} /></button>
            <button className="um-icon-btn"><Icon name="download" size={16} /></button>
          </div>

          <div className="um-table-card">
            <div className="um-table-scroll">
              <table className="um-table">
                <thead>
                  <tr>
                    <th style={{ width: 32 }}></th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {USERS.map((u) => (
                    <tr key={u.name}>
                      <td>
                        <input
                          type="checkbox"
                          className="um-checkbox"
                          checked={!!checked[u.name]}
                          onChange={() => toggleRow(u.name)}
                        />
                      </td>
                      <td>
                        <div className="um-user-cell">
                          <div className="um-user-avatar">{u.initials}</div>
                          <div>
                            <p className="um-user-name">{u.name}</p>
                            <p className="um-user-email">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className={`um-role-pill ${u.role === "Admin" ? "admin" : ""}`}>{u.role}</span></td>
                      <td>
                        <span className={`um-status ${u.status === "Active" ? "active" : "inactive"}`}>
                          <span className="um-status-dot" />
                          {u.status}
                        </span>
                      </td>
                      <td>{u.lastLogin}</td>
                      <td>
                        <div className="um-actions-cell">
                          <button className="um-row-btn"><Icon name="edit" size={15} /></button>
                          <button className="um-row-btn"><Icon name="dots" size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="um-table-footer">
              <span>Showing 1 to 4 of 124 users</span>
              <div className="um-pagination">
                <button className="um-page-btn"><Icon name="chevron-left" size={14} /></button>
                <button className="um-page-btn active">1</button>
                <button className="um-page-btn"><Icon name="chevron-right" size={14} /></button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}