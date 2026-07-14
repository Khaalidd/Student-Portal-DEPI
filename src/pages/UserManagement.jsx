
import { useMemo, useState } from 'react';



const USERS = [
  {
    id: 1,
    name: 'Dr. Sarah Jenkins',
    email: 's.jenkins@eduportal.edu',
    role: 'Instructor',
    status: 'Active',
    lastLogin: '2 hours ago',
    avatar: 'https://i.pravatar.cc/64?img=47',
  },
  {
    id: 2,
    name: 'Marcus Lee',
    email: 'm.lee24@student.edu',
    role: 'Student',
    status: 'Active',
    lastLogin: 'Yesterday',
    initials: 'ML',
  },
  {
    id: 3,
    name: 'David Chen',
    email: 'admin@eduportal.edu',
    role: 'Admin',
    status: 'Offline',
    lastLogin: 'Oct 15, 2023',
    avatar: 'https://i.pravatar.cc/64?img=12',
  },
  {
    id: 4,
    name: 'Elena Patel',
    email: 'e.patel@student.edu',
    role: 'Student',
    status: 'Pending',
    lastLogin: 'Just now',
    initials: 'EP',
  },
];

const ROLE_STYLES = {
  Instructor: 'bg-[#e6f4f1] text-[#005c55] border-[#bfded9]',
  Student: 'bg-[#e7eeff] text-[#1e3a8a] border-[#c7d7ff]',
  Admin: 'bg-[#111c2d] text-white border-[#111c2d]',
};

const STATUS_STYLES = {
  Active: { dot: 'bg-[#16a34a]', text: 'text-[#16a34a]' },
  Inactive: { dot: 'bg-[#9ca3af]', text: 'text-[#6b7280]' },
  Offline: { dot: 'bg-[#dc2626]', text: 'text-[#dc2626]' },
  Pending: { dot: 'bg-[#d97706]', text: 'text-[#d97706]' },
};

const FILTER_CHIPS = ['All Users', 'Active', 'Pending', 'Instructors'];

function Avatar({ user }) {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className="size-[36px] shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-[#005c55] text-[12px] font-bold text-white">
      {user.initials}
    </div>
  );
}

function RoleBadge({ role }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-[10px] py-[2px] text-[11px] font-semibold ${ROLE_STYLES[role]}`}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-[6px] text-[13px] font-medium ${style.text}`}>
      <span className={`size-[6px] rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

function KebabMenu() {
  return (
    <button
      type="button"
      className="rounded-[6px] p-[6px] text-[#3e4947] hover:bg-[#f9f9ff]"
      aria-label="More actions"
    >
      <svg className="size-[16px]" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="3" r="1.4" />
        <circle cx="8" cy="8" r="1.4" />
        <circle cx="8" cy="13" r="1.4" />
      </svg>
    </button>
  );
}

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [activeChip, setActiveChip] = useState('All Users');
  const [selected, setSelected] = useState([]);

  const filteredUsers = useMemo(() => {
    return USERS.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (activeChip === 'All Users') return true;
      if (activeChip === 'Active') return u.status === 'Active';
      if (activeChip === 'Pending') return u.status === 'Pending';
      if (activeChip === 'Instructors') return u.role === 'Instructor';
      return true;
    });
  }, [search, activeChip]);

  const toggleSelected = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    setSelected((prev) => (prev.length === filteredUsers.length ? [] : filteredUsers.map((u) => u.id)));
  };

  return (
    <div className="w-full">
      {/* ===== Mobile layout ===== */}
      <div className="mx-auto flex w-full max-w-[400px] flex-col gap-[16px] px-4 py-6 lg:hidden">
        <div className="flex flex-col gap-[4px]">
          <h1 className="text-[20px] font-bold leading-[26px] text-[#111c2d]">User Management</h1>
          <p className="text-[13px] leading-[18px] text-[#3e4947]">
            Manage platform access, roles, and status.
          </p>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-[8px] rounded-[8px] bg-[#005c55] px-[16px] py-[10px] text-[14px] font-semibold text-white hover:bg-[#00473f]"
        >
          <svg className="size-[16px]" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Add New User
        </button>

        <div className="relative">
          <svg
            className="pointer-events-none absolute left-[12px] top-1/2 size-[16px] -translate-y-1/2 text-[#9ca3af]"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
            <path d="M17 17l-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full rounded-[9999px] border border-[#bdc9c6] bg-[#f9f9ff] py-[10px] pl-[36px] pr-[14px] text-[14px] text-[#111c2d] outline-none placeholder:text-[#9ca3af] focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55]"
          />
        </div>

        <div className="flex w-full gap-[8px] overflow-x-auto pb-[2px]">
          {FILTER_CHIPS.map((chip) => {
            const isActive = activeChip === chip;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => setActiveChip(chip)}
                className={`shrink-0 rounded-full border px-[14px] py-[6px] text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'border-[#005c55] bg-[#005c55] text-white'
                    : 'border-[#bdc9c6] bg-white text-[#3e4947] hover:bg-[#f9f9ff]'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-[12px]">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-start justify-between gap-[12px] rounded-[12px] border border-[#bdc9c6] bg-white p-[14px]"
            >
              <div className="flex items-start gap-[12px]">
                <Avatar user={user} />
                <div className="flex flex-col gap-[4px]">
                  <span className="text-[14px] font-semibold leading-[18px] text-[#111c2d]">
                    {user.name}
                  </span>
                  <span className="text-[12px] leading-[16px] text-[#3e4947]">{user.email}</span>
                  <div className="flex items-center gap-[8px] pt-[2px]">
                    <RoleBadge role={user.role} />
                    <StatusBadge status={user.status} />
                  </div>
                </div>
              </div>
              <KebabMenu />
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="rounded-[12px] border border-[#bdc9c6] bg-white p-[24px] text-center text-[13px] text-[#3e4947]">
              No users match this filter.
            </div>
          )}
        </div>
      </div>

      {/* ===== Desktop / tablet layout ===== */}
      <div className="hidden w-full max-w-[1280px] flex-col items-start gap-[24px] lg:flex">
        <div className="flex w-full items-start justify-between gap-4">
          <div className="flex flex-col gap-[8px]">
            <h1 className="text-[36px] font-bold leading-[44px] tracking-[-0.72px] text-[#111c2d]">
              User Management
            </h1>
            <p className="text-[16px] leading-[24px] text-[#3e4947]">
              Manage students, instructors, and administrative accounts.
            </p>
          </div>
          <button
            type="button"
            className="flex shrink-0 items-center gap-[8px] rounded-[8px] bg-[#005c55] px-[20px] py-[10px] text-[14px] font-semibold text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:bg-[#00473f]"
          >
            <svg className="size-[16px]" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Add New User
          </button>
        </div>

        <div className="flex w-full flex-col overflow-hidden rounded-[12px] border border-[#bdc9c6] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          {/* Filters */}
          <div className="flex w-full flex-wrap items-center gap-[12px] border-b border-[#bdc9c6] p-[16px]">
            <div className="relative min-w-[220px] flex-1">
              <svg
                className="pointer-events-none absolute left-[12px] top-1/2 size-[16px] -translate-y-1/2 text-[#9ca3af]"
                viewBox="0 0 20 20"
                fill="none"
              >
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
                <path d="M17 17l-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by name or email"
                className="w-full rounded-[8px] border border-[#bdc9c6] bg-[#f9f9ff] py-[9px] pl-[36px] pr-[12px] text-[14px] text-[#111c2d] outline-none placeholder:text-[#9ca3af] focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55]"
              />
            </div>

            <select className="rounded-[8px] border border-[#bdc9c6] bg-white px-[12px] py-[9px] text-[14px] text-[#3e4947] outline-none focus:border-[#005c55]">
              <option>All Roles</option>
              <option>Student</option>
              <option>Instructor</option>
              <option>Admin</option>
            </select>

            <select className="rounded-[8px] border border-[#bdc9c6] bg-white px-[12px] py-[9px] text-[14px] text-[#3e4947] outline-none focus:border-[#005c55]">
              <option>Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Pending</option>
              <option>Offline</option>
            </select>

            <button
              type="button"
              className="rounded-[8px] border border-[#bdc9c6] p-[9px] text-[#3e4947] hover:bg-[#f9f9ff]"
              aria-label="Sort"
            >
              <svg className="size-[16px]" viewBox="0 0 16 16" fill="none">
                <path d="M4 4h8M4 8h5M4 12h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              className="rounded-[8px] border border-[#bdc9c6] p-[9px] text-[#3e4947] hover:bg-[#f9f9ff]"
              aria-label="Export"
            >
              <svg className="size-[16px]" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8m0 0L5 7m3 3l3-3M3 13h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Table */}
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#bdc9c6] bg-[#f9f9ff]">
                <th className="w-[44px] px-[16px] py-[12px]">
                  <input
                    type="checkbox"
                    checked={selected.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="size-[16px] accent-[#005c55]"
                  />
                </th>
                <th className="px-[12px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#3e4947]">
                  User
                </th>
                <th className="px-[12px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#3e4947]">
                  Role
                </th>
                <th className="px-[12px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#3e4947]">
                  Status
                </th>
                <th className="px-[12px] py-[12px] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#3e4947]">
                  Last Login
                </th>
                <th className="px-[16px] py-[12px] text-right text-[11px] font-semibold uppercase tracking-[0.6px] text-[#3e4947]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-[#e5e7eb] last:border-b-0 hover:bg-[#f9f9ff]">
                  <td className="px-[16px] py-[14px]">
                    <input
                      type="checkbox"
                      checked={selected.includes(user.id)}
                      onChange={() => toggleSelected(user.id)}
                      className="size-[16px] accent-[#005c55]"
                    />
                  </td>
                  <td className="px-[12px] py-[14px]">
                    <div className="flex items-center gap-[12px]">
                      <Avatar user={user} />
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold leading-[18px] text-[#111c2d]">
                          {user.name}
                        </span>
                        <span className="text-[12px] leading-[16px] text-[#3e4947]">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-[12px] py-[14px]">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-[12px] py-[14px]">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-[12px] py-[14px] text-[14px] text-[#3e4947]">{user.lastLogin}</td>
                  <td className="px-[16px] py-[14px]">
                    <div className="flex items-center justify-end gap-[8px]">
                      <button
                        type="button"
                        className="rounded-[6px] p-[6px] text-[#3e4947] hover:bg-[#e7eeff] hover:text-[#005c55]"
                        aria-label="Edit user"
                      >
                        <svg className="size-[16px]" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M11 2l3 3-8 8H3v-3l8-8z"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <KebabMenu />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-[16px] py-[32px] text-center text-[14px] text-[#3e4947]">
                    No users match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex w-full items-center justify-between border-t border-[#bdc9c6] px-[16px] py-[12px]">
            <span className="text-[13px] text-[#3e4947]">
              Showing 1 to {filteredUsers.length} of 124 users
            </span>
            <div className="flex items-center gap-[6px]">
              <button
                type="button"
                className="rounded-[6px] border border-[#bdc9c6] p-[6px] text-[#3e4947] hover:bg-[#f9f9ff] disabled:opacity-40"
                aria-label="Previous page"
                disabled
              >
                <svg className="size-[14px]" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L6 8l4 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className="rounded-[6px] border border-[#bdc9c6] p-[6px] text-[#3e4947] hover:bg-[#f9f9ff]"
                aria-label="Next page"
              >
                <svg className="size-[14px]" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3l4 5-4 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



