import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "grid" },
  { label: "User Management", icon: "users" },
  { label: "Course Catalog", icon: "book" },
  { label: "System Logs", icon: "list" },
  { label: "Settings", icon: "gear" },
];

const STATS = [
  { label: "Total Students", value: "12,450", change: "+0.2%", positive: true, icon: "users" },
  { label: "Total Faculty", value: "842", change: "+1%", positive: true, icon: "briefcase" },
  { label: "Active Courses", value: "3,120", change: "-0%", positive: false, icon: "book" },
];

const QUICK_ACTIONS = [
  { title: "Add New User", desc: "Create student or faculty profile", icon: "userPlus" },
  { title: "Create Course", desc: "Initialize a new academic course", icon: "book" },
  { title: "System Announcement", desc: "Broadcast message to all users", icon: "megaphone" },
];

const ROLE_ROWS = [
  { name: "Sarah Jenkins", email: "sarah.jenkins@eduportal.edu", role: "Super Admin", active: "Just now", initials: "SJ" },
  { name: "Michael Ross", email: "m.ross@eduportal.edu", role: "IT Admin", active: "2 hours ago", initials: "MR" },
  { name: "Elena Liu", email: "elena.liu@eduportal.edu", role: "Academic Registrar", active: "Yesterday", initials: "EL" },
];

function Icon({ name, size = 18 }) {
  const c = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "grid": return (<svg {...c}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>);
    case "users": return (<svg {...c}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
    case "book": return (<svg {...c}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>);
    case "list": return (<svg {...c}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>);
    case "gear": return (<svg {...c}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>);
    case "search": return (<svg {...c}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
    case "bell": return (<svg {...c}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>);
    case "apps": return (<svg {...c}><circle cx="5" cy="5" r="1.5" /><circle cx="12" cy="5" r="1.5" /><circle cx="19" cy="5" r="1.5" /><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /><circle cx="5" cy="19" r="1.5" /><circle cx="12" cy="19" r="1.5" /><circle cx="19" cy="19" r="1.5" /></svg>);
    case "briefcase": return (<svg {...c}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>);
    case "trend-up": return (<svg {...c}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>);
    case "trend-down": return (<svg {...c}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>);
    case "shield": return (<svg {...c}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
    case "userPlus": return (<svg {...c}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="17" y1="11" x2="23" y2="11" /></svg>);
    case "megaphone": return (<svg {...c}><path d="M3 11l18-5v12L3 13v-2z" /><path d="M11.6 16.8a2 2 0 1 1-3.2 2.4" /></svg>);
    case "dots": return (<svg {...c}><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>);
    case "menu": return (<svg {...c}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>);
    case "close": return (<svg {...c}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
    default: return null;
  }
}

export default function AdminDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="ad-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .ad-page { display: flex; min-height: 100vh; background: #F9F9FF; font-family: 'Inter', Arial, sans-serif; }

        .ad-sidebar { width: 240px; background: #fff; border-right: 1px solid #BDC9C6; display: flex; flex-direction: column; flex-shrink: 0; }
        .ad-logo-row { display: flex; align-items: center; gap: 12px; padding: 20px; }
        .ad-logo-box { width: 34px; height: 34px; border-radius: 8px; background: #005C55; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
        .ad-brand { color: #005C55; font-weight: 700; font-size: 18px; margin: 0; line-height: 22px; }
        .ad-brand-sub { color: #3E4947; font-weight: 600; font-size: 11px; margin: 0; }
        .ad-nav { padding: 8px 12px; display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .ad-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #3E4947; cursor: pointer; }
        .ad-nav-item.active { font-weight: 700; color: #fff; background: #005C55; }
        .ad-sidebar-footer { display: flex; align-items: center; gap: 10px; padding: 16px 20px; border-top: 1px solid #BDC9C6; }
        .ad-avatar { width: 34px; height: 34px; border-radius: 50%; background: #DEE8FF; color: #005C55; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; flex-shrink: 0; }
        .ad-footer-name { font-size: 13px; font-weight: 600; color: #111C2D; margin: 0; }
        .ad-footer-email { font-size: 11px; color: #3E4947; margin: 0; }

        .ad-main-col { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .ad-header { height: 60px; border-bottom: 1px solid #BDC9C6; display: flex; align-items: center; gap: 16px; padding: 0 24px; background: #fff; }
        .ad-menu-btn { display: none; background: none; border: none; color: #3E4947; cursor: pointer; }
        .ad-search-wrap { position: relative; flex: 1; max-width: 480px; }
        .ad-search-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #6B7280; }
        .ad-search-input { width: 100%; box-sizing: border-box; padding: 9px 14px 9px 38px; border-radius: 8px; border: 1px solid #BDC9C6; background: #F9F9FF; font-size: 14px; color: #111C2D; outline: none; }
        .ad-header-icons { display: flex; align-items: center; gap: 16px; margin-left: auto; color: #3E4947; }

        .ad-main { padding: 24px; display: flex; flex-direction: column; gap: 24px; max-width: 1280px; width: 100%; box-sizing: border-box; }
        .ad-h1 { font-size: 28px; font-weight: 700; color: #111C2D; margin: 0; }
        .ad-subtitle { font-size: 14px; color: #3E4947; margin: 6px 0 0; }

        .ad-stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .ad-stat-card { background: #fff; border: 1px solid #BDC9C6; border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 10px; }
        .ad-stat-top { display: flex; align-items: center; justify-content: space-between; }
        .ad-stat-icon { width: 32px; height: 32px; border-radius: 8px; background: #E7EEFF; color: #005C55; display: flex; align-items: center; justify-content: center; }
        .ad-stat-change { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 2px; }
        .ad-stat-change.up { color: #059669; }
        .ad-stat-change.down { color: #DC2626; }
        .ad-stat-value { font-size: 24px; font-weight: 700; color: #111C2D; margin: 0; }
        .ad-stat-label { font-size: 12px; color: #3E4947; margin: 0; }

        .ad-health-card { background: #005C55; border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 10px; color: #fff; }
        .ad-health-top { display: flex; align-items: center; justify-content: space-between; }
        .ad-health-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; }
        .ad-health-badge { font-size: 11px; font-weight: 700; background: rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 9999px; }
        .ad-health-value { font-size: 24px; font-weight: 700; margin: 0; }
        .ad-health-label { font-size: 12px; opacity: 0.85; margin: 0; }

        .ad-bottom-row { display: grid; grid-template-columns: 320px 1fr; gap: 16px; align-items: start; }

        .ad-card { background: #fff; border: 1px solid #BDC9C6; border-radius: 12px; overflow: hidden; }
        .ad-card-header { padding: 16px 20px; border-bottom: 1px solid #EEF1F0; display: flex; align-items: center; justify-content: space-between; }
        .ad-card-title { font-size: 16px; font-weight: 700; color: #111C2D; margin: 0; }
        .ad-card-desc { font-size: 12px; color: #3E4947; margin: 2px 0 0; }
        .ad-manage-btn { background: #005C55; color: #fff; border: none; border-radius: 8px; padding: 8px 14px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; }

        .ad-actions-list { display: flex; flex-direction: column; }
        .ad-action-item { display: flex; align-items: center; gap: 12px; padding: 14px 20px; cursor: pointer; border-bottom: 1px solid #EEF1F0; }
        .ad-action-item:last-child { border-bottom: none; }
        .ad-action-icon { width: 34px; height: 34px; border-radius: 8px; background: #E7EEFF; color: #005C55; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ad-action-title { font-size: 14px; font-weight: 600; color: #111C2D; margin: 0; }
        .ad-action-desc { font-size: 12px; color: #3E4947; margin: 2px 0 0; }

        .ad-table { width: 100%; border-collapse: collapse; }
        .ad-table th { text-align: left; font-size: 11px; font-weight: 700; color: #3E4947; text-transform: uppercase; letter-spacing: 0.4px; padding: 10px 20px; border-bottom: 1px solid #EEF1F0; }
        .ad-table td { padding: 12px 20px; border-bottom: 1px solid #EEF1F0; font-size: 13px; color: #111C2D; vertical-align: middle; }
        .ad-table tr:last-child td { border-bottom: none; }
        .ad-user-cell { display: flex; align-items: center; gap: 10px; }
        .ad-user-avatar { width: 30px; height: 30px; border-radius: 50%; background: #DEE8FF; color: #005C55; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 11px; flex-shrink: 0; }
        .ad-user-name { font-weight: 600; margin: 0; }
        .ad-user-email { font-size: 11px; color: #3E4947; margin: 0; }
        .ad-role-pill { display: inline-block; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; background: #E7EEFF; color: #005C55; }
        .ad-dots-btn { background: none; border: none; color: #6B7280; cursor: pointer; padding: 4px; }

        .ad-overlay { display: none; }

        @media (max-width: 1024px) {
          .ad-stats-row { grid-template-columns: repeat(2, 1fr); }
          .ad-bottom-row { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .ad-sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; transform: translateX(-100%); transition: transform 0.2s ease; box-shadow: 2px 0 12px rgba(0,0,0,0.15); }
          .ad-sidebar.open { transform: translateX(0); }
          .ad-menu-btn { display: block; }
          .ad-overlay.open { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 40; }
          .ad-header { padding: 0 12px; gap: 10px; }
          .ad-main { padding: 16px; }
          .ad-h1 { font-size: 22px; }
          .ad-stats-row { grid-template-columns: 1fr 1fr; gap: 12px; }
          .ad-table th:nth-child(3), .ad-table td:nth-child(3) { display: none; }
          .ad-search-wrap { max-width: none; }
        }

        @media (max-width: 420px) {
          .ad-stats-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className={`ad-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />

      <aside className={`ad-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="ad-logo-row">
          <div className="ad-logo-box">E</div>
          <div>
            <p className="ad-brand">EduPortal</p>
            <p className="ad-brand-sub">System Admin</p>
          </div>
        </div>
        <nav className="ad-nav">
          {NAV_ITEMS.map((item) => {
            const active = item.label === "Dashboard";
            return (
              <div key={item.label} className={`ad-nav-item ${active ? "active" : ""}`}>
                <Icon name={item.icon} size={17} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>
        <div className="ad-sidebar-footer">
          <div className="ad-avatar">AU</div>
          <div>
            <p className="ad-footer-name">Admin User</p>
            <p className="ad-footer-email">admin@eduportal.edu</p>
          </div>
        </div>
      </aside>

      <div className="ad-main-col">
        <header className="ad-header">
          <button className="ad-menu-btn" onClick={() => setMenuOpen(true)}>
            <Icon name="menu" size={20} />
          </button>
          <div className="ad-search-wrap">
            <span className="ad-search-icon"><Icon name="search" size={16} /></span>
            <input className="ad-search-input" placeholder="Search users, courses, logs..." />
          </div>
          <div className="ad-header-icons">
            <Icon name="bell" size={18} />
            <Icon name="apps" size={18} />
          </div>
        </header>

        <main className="ad-main">
          <div>
            <h1 className="ad-h1">System Overview</h1>
            <p className="ad-subtitle">Welcome back, Admin. Here is the current state of EduPortal.</p>
          </div>

          <div className="ad-stats-row">
            {STATS.map((stat) => (
              <div key={stat.label} className="ad-stat-card">
                <div className="ad-stat-top">
                  <div className="ad-stat-icon"><Icon name={stat.icon} size={16} /></div>
                  <span className={`ad-stat-change ${stat.positive ? "up" : "down"}`}>
                    <Icon name={stat.positive ? "trend-up" : "trend-down"} size={12} />
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="ad-stat-value">{stat.value}</p>
                  <p className="ad-stat-label">{stat.label}</p>
                </div>
              </div>
            ))}

            <div className="ad-health-card">
              <div className="ad-health-top">
                <div className="ad-health-icon"><Icon name="shield" size={16} /></div>
                <span className="ad-health-badge">Optimal</span>
              </div>
              <div>
                <p className="ad-health-value">99.98%</p>
                <p className="ad-health-label">System Health &middot; Uptime</p>
              </div>
            </div>
          </div>

          <div className="ad-bottom-row">
            <div className="ad-card">
              <div className="ad-card-header">
                <div>
                  <p className="ad-card-title">Quick Actions</p>
                  <p className="ad-card-desc">Frequently used administrative tasks.</p>
                </div>
              </div>
              <div className="ad-actions-list">
                {QUICK_ACTIONS.map((action) => (
                  <div key={action.title} className="ad-action-item">
                    <div className="ad-action-icon"><Icon name={action.icon} size={16} /></div>
                    <div>
                      <p className="ad-action-title">{action.title}</p>
                      <p className="ad-action-desc">{action.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ad-card">
              <div className="ad-card-header">
                <div>
                  <p className="ad-card-title">Role Management</p>
                  <p className="ad-card-desc">Active system administrators and roles.</p>
                </div>
                <button className="ad-manage-btn">+ Manage Roles</button>
              </div>
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ROLE_ROWS.map((row) => (
                    <tr key={row.name}>
                      <td>
                        <div className="ad-user-cell">
                          <div className="ad-user-avatar">{row.initials}</div>
                          <div>
                            <p className="ad-user-name">{row.name}</p>
                            <p className="ad-user-email">{row.email}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="ad-role-pill">{row.role}</span></td>
                      <td>{row.active}</td>
                      <td>
                        <button className="ad-dots-btn"><Icon name="dots" size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}