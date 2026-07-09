// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';

// Auth
import LoginPage from './pages/LoginPage';

// Student
import StudentDashboard from './pages/StudentDashboard';
import MyCourses from './pages/MyCourses';
import CourseDetail from './pages/CourseDetail';
import Notifications from './pages/Notifications';
import Schedule from './pages/Schedule';
import Grades from './pages/Grades';

// Shared
import Profile from './pages/Profile';

// Instructor
import InstructorDashboard from './pages/InstructorDashboard';
import CourseManagement from './pages/CourseManagement';
import Gradebook from './pages/Gradebook';

// Admin
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public route — no layout, no protection */}
          <Route path="/login" element={<LoginPage />} />

          {/* Everything below shares the sidebar + top bar layout */}
          <Route element={<AppLayout />}>

            {/* Student-only routes */}
            <Route element={<ProtectedRoute role="student" />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/courses" element={<MyCourses />} />
              <Route path="/student/courses/:courseId" element={<CourseDetail />} />
              <Route path="/student/notifications" element={<Notifications />} />
              <Route path="/student/schedule" element={<Schedule />} />
              <Route path="/student/grades" element={<Grades />} />
            </Route>

            {/* Instructor-only routes */}
            <Route element={<ProtectedRoute role="instructor" />}>
              <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
              <Route path="/instructor/courses/:courseId" element={<CourseManagement />} />
              <Route path="/instructor/courses/:courseId/gradebook" element={<Gradebook />} />
            </Route>


            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
            </Route>


            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>

          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}