
import React, { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Server,
  UserPlus,
  FilePlus2,
  Megaphone,
  ShieldCheck,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../api/usersApi";
import { getAllCourses } from "../api/coursesApi";
import { supabase } from "../lib/supabaseClient";

/* ---------- icon lookup ---------- */

var STAT_ICONS = {
  "Total Students": Users,
  "Total Faculty": GraduationCap,
  "Active Courses": BookOpen,
};

/* ---------- data ---------- */

var desktopActions = [
  { title: "Add New User", subtitle: "Create student or faculty profile", icon: UserPlus, action: "/admin/users" },
  { title: "Create Course", subtitle: "Initialize a new academic course", icon: FilePlus2, action: "/admin/courses/new" },
  { title: "System Announcement", subtitle: "Broadcast message to all users", icon: Megaphone, action: "announcement" },
];

var mobileActions = [
  { title: "Add New Student", icon: UserPlus, action: "/admin/users" },
  { title: "Send Global Announcement", icon: Megaphone, action: "announcement" },
  { title: "Manage Roles & Permissions", icon: ShieldCheck, action: "/admin/users" },
];

/* ---------- small pieces ---------- */

function DeltaPill({ type, children }) {
  var styles = {
    up: "text-emerald-600 bg-emerald-50",
    flat: "text-amber-600 bg-amber-50",
    down: "text-gray-500 bg-gray-100",
  };
  return (
    <span className={`absolute top-5 right-5 text-xs font-bold px-2 py-1 rounded-full ${styles[type]}`}>
      {children}
    </span>
  );
}

function DesktopStatCard({ label, value, delta, deltaType, icon: Icon }) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl p-5">
      {delta && (
        <DeltaPill type={deltaType}>
          {deltaType === "up" ? "\u2197 " : deltaType === "down" ? "\u2198 " : ""}
          {delta}
        </DeltaPill>
      )}
      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-teal-800 flex items-center justify-center mb-4">
        <Icon size={18} />
      </div>
      <div className="text-xs font-bold tracking-wider uppercase text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-extrabold tracking-tight text-gray-900">{value}</div>
    </div>
  );
}

function DesktopHealthCard() {
  return (
    <div className="relative bg-gradient-to-br from-teal-700 to-teal-900 text-white rounded-2xl p-5">
      <span className="absolute top-5 right-5 flex items-center gap-1.5 text-xs font-bold bg-white/15 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
        Optimal
      </span>
      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
        <Server size={18} />
      </div>
      <div className="text-xs font-bold tracking-wider uppercase text-white/70 mb-1">System Health</div>
      <div className="text-xl font-extrabold tracking-tight">99.98% Uptime</div>
    </div>
  );
}

function MobileStatCard({ label, value, delta, icon: Icon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-teal-700 flex items-center justify-center">
          <Icon size={15} />
        </div>
      </div>
      <div className="text-2xl font-extrabold text-gray-900">{value}</div>
      {delta && <div className="text-xs font-semibold text-emerald-600 mt-1">\u2191 {delta} from last term</div>}
    </div>
  );
}

function MobileHealthCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-gray-900">System Health</span>
        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">Optimal</span>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Server Uptime</span>
            <span className="font-semibold text-gray-700">99.8%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-teal-700 rounded-full" style={{ width: "99.8%" }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Database Load</span>
            <span className="font-semibold text-gray-700">42%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-teal-700 rounded-full" style={{ width: "42%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionRow({ title, subtitle, icon: Icon, onClick }) {
  return (
    <div className="flex items-center gap-3 py-3 cursor-pointer group" onClick={onClick}>
      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-teal-800 flex items-center justify-center flex-none">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
      </div>
      <ChevronRight size={16} className="ml-auto flex-none text-gray-300 group-hover:text-gray-500" />
    </div>
  );
}

function NetworkIllustration() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-center">
      <svg width="220" height="150" viewBox="0 0 220 150" fill="none">
        <g stroke="#bfe4d7" strokeWidth="1.5">
          <line x1="110" y1="75" x2="30" y2="30" />
          <line x1="110" y1="75" x2="190" y2="30" />
          <line x1="110" y1="75" x2="30" y2="120" />
          <line x1="110" y1="75" x2="190" y2="120" />
          <line x1="110" y1="75" x2="110" y2="15" />
          <line x1="110" y1="75" x2="110" y2="135" />
          <line x1="30" y1="30" x2="110" y2="15" />
          <line x1="190" y1="30" x2="110" y2="15" />
          <line x1="30" y1="120" x2="110" y2="135" />
          <line x1="190" y1="120" x2="110" y2="135" />
        </g>
        <circle cx="110" cy="75" r="17" fill="#0f4f43" />
        <circle cx="30" cy="30" r="9" fill="#1c8a72" />
        <circle cx="190" cy="30" r="9" fill="#1c8a72" />
        <circle cx="30" cy="120" r="9" fill="#1c8a72" />
        <circle cx="190" cy="120" r="9" fill="#1c8a72" />
        <circle cx="110" cy="15" r="7" fill="#5be0a3" />
        <circle cx="110" cy="135" r="7" fill="#5be0a3" />
      </svg>
    </div>
  );
}

/* ---------- helpers ---------- */

function getInitials(name) {
  var parts = (name || "").trim().split(/\s+/);
  var letters = parts.map(function (p) {
    return p[0];
  });
  return letters.join("").toUpperCase().slice(0, 2) || "A";
}

var AVATAR_BG = "bg-teal-700";
var ROLE_STYLE = "bg-teal-50 text-teal-700";

/* ---------- page ---------- */

export default function EduPortalDashboard() {
  var [stats, setStats] = useState([]);
  var [admins, setAdmins] = useState([]);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);
  var [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  var [announcementMessage, setAnnouncementMessage] = useState("");

  useEffect(function () {
    var cancelled = false;
    async function fetchData() {
      try {
        var [allUsers, allCourses] = await Promise.all([getUsers(), getAllCourses()]);

        if (cancelled) return;

        var studentCount = allUsers.filter(function (u) {
          return u.role === "student";
        }).length;
        var facultyCount = allUsers.filter(function (u) {
          return u.role === "instructor";
        }).length;
        var courseCount = allCourses.length;

        setStats([
          { label: "Total Students", value: String(studentCount), delta: "", deltaType: "" },
          { label: "Total Faculty", value: String(facultyCount), delta: "", deltaType: "" },
          { label: "Active Courses", value: String(courseCount), delta: "", deltaType: "" },
        ]);

        var adminUsers = allUsers.filter(function (u) {
          return u.role === "admin";
        });
        var adminList = adminUsers.map(function (u) {
          return {
            name: u.name || "Admin",
            email: u.email,
            initials: getInitials(u.name),
            avatar_bg: AVATAR_BG,
            role: "Admin",
            role_style: ROLE_STYLE,
            last_active: u.last_active || u.updated_at || "\u2014",
          };
        });
        setAdmins(adminList);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return function () {
      cancelled = true;
    };
  }, []);

  var navigate = useNavigate();

  function handleActionClick(action) {
    if (action === "announcement") {
      setShowAnnouncementModal(true);
    } else {
      navigate(action);
    }
  }

  async function handleSendAnnouncement() {
    if (!announcementMessage.trim()) return;
    await supabase.from("notifications").insert({
      user_id: null,
      day: "Today",
      category_id: "system",
      type: "system",
      source_label: "System Announcement",
      title: announcementMessage,
      description: announcementMessage,
      time_label: "Just now",
      action_label: null,
      read: false,
    });
    setAnnouncementMessage("");
    setShowAnnouncementModal(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <p className="text-red-600 text-sm">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 pb-14">
        {/* Title block */}
        <div className="mb-5 md:mb-6">
          <div className="md:hidden">
            <h1 className="text-xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">System overview and quick controls.</p>
          </div>
          <div className="hidden md:block">
            <h1 className="text-2xl font-extrabold tracking-tight">System Overview</h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, Admin. Here is the current state of EduPortal.
            </p>
          </div>
        </div>

        {/* ===== MOBILE ONLY ===== */}
        <div className="md:hidden space-y-4">
          {stats.map(function (s) {
            return (
              <MobileStatCard
                key={s.label}
                label={s.label}
                value={s.value}
                delta={s.delta}
                icon={STAT_ICONS[s.label]}
              />
            );
          })}
          <MobileHealthCard />

          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="text-xs font-bold tracking-wider uppercase text-gray-400 mb-1 px-1">
              Quick Actions
            </div>
            <div className="divide-y divide-gray-100">
              {mobileActions.map(function (a) {
                return <ActionRow key={a.title} {...a} onClick={function () { handleActionClick(a.action); }} />;
              })}
            </div>
          </div>

          <NetworkIllustration />
        </div>

        {/* ===== DESKTOP ONLY ===== */}
        <div className="hidden md:block">
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {stats.map(function (s) {
              return (
                <DesktopStatCard
                  key={s.label}
                  label={s.label}
                  value={s.value}
                  delta={s.delta}
                  deltaType={s.deltaType}
                  icon={STAT_ICONS[s.label]}
                />
              );
            })}
            <DesktopHealthCard />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="text-base font-bold">Quick Actions</h2>
              <p className="text-sm text-gray-500">Frequently used administrative tasks.</p>
              <div className="divide-y divide-gray-100 mt-1">
                {desktopActions.map(function (a) {
                  return <ActionRow key={a.title} {...a} onClick={function () { handleActionClick(a.action); }} />;
                })}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold">Role Management</h2>
                  <p className="text-sm text-gray-500">Active system administrators and roles.</p>
                </div>
                <button
                  onClick={function () { navigate("/admin/users"); }}
                  className="flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold px-3.5 py-2 rounded-lg whitespace-nowrap"
                >
                  + Manage Roles
                </button>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                    <th className="font-semibold pb-2">User</th>
                    <th className="font-semibold pb-2">Role</th>
                    <th className="font-semibold pb-2">Last Active</th>
                    <th className="font-semibold pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(function (u) {
                    return (
                      <tr key={u.email} className="border-t border-gray-100">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full ${u.avatar_bg} text-white text-xs font-bold flex items-center justify-center flex-none`}
                            >
                              {u.initials}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{u.name}</div>
                              <div className="text-xs text-gray-500">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.role_style}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500">{u.last_active}</td>
                        <td className="py-3 text-right">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* ===== System Announcement Modal ===== */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">System Announcement</h2>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              rows={4}
              placeholder="Type your announcement message..."
              value={announcementMessage}
              onChange={function (e) { setAnnouncementMessage(e.target.value); }}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={function () { setShowAnnouncementModal(false); setAnnouncementMessage(""); }}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSendAnnouncement}
                className="px-4 py-2 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900"
              >
                Send to All Users
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
