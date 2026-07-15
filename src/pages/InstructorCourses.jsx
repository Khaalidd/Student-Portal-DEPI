import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllCourses } from '../api/coursesApi';
import { supabase } from '../lib/supabaseClient';

const COURSE_BANNERS = {
  'computer-science': (
    <svg className="w-full h-32 bg-gradient-to-r from-teal-700 to-cyan-900" viewBox="0 0 400 120" fill="none">
      <circle cx="200" cy="30" r="8" fill="#5EEAD4" />
      <circle cx="150" cy="70" r="8" fill="#2DD4BF" />
      <circle cx="250" cy="70" r="8" fill="#2DD4BF" />
      <circle cx="120" cy="105" r="6" fill="#0D9488" />
      <circle cx="180" cy="105" r="6" fill="#0D9488" />
      <line x1="200" y1="38" x2="150" y2="62" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
      <line x1="200" y1="38" x2="250" y2="62" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
      <line x1="150" y1="78" x2="120" y2="97" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />
      <line x1="150" y1="78" x2="180" y2="97" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />
      <path d="M20 20 L60 20 L60 60" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
      <circle cx="340" cy="40" r="20" stroke="#5EEAD4" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
    </svg>
  ),
  'mathematics': (
    <svg className="w-full h-32 bg-gradient-to-r from-blue-700 to-indigo-900" viewBox="0 0 400 120" fill="none">
      <path d="M 0 60 Q 50 20 100 60 T 200 60 T 300 60 T 400 60" stroke="#93C5FD" strokeWidth="3" fill="none" opacity="0.4" />
      <path d="M 0 60 Q 50 100 100 60 T 200 60 T 300 60 T 400 60" stroke="#60A5FA" strokeWidth="1.5" fill="none" opacity="0.2" />
      <circle cx="100" cy="60" r="4" fill="#60A5FA" />
      <circle cx="200" cy="60" r="4" fill="#60A5FA" />
      <circle cx="300" cy="60" r="4" fill="#60A5FA" />
      <line x1="200" y1="10" x2="200" y2="110" stroke="#ffffff" strokeWidth="1" opacity="0.2" strokeDasharray="4 4" />
      <line x1="10" y1="60" x2="390" y2="60" stroke="#ffffff" strokeWidth="1" opacity="0.2" strokeDasharray="4 4" />
    </svg>
  ),
  'physics': (
    <svg className="w-full h-32 bg-gradient-to-r from-slate-700 to-slate-900" viewBox="0 0 400 120" fill="none">
      <ellipse cx="200" cy="60" rx="90" ry="25" stroke="#94A3B8" strokeWidth="1.5" transform="rotate(-30 200 60)" opacity="0.3" />
      <ellipse cx="200" cy="60" rx="90" ry="25" stroke="#94A3B8" strokeWidth="1.5" transform="rotate(30 200 60)" opacity="0.3" />
      <ellipse cx="200" cy="60" rx="90" ry="10" stroke="#CBD5E1" strokeWidth="1" opacity="0.2" />
      <circle cx="200" cy="60" r="12" fill="#E2E8F0" opacity="0.9" />
      <circle cx="120" cy="40" r="4" fill="#38BDF8" />
      <circle cx="280" cy="80" r="4" fill="#38BDF8" />
    </svg>
  ),
};

export default function InstructorCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCourses() {
      if (!user || !user.id) return;
      setLoading(true);
      setError(null);

      try {
        const allCourses = await getAllCourses();
        if (cancelled) return;

        const instructorCourses = allCourses.filter((c) => c.instructor_id === user.id);

        const courseQueries = instructorCourses.map((c) =>
          Promise.all([
            supabase.from('course_students').select('*', { count: 'exact', head: true }).eq('course_id', c.id),
            supabase.from('gradebook_entries').select('overall').eq('course_id', c.id),
          ])
        );

        const courseStats = await Promise.all(courseQueries);

        if (cancelled) return;

        const mappedCourses = instructorCourses.map((c, idx) => {
          const studentResult = courseStats[idx][0];
          const gradeResult = courseStats[idx][1];

          const studentCount = studentResult && !studentResult.error ? studentResult.count || 0 : 0;
          const grades = gradeResult && !gradeResult.error && gradeResult.data ? gradeResult.data : [];

          let avgGrade = 'N/A';
          if (grades.length > 0) {
            let sum = 0;
            let validCount = 0;
            for (let g of grades) {
              if (g.overall && g.overall !== '--' && g.overall !== 'EXC') {
                const num = parseFloat(g.overall);
                if (!isNaN(num)) {
                  sum += num;
                  validCount++;
                }
              }
            }
            if (validCount > 0) {
              avgGrade = (sum / validCount).toFixed(1) + '%';
            }
          }

          // Randomize banner based on course ID length just to have varied styles
          const bannerKeys = Object.keys(COURSE_BANNERS);
          const banner_key = bannerKeys[c.id.length % bannerKeys.length];

          return {
            id: c.id,
            title: c.title,
            description: c.description || 'No description provided.',
            term: c.term || 'Ongoing',
            students: studentCount,
            avgGrade,
            banner_key,
          };
        });

        setCourses(mappedCourses);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCourses();

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Loading your courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-sm">Failed to load courses: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">My Courses</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your assigned courses, students, and grades.</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200 border-dashed p-12 text-center">
          <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">You have not been assigned as an instructor to any courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/instructor/courses/${course.id}`}
              className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-teal-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              {/* Banner Image Area */}
              <div className="relative h-32 w-full overflow-hidden bg-gray-100">
                <div className="absolute inset-0 transform group-hover:scale-105 transition-transform duration-500">
                  {COURSE_BANNERS[course.banner_key] || COURSE_BANNERS['computer-science']}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border border-white/20">
                  <span className="text-xs font-semibold text-gray-700">{course.term}</span>
                </div>
              </div>

              {/* Card Content Area */}
              <div className="flex-1 flex flex-col p-5">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold tracking-wider text-teal-600 uppercase bg-teal-50 px-2 py-1 rounded-md">
                      {course.id.toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="text-[17px] font-bold text-gray-900 leading-tight mb-2 group-hover:text-teal-700 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {course.description}
                  </p>
                </div>

                {/* Footer Metrics */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1">Enrolled</span>
                    <div className="flex items-center gap-1.5 text-gray-900">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="font-semibold text-sm">{course.students}</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1">Avg Grade</span>
                    <div className="flex items-center gap-1.5 text-gray-900">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold text-sm">{course.avgGrade}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
