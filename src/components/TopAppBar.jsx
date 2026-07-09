import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopAppBar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-gray-150 bg-white px-4 md:px-6 shrink-0 relative">
      {/* Left side: Hamburger (Mobile) / Search (Desktop) */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 md:hidden"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Search bar */}
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 w-64 lg:w-80">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search courses, files..."
            className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-hidden"
          />
        </div>
      </div>

      {/* Center Logo: Mobile Only */}
      <div className="md:hidden flex items-center justify-center absolute left-1/2 -translate-x-1/2">
        <span className="text-base font-bold text-teal-600">EduPortal</span>
      </div>

      {/* Right side: Notifications, Grid icon, Profile dropdown */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notification Bell */}
        <button className="relative rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Grid Icon (Desktop Only) */}
        <button className="hidden md:block rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
          </svg>
        </button>

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 focus:outline-hidden"
          >
            <div className="h-8 w-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs hover:ring-2 hover:ring-teal-200 transition-all">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
            </div>
          </button>

          {dropdownOpen && (
            <>
              {/* Overlay transparent to close dropdown */}
              <div onClick={() => setDropdownOpen(false)} className="fixed inset-0 z-10" />
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-150 bg-white py-1 shadow-md z-20">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-800">{user?.name || 'Guest User'}</p>
                  <p className="text-[10px] text-gray-400 capitalize">{user?.role || 'Guest'}</p>
                </div>
                
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/profile');
                  }}
                  className="flex w-full items-center px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50"
                >
                  My Profile
                </button>
                
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 border-t border-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}