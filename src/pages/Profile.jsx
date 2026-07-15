import { updateUser } from "../api/usersApi";
import { useAuth } from "../context/AuthContext";

import { useState } from "react";

var AVATAR_COLORS = [
  "#005c55",
  "#1a73e8",
  "#e8710a",
  "#c5221f",
  "#7b1fa2",
  "#007b83",
  "#d93025",
  "#188038",
];
function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  var hash = 0;
  for (var i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name) {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

var TABS = [
  { id: "personal", label: "Personal Info" },
  { id: "security", label: "Security" },
  { id: "notifications", label: "Notifications" },
  { id: "appearance", label: "Appearance" },
];

function ChevronRight({ active }) {
  return (
    <svg
      className="h-[9px] w-[5.55px] shrink-0"
      viewBox="0 0 6 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1L5 4.5L1 8"
        stroke={active ? "#005c55" : "#3e4947"}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex w-full items-center justify-between gap-4 py-[14px]">
      <div className="flex flex-col items-start gap-[2px]">
        <span className="text-[14px] font-medium leading-[20px] text-[#111c2d]">
          {label}
        </span>
        {description && (
          <span className="text-[12px] leading-[16px] text-[#3e4947]">
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative h-[24px] w-[42px] shrink-0 rounded-full transition-colors ${
          checked ? "bg-[#005c55]" : "bg-[#bdc9c6]"
        }`}
      >
        <span
          className={`absolute top-[2px] h-[20px] w-[20px] rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[20px]" : "translate-x-[2px]"
          }`}
        />
      </button>
    </div>
  );
}

export default function ProfileSettings() {
  var { user } = useAuth();

  var nameParts = user && user.name ? user.name.trim().split(" ") : ["", ""];
  var firstName = nameParts[0] || "";
  var lastName = nameParts.slice(1).join(" ") || "";
  var userEmail = user && user.email ? user.email : "";
  var userPhone = user && user.phone ? user.phone : "";
  var userName = user && user.name ? user.name : "";
  var userRole = user && user.role ? user.role : "";
  var avatarColor = getAvatarColor(userName);
  var initials = getInitials(userName);

  var [activeTab, setActiveTab] = useState("personal");
  var [formData, setFormData] = useState({
    firstName: firstName,
    lastName: lastName,
    email: userEmail,
    phone: userPhone,
  });
  var [saved, setSaved] = useState(false);

  var [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  var [twoFactor, setTwoFactor] = useState(false);
  var [securitySaved, setSecuritySaved] = useState(false);

  var [notifications, setNotifications] = useState({
    grades: true,
    announcements: true,
    schedule: false,
    marketing: false,
  });

  function handleChange(field) {
    return function (e) {
      setFormData(function (prev) {
        return { ...prev, [field]: e.target.value };
      });
      setSaved(false);
    };
  }

  function handleSave(e) {
    e.preventDefault();
    if (!user || !user.id) {
      console.error("No logged-in user ID available");
      return;
    }
    updateUser(user.id, formData)
      .then(function () {
        setSaved(true);
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  function handlePasswordChange(field) {
    return function (e) {
      setPasswordForm(function (prev) {
        return { ...prev, [field]: e.target.value };
      });
      setSecuritySaved(false);
    };
  }

  function handleSecuritySave(e) {
    e.preventDefault();
    // TODO: استبدلها بنداء الـ API بتاعك لتحديث كلمة السر / الـ 2FA
    setSecuritySaved(true);
    setPasswordForm({ current: "", next: "", confirm: "" });
  }

  function toggleNotification(key) {
    return function () {
      setNotifications(function (prev) {
        return { ...prev, [key]: !prev[key] };
      });
    };
  }

  var [mobileFormData, setMobileFormData] = useState({
    firstName: firstName,
    lastName: lastName,
    universityEmail: userEmail,
    personalEmail: "",
    phone: userPhone,
  });
  var [mobileTwoFactor, setMobileTwoFactor] = useState(true);
  var [mobileNotifications, setMobileNotifications] = useState({
    courseAnnouncements: true,
    gradeUpdates: true,
    assignmentDeadline: false,
  });

  function handleMobileChange(field) {
    return function (e) {
      setMobileFormData(function (prev) {
        return { ...prev, [field]: e.target.value };
      });
    };
  }

  function toggleMobileNotification(key) {
    return function () {
      setMobileNotifications(function (prev) {
        return { ...prev, [key]: !prev[key] };
      });
    };
  }

  function handleMobileSave() {
    if (!user || !user.id) {
      console.error("No logged-in user ID available");
      return;
    }
    updateUser(user.id, mobileFormData)
      .then(function () {
        setSaved(true);
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  return (
    <div className="w-full">
      {/* ===== Mobile layout (stacked, single scroll) ===== */}
      <div className="mx-auto flex w-full max-w-[400px] flex-col items-center gap-[20px] px-4 py-6 lg:hidden">
        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-[6px] text-center">
          <div
            className="flex size-[72px] shrink-0 items-center justify-center rounded-full border-4 border-[#f9f9ff] text-[28px] font-bold text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>
          <h1 className="text-[18px] font-bold leading-[24px] text-[#111c2d]">
            {userName}
          </h1>
          <p className="text-[13px] leading-[18px] text-[#3e4947]">
            {userEmail}
          </p>
          <span className="mt-[2px] inline-flex items-center gap-[6px] rounded-full border border-[#bfded9] bg-[#e6f4f1] px-[10px] py-[4px] text-[12px] font-semibold text-[#005c55]">
            <svg className="size-[12px]" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8.5L6.5 12L13 4.5"
                stroke="#005c55"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {capitalize(userRole)}
          </span>
        </div>

        {/* Academic Status */}
        <div className="w-full rounded-[12px] border border-[#bdc9c6] bg-white p-[16px]">
          <h3 className="mb-[10px] text-[11px] font-bold uppercase tracking-[0.6px] text-[#3e4947]">
            Account Info
          </h3>
          <div className="flex flex-col divide-y divide-[#e5e7eb]">
            <div className="flex items-center justify-between py-[8px] text-[13px]">
              <span className="text-[#3e4947]">Role</span>
              <span className="font-semibold text-[#111c2d]">
                {capitalize(userRole)}
              </span>
            </div>
            <div className="flex items-center justify-between py-[8px] text-[13px]">
              <span className="text-[#3e4947]">Email</span>
              <span className="font-semibold text-[#111c2d] truncate ml-2 max-w-[180px]">
                {userEmail}
              </span>
            </div>
            <div className="flex items-center justify-between py-[8px] text-[13px]">
              <span className="text-[#3e4947]">Phone</span>
              <span className="font-semibold text-[#111c2d]">
                {userPhone || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="w-full rounded-[12px] border border-[#bdc9c6] bg-white p-[16px]">
          <div className="mb-[12px] flex items-center gap-[8px]">
            <svg
              className="size-[16px] shrink-0"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM4 17c0-3 2.7-5 6-5s6 2 6 5"
                stroke="#005c55"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="text-[15px] font-semibold text-[#111c2d]">
              Personal Information
            </h3>
          </div>
          <div className="flex flex-col gap-[12px]">
            <div className="flex flex-col gap-[4px]">
              <label className="text-[12px] font-medium text-[#3e4947]">
                First Name
              </label>
              <input
                type="text"
                value={mobileFormData.firstName}
                onChange={handleMobileChange("firstName")}
                className="w-full rounded-[6px] border border-[#bdc9c6] bg-[#f9f9ff] px-[12px] py-[8px] text-[14px] text-[#111c2d] outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55]"
              />
            </div>
            <div className="flex flex-col gap-[4px]">
              <label className="text-[12px] font-medium text-[#3e4947]">
                Last Name
              </label>
              <input
                type="text"
                value={mobileFormData.lastName}
                onChange={handleMobileChange("lastName")}
                className="w-full rounded-[6px] border border-[#bdc9c6] bg-[#f9f9ff] px-[12px] py-[8px] text-[14px] text-[#111c2d] outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55]"
              />
            </div>
            <div className="flex flex-col gap-[4px]">
              <label className="text-[12px] font-medium text-[#3e4947]">
                University Email
              </label>
              <input
                type="email"
                value={mobileFormData.universityEmail}
                disabled
                className="w-full cursor-not-allowed rounded-[6px] border border-[#bdc9c6] bg-[#e7eeff] px-[12px] py-[8px] text-[14px] text-[#3e4947] opacity-70"
              />
              <p className="text-[11px] text-[#3e4947]">
                University emails cannot be changed.
              </p>
            </div>
            <div className="flex flex-col gap-[4px]">
              <label className="text-[12px] font-medium text-[#3e4947]">
                Personal Email
              </label>
              <input
                type="email"
                value={mobileFormData.personalEmail}
                onChange={handleMobileChange("personalEmail")}
                className="w-full rounded-[6px] border border-[#bdc9c6] bg-[#f9f9ff] px-[12px] py-[8px] text-[14px] text-[#111c2d] outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55]"
              />
            </div>
            <div className="flex flex-col gap-[4px]">
              <label className="text-[12px] font-medium text-[#3e4947]">
                Phone Number
              </label>
              <input
                type="tel"
                value={mobileFormData.phone}
                onChange={handleMobileChange("phone")}
                className="w-full rounded-[6px] border border-[#bdc9c6] bg-[#f9f9ff] px-[12px] py-[8px] text-[14px] text-[#111c2d] outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55]"
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="w-full rounded-[12px] border border-[#bdc9c6] bg-white p-[16px]">
          <div className="mb-[12px] flex items-center gap-[8px]">
            <svg
              className="size-[16px] shrink-0"
              viewBox="0 0 20 20"
              fill="none"
            >
              <rect
                x="4"
                y="9"
                width="12"
                height="8"
                rx="2"
                stroke="#005c55"
                strokeWidth="1.6"
              />
              <path
                d="M6.5 9V6.5a3.5 3.5 0 017 0V9"
                stroke="#005c55"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <h3 className="text-[15px] font-semibold text-[#111c2d]">
              Security
            </h3>
          </div>

          <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-[14px]">
            <div className="flex flex-col gap-[2px]">
              <span className="text-[13px] font-medium text-[#111c2d]">
                Password
              </span>
              <span className="text-[11px] text-[#3e4947]">
                Last changed 3 months ago
              </span>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-[8px] border border-[#005c55] px-[12px] py-[6px] text-[12px] font-semibold text-[#005c55] hover:bg-[#e6f4f1]"
            >
              Update Password
            </button>
          </div>

          <div className="pt-[14px]">
            <Toggle
              checked={mobileTwoFactor}
              onChange={function () {
                setMobileTwoFactor(function (prev) {
                  return !prev;
                });
              }}
              label="Two-Factor Authentication"
              description={
                mobileTwoFactor
                  ? "Currently enabled via Authenticator App"
                  : "Currently disabled"
              }
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="w-full rounded-[12px] border border-[#bdc9c6] bg-white p-[16px]">
          <div className="mb-[4px] flex items-center gap-[8px]">
            <svg
              className="size-[16px] shrink-0"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15 14H5l1.2-1.5V9a3.8 3.8 0 013.5-3.8V4a1 1 0 012 0v1.2A3.8 3.8 0 0115 9v3.5L15 14z"
                stroke="#005c55"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 16.5a1.5 1.5 0 003 0"
                stroke="#005c55"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <h3 className="text-[15px] font-semibold text-[#111c2d]">
              Notifications
            </h3>
          </div>
          <div className="flex flex-col divide-y divide-[#e5e7eb]">
            <Toggle
              checked={mobileNotifications.courseAnnouncements}
              onChange={toggleMobileNotification("courseAnnouncements")}
              label="Course Announcements"
              description="Updates from professors and TAs"
            />
            <Toggle
              checked={mobileNotifications.gradeUpdates}
              onChange={toggleMobileNotification("gradeUpdates")}
              label="Grade Updates"
              description="When new grades are posted"
            />
            <Toggle
              checked={mobileNotifications.assignmentDeadline}
              onChange={toggleMobileNotification("assignmentDeadline")}
              label="Assignment Deadline"
              description="24 hour reminder before due dates"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex w-full items-center gap-[12px] pb-[8px] pt-[4px]">
          <button
            type="button"
            className="flex-1 rounded-[8px] border border-[#bdc9c6] bg-white px-[16px] py-[10px] text-[14px] font-semibold text-[#3e4947] hover:bg-[#f9f9ff]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleMobileSave}
            className="flex-1 rounded-[8px] bg-[#005c55] px-[16px] py-[10px] text-[14px] font-semibold text-white hover:bg-[#00473f]"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* ===== Desktop / tablet layout (tabs) ===== */}
      <div className="hidden w-full max-w-[1280px] flex-col items-start gap-[24px] lg:flex">
        {/* Header */}
        <div className="flex w-full flex-col items-start gap-[8px]">
          <h1 className="w-full text-[36px] font-bold leading-[44px] tracking-[-0.72px] text-[#111c2d]">
            Profile &amp; Settings
          </h1>
          <p className="w-full text-[16px] leading-[24px] text-[#3e4947]">
            Manage your account preferences and personal information.
          </p>
        </div>

        {/* Settings Layout */}
        <div className="flex w-full flex-col items-start gap-[24px] lg:flex-row">
          {/* Settings Sidebar (in-page tabs, not the app sidebar) */}
          <div className="w-full shrink-0 rounded-[12px] border border-[#bdc9c6] bg-white p-[13px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] lg:w-[256px]">
            <nav className="flex w-full flex-col items-start gap-[8px]">
              {TABS.map(function (tab) {
                var isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={function () {
                      setActiveTab(tab.id);
                    }}
                    className={`flex w-full items-center justify-between rounded-[8px] px-[16px] py-[12px] text-left text-[14px] leading-[20px] tracking-[0.14px] transition-colors ${
                      isActive
                        ? "bg-[#dee8ff] font-bold text-[#005c55]"
                        : "font-medium text-[#3e4947] hover:bg-[#f9f9ff]"
                    }`}
                  >
                    {tab.label}
                    <ChevronRight active={isActive} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex min-w-0 flex-1 flex-col items-start gap-[24px]">
            {activeTab === "personal" && (
              <>
                {/* Profile Header Card */}
                <div className="flex w-full flex-col items-center gap-[24px] rounded-[12px] border border-[#bdc9c6] bg-white p-[25px] text-center drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:flex-row sm:items-start sm:text-left">
                  <div className="relative size-[128px] shrink-0 rounded-full border-4 border-[#f9f9ff] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                    <div
                      className="flex size-full items-center justify-center rounded-full text-[48px] font-bold text-white"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {initials}
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col items-start gap-[8px]">
                    <h2 className="w-full text-[24px] font-bold leading-[32px] tracking-[-0.24px] text-[#111c2d]">
                      {userName}
                    </h2>
                    <p className="w-full text-[16px] leading-[24px] text-[#005c55]">
                      {userEmail}
                    </p>
                    <div className="flex w-full flex-wrap items-start justify-center gap-[16px] whitespace-nowrap pt-[8px] sm:justify-start">
                      <div className="flex shrink-0 flex-col items-start gap-[4px] self-stretch rounded-[8px] border border-[#bdc9c6] bg-[#e7eeff] px-[17px] py-[9px]">
                        <span className="text-[12px] font-semibold uppercase leading-[16px] tracking-[0.6px] text-[#3e4947]">
                          Email
                        </span>
                        <span className="text-[16px] font-medium leading-[24px] text-[#111c2d] truncate max-w-[220px]">
                          {userEmail}
                        </span>
                      </div>
                      <div className="flex shrink-0 flex-col items-start gap-[4px] self-stretch rounded-[8px] border border-[#bdc9c6] bg-[#e7eeff] px-[17px] py-[9px]">
                        <span className="text-[12px] font-semibold uppercase leading-[16px] tracking-[0.6px] text-[#3e4947]">
                          Role
                        </span>
                        <span className="text-[16px] font-medium leading-[24px] text-[#111c2d]">
                          {capitalize(userRole)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Section: Personal Info */}
                <form
                  onSubmit={handleSave}
                  className="flex w-full flex-col items-start overflow-hidden rounded-[12px] border border-[#bdc9c6] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex w-full flex-col items-start gap-[4px] border-b border-[#bdc9c6] bg-[#f9f9ff] px-[24px] pb-[17px] pt-[16px]">
                    <h3 className="w-full text-[20px] font-semibold leading-[30px] text-[#111c2d]">
                      Basic Information
                    </h3>
                    <p className="w-full text-[12px] font-semibold leading-[16px] text-[#3e4947]">
                      Update your contact details and bio.
                    </p>
                  </div>

                  <div className="grid w-full grid-cols-1 gap-x-[16px] gap-y-[16px] p-[24px] sm:grid-cols-2">
                    <div className="flex flex-col items-start gap-[8px]">
                      <label className="text-[14px] font-medium leading-[20px] tracking-[0.14px] text-[#3e4947]">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange("firstName")}
                        className="w-full rounded-[6px] border border-[#bdc9c6] bg-[#f9f9ff] px-[13px] py-[9px] text-[16px] leading-[24px] text-[#111c2d] outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55]"
                      />
                    </div>

                    <div className="flex flex-col items-start gap-[8px]">
                      <label className="text-[14px] font-medium leading-[20px] tracking-[0.14px] text-[#3e4947]">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange("lastName")}
                        className="w-full rounded-[6px] border border-[#bdc9c6] bg-[#f9f9ff] px-[13px] py-[9px] text-[16px] leading-[24px] text-[#111c2d] outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55]"
                      />
                    </div>

                    <div className="flex flex-col items-start gap-[8px] sm:col-span-2">
                      <label className="text-[14px] font-medium leading-[20px] tracking-[0.14px] text-[#3e4947]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full cursor-not-allowed rounded-[6px] border border-[#bdc9c6] bg-[#e7eeff] px-[13px] py-[9px] text-[16px] leading-[24px] text-[#3e4947] opacity-70"
                      />
                      <p className="pt-[4px] text-[12px] font-semibold leading-[16px] text-[#3e4947]">
                        Contact IT support to change your institutional email.
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-[8px] sm:col-span-2">
                      <label className="text-[14px] font-medium leading-[20px] tracking-[0.14px] text-[#3e4947]">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange("phone")}
                        className="w-full rounded-[6px] border border-[#bdc9c6] bg-[#f9f9ff] px-[13px] py-[9px] text-[16px] leading-[24px] text-[#111c2d] outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55]"
                      />
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-end gap-3 border-t border-[#bdc9c6] bg-[#f9f9ff] px-[24px] pb-[16px] pt-[17px]">
                    {saved && (
                      <span className="text-[12px] font-semibold text-[#005c55]">
                        Changes saved
                      </span>
                    )}
                    <button
                      type="submit"
                      className="rounded-[8px] bg-[#005c55] px-[24px] py-[8px] text-[14px] font-medium leading-[20px] tracking-[0.14px] text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:bg-[#00473f]"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </>
            )}

            {activeTab === "security" && (
              <>
                {/* Password form */}
                <form
                  onSubmit={handleSecuritySave}
                  className="flex w-full flex-col items-start overflow-hidden rounded-[12px] border border-[#bdc9c6] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex w-full flex-col items-start gap-[4px] border-b border-[#bdc9c6] bg-[#f9f9ff] px-[24px] pb-[17px] pt-[16px]">
                    <h3 className="w-full text-[20px] font-semibold leading-[30px] text-[#111c2d]">
                      Change Password
                    </h3>
                    <p className="w-full text-[12px] font-semibold leading-[16px] text-[#3e4947]">
                      Choose a strong password you haven't used before.
                    </p>
                  </div>

                  <div className="grid w-full grid-cols-1 gap-x-[16px] gap-y-[16px] p-[24px] sm:grid-cols-2">
                    <div className="flex flex-col items-start gap-[8px] sm:col-span-2">
                      <label className="text-[14px] font-medium leading-[20px] tracking-[0.14px] text-[#3e4947]">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.current}
                        onChange={handlePasswordChange("current")}
                        placeholder="••••••••"
                        className="w-full rounded-[6px] border border-[#bdc9c6] bg-[#f9f9ff] px-[13px] py-[9px] text-[16px] leading-[24px] text-[#111c2d] outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55]"
                      />
                    </div>

                    <div className="flex flex-col items-start gap-[8px]">
                      <label className="text-[14px] font-medium leading-[20px] tracking-[0.14px] text-[#3e4947]">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.next}
                        onChange={handlePasswordChange("next")}
                        placeholder="••••••••"
                        className="w-full rounded-[6px] border border-[#bdc9c6] bg-[#f9f9ff] px-[13px] py-[9px] text-[16px] leading-[24px] text-[#111c2d] outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55]"
                      />
                    </div>

                    <div className="flex flex-col items-start gap-[8px]">
                      <label className="text-[14px] font-medium leading-[20px] tracking-[0.14px] text-[#3e4947]">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirm}
                        onChange={handlePasswordChange("confirm")}
                        placeholder="••••••••"
                        className="w-full rounded-[6px] border border-[#bdc9c6] bg-[#f9f9ff] px-[13px] py-[9px] text-[16px] leading-[24px] text-[#111c2d] outline-none focus:border-[#005c55] focus:ring-1 focus:ring-[#005c55]"
                      />
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-end gap-3 border-t border-[#bdc9c6] bg-[#f9f9ff] px-[24px] pb-[16px] pt-[17px]">
                    {securitySaved && (
                      <span className="text-[12px] font-semibold text-[#005c55]">
                        Password updated
                      </span>
                    )}
                    <button
                      type="submit"
                      className="rounded-[8px] bg-[#005c55] px-[24px] py-[8px] text-[14px] font-medium leading-[20px] tracking-[0.14px] text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:bg-[#00473f]"
                    >
                      Update Password
                    </button>
                  </div>
                </form>

                {/* Two-factor authentication */}
                <div className="flex w-full flex-col items-start overflow-hidden rounded-[12px] border border-[#bdc9c6] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                  <div className="flex w-full flex-col items-start gap-[4px] border-b border-[#bdc9c6] bg-[#f9f9ff] px-[24px] pb-[17px] pt-[16px]">
                    <h3 className="w-full text-[20px] font-semibold leading-[30px] text-[#111c2d]">
                      Two-Factor Authentication
                    </h3>
                    <p className="w-full text-[12px] font-semibold leading-[16px] text-[#3e4947]">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <div className="w-full px-[24px] py-[8px]">
                    <Toggle
                      checked={twoFactor}
                      onChange={function () {
                        setTwoFactor(function (prev) {
                          return !prev;
                        });
                      }}
                      label="Enable two-factor authentication"
                      description="Get a verification code by SMS each time you sign in."
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "notifications" && (
              <div className="flex w-full flex-col items-start overflow-hidden rounded-[12px] border border-[#bdc9c6] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                <div className="flex w-full flex-col items-start gap-[4px] border-b border-[#bdc9c6] bg-[#f9f9ff] px-[24px] pb-[17px] pt-[16px]">
                  <h3 className="w-full text-[20px] font-semibold leading-[30px] text-[#111c2d]">
                    Notification Preferences
                  </h3>
                  <p className="w-full text-[12px] font-semibold leading-[16px] text-[#3e4947]">
                    Choose what you want to be notified about.
                  </p>
                </div>
                <div className="flex w-full flex-col items-start divide-y divide-[#e5e7eb] px-[24px]">
                  <Toggle
                    checked={notifications.grades}
                    onChange={toggleNotification("grades")}
                    label="Grade updates"
                    description="Get notified when a new grade is posted."
                  />
                  <Toggle
                    checked={notifications.announcements}
                    onChange={toggleNotification("announcements")}
                    label="Course announcements"
                    description="Updates from instructors about your courses."
                  />
                  <Toggle
                    checked={notifications.schedule}
                    onChange={toggleNotification("schedule")}
                    label="Schedule changes"
                    description="Room or time changes for your classes."
                  />
                  <Toggle
                    checked={notifications.marketing}
                    onChange={toggleNotification("marketing")}
                    label="Campus news & offers"
                    description="Occasional emails about campus events."
                  />
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="w-full rounded-[12px] border border-[#bdc9c6] bg-white p-8 text-center text-[14px] text-[#3e4947]">
                Appearance settings go here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
