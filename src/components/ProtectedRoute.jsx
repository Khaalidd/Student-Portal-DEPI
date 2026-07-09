import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ role }) {
  const { user, loading, isLoggedIn } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}/dashboard`} />;
  }

  return <Outlet />;
}