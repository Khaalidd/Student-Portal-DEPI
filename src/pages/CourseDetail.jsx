import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CourseDetail() {
  const { courseId } = useParams();
  
  // Default to CS301 data if the route parameter doesn't match
  const activeCourseId = courseData[courseId] ? courseId : 'CS301';
  const course = courseData[activeCourseId];

  const [activeTab, setActiveTab] = useState('Materials');
  const [expandedWeeks, setExpandedWeeks] = useState({ 4: true }); // Week 4 expanded by default

  const toggleWeek = (id) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6">
      {/* 1. Breadcrumbs */}
      <div className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
        <Link to="/student/courses" className="hover:text-teal-600 transition-colors">
          My Courses
        </Link>
        <span>&gt;</span>
        <span className="text-teal-600 font-bold uppercase">{course.code}</span>
      </div>

      {/* 2. Responsive Header Card */}
      <div className="rounded-xl border border-gray-150 bg-white p-5 md:p-6 shadow-2xs">
        {/* Mobile Header Tags (Hidden on desktop) */}
        <div className="flex md:hidden items-center gap-2 mb-3">
          <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-blue-100 uppercase">
            {course.department}
          </span>
          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100">
            {course.term}
          </span>
        </div>

        {/* Title row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="hidden md:inline-block bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-md text-xs font-bold border border-teal-100 uppercase mb-2">
              {course.code}
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              {course.title}
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-2 leading-relaxed max-w-3xl">
              {course.description}
            </p>
          </div>
          
          {/* Desktop Credits Display */}
          <div className="hidden md:block shrink-0 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-center">
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Credits</span>
            <span className="block text-lg font-bold text-gray-800">{course.credits}</span>
          </div>
        </div>

        {/* Mobile Action Buttons (Hidden on desktop) */}
        <div className="flex md:hidden items-center gap-3 mt-5">
          <button className="flex-1 flex items-center justify-center gap-1.5 border border-teal-600 text-teal-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-teal-50/50 transition-colors cursor-pointer">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Discussions
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Join Lecture
          </button>
        </div>
      </div>

      {/* 3. Sub-tabs layout */}
      <div className="border-b border-gray-150">
        <div className="flex gap-6 overflow-x-auto">
          {['Overview', 'Materials', 'Assignments', 'Grades'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold tracking-tight border-b-2 transition-all shrink-0 cursor-pointer ${
                activeTab === tab
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
              {tab === 'Assignments' && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-100 text-red-600">
                  1
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Split Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Tab Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'Materials' && (
            <div className="space-y-4">
              {course.weeks.map((week) => (
                <div key={week.id} className="rounded-xl border border-gray-150 bg-white overflow-hidden shadow-2xs">
                  {/* Accordion Header */}
                  <div
                    onClick={() => toggleWeek(week.id)}
                    className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 border-b border-gray-100 cursor-pointer select-none"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{week.title}</h3>
                      <p className="text-[10px] font-semibold text-gray-400 mt-0.5">{week.dateRange}</p>
                    </div>
                    <button className="text-gray-400">
                      <svg
                        className={`h-5 w-5 transform transition-transform duration-200 ${
                          expandedWeeks[week.id] ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Accordion Body */}
                  {expandedWeeks[week.id] && (
                    <div className="divide-y divide-gray-100">
                      {week.materials.map((file, fileIdx) => (
                        <div
                          key={fileIdx}
                          className="flex items-center justify-between p-4 hover:bg-gray-50/20 transition-colors gap-4"
                        >
                          <div className="flex items-center gap-3">
                            {/* File Type Icon */}
                            <div className="h-10 w-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                              {file.type === 'pdf' && (
                                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              )}
                              {file.type === 'video' && (
                                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                              {file.type === 'code' && (
                                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-800 leading-tight">{file.name}</p>
                              <p className="text-[10px] text-gray-400 mt-1">{file.info}</p>
                            </div>
                          </div>

                          {/* Action Button */}
                          {file.action !== 'viewed' && (
                            <button className="text-gray-400 hover:text-teal-600 transition-colors p-1 rounded-md hover:bg-teal-50 cursor-pointer">
                              {file.action === 'download' ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 00-2 2v4a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Overview' && (
            <div className="rounded-xl border border-gray-150 bg-white p-5 md:p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Course Syllabus & Details</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                This course covers advanced data structures and algorithms. Topics include complexity analysis, sorting and searching, graphs, trees, and hashing. Students will implement these algorithms to solve real-world problems.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="block text-[10px] text-gray-400 uppercase font-bold">Department</span>
                  <span className="text-xs font-bold text-gray-800">{course.department}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="block text-[10px] text-gray-400 uppercase font-bold">Term</span>
                  <span className="text-xs font-bold text-gray-800">{course.term}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Assignments' && (
            <div className="rounded-xl border border-gray-150 bg-white p-5 md:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-900">Assignments</h3>
                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[9px] font-bold border border-red-100">
                  1 Pending
                </span>
              </div>
              <div className="p-4 rounded-xl border border-red-100 bg-red-50/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-red-800">{course.upNext.title}</h4>
                    <p className="text-[10px] text-red-600 mt-1">{course.upNext.due}</p>
                  </div>
                </div>
                <button className="bg-teal-700 hover:bg-teal-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-2xs">
                  Submit
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Grades' && (
            <div className="rounded-xl border border-gray-150 bg-white p-5 md:p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Course Gradebook</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                  <span className="font-bold text-gray-700">Midterm Exam</span>
                  <span className="font-bold text-emerald-700">92%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                  <span className="font-bold text-gray-700">Assignment 1: Big-O Analyzer</span>
                  <span className="font-bold text-emerald-700">95%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-teal-50/40 rounded-lg border border-teal-100/50 text-xs font-bold">
                  <span className="text-teal-800">Current Average</span>
                  <span className="text-teal-800">{course.stats.grade}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Instructor & Stats Sidebar (Desktop) / Bottom Stack (Mobile) */}
        <div className="space-y-6">
          {/* Card 1: Instructor Details */}
          <div className="rounded-xl border border-gray-150 bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Instructor</h3>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                AT
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">{course.instructor.name}</h4>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{course.instructor.role}</p>
              </div>
            </div>
            
            <div className="space-y-2.5 pt-2 border-t border-gray-50">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{course.instructor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Office Hours: {course.instructor.hours}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{course.instructor.office}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Course Stats */}
          <div className="rounded-xl border border-gray-150 bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Course Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Credits</span>
                <span className="font-bold text-gray-800">{course.stats.credits}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Current Grade</span>
                <span className="font-bold text-emerald-600">{course.stats.grade}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Recent Files (Desktop only) */}
          <div className="hidden lg:block rounded-xl border border-gray-150 bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recent Files</h3>
            <div className="space-y-3">
              {course.recentFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2.5 hover:bg-gray-50 p-1.5 rounded-lg transition-colors cursor-pointer">
                  {file.type === 'pdf' ? (
                    <svg className="h-4.5 w-4.5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="h-4.5 w-4.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  )}
                  <span className="text-xs font-bold text-gray-700 truncate">{file.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Up Next (Mobile stack equivalent to Assignments teaser) */}
          <div className="block lg:hidden rounded-xl border border-red-100 bg-red-50/50 p-5 shadow-2xs space-y-3">
            <h3 className="text-[10px] font-bold text-red-800 uppercase tracking-wider">Up Next</h3>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                !
              </div>
              <div>
                <h4 className="text-xs font-bold text-red-900">{course.upNext.title}</h4>
                <p className="text-[10px] text-red-600 font-semibold mt-0.5">{course.upNext.due}</p>
              </div>
            </div>
            <button className="w-full mt-2 bg-white border border-gray-200 text-gray-700 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
              View Course Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Course Detail Database Mock
const courseData = {
  CS301: {
    code: 'CS301',
    title: 'Data Structures & Algorithms',
    credits: 4,
    description: 'Advanced concepts in data structures including trees, graphs, and hash tables. CS301 focuses on practical implementation and complexity analysis.',
    department: 'COMPUTER SCIENCE',
    term: 'Fall 2024',
    instructor: {
      name: 'Prof. Alan Turing',
      role: 'Lead Instructor',
      email: 'a.turing@eduportal.edu',
      office: 'Science Bldg, Room 404',
      hours: 'Tue/Thu 2:00 PM - 4:00 PM'
    },
    stats: {
      credits: 4,
      grade: '92% (A-)'
    },
    weeks: [
      {
        id: 4,
        title: 'Week 4: Trees and Graphs',
        dateRange: 'Sept 18 - Sept 24',
        materials: [
          {
            type: 'pdf',
            name: 'Binary Search Trees.pdf',
            info: '2.4 MB • Read by Friday',
            action: 'download'
          },
          {
            type: 'video',
            name: 'Lecture Recording: AVL Trees',
            info: 'Video • 45 mins',
            action: 'play'
          },
          {
            type: 'code',
            name: 'Starter Code: BST Implementation',
            info: 'ZIP Archive • 120 KB',
            action: 'download'
          }
        ]
      },
      {
        id: 3,
        title: 'Week 3: Linked Lists & Stacks',
        dateRange: 'Sept 11 - Sept 17',
        materials: [
          {
            type: 'pdf',
            name: 'Hash Tables Overview.pdf',
            info: '1.8 MB • Viewed',
            action: 'viewed'
          }
        ]
      }
    ],
    recentFiles: [
      { name: 'Syllabus_Fall24.pdf', type: 'pdf' },
      { name: 'graph_traversal.py', type: 'code' }
    ],
    upNext: {
      title: 'Project 2: Graph Router',
      due: 'Due Tomorrow, 11:59 PM'
    }
  },
  MAT201: {
    code: 'MAT201',
    title: 'Calculus II & Linear Algebra',
    credits: 4,
    description: 'Techniques of integration, sequences, infinite series, and vector spaces. Connects mathematical frameworks with computer applications.',
    department: 'MATHEMATICS',
    term: 'Fall 2024',
    instructor: {
      name: 'Dr. Katherine Johnson',
      role: 'Professor of Mathematics',
      email: 'k.johnson@eduportal.edu',
      office: 'Science Bldg, Room 502',
      hours: 'Mon/Wed 1:00 PM - 3:00 PM'
    },
    stats: {
      credits: 4,
      grade: '88% (B+)'
    },
    weeks: [
      {
        id: 4,
        title: 'Week 4: Infinite Series',
        dateRange: 'Sept 18 - Sept 24',
        materials: [
          {
            type: 'pdf',
            name: 'Taylor Series Expansion.pdf',
            info: '1.5 MB • Read by Friday',
            action: 'download'
          }
        ]
      }
    ],
    recentFiles: [
      { name: 'Syllabus_Math201.pdf', type: 'pdf' }
    ],
    upNext: {
      title: 'Homework 3: Convergence Tests',
      due: 'Due Friday, 11:59 PM'
    }
  },
  PHY105: {
    code: 'PHY105',
    title: 'General Physics & Quantum Mechanics',
    credits: 4,
    description: 'Mechanics, heat, sound, and quantum physics foundations. Includes laboratory experiments and simulation analyses.',
    department: 'PHYSICS',
    term: 'Fall 2024',
    instructor: {
      name: 'Prof. Richard Feynman',
      role: 'Lead Instructor',
      email: 'r.feynman@eduportal.edu',
      office: 'Science Bldg, Room 301',
      hours: 'Fri 10:00 AM - 12:00 PM'
    },
    stats: {
      credits: 4,
      grade: '95% (A)'
    },
    weeks: [
      {
        id: 4,
        title: 'Week 4: Quantum Mechanics Intro',
        dateRange: 'Sept 18 - Sept 24',
        materials: [
          {
            type: 'pdf',
            name: 'Double Slit Experiment Notes.pdf',
            info: '3.1 MB • Read by Friday',
            action: 'download'
          }
        ]
      }
    ],
    recentFiles: [
      { name: 'Syllabus_Phys105.pdf', type: 'pdf' }
    ],
    upNext: {
      title: 'Lab Report 1: Mechanics',
      due: 'Due Monday, 11:59 PM'
    }
  }
};