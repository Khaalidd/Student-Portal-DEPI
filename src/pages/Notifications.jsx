// Notifications.jsx
import { useState, useEffect } from 'react';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../api/notificationsApi';
import { useAuth } from '../context/AuthContext';

// Categories are static UI filters, not fetched data.
const CATEGORIES = [
  { id: 'all', label: 'All Updates' },
  { id: 'academic', label: 'Academic' },
  { id: 'events', label: 'Campus Events' },
  { id: 'system', label: 'System' },
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
function NotificationCard({ notification, onMarkAsRead }) {
  const styles = TYPE_STYLES[notification.type];

  // Unread notifications get a solid color bar on the left.
  // Read notifications get a faded/transparent bar and slightly lower opacity.
  const leftBorderClass = notification.read ? 'border-l-transparent' : styles.leftBorder;
  const cardOpacityClass = notification.read ? 'opacity-80' : 'opacity-100';
  const interactiveStyles = !notification.read ? 'cursor-pointer hover:bg-teal-50/10 hover:shadow-md transition-all duration-200' : '';

  return (
    <div
      onClick={function () {
        if (!notification.read && onMarkAsRead) {
          onMarkAsRead(notification.id);
        }
      }}
      className={`flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm border-l-4 ${leftBorderClass} ${cardOpacityClass} ${interactiveStyles}`}
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
          <span className="text-xs font-semibold text-gray-600">{notification.source_label}</span>
        </div>

        <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
          {notification.title}
        </h3>

        <p className="mt-1 text-sm text-gray-600">{notification.description}</p>

        {notification.action_label && (
          <button className="mt-3 rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900">
            {notification.action_label}
          </button>
        )}
      </div>

      {/* Time, shown on its own on the right on larger screens */}
      <div className="hidden shrink-0 text-xs font-bold text-teal-800 sm:block">
        {notification.time_label}
      </div>
    </div>
  );
}

export default function Notifications() {
  var { user } = useAuth();
  var [notifications, setNotifications] = useState([]);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState('');
  var [selectedCategory, setSelectedCategory] = useState('all');

  const fetchNotifs = function () {
    getNotifications(user ? user.id : null)
      .then(function (data) {
        setNotifications(data);
        setError('');
      })
      .catch(function (err) {
        setError(err.message);
      });
  };

  // Fetch notifications on mount, filtered by the logged-in user
  useEffect(function fetchNotifications() {
    setLoading(true);
    getNotifications(user ? user.id : null)
      .then(function (data) {
        setNotifications(data);
        setError('');
      })
      .catch(function (err) {
        setError(err.message);
      })
      .finally(function () {
        setLoading(false);
      });
  }, [user && user.id]);

  useEffect(function () {
    window.addEventListener('notifications-updated', fetchNotifs);
    return function () {
      window.removeEventListener('notifications-updated', fetchNotifs);
    };
  }, [user && user.id]);

  // Compute category counts from the actual fetched data
  const categoryCounts = {};
  for (var i = 0; i < notifications.length; i++) {
    var catId = notifications[i].category_id;
    categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
  }

  var categoriesWithCounts = CATEGORIES.map(function (cat) {
    var count = cat.id === 'all' ? notifications.length : (categoryCounts[cat.id] || 0);
    return { id: cat.id, label: cat.label, count: count };
  });

  // How many urgent + unread notifications there are, for the subtitle text.
  var unreadUrgentCount = notifications.filter(
    function (n) { return n.type === 'urgent' && !n.read; }
  ).length;

  async function handleMarkAsRead(id) {
    try {
      await markNotificationRead(id);
      setNotifications(function (prev) {
        return prev.map(function (n) {
          if (n.id === id) {
            return { ...n, read: true };
          }
          return n;
        });
      });
      window.dispatchEvent(new CustomEvent('notifications-updated'));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllNotificationsRead(user ? user.id : null);
      setNotifications(function (prev) {
        return prev.map(function (n) { return { ...n, read: true }; });
      });
      window.dispatchEvent(new CustomEvent('notifications-updated'));
    } catch (err) {
      setError(err.message);
    }
  }

  // If "All Updates" is selected, show everything. Otherwise only show
  // notifications whose category_id matches the selected category.
  var visibleNotifications =
    selectedCategory === 'all'
      ? notifications
      : notifications.filter(function (n) { return n.category_id === selectedCategory; });

  var todayNotifications = visibleNotifications.filter(function (n) { return n.day === 'Today'; });
  var yesterdayNotifications = visibleNotifications.filter(function (n) { return n.day === 'Yesterday'; });

  if (loading) {
    return <p className="text-sm text-gray-500">Loading notifications...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">Error: {error}</p>;
  }

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
            {categoriesWithCounts.map(function (category) {
              var isActive = category.id === selectedCategory;
              return (
                <button
                  key={category.id}
                  onClick={function () { setSelectedCategory(category.id); }}
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
                {todayNotifications.map(function (notification) {
                  return <NotificationCard key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />;
                })}
              </div>
            </div>
          )}

          {yesterdayNotifications.length > 0 && (
            <div>
              <h2 className="mb-2 border-b border-gray-200 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Yesterday
              </h2>
              <div className="flex flex-col gap-3">
                {yesterdayNotifications.map(function (notification) {
                  return <NotificationCard key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />;
                })}
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