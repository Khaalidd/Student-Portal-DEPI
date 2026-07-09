// SideNavBar.jsx — placeholder, real nav links/design come later.
import { useAuth } from '../context/AuthContext';

export default function SideNavBar() {
  const { user } = useAuth();

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white p-4">
      <div className="mb-6 text-lg font-semibold">Student Portal</div>
      <div className="text-sm text-gray-500">Nav links for role: {user?.role}</div>
    </aside>
  );
}