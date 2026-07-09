// AppLayout.jsx
import { Outlet } from 'react-router-dom';
import SideNavBar from './SideNavBar';
import TopAppBar from './TopAppBar';


export default function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <SideNavBar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopAppBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
