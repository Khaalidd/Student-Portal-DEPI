import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourse, getCourseWeeks, getWeekMaterials, getCourseFiles } from '../api/coursesApi';
import { getAssignments, getSubmissions, submitAssignment } from '../api/assignmentsApi';
import { getGradebookEntries } from '../api/gradebookApi';
import { submissionSchema } from '../validation/assignmentSchema';
import { useAuth } from '../context/AuthContext';

function formatUpcomingDue(date) {
  var now = new Date();
  var target = new Date(date);
  if (isNaN(target.getTime())) return 'Due ' + date;

  var diffMs = target.getTime() - now.getTime();
  var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Due Today, 11:59 PM';
  if (diffDays === 1) return 'Due Tomorrow, 11:59 PM';

  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return 'Due ' + months[target.getMonth()] + ' ' + target.getDate();
}

export default function CourseDetail() {
  const { courseId } = useParams();
  const safeId = courseId ? courseId.toLowerCase() : '';
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Materials');
  const [expandedWeeks, setExpandedWeeks] = useState({});

  var [assignments, setAssignments] = useState([]);
  var [assignmentsLoading, setAssignmentsLoading] = useState(false);
  var [assignmentsError, setAssignmentsError] = useState(null);
  var [submissionsMap, setSubmissionsMap] = useState({});
  var [expandedSubmitForm, setExpandedSubmitForm] = useState(null);
  var [submissionText, setSubmissionText] = useState('');
  var [submissionFileUrl, setSubmissionFileUrl] = useState('');
  var [submittingAssignment, setSubmittingAssignment] = useState(null);
  var [submitError, setSubmitError] = useState(null);

  useEffect(function () {
    var cancelled = false;

    async function loadCourse() {
      if (!safeId) {
        if (!cancelled) {
          setError('No course ID provided');
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        var results = await Promise.all([
          getCourse(safeId),
          getCourseWeeks(safeId),
          getCourseFiles(safeId),
          getAssignments(safeId),
        ]);
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
        return;
      }

      if (cancelled) return;

      var [courseRow, weeksRows, filesRows, assignmentsData] = results;

      var upNext = null;
      if (assignmentsData && assignmentsData.length > 0) {
        var now = new Date();
        var bestAssignment = null;
        var bestDate = null;

        for (var ai = 0; ai < assignmentsData.length; ai++) {
          var a = assignmentsData[ai];
          var dueDate = a.due_date ? new Date(a.due_date) : null;
          if (!dueDate || isNaN(dueDate.getTime())) continue;

          if (dueDate >= now) {
            if (!bestDate || dueDate < bestDate) {
              bestDate = dueDate;
              bestAssignment = a;
            }
          }
        }

        if (!bestAssignment) {
          for (var ai2 = 0; ai2 < assignmentsData.length; ai2++) {
            var a2 = assignmentsData[ai2];
            var d2 = a2.due_date ? new Date(a2.due_date) : null;
            if (d2 && !isNaN(d2.getTime())) {
              bestAssignment = a2;
              bestDate = d2;
              break;
            }
          }
        }

        if (!bestAssignment && assignmentsData.length > 0) {
          bestAssignment = assignmentsData[0];
          bestDate = new Date();
        }

        if (bestAssignment) {
          upNext = {
            title: bestAssignment.title,
            due: formatUpcomingDue(bestDate),
          };
        }
      }

      var weeksWithMaterials = [];
      if (weeksRows && weeksRows.length > 0) {
        var materialsResults = await Promise.all(
          weeksRows.map(function (week) {
            return getWeekMaterials(week.id).then(function (materials) {
              return { week: week, materials: materials };
            });
          })
        );

        weeksWithMaterials = materialsResults.map(function (item) {
          return {
            id: item.week.id,
            title: item.week.title,
            dateRange: item.week.date_range,
            materials: item.materials,
          };
        });
      }

      if (cancelled) return;

      var assembled = {
        code: courseRow.id,
        title: courseRow.title,
        credits: courseRow.credits,
        description: courseRow.description,
        department: courseRow.department,
        term: courseRow.term,
        instructor: {
          name: courseRow.instructor_name,
          role: courseRow.instructor_role,
          email: courseRow.instructor_email,
          office: courseRow.instructor_office,
          hours: courseRow.instructor_hours,
        },
        stats: {
          credits: courseRow.credits,
          grade: 'N/A',
        },
        weeks: weeksWithMaterials,
        recentFiles: filesRows || [],
        upNext: upNext,
      };

      if (!cancelled) {
        setCourse(assembled);
        setAssignments(assignmentsData || []);
        if (assembled.weeks.length > 0) {
          setExpandedWeeks((function () {
            var first = assembled.weeks[0];
            var expanded = {};
            expanded[first.id] = true;
            return expanded;
          })());
        }
        setLoading(false);
      }
    }

    loadCourse();

    return function () {
      cancelled = true;
    };
  }, [safeId]);

  useEffect(function () {
    var cancelled = false;

    async function loadGrade() {
      if (!safeId || !user) return;

      try {
        var entries = await getGradebookEntries(safeId);
        if (cancelled) return;

        var userEntries = [];
        for (var ei = 0; ei < entries.length; ei++) {
          var entry = entries[ei];
          if (
            entry.user_id === user.id ||
            entry.student_id === user.id ||
            entry.student_name === user.name
          ) {
            userEntries.push(entry);
          }
        }

        var grade = 'N/A';
        if (userEntries.length > 0) {
          var total = 0;
          for (var gi = 0; gi < userEntries.length; gi++) {
            var score = parseFloat(userEntries[gi].score);
            if (!isNaN(score)) {
              total += score;
            }
          }
          var avg = Math.round(total / userEntries.length);
          grade = avg + '%';
        }

        if (!cancelled) {
          setCourse(function (prev) {
            if (!prev) return prev;
            var updated = { credits: prev.stats.credits, grade: grade };
            return { ...prev, stats: updated };
          });
        }
      } catch (_err) {
        // gradebook unavailable — grade stays N/A
      }
    }

    loadGrade();

    return function () {
      cancelled = true;
    };
  }, [safeId, user]);

  const toggleWeek = function (id) {
    setExpandedWeeks(function (prev) {
      var next = {};
      var keys = Object.keys(prev);
      for (var i = 0; i < keys.length; i++) {
        next[keys[i]] = prev[keys[i]];
      }
      next[id] = !prev[id];
      return next;
    });
  };

  useEffect(function () {
    var cancelled = false;

    async function loadSubmissions() {
      if (!safeId || !user) return;
      if (assignments.length === 0) return;

      setAssignmentsLoading(true);
      setAssignmentsError(null);

      try {
        var submissionsResults = await Promise.all(
          assignments.map(function (assignment) {
            return getSubmissions(assignment.id, user.id)
              .then(function (subs) { return { assignmentId: assignment.id, result: subs }; })
              .catch(function () { return { assignmentId: assignment.id, result: [] }; });
          })
        );

        if (cancelled) return;

        var map = {};
        for (var i = 0; i < submissionsResults.length; i++) {
          var item = submissionsResults[i];
          map[item.assignmentId] = item.result && item.result.length > 0 ? item.result[0] : null;
        }

        setSubmissionsMap(map);
      } catch (err) {
        if (!cancelled) {
          setAssignmentsError(err.message);
        }
      } finally {
        if (!cancelled) {
          setAssignmentsLoading(false);
        }
      }
    }

    if (activeTab === 'Assignments') {
      loadSubmissions();
    }

    return function () {
      cancelled = true;
    };
  }, [safeId, user, activeTab, assignments]);

  function handleSubmitAssignment(assignmentId) {
    var validation = submissionSchema.safeParse({ submission_text: submissionText, file_url: submissionFileUrl });
    if (!validation.success) {
      setSubmitError(validation.error.errors ? validation.error.errors[0].message : validation.error.issues[0].message);
      return;
    }

    setSubmittingAssignment(assignmentId);
    setSubmitError(null);

    submitAssignment(assignmentId, user.id, submissionText, submissionFileUrl)
      .then(function (result) {
        setSubmissionsMap(function (prev) {
          var next = {};
          var keys = Object.keys(prev);
          for (var i = 0; i < keys.length; i++) {
            next[keys[i]] = prev[keys[i]];
          }
          next[assignmentId] = result;
          return next;
        });
        setExpandedSubmitForm(null);
        setSubmissionText('');
        setSubmissionFileUrl('');
        setSubmittingAssignment(null);
      })
      .catch(function (err) {
        setSubmitError(err.message);
        setSubmittingAssignment(null);
      });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
          <span className="text-sm text-gray-400 font-semibold">Loading course...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-center max-w-md">
          <div className="h-12 w-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-800">Failed to load course</p>
          <p className="text-xs text-gray-500">{error}</p>
          <Link to="/student/courses" className="mt-2 text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors">
            &larr; Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-bold text-gray-800">Course not found</p>
          <Link to="/student/courses" className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors">
            &larr; Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  var pendingCount = 0;
  for (var i = 0; i < assignments.length; i++) {
    if (!submissionsMap[assignments[i].id]) {
      pendingCount++;
    }
  }

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
          {['Overview', 'Materials', 'Assignments', 'Grades'].map(function (tab) {
            return (
              <button
                key={tab}
                onClick={function () { setActiveTab(tab); }}
                className={`pb-3 text-sm font-semibold tracking-tight border-b-2 transition-all shrink-0 cursor-pointer ${
                  activeTab === tab
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {tab === 'Assignments' && pendingCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-100 text-red-600">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Split Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Tab Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'Materials' && (
            <div className="space-y-4">
              {course.weeks.map(function (week) {
                return (
                  <div key={week.id} className="rounded-xl border border-gray-150 bg-white overflow-hidden shadow-2xs">
                    {/* Accordion Header */}
                    <div
                      onClick={function () { toggleWeek(week.id); }}
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
                        {week.materials.map(function (file, fileIdx) {
                          return (
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
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
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
                {pendingCount > 0 && (
                  <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[9px] font-bold border border-red-100">
                    {pendingCount} Pending
                  </span>
                )}
              </div>

              {assignmentsLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
                    <span className="text-xs text-gray-400 font-semibold">Loading assignments...</span>
                  </div>
                </div>
              )}

              {assignmentsError && !assignmentsLoading && (
                <div className="p-4 rounded-xl border border-red-100 bg-red-50/30 text-center">
                  <p className="text-xs font-bold text-red-600">{assignmentsError}</p>
                </div>
              )}

              {!assignmentsLoading && !assignmentsError && assignments.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-xs text-gray-400 font-semibold">No assignments for this course yet.</p>
                </div>
              )}

              {!assignmentsLoading && !assignmentsError && assignments.map(function (assignment) {
                var existingSubmission = submissionsMap[assignment.id];
                var isExpanded = expandedSubmitForm === assignment.id;
                var isSubmitting = submittingAssignment === assignment.id;

                return (
                  <div key={assignment.id} className={`p-4 rounded-xl border ${existingSubmission ? 'border-emerald-100 bg-emerald-50/30' : 'border-red-100 bg-red-50/30'}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-lg ${existingSubmission ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'} flex items-center justify-center shrink-0`}>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <h4 className={`text-xs font-bold ${existingSubmission ? 'text-emerald-800' : 'text-red-800'}`}>{assignment.title}</h4>
                          {assignment.description && (
                            <p className="text-[10px] text-gray-500 mt-0.5">{assignment.description}</p>
                          )}
                          <p className={`text-[10px] mt-1 font-semibold ${existingSubmission ? 'text-emerald-600' : 'text-red-600'}`}>
                            Due: {assignment.due_date}
                          </p>
                        </div>
                      </div>
                      {existingSubmission ? (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full border border-emerald-200 shrink-0 whitespace-nowrap">
                          Submitted &#10003;
                        </span>
                      ) : (
                        <button
                          onClick={function () {
                            if (isExpanded) {
                              setExpandedSubmitForm(null);
                              setSubmissionText('');
                              setSubmitError(null);
                            } else {
                              setExpandedSubmitForm(assignment.id);
                              setSubmissionText('');
                              setSubmitError(null);
                            }
                          }}
                          className="bg-teal-700 hover:bg-teal-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-2xs shrink-0"
                        >
                          Submit
                        </button>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="space-y-3 pt-3 mt-3 border-t border-gray-100">
                        {submitError && (
                          <p className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-1 rounded">{submitError}</p>
                        )}
                        <textarea
                          value={submissionText}
                          onChange={function (e) { setSubmissionText(e.target.value); }}
                          placeholder="Type your submission..."
                          rows={4}
                          className="w-full rounded-lg border border-gray-200 p-3 text-xs text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
<p className="mt-2 text-[10px] text-gray-400">Or paste a link to your file (Google Drive, Dropbox, etc.):</p>
<input
  type="url"
  value={submissionFileUrl}
  onChange={function (e) { setSubmissionFileUrl(e.target.value); }}
  placeholder="https://drive.google.com/..."
  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
/>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={function () { handleSubmitAssignment(assignment.id); }}
                            disabled={isSubmitting}
                            className="bg-teal-700 hover:bg-teal-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                          </button>
                          <button
                            onClick={function () {
                              setExpandedSubmitForm(null);
                              setSubmissionText('');
                              setSubmissionFileUrl('');
                              setSubmitError(null);
                            }}
                            className="border border-gray-200 text-gray-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
              {course.recentFiles.map(function (file, idx) {
                return (
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
                );
              })}
            </div>
          </div>

          {/* Card 4: Up Next (Mobile stack equivalent to Assignments teaser) */}
          {course.upNext && (
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
          )}
        </div>
      </div>
    </div>
  );
}
