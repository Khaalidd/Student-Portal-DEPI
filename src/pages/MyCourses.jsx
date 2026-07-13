import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyCourses() {
  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState('Fall 2024');

  const courses = [
    {
      code: 'CS301',
      title: 'Data Structures & Algorithms',
      description: 'Fundamental concepts of programming, trees, graphs, and hash tables. CS301 focuses on practical implementation and complexity analysis.',
      instructor: 'Prof. Alan Turing',
      progress: 75,
      term: 'Fall 2024',
      statusText: '1 Assignment Due',
      statusType: 'warning',
      // SVG banner for Computer Science (Binary tree / nodes theme)
      banner: (
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
      )
    },
    {
      code: 'MAT201',
      title: 'Calculus II & Linear Algebra',
      description: 'Techniques of integration, sequences, and infinite series. CS301 focuses on practical implementation and Big-O complexity analysis.',
      instructor: 'Dr. Katherine Johnson',
      progress: 72,
      term: 'Fall 2024',
      statusText: 'All caught up',
      statusType: 'success',
      // SVG banner for Math (Geometric wave theme)
      banner: (
        <svg className="w-full h-32 bg-gradient-to-r from-blue-700 to-indigo-900" viewBox="0 0 400 120" fill="none">
          <path d="M 0 60 Q 50 20 100 60 T 200 60 T 300 60 T 400 60" stroke="#93C5FD" strokeWidth="3" fill="none" opacity="0.4" />
          <path d="M 0 60 Q 50 100 100 60 T 200 60 T 300 60 T 400 60" stroke="#60A5FA" strokeWidth="1.5" fill="none" opacity="0.2" />
          <circle cx="100" cy="60" r="4" fill="#60A5FA" />
          <circle cx="200" cy="60" r="4" fill="#60A5FA" />
          <circle cx="300" cy="60" r="4" fill="#60A5FA" />
          <line x1="200" y1="10" x2="200" y2="110" stroke="#ffffff" strokeWidth="1" opacity="0.2" strokeDasharray="4 4" />
          <line x1="10" y1="60" x2="390" y2="60" stroke="#ffffff" strokeWidth="1" opacity="0.2" strokeDasharray="4 4" />
        </svg>
      )
    },
    {
      code: 'PHY105',
      title: 'General Physics & Quantum Mechanics',
      description: 'Mechanics, heat, sound, and quantum physics foundations. Includes laboratory experiments and simulation analyses.',
      instructor: 'Prof. Richard Feynman',
      progress: 15,
      term: 'Fall 2024',
      statusText: 'Next class in 2h',
      statusType: 'info',
      // SVG banner for Physics (Atomic orbit theme)
      banner: (
        <svg className="w-full h-32 bg-gradient-to-r from-slate-700 to-slate-900" viewBox="0 0 400 120" fill="none">
          <ellipse cx="200" cy="60" rx="90" ry="25" stroke="#94A3B8" strokeWidth="1.5" transform="rotate(-30 200 60)" opacity="0.3" />
          <ellipse cx="200" cy="60" rx="90" ry="25" stroke="#94A3B8" strokeWidth="1.5" transform="rotate(30 200 60)" opacity="0.3" />
          <ellipse cx="200" cy="60" rx="90" ry="10" stroke="#CBD5E1" strokeWidth="1" opacity="0.2" />
          <circle cx="200" cy="60" r="12" fill="#E2E8F0" opacity="0.9" />
          <circle cx="120" cy="40" r="4" fill="#38BDF8" />
          <circle cx="280" cy="80" r="4" fill="#38BDF8" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">My Courses</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            <span className="hidden md:inline">Manage and track your enrolled courses for the current semester.</span>
            <span className="md:hidden">Manage your active semester enrollment.</span>
          </p>
        </div>

        {/* Semester selector (Desktop only dropdown styled like screenshot) */}
        <div className="relative self-start sm:self-auto">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-semibold text-gray-700 shadow-2xs outline-hidden cursor-pointer hover:border-gray-300"
          >
            <option>Fall 2024</option>
            <option>Spring 2024</option>
            <option>Fall 2023</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Grid containing courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, idx) => (
          <div
            key={idx}
            className="flex flex-col bg-white rounded-xl border border-gray-150 shadow-2xs overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            {/* 1. Mobile top banner (Hidden on desktop) */}
            <div className="block md:hidden relative">
              {course.banner}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[9px] font-bold text-gray-800">
                {course.code}
              </div>
              <div className="absolute top-3 right-3 bg-teal-600/90 text-white px-2 py-0.5 rounded-full text-[9px] font-bold">
                {course.term}
              </div>
            </div>

            {/* Card Content Area */}
            <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
              <div>
                {/* 2. Desktop-only top row with code and option dot (Hidden on mobile) */}
                <div className="hidden md:flex items-center justify-between mb-4">
                  <span className="bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-md text-xs font-bold border border-teal-100">
                    {course.code}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </button>
                </div>

                {/* Course Title */}
                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {course.title}
                </h3>
                
                {/* Instructor (Desktop only) */}
                <p className="hidden md:block text-xs text-gray-400 mt-2 font-medium">
                  {course.instructor}
                </p>

                {/* Course Description (Mobile only) */}
                <p className="block md:hidden text-xs text-gray-500 mt-2 leading-relaxed">
                  {course.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4 md:mt-5">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-800 mb-1.5">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-600 transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer Actions & Status */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-4">
                {/* Desktop-only status alert indicator */}
                <div className="hidden md:flex items-center gap-1.5 text-xs">
                  {course.statusType === 'warning' && (
                    <span className="flex items-center gap-1.5 text-red-600 font-semibold">
                      <svg className="h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {course.statusText}
                    </span>
                  )}
                  {course.statusType === 'success' && (
                    <span className="flex items-center gap-1.5 text-gray-400 font-medium">
                      <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.statusText}
                    </span>
                  )}
                  {course.statusType === 'info' && (
                    <span className="flex items-center gap-1.5 text-gray-400 font-medium">
                      <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.statusText}
                    </span>
                  )}
                </div>

                {/* Enter Course button (Responsive style) */}
                <button
                  onClick={() => navigate(`/student/courses/${course.code}`)}
                  className={`w-full py-2 rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    course.code === 'CS301' || course.code === 'MAT201'
                      ? 'bg-teal-700 text-white hover:bg-teal-800'
                      : 'border border-teal-600 text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  Enter Course
                  <span className="block md:hidden">→</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* 4. Desktop-only dashed "Register for a new course" card */}
        <div className="hidden lg:flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-gray-300 transition-colors bg-gray-50/20 group">
          <div className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 bg-white shadow-2xs group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="block mt-4 text-xs font-bold text-gray-800">Register for a new course</span>
          <span className="block mt-1 text-[11px] text-gray-400 max-w-xs">
            Browse the course catalog for Fall 2024
          </span>
        </div>
      </div>
    </div>
  );
}