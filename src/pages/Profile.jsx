import { useState } from "react";

const imgUserProfile = "https://www.figma.com/api/mcp/asset/85366406-af28-409f-9953-d29e020f2975";
const imgStudentPhoto = "https://www.figma.com/api/mcp/asset/1fd3aab2-d1b3-4240-9352-ec129b496a46";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "grid" },
  { label: "My Courses", icon: "book" },
  { label: "Grades", icon: "star" },
  { label: "Schedule", icon: "calendar" },
  { label: "Notifications", icon: "bell" },
  { label: "Settings", icon: "gear" },
];

const TABS = ["Personal Info", "Security", "Notifications", "Appearance"];

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "grid":
      return (<svg {...common}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>);
    case "book":
      return (<svg {...common}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>);
    case "star":
      return (<svg {...common}><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9 12 2" /></svg>);
    case "calendar":
      return (<svg {...common}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>);
    case "bell":
      return (<svg {...common}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>);
    case "gear":
      return (<svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>);
    case "search":
      return (<svg {...common}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
    case "apps":
      return (<svg {...common}><circle cx="5" cy="5" r="1.5" /><circle cx="12" cy="5" r="1.5" /><circle cx="19" cy="5" r="1.5" /><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /><circle cx="5" cy="19" r="1.5" /><circle cx="12" cy="19" r="1.5" /><circle cx="19" cy="19" r="1.5" /></svg>);
    case "chevron":
      return (<svg {...common}><polyline points="9 18 15 12 9 6" /></svg>);
    case "menu":
      return (<svg {...common}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>);
    case "close":
      return (<svg {...common}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
    case "user":
      return (<svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" /></svg>);
    case "lock":
      return (<svg {...common}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>);
    case "check":
      return (<svg {...common}><polyline points="20 6 9 17 4 12" /></svg>);
    default:
      return null;
  }
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`ps-toggle ${checked ? "on" : ""}`}
      aria-pressed={checked}
    >
      <span className="ps-toggle-knob" />
    </button>
  );
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Personal Info");
  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Johnson");
  const [personalEmail, setPersonalEmail] = useState("alexj@example.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [twoFactor, setTwoFactor] = useState(true);
  const [courseAnnouncements, setCourseAnnouncements] = useState(true);
  const [gradeUpdates, setGradeUpdates] = useState(true);
  const [assignmentDeadlines, setAssignmentDeadlines] = useState(false);
  const [saved, setSaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="ps-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .ps-page { display: flex; min-height: 100vh; background: #F9F9FF; font-family: 'Inter', Arial, sans-serif; }
        .ps-desktop-only { display: flex; }
        .ps-mobile-only { display: none; }

        /* ===== Desktop / tablet ===== */
        .ps-sidebar { width: 260px; background: #fff; border-right: 1px solid #BDC9C6; display: flex; flex-direction: column; flex-shrink: 0; }
        .ps-logo-row { display: flex; align-items: center; gap: 16px; padding: 24px; }
        .ps-logo-box { width: 40px; height: 40px; border-radius: 8px; background: #005C55; flex-shrink: 0; }
        .ps-brand { color: #005C55; font-weight: 700; font-size: 24px; line-height: 32px; margin: 0; }
        .ps-brand-sub { color: #3E4947; font-weight: 600; font-size: 12px; margin: 0; }
        .ps-nav { padding: 16px 12px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .ps-nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #3E4947; border-left: 4px solid transparent; cursor: pointer; }
        .ps-nav-item.active { font-weight: 700; color: #005C55; background: rgba(0,92,85,0.1); border-left: 4px solid #005C55; padding-left: 12px; }
        .ps-close-btn { display: none; }

        .ps-main-col { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .ps-header { height: 64px; border-bottom: 1px solid #BDC9C6; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; background: rgba(249,249,255,0.8); backdrop-filter: blur(6px); gap: 24px; }
        .ps-menu-btn { display: none; background: none; border: none; color: #3E4947; cursor: pointer; }
        .ps-search-wrap { position: relative; flex: 1 0 0; min-width: 0; }
        .ps-search-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #6B7280; }
        .ps-search-input { width: 100%; box-sizing: border-box; padding: 11px 16px 11px 40px; border-radius: 9999px; border: 1px solid #BDC9C6; background: #F0F3FF; font-size: 16px; color: #111C2D; outline: none; }
        .ps-header-icons { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
        .ps-icon-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; cursor: pointer; color: #3E4947; }
        .ps-avatar-sm { width: 32px; height: 32px; border-radius: 50%; border: 1px solid #BDC9C6; object-fit: cover; }

        .ps-main { max-width: 1280px; padding: 16px 24px 40px; width: 100%; box-sizing: border-box; }
        .ps-h1 { font-size: 36px; font-weight: 700; color: #111C2D; margin: 0; letter-spacing: -0.5px; }
        .ps-subtitle { color: #3E4947; font-size: 16px; margin: 8px 0 24px; }

        .ps-layout { display: flex; gap: 24px; align-items: flex-start; }
        .ps-settings-nav { width: 256px; background: #fff; border: 1px solid #BDC9C6; border-radius: 12px; padding: 13px; flex-shrink: 0; box-shadow: 0 1px 1px rgba(0,0,0,0.05); }
        .ps-settings-tab { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-radius: 8px; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #3E4947; background: transparent; cursor: pointer; }
        .ps-settings-tab.active { font-weight: 700; color: #005C55; background: #DEE8FF; }

        .ps-content { flex: 1; display: flex; flex-direction: column; gap: 24px; min-width: 0; }
        .ps-profile-card { background: #fff; border: 1px solid #BDC9C6; border-radius: 12px; padding: 25px; display: flex; gap: 24px; box-shadow: 0 1px 1px rgba(0,0,0,0.05); }
        .ps-photo { width: 128px; height: 128px; border-radius: 50%; border: 4px solid #F9F9FF; flex-shrink: 0; object-fit: cover; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .ps-name { font-size: 24px; font-weight: 700; color: #111C2D; margin: 0; }
        .ps-major { color: #005C55; font-size: 16px; margin: 8px 0; }
        .ps-badge-row { display: flex; gap: 16px; margin-top: 8px; flex-wrap: wrap; }
        .ps-badge { background: #E7EEFF; border: 1px solid #BDC9C6; border-radius: 8px; padding: 9px 17px; }
        .ps-badge-label { font-size: 12px; font-weight: 600; color: #3E4947; text-transform: uppercase; letter-spacing: 0.5px; margin: 0; }
        .ps-badge-value { font-size: 16px; font-weight: 500; color: #111C2D; margin: 0; }

        .ps-form-card { background: #fff; border: 1px solid #BDC9C6; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .ps-form-header { background: #F9F9FF; border-bottom: 1px solid #BDC9C6; padding: 16px 24px 17px; }
        .ps-form-title { font-size: 20px; font-weight: 600; color: #111C2D; margin: 0; }
        .ps-form-desc { font-size: 12px; font-weight: 600; color: #3E4947; margin: 4px 0 0; }
        .ps-form-grid { padding: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .ps-col-span-2 { grid-column: 1 / span 2; }
        .ps-label { font-size: 14px; font-weight: 500; color: #3E4947; display: block; margin-bottom: 8px; }
        .ps-input { width: 100%; box-sizing: border-box; padding: 9px 13px; border-radius: 6px; border: 1px solid #BDC9C6; background: #F9F9FF; font-size: 16px; color: #111C2D; outline: none; }
        .ps-email-box { padding: 9px 13px; border-radius: 6px; border: 1px solid #BDC9C6; background: #E7EEFF; color: #3E4947; font-size: 16px; opacity: 0.7; }
        .ps-hint { font-size: 12px; font-weight: 600; color: #3E4947; margin: 4px 0 0; }
        .ps-form-footer { background: #F9F9FF; border-top: 1px solid #BDC9C6; padding: 17px 24px 16px; display: flex; justify-content: flex-end; align-items: center; gap: 12px; }
        .ps-saved-text { font-size: 13px; color: #005C55; font-weight: 500; }
        .ps-save-btn { background: #005C55; color: #fff; border: none; border-radius: 8px; padding: 8px 24px; font-size: 14px; font-weight: 500; cursor: pointer; }
        .ps-placeholder-card { background: #fff; border: 1px solid #BDC9C6; border-radius: 12px; padding: 40px; text-align: center; color: #3E4947; font-size: 14px; }

        .ps-overlay { display: none; }

        .ps-toggle { width: 40px; height: 22px; border-radius: 9999px; background: #BDC9C6; border: none; position: relative; cursor: pointer; padding: 0; flex-shrink: 0; transition: background 0.15s ease; }
        .ps-toggle.on { background: #10B981; }
        .ps-toggle-knob { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform 0.15s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
        .ps-toggle.on .ps-toggle-knob { transform: translateX(18px); }

        /* ===== Mobile (matches "Setting (mobile web)-revised" Figma frame) ===== */
        @media (max-width: 640px) {
          .ps-desktop-only { display: none; }
          .ps-mobile-only { display: flex; }

          .ps-m-page { display: flex; flex-direction: column; width: 100%; min-height: 100vh; background: #F9F9FF; }

          .ps-m-header { display: flex; align-items: center; justify-content: space-between; height: 56px; padding: 0 16px; background: #fff; border-bottom: 1px solid #BDC9C6; position: fixed; top: 0; left: 0; right: 0; width: 100%; box-sizing: border-box; z-index: 100; }
          .ps-m-brand { display: flex; align-items: center; gap: 10px; color: #3E4947; }
          .ps-m-brand-text { color: #005C55; font-weight: 700; font-size: 17px; }
          .ps-m-header-icons { display: flex; align-items: center; gap: 14px; color: #3E4947; }
          .ps-m-avatar { width: 26px; height: 26px; border-radius: 50%; object-fit: cover; border: 1px solid #BDC9C6; }
        .ps-m-menu-btn { background: none; border: none; padding: 0; margin: 0; color: #3E4947; display: flex; align-items: center; cursor: pointer; outline: none; }
        .ps-m-header, .ps-m-header * { outline: none; box-shadow: none; }

          .ps-m-overlay { display: none; }
          .ps-m-overlay.open { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 40; }
          .ps-m-drawer { position: fixed; top: 0; left: 0; bottom: 0; width: 240px; background: #fff; z-index: 50; transform: translateX(-100%); transition: transform 0.2s ease; box-shadow: 2px 0 12px rgba(0,0,0,0.15); display: flex; flex-direction: column; }
          .ps-m-drawer.open { transform: translateX(0); }
          .ps-m-drawer-header { display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid #BDC9C6; }
          .ps-m-drawer-nav { padding: 12px; display: flex; flex-direction: column; gap: 4px; }

          .ps-m-main { margin-top: 56px; padding: 12px 16px 16px; display: flex; flex-direction: column; gap: 16px; }
          .ps-m-h1 { font-size: 22px; font-weight: 700; color: #111C2D; margin: 0; }
          .ps-m-subtitle { font-size: 13px; color: #3E4947; margin: 4px 0 0; }

          .ps-m-profile-card { background: #fff; border: 1px solid #BDC9C6; border-radius: 12px; padding: 20px 16px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; }
          .ps-m-photo { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 3px solid #F9F9FF; margin-bottom: 8px; }
          .ps-m-name { font-size: 18px; font-weight: 700; color: #111C2D; margin: 0; }
          .ps-m-major { font-size: 13px; color: #3E4947; margin: 0; }
          .ps-m-status-pill { display: inline-flex; align-items: center; gap: 6px; background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; border-radius: 9999px; padding: 4px 12px; font-size: 12px; font-weight: 600; margin-top: 10px; }
          .ps-m-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #10B981; }

          .ps-m-academic-card { background: #fff; border: 1px solid #BDC9C6; border-radius: 12px; padding: 16px; }
          .ps-m-academic-title { font-size: 11px; font-weight: 700; letter-spacing: 0.6px; color: #3E4947; text-transform: uppercase; margin: 0 0 12px; }
          .ps-m-academic-row { display: flex; justify-content: space-between; padding: 8px 0; border-top: 1px solid #EEF1F0; font-size: 13px; }
          .ps-m-academic-row:first-of-type { border-top: none; }
          .ps-m-academic-label { color: #3E4947; }
          .ps-m-academic-value { color: #111C2D; font-weight: 600; }

          .ps-m-section-card { background: #fff; border: 1px solid #BDC9C6; border-radius: 12px; overflow: hidden; }
          .ps-m-section-header { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid #EEF1F0; color: #005C55; }
          .ps-m-section-title { font-size: 15px; font-weight: 700; color: #111C2D; margin: 0; }
          .ps-m-section-body { padding: 16px; display: flex; flex-direction: column; gap: 14px; }

          .ps-m-field-label { font-size: 12px; font-weight: 600; color: #3E4947; display: block; margin-bottom: 6px; }
          .ps-m-input { width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 6px; border: 1px solid #BDC9C6; background: #F9F9FF; font-size: 14px; color: #111C2D; outline: none; }
          .ps-m-input.readonly { background: #E7EEFF; color: #3E4947; opacity: 0.75; }
          .ps-m-field-hint { font-size: 11px; color: #3E4947; margin: 4px 0 0; }

          .ps-m-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
          .ps-m-row-title { font-size: 14px; font-weight: 600; color: #111C2D; margin: 0; }
          .ps-m-row-sub { font-size: 12px; color: #3E4947; margin: 2px 0 0; }
          .ps-m-divider { height: 1px; background: #EEF1F0; margin: 2px 0; }
          .ps-m-update-btn { background: #F9F9FF; border: 1px solid #BDC9C6; color: #111C2D; border-radius: 6px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; }

          .ps-m-actions { display: flex; gap: 12px; padding-bottom: 24px; }
          .ps-m-cancel-btn { flex: 1; background: #fff; border: 1px solid #BDC9C6; color: #3E4947; border-radius: 8px; padding: 12px; font-size: 14px; font-weight: 600; cursor: pointer; }
          .ps-m-save-btn { flex: 1; background: #005C55; border: none; color: #fff; border-radius: 8px; padding: 12px; font-size: 14px; font-weight: 600; cursor: pointer; }
          .ps-m-saved-banner { background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; border-radius: 8px; padding: 8px 12px; font-size: 13px; font-weight: 600; text-align: center; }
        }

        @media (min-width: 641px) and (max-width: 900px) {
          .ps-layout { flex-direction: column; }
          .ps-settings-nav { width: 100%; box-sizing: border-box; display: flex; gap: 8px; overflow-x: auto; padding: 8px; }
          .ps-settings-tab { flex-shrink: 0; margin-bottom: 0; }
        }
      `}</style>

      {/* ===================== DESKTOP / TABLET LAYOUT ===================== */}
      <div className="ps-desktop-only" style={{ width: "100%" }}>
        <div className={`ps-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />

        <aside className="ps-sidebar">
          <div className="ps-logo-row">
            <div className="ps-logo-box" />
            <div>
              <p className="ps-brand">EduPortal</p>
              <p className="ps-brand-sub">Student Management</p>
            </div>
          </div>
          <nav className="ps-nav">
            {NAV_ITEMS.map((item) => {
              const active = item.label === "Settings";
              return (
                <div key={item.label} className={`ps-nav-item ${active ? "active" : ""}`}>
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </nav>
        </aside>

        <div className="ps-main-col">
          <header className="ps-header">
            <div className="ps-search-wrap">
              <span className="ps-search-icon"><Icon name="search" /></span>
              <input className="ps-search-input" placeholder="Search..." />
            </div>
            <div className="ps-header-icons">
              <span className="ps-icon-btn"><Icon name="bell" /></span>
              <span className="ps-icon-btn"><Icon name="apps" /></span>
              <img className="ps-avatar-sm" src={imgUserProfile} alt="User profile" />
            </div>
          </header>

          <main className="ps-main">
            <h1 className="ps-h1">Profile & Settings</h1>
            <p className="ps-subtitle">Manage your account preferences and personal information.</p>

            <div className="ps-layout">
              <div className="ps-settings-nav">
                {TABS.map((tab) => (
                  <div key={tab} className={`ps-settings-tab ${tab === activeTab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                    <span>{tab}</span>
                    <Icon name="chevron" size={12} />
                  </div>
                ))}
              </div>

              <div className="ps-content">
                <div className="ps-profile-card">
                  <img className="ps-photo" src={imgStudentPhoto} alt="Student" />
                  <div>
                    <h2 className="ps-name">{firstName} {lastName}</h2>
                    <p className="ps-major">Computer Science, Year 3</p>
                    <div className="ps-badge-row">
                      <div className="ps-badge">
                        <p className="ps-badge-label">Student ID</p>
                        <p className="ps-badge-value">10283847</p>
                      </div>
                      <div className="ps-badge">
                        <p className="ps-badge-label">Current GPA</p>
                        <p className="ps-badge-value">3.8</p>
                      </div>
                    </div>
                  </div>
                </div>

                {activeTab === "Personal Info" && (
                  <div className="ps-form-card">
                    <div className="ps-form-header">
                      <p className="ps-form-title">Personal Information</p>
                      <p className="ps-form-desc">Update your contact details and bio.</p>
                    </div>
                    <div className="ps-form-grid">
                      <div>
                        <label className="ps-label">First name</label>
                        <input className="ps-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                      </div>
                      <div>
                        <label className="ps-label">Last name</label>
                        <input className="ps-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                      </div>
                      <div className="ps-col-span-2">
                        <label className="ps-label">University email</label>
                        <div className="ps-email-box">a.johnson@eduportal.edu</div>
                        <p className="ps-hint">University email cannot be changed here.</p>
                      </div>
                      <div>
                        <label className="ps-label">Personal email</label>
                        <input className="ps-input" value={personalEmail} onChange={(e) => setPersonalEmail(e.target.value)} />
                      </div>
                      <div>
                        <label className="ps-label">Phone number</label>
                        <input className="ps-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                    </div>
                    <div className="ps-form-footer">
                      {saved && <span className="ps-saved-text">Saved</span>}
                      <button className="ps-save-btn" onClick={handleSave}>Save changes</button>
                    </div>
                  </div>
                )}

                {activeTab !== "Personal Info" && (
                  <div className="ps-placeholder-card">{activeTab} settings go here.</div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ===================== MOBILE LAYOUT (matches "Setting (mobile web)-revised") ===================== */}
      <div className="ps-mobile-only ps-m-page">
        <header className="ps-m-header">
          <div className="ps-m-brand">
            <button className="ps-m-menu-btn" onClick={() => setMenuOpen((prev) => !prev)} aria-label="Toggle menu">
              <Icon name={menuOpen ? "close" : "menu"} size={20} />
            </button>
            <span className="ps-m-brand-text">EduPortal</span>
          </div>
          <div className="ps-m-header-icons">
            <Icon name="bell" size={18} />
            <Icon name="apps" size={18} />
            <img className="ps-m-avatar" src={imgUserProfile} alt="User profile" />
          </div>
        </header>

        <div className={`ps-m-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
        <aside className={`ps-m-drawer ${menuOpen ? "open" : ""}`}>
          <div className="ps-m-drawer-header">
            <span className="ps-m-brand-text">EduPortal</span>
            <button className="ps-m-menu-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <Icon name="close" size={20} />
            </button>
          </div>
          <nav className="ps-m-drawer-nav">
            {NAV_ITEMS.map((item) => {
              const active = item.label === "Settings";
              return (
                <div key={item.label} className={`ps-nav-item ${active ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="ps-m-main">
          <div>
            <h1 className="ps-m-h1">Profile & Settings</h1>
            <p className="ps-m-subtitle">Manage your account and profile details and preferences.</p>
          </div>

          {saved && <div className="ps-m-saved-banner">Changes saved</div>}

          <div className="ps-m-profile-card">
            <img className="ps-m-photo" src={imgStudentPhoto} alt="Student" />
            <p className="ps-m-name">{firstName} {lastName}</p>
            <p className="ps-m-major">Computer Science, Year 3</p>
            <span className="ps-m-status-pill">
              <span className="ps-m-status-dot" />
              Good Standing &middot; Full Time
            </span>
          </div>

          <div className="ps-m-academic-card">
            <p className="ps-m-academic-title">Academic Status</p>
            <div className="ps-m-academic-row">
              <span className="ps-m-academic-label">Student ID</span>
              <span className="ps-m-academic-value">10283847</span>
            </div>
            <div className="ps-m-academic-row">
              <span className="ps-m-academic-label">Current GPA</span>
              <span className="ps-m-academic-value">3.8</span>
            </div>
            <div className="ps-m-academic-row">
              <span className="ps-m-academic-label">Expected Grad</span>
              <span className="ps-m-academic-value">May 2026</span>
            </div>
          </div>

          <div className="ps-m-section-card">
            <div className="ps-m-section-header">
              <Icon name="user" size={16} />
              <p className="ps-m-section-title">Personal Information</p>
            </div>
            <div className="ps-m-section-body">
              <div>
                <label className="ps-m-field-label">First Name</label>
                <input className="ps-m-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div>
                <label className="ps-m-field-label">Last Name</label>
                <input className="ps-m-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div>
                <label className="ps-m-field-label">University Email</label>
                <input className="ps-m-input readonly" value="a.johnson@eduportal.edu" readOnly />
                <p className="ps-m-field-hint">University email cannot be changed here.</p>
              </div>
              <div>
                <label className="ps-m-field-label">Personal Email</label>
                <input className="ps-m-input" value={personalEmail} onChange={(e) => setPersonalEmail(e.target.value)} />
              </div>
              <div>
                <label className="ps-m-field-label">Phone Number</label>
                <input className="ps-m-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="ps-m-section-card">
            <div className="ps-m-section-header">
              <Icon name="lock" size={16} />
              <p className="ps-m-section-title">Security</p>
            </div>
            <div className="ps-m-section-body">
              <div className="ps-m-row">
                <div>
                  <p className="ps-m-row-title">Password</p>
                  <p className="ps-m-row-sub">Last changed 3 months ago</p>
                </div>
                <button className="ps-m-update-btn">Update Password</button>
              </div>
              <div className="ps-m-divider" />
              <div className="ps-m-row">
                <div>
                  <p className="ps-m-row-title">Two-Factor Authentication</p>
                  <p className="ps-m-row-sub">Currently enabled via Authenticator App</p>
                </div>
                <Toggle checked={twoFactor} onChange={setTwoFactor} />
              </div>
            </div>
          </div>

          <div className="ps-m-section-card">
            <div className="ps-m-section-header">
              <Icon name="bell" size={16} />
              <p className="ps-m-section-title">Notifications</p>
            </div>
            <div className="ps-m-section-body">
              <div className="ps-m-row">
                <div>
                  <p className="ps-m-row-title">Course Announcements</p>
                  <p className="ps-m-row-sub">Updates from professors and TAs</p>
                </div>
                <Toggle checked={courseAnnouncements} onChange={setCourseAnnouncements} />
              </div>
              <div className="ps-m-divider" />
              <div className="ps-m-row">
                <div>
                  <p className="ps-m-row-title">Grade Updates</p>
                  <p className="ps-m-row-sub">When new grades are posted</p>
                </div>
                <Toggle checked={gradeUpdates} onChange={setGradeUpdates} />
              </div>
              <div className="ps-m-divider" />
              <div className="ps-m-row">
                <div>
                  <p className="ps-m-row-title">Assignment Deadlines</p>
                  <p className="ps-m-row-sub">24 hour reminder before due date</p>
                </div>
                <Toggle checked={assignmentDeadlines} onChange={setAssignmentDeadlines} />
              </div>
            </div>
          </div>

          <div className="ps-m-actions">
            <button className="ps-m-cancel-btn">Cancel</button>
            <button className="ps-m-save-btn" onClick={handleSave}>Save Changes</button>
          </div>
        </main>
      </div>
    </div>
  );
}