
import { useMemo, useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api/usersApi';
import { userSchema } from '../validation/userSchema';



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

function KebabMenu({ onDelete }) {
  var [open, setOpen] = useState(false);

  function handleDelete() {
    setOpen(false);
    if (onDelete) onDelete();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={function () { setOpen(!open); }}
        className="rounded-[6px] p-[6px] text-[#3e4947] hover:bg-[#f9f9ff]"
        aria-label="More actions"
      >
        <svg className="size-[16px]" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.4" />
          <circle cx="8" cy="8" r="1.4" />
          <circle cx="8" cy="13" r="1.4" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-36 rounded-lg border border-[#bdc9c6] bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={handleDelete}
            className="w-full px-4 py-2 text-left text-[13px] text-red-600 hover:bg-red-50"
          >
            Delete User
          </button>
        </div>
      )}
    </div>
  );
}

export default function UserManagement() {
  var [users, setUsers] = useState([]);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);
  var [search, setSearch] = useState('');
  var [activeChip, setActiveChip] = useState('All Users');
  var [selected, setSelected] = useState([]);

  var [modalOpen, setModalOpen] = useState(false);
  var [editingUser, setEditingUser] = useState(null);
  var [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student', status: 'Active' });
  var [formErrors, setFormErrors] = useState({});
  var [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(function () {
    var cancelled = false;
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        var data = await getUsers();
        if (!cancelled) {
          var normalized = data.map(function (u) {
            return {
              ...u,
              role: u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : u.role,
            };
          });
          setUsers(normalized);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchUsers();
    return function () {
      cancelled = true;
    };
  }, []);

  var filteredUsers = useMemo(function () {
    return users.filter(function (u) {
      var matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (activeChip === 'All Users') return true;
      if (activeChip === 'Active') return u.status === 'Active';
      if (activeChip === 'Pending') return u.status === 'Pending';
      if (activeChip === 'Instructors') return u.role === 'Instructor';
      return true;
    });
  }, [users, search, activeChip]);

  var toggleSelected = function (id) {
    setSelected(function (prev) {
      return prev.includes(id) ? prev.filter(function (x) { return x !== id; }) : [...prev, id];
    });
  };

  var toggleSelectAll = function () {
    setSelected(function (prev) {
      return prev.length === filteredUsers.length
        ? []
        : filteredUsers.map(function (u) { return u.id; });
    });
  };

  function handleDeleteUser(userToDelete) {
    if (!window.confirm('Delete ' + userToDelete.name + '?')) return;
    deleteUser(userToDelete.id).then(function () {
      setUsers(function (prev) {
        return prev.filter(function (u) { return u.id !== userToDelete.id; });
      });
      setSelected(function (prev) {
        return prev.filter(function (id) { return id !== userToDelete.id; });
      });
    }).catch(function (err) {
      console.error(err);
    });
  }

  var openCreateModal = function () {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'student', status: 'Active' });
    setFormErrors({});
    setModalOpen(true);
  };

  var openEditModal = function (user) {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role.charAt(0).toLowerCase() + user.role.slice(1),
      status: user.status,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  var closeModal = function () {
    setModalOpen(false);
    setEditingUser(null);
    setFormErrors({});
  };

  var handleFormChange = function (e) {
    var { name, value } = e.target;
    setFormData(function (prev) { return { ...prev, [name]: value }; });
    setFormErrors(function (prev) { return { ...prev, [name]: '' }; });
  };

  var handleFormSubmit = async function (e) {
    e.preventDefault();
    setFormErrors({});
    setFormSubmitting(true);

    if (!editingUser && !formData.password) {
      setFormErrors({ password: 'Password is required' });
      setFormSubmitting(false);
      return;
    }

    try {
      userSchema.parse(formData);
    } catch (err) {
      var fieldErrors = {};
      err.errors.forEach(function (issue) {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setFormErrors(fieldErrors);
      setFormSubmitting(false);
      return;
    }

    try {
      if (editingUser) {
        var updated = await updateUser(editingUser.id, formData);
        updated.role = updated.role.charAt(0).toUpperCase() + updated.role.slice(1);
        setUsers(function (prev) {
          return prev.map(function (u) {
            return u.id === editingUser.id ? { ...u, ...updated } : u;
          });
        });
      } else {
        var created = await createUser(formData);
        created.role = created.role.charAt(0).toUpperCase() + created.role.slice(1);
        setUsers(function (prev) { return [...prev, created]; });
      }
      closeModal();
    } catch (err) {
      setFormErrors({ form: err.message });
    } finally {
      setFormSubmitting(false);
    }
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
          onClick={openCreateModal}
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

        {loading && (
          <div className="flex items-center justify-center py-[32px] text-[14px] text-[#3e4947]">
            Loading users...
          </div>
        )}
        {!loading && error && (
          <div className="rounded-[12px] border border-[#fca5a5] bg-[#fef2f2] p-[16px] text-[13px] text-[#dc2626]">
            {error}
          </div>
        )}
        {!loading && !error && (
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
                <KebabMenu onDelete={function () { handleDeleteUser(user); }} />
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="rounded-[12px] border border-[#bdc9c6] bg-white p-[24px] text-center text-[13px] text-[#3e4947]">
                No users match this filter.
              </div>
            )}
          </div>
        )}
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
            onClick={openCreateModal}
            className="flex shrink-0 items-center gap-[8px] rounded-[8px] bg-[#005c55] px-[20px] py-[10px] text-[14px] font-semibold text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:bg-[#00473f]"
          >
            <svg className="size-[16px]" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Add New User
          </button>
        </div>

        {loading && (
          <div className="flex w-full items-center justify-center rounded-[12px] border border-[#bdc9c6] bg-white py-[48px] text-[14px] text-[#3e4947]">
            Loading users...
          </div>
        )}
        {!loading && error && (
          <div className="w-full rounded-[12px] border border-[#fca5a5] bg-[#fef2f2] p-[16px] text-[14px] text-[#dc2626]">
            {error}
          </div>
        )}
        {!loading && !error && (
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
                          onClick={() => openEditModal(user)}
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
                        <KebabMenu onDelete={function () { handleDeleteUser(user); }} />
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
                Showing 1 to {filteredUsers.length} of {users.length} users
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
        )}
      </div>

      {/* ===== Modal ===== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative z-10 mx-4 w-full max-w-[440px] rounded-[16px] bg-white p-[24px] shadow-xl">
            <h2 className="mb-[20px] text-[18px] font-bold text-[#111c2d]">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-medium text-[#3e4947]">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full rounded-[8px] border border-[#bdc9c6] bg-[#f9f9ff] px-[12px] py-[9px] text-[14px] text-[#111c2d] outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55]"
                />
                {formErrors.name && (
                  <span className="text-[12px] text-[#dc2626]">{formErrors.name}</span>
                )}
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-medium text-[#3e4947]">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full rounded-[8px] border border-[#bdc9c6] bg-[#f9f9ff] px-[12px] py-[9px] text-[14px] text-[#111c2d] outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55]"
                />
                {formErrors.email && (
                  <span className="text-[12px] text-[#dc2626]">{formErrors.email}</span>
                )}
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-medium text-[#3e4947]">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  placeholder={editingUser ? 'Leave blank to keep current' : 'Enter password'}
                  className="w-full rounded-[8px] border border-[#bdc9c6] bg-[#f9f9ff] px-[12px] py-[9px] text-[14px] text-[#111c2d] outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55]"
                />
                {formErrors.password && (
                  <span className="text-[12px] text-[#dc2626]">{formErrors.password}</span>
                )}
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-medium text-[#3e4947]">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="w-full rounded-[8px] border border-[#bdc9c6] bg-white px-[12px] py-[9px] text-[14px] text-[#3e4947] outline-none focus:border-[#005c55]"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
                {formErrors.role && (
                  <span className="text-[12px] text-[#dc2626]">{formErrors.role}</span>
                )}
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-medium text-[#3e4947]">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full rounded-[8px] border border-[#bdc9c6] bg-white px-[12px] py-[9px] text-[14px] text-[#3e4947] outline-none focus:border-[#005c55]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Offline">Offline</option>
                  <option value="Pending">Pending</option>
                </select>
                {formErrors.status && (
                  <span className="text-[12px] text-[#dc2626]">{formErrors.status}</span>
                )}
              </div>

              {formErrors.form && (
                <div className="rounded-[8px] border border-[#fca5a5] bg-[#fef2f2] p-[10px] text-[13px] text-[#dc2626]">
                  {formErrors.form}
                </div>
              )}

              <div className="flex items-center justify-end gap-[10px] pt-[8px]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-[8px] border border-[#bdc9c6] px-[16px] py-[9px] text-[14px] font-medium text-[#3e4947] hover:bg-[#f9f9ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="rounded-[8px] bg-[#005c55] px-[16px] py-[9px] text-[14px] font-semibold text-white hover:bg-[#00473f] disabled:opacity-60"
                >
                  {formSubmitting ? 'Saving...' : editingUser ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


