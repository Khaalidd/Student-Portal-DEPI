// Notifications.jsx
import { useState } from 'react';

// All the categories shown in the filter panel on the left.
// "count" is just the number badge next to each category name.
const CATEGORIES = [
  { id: 'all', label: 'All Updates', count: 12 },
  { id: 'academic', label: 'Academic', count: 5 },
  { id: 'events', label: 'Campus Events', count: 4 },
  { id: 'system', label: 'System', count: 3 },
];

// Each notification knows which day it belongs to ("Today" / "Yesterday"),
// which category it belongs to (must match a CATEGORIES id above),
// and a "type" that controls its color (urgent, success, system, event).
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    day: 'Today',
    categoryId: 'academic',
    type: 'urgent',
    sourceLabel: 'Academic • Computer Science 301',
    title: 'Missing Assignment: Final Project Draft',
    description:
      "Your submission for 'Final Project Draft' is past due. Late penalty of 10% per day will be applied. Please submit immediately.",
    time: '2h ago',
    actionLabel: 'Submit Now',
    read: false,
  },
  {
    id: 2,
    day: 'Today',
    categoryId: 'academic',
    type: 'success',
    sourceLabel: 'Academic • History 101',
    title: 'New Grade Posted: Midterm Essay',
    description: "Prof. Anderson has graded your submission 'Midterm Essay'.",
    time: '5h ago',
    read: false,
  },
  {
    id: 3,
    day: 'Today',
    categoryId: 'system',
    type: 'system',
    sourceLabel: 'System Update',
    title: 'Scheduled Maintenance',
    description:
      'EduPortal will be down for scheduled maintenance on Sunday, Oct 15th from 2:00 AM to 4:00 AM EST.',
    time: '8h ago',
    read: true,
  },
  {
    id: 4,
    day: 'Yesterday',
    categoryId: 'events',
    type: 'event',
    sourceLabel: 'Campus Event',
    title: 'Career Fair Registration Open',
    description:
      'Register now for the Fall Career Fair in the Student Union building. Over 50 companies attending.',
    time: 'Yesterday',
    read: true,
  },
];

// Colors for each notification "type". Keeping this in one place means
// if you want to change the urgent color later, you only change it here.
const TYPE_STYLES = {
  urgent: {
    iconBg: 'bg-rose-100',
    iconText: 'text-rose-600',
    badgeBg: 'bg-rose-600',
    badgeText: 'text-white',
    leftBorder: 'border-l-rose-600',
  },
  success: {
    iconBg: 'bg-teal-100',
    iconText: 'text-teal-700',
    badgeBg: 'bg-teal-700',
    badgeText: 'text-teal-50',
    leftBorder: 'border-l-teal-700',
  },
  system: {
    iconBg: 'bg-gray-100',
    iconText: 'text-gray-600',
    badgeBg: 'bg-gray-500',
    badgeText: 'text-white',
    leftBorder: 'border-l-gray-400',
  },
  event: {
    iconBg: 'bg-indigo-100',
    iconText: 'text-indigo-600',
    badgeBg: 'bg-indigo-600',
    badgeText: 'text-white',
    leftBorder: 'border-l-indigo-600',
  },
};

// One notification card. Kept as its own function so we don't repeat
// the same markup 4+ times inside the main component below.
function NotificationCard({ notification }) {
  const styles = TYPE_STYLES[notification.type];

  // Unread notifications get a solid color bar on the left.
  // Read notifications get a faded/transparent bar and slightly lower opacity.
  const leftBorderClass = notification.read ? 'border-l-transparent' : styles.leftBorder;
  const cardOpacityClass = notification.read ? 'opacity-80' : 'opacity-100';

  return (
    <div
      className={`flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm border-l-4 ${leftBorderClass} ${cardOpacityClass}`}
    >
      {/* Round icon on the left */}
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconText} font-semibold`}>
        {notification.type === 'urgent' && '!'}
        {notification.type === 'success' && '✓'}
        {notification.type === 'system' && 'i'}
        {notification.type === 'event' && '★'}
      </div>

      {/* Main text content */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          {notification.type === 'urgent' && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide ${styles.badgeBg} ${styles.badgeText}`}>
              URGENT
            </span>
          )}
          <span className="text-xs font-semibold text-gray-600">{notification.sourceLabel}</span>
        </div>

        <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
          {notification.title}
        </h3>

        <p className="mt-1 text-sm text-gray-600">{notification.description}</p>

        {notification.actionLabel && (
          <button className="mt-3 rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900">
            {notification.actionLabel}
          </button>
        )}
      </div>

      {/* Time, shown on its own on the right on larger screens */}
      <div className="hidden shrink-0 text-xs font-bold text-teal-800 sm:block">
        {notification.time}
      </div>
    </div>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // How many urgent + unread notifications there are, for the subtitle text.
  const unreadUrgentCount = notifications.filter(
    (n) => n.type === 'urgent' && !n.read
  ).length;

  function handleMarkAllAsRead() {
    const updatedNotifications = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
  }

  // If "All Updates" is selected, show everything. Otherwise only show
  // notifications whose categoryId matches the selected category.
  const visibleNotifications =
    selectedCategory === 'all'
      ? notifications
      : notifications.filter((n) => n.categoryId === selectedCategory);

  const todayNotifications = visibleNotifications.filter((n) => n.day === 'Today');
  const yesterdayNotifications = visibleNotifications.filter((n) => n.day === 'Yesterday');

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Inbox</h1>
          <p className="text-sm text-gray-600 sm:text-base">
            You have {unreadUrgentCount} unread urgent notification{unreadUrgentCount === 1 ? '' : 's'}.
          </p>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          className="self-start rounded-lg border border-teal-800 px-4 py-2 text-sm font-medium text-teal-800 hover:bg-teal-50 sm:self-auto"
        >
          Mark all as read
        </button>
      </div>

      {/* Categories + notifications list.
          On mobile these stack (flex-col). On large screens they sit side by side (lg:flex-row). */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Categories panel */}
        <div className="rounded-xl border border-gray-200 bg-white p-3 lg:w-64 lg:shrink-0">
          <h2 className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Categories
          </h2>
          {/* Horizontal scrolling row on mobile, vertical list on large screens */}
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {CATEGORIES.map((category) => {
              const isActive = category.id === selectedCategory;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap
                    ${isActive ? 'bg-teal-50 text-teal-800' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>{category.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium
                      ${isActive ? 'bg-teal-700 text-teal-50' : 'bg-gray-200 text-gray-600'}`}
                  >
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex flex-1 flex-col gap-4">
          {todayNotifications.length > 0 && (
            <div>
              <h2 className="mb-2 border-b border-gray-200 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Today
              </h2>
              <div className="flex flex-col gap-3">
                {todayNotifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            </div>
          )}

          {yesterdayNotifications.length > 0 && (
            <div>
              <h2 className="mb-2 border-b border-gray-200 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Yesterday
              </h2>
              <div className="flex flex-col gap-3">
                {yesterdayNotifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            </div>
          )}

          {visibleNotifications.length === 0 && (
            <p className="text-sm text-gray-500">No notifications in this category.</p>
          )}
        </div>
      </div>
    </div>
  );
}