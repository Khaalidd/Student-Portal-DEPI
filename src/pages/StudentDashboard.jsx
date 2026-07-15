import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStudentMetrics, getMyCourses } from '../api/dashboardApi';
import { getScheduleClasses } from '../api/scheduleApi';
import { getSemesterCourses } from '../api/gradesApi';
import { getAssignments, getSubmissions } from '../api/assignmentsApi';
import { getAllCourses } from '../api/coursesApi';
import { TrendingUp, BookOpen, AlertTriangle } from 'lucide-react';

function getTodayDayId() {
  var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dayNames[new Date().getDay()];
}

function formatHour(h) {
  var hour = Math.floor(h);
  var minutes = Math.round((h - hour) * 60);
  if (minutes === 60) { hour += 1; minutes = 0; }
  var ampm = hour >= 12 ? 'PM' : 'AM';
  var displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
  return displayHour + ':' + String(minutes).padStart(2, '0') + ' ' + ampm;
}

function scoreToColor(scoreVal) {
  var num = parseFloat(scoreVal);
  if (isNaN(num)) return 'bg-gray-50 text-gray-700 border-gray-100';
  if (num >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (num >= 80) return 'bg-blue-50 text-blue-700 border-blue-100';
  if (num >= 70) return 'bg-amber-50 text-amber-700 border-amber-100';
  return 'bg-red-50 text-red-700 border-red-100';
}

export default function StudentDashboard() {
  var { user } = useAuth();
  var navigate = useNavigate();
  var userName = user?.name?.split(' ')[0] || 'Alex';

  var METRIC_ICONS = {
    gpa: TrendingUp,
    credits: BookOpen,
    alert: AlertTriangle,
  };

  var [metrics, setMetrics] = useState([]);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);

  var [schedule, setSchedule] = useState([]);
  var [scheduleLoading, setScheduleLoading] = useState(true);

  var [recentGrades, setRecentGrades] = useState([]);
  var [gradesLoading, setGradesLoading] = useState(true);

  var [pendingCount, setPendingCount] = useState(0);
  var [pendingLoading, setPendingLoading] = useState(true);

  useEffect(function () {
    var cancelled = false;

    async function fetchMetrics() {
      try {
        setLoading(true);
        setError(null);
        var data = await getStudentMetrics(user ? user.id : null);
        if (!cancelled) {
          setMetrics(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load metrics');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMetrics();

    return function () {
      cancelled = true;
    };
  }, []);

  useEffect(function () {
    var cancelled = false;

    async function fetchSchedule() {
      try {
        setScheduleLoading(true);
        if (!user) { setSchedule([]); return; }
        var enrolledCourses = await getMyCourses(user.id);
        if (cancelled) return;
        var enrolledCodes = enrolledCourses.map(function (c) { return c.code; });
        var data = await getScheduleClasses();
        if (!cancelled) {
          var todayId = getTodayDayId();
          var todayClasses = data
            .filter(function (c) { return c.day === todayId && enrolledCodes.indexOf(c.course_code) !== -1; })
            .sort(function (a, b) { return a.start_hour - b.start_hour; })
            .map(function (c) {
              return {
                time: formatHour(c.start_hour),
                endTime: formatHour(c.end_hour),
                code: c.course_code,
                name: c.course_name || c.title || c.course_code,
                location: c.location || 'TBA',
                isOnline: c.is_online === true || c.is_online === 'true',
                badge: c.badge || null,
                action: (c.is_online === true || c.is_online === 'true') ? 'Join' : 'Details',
                actionStyle: (c.is_online === true || c.is_online === 'true') ? 'solid' : 'outline',
              };
            });
          setSchedule(todayClasses);
        }
      } catch (err) {
        if (!cancelled) {
          setSchedule([]);
        }
      } finally {
        if (!cancelled) {
          setScheduleLoading(false);
        }
      }
    }

    fetchSchedule();

    return function () {
      cancelled = true;
    };
  }, []);

  useEffect(function () {
    var cancelled = false;

    async function fetchGrades() {
      try {
        setGradesLoading(true);
        var data = await getSemesterCourses();
        if (!cancelled) {
          var sorted = data.slice().sort(function (a, b) {
            if (b.semester_id !== a.semester_id) return b.semester_id - a.semester_id;
            return b.id - a.id;
          });
          var latestSemesterId = sorted.length > 0 ? sorted[0].semester_id : null;
          var latestEntries = sorted
            .filter(function (c) { return c.semester_id === latestSemesterId; })
            .slice(0, 3);

          var gradeEntries = latestEntries.map(function (g) {
            var scoreVal = g.score || g.grade || g.percentage || 'N/A';
            var scoreStr = String(scoreVal).includes('%') ? String(scoreVal) : String(scoreVal) + '%';
            return {
              course: g.course_code || g.code || '',
              assignment: g.assignment || g.title || g.name || g.type || 'Assignment',
              score: scoreStr,
              scoreColor: scoreToColor(parseFloat(scoreVal)),
            };
          });
          setRecentGrades(gradeEntries);
        }
      } catch (err) {
        if (!cancelled) {
          setRecentGrades([]);
        }
      } finally {
        if (!cancelled) {
          setGradesLoading(false);
        }
      }
    }

    fetchGrades();

    return function () {
      cancelled = true;
    };
  }, []);

  useEffect(function () {
    var cancelled = false;

    async function fetchPending() {
      if (!user) return;
      try {
        setPendingLoading(true);
        var myCourses = await getMyCourses(user.id);
        if (cancelled) return;

        var allCourses = await getAllCourses();
        if (cancelled) return;

        var coursesByCode = {};
        for (var i = 0; i < allCourses.length; i++) {
          coursesByCode[allCourses[i].code] = allCourses[i].id;
        }

        var count = 0;
        for (var j = 0; j < myCourses.length; j++) {
          var courseId = myCourses[j].course_id || coursesByCode[myCourses[j].code];
          if (!courseId) continue;

          var assignments = await getAssignments(courseId);
          if (cancelled) return;

          for (var k = 0; k < assignments.length; k++) {
            var submissions = await getSubmissions(assignments[k].id, user.id);
            if (cancelled) return;
            if (!submissions || submissions.length === 0) {
              count++;
            }
          }
        }

        if (!cancelled) {
          setPendingCount(count);
        }
      } catch (err) {
        if (!cancelled) {
          setPendingCount(0);
        }
      } finally {
        if (!cancelled) {
          setPendingLoading(false);
        }
      }
    }

    fetchPending();

    return function () {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Desktop Weather Alert Banner */}
      <div className="hidden md:flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800 shadow-xs">
        <svg className="h-5 w-5 shrink-0 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
        <div>
          <span className="font-bold">Campus Weather Alert: </span>
          All afternoon classes are moved online due to impending severe weather conditions. Please check your course portals for Zoom links.
        </div>
      </div>

      {/* 2. Mobile Weather Widget */}
      <div className="md:hidden flex items-center justify-between rounded-xl bg-blue-50 border border-blue-100 p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-900">Campus Weather</h4>
            <p className="text-xs text-blue-700 mt-0.5">Mild conditions today. No expected disruptions.</p>
          </div>
        </div>
        <span className="text-xl font-bold text-blue-900">68°F</span>
      </div>

      {/* 3. Welcome / Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {/* Responsive title text */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            <span className="hidden md:inline">Good morning, {userName}.</span>
            <span className="md:hidden">Welcome back, {userName}.</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            <span className="hidden md:inline">Computer Science Major • Junior Year</span>
            <span className="md:hidden">Here's what's happening today.</span>
          </p>
        </div>
        <button onClick={function () { navigate('/student/courses'); }} className="self-start md:self-auto rounded-lg bg-teal-800 hover:bg-teal-900 text-white px-4 py-2 text-sm font-semibold shadow-xs transition-colors cursor-pointer">
          Register for Spring
        </button>
      </div>

      {/* 4. Metric KPIs Grid */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map(function (i) {
            return (
              <div key={i} className="rounded-xl border border-gray-150 bg-white p-5 shadow-xs animate-pulse">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="mt-2 h-7 w-16 bg-gray-200 rounded" />
                  </div>
                  <div className="rounded-lg p-2 bg-gray-100 h-9 w-9" />
                </div>
                <div className="mt-4 h-3 w-32 bg-gray-100 rounded" />
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          Failed to load metrics: {error}
        </div>
      )}

      {!loading && !error && metrics.length === 0 && (
        <div className="rounded-xl border border-gray-150 bg-white p-5 shadow-xs text-sm text-gray-500">
          No metrics available yet.
        </div>
      )}

      {!loading && !error && metrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {metrics.map(function (m, idx) {
            var Icon = METRIC_ICONS[m.icon_key];
            return (
              <div
                key={idx}
                className={`rounded-xl border bg-white p-5 shadow-xs transition-all hover:shadow-sm ${
                  m.isAlert ? 'border-red-100' : 'border-gray-150'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                      {m.title}
                    </p>
                    <h3 className={`mt-2 text-2xl md:text-3xl font-bold tracking-tight ${
                      m.isAlert ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {m.value}
                    </h3>
                  </div>
                  <div className={`rounded-lg p-2 ${m.isAlert ? 'bg-red-50' : 'bg-gray-50'}`}>
                    {Icon ? <Icon className="w-5 h-5 text-teal-600" /> : null}
                  </div>
                </div>

                {m.progress !== undefined && (
                  <div className="mt-4">
                    <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-teal-600 transition-all duration-500"
                        style={{ width: `${m.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {m.trend && (
                  <p className={`mt-3 text-xs ${m.trendColor || 'text-gray-400'}`}>
                    {m.trend}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Main Dashboard Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Schedule */}
        <div className="lg:col-span-2 rounded-xl border border-gray-150 bg-white p-5 md:p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <h3 className="text-base font-bold text-gray-900">Today's Schedule</h3>
            <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer">
              View Calendar
            </button>
          </div>

          {scheduleLoading && (
            <div className="space-y-4">
              {[0, 1].map(function (idx) {
                return (
                  <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-10 bg-gray-200 rounded" />
                      <div>
                        <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
                        <div className="h-3 w-56 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!scheduleLoading && schedule.length === 0 && (
            <p className="text-sm text-gray-500 py-4">No classes scheduled for today.</p>
          )}

          {!scheduleLoading && schedule.length > 0 && (
            <div className="space-y-4">
              {schedule.map(function (item, idx) {
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Time block */}
                      <div className="w-20 shrink-0 text-left sm:border-r border-gray-200 sm:pr-4">
                        <span className="block text-xs font-bold text-gray-900">{item.time}</span>
                        <span className="block text-[10px] font-medium text-gray-400 mt-0.5">{item.endTime}</span>
                      </div>

                      {/* Course info */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">
                          {item.name} ({item.code})
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                          {item.isOnline ? (
                            <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                          <span>{item.location}</span>
                        </div>

                        {/* Badge below info on mobile, inline otherwise */}
                        {item.badge && (
                          <span className="inline-block mt-2 sm:mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-100 text-red-700 border border-red-200">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Course actions */}
                    <button
                      className={`self-start sm:self-auto px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
                        item.actionStyle === 'solid'
                          ? 'bg-teal-700 text-white hover:bg-teal-800'
                          : 'border border-teal-600 text-teal-600 hover:bg-teal-50'
                      }`}
                    >
                      {item.action}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Grades & Action Required */}
        <div className="space-y-6 flex flex-col">
          {/* Grades Card */}
          <div className="rounded-xl border border-gray-150 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h3 className="text-base font-bold text-gray-900">Recent Grades</h3>
              <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer">
                All Grades
              </button>
            </div>

            {gradesLoading && (
              <div className="space-y-3">
                {[0, 1].map(function (idx) {
                  return (
                    <div key={idx} className="animate-pulse flex justify-between items-center py-3">
                      <div>
                        <div className="h-3 w-28 bg-gray-200 rounded mb-2" />
                        <div className="h-2.5 w-12 bg-gray-100 rounded" />
                      </div>
                      <div className="h-5 w-12 bg-gray-200 rounded" />
                    </div>
                  );
                })}
              </div>
            )}

            {!gradesLoading && recentGrades.length === 0 && (
              <p className="text-sm text-gray-500 py-4">No grades posted yet.</p>
            )}

            {!gradesLoading && recentGrades.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="pb-2">Assignment</th>
                      <th className="pb-2 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentGrades.map(function (grade, idx) {
                      return (
                        <tr key={idx} className="text-xs">
                          <td className="py-3">
                            <p className="font-bold text-gray-900">{grade.assignment}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{grade.course}</p>
                          </td>
                          <td className="py-3 text-right">
                            <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold border ${grade.scoreColor}`}>
                              {grade.score}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Action Required Box */}
          {!pendingLoading && pendingCount === 0 && (
            <div className="rounded-xl border border-green-100 bg-green-50/50 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-sm font-bold text-green-800">
                <svg className="h-4.5 w-4.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>All caught up!</span>
              </div>
            </div>
          )}

          {!pendingLoading && pendingCount > 0 && (
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-red-800">
                <svg className="h-4.5 w-4.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Action Required</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-red-100 bg-white shadow-2xs">
                <div>
                  <h5 className="text-xs font-bold text-red-800">
                    {pendingCount} pending assignment{pendingCount !== 1 ? 's' : ''}
                  </h5>
                  <p className="text-[10px] text-gray-400 mt-0.5">Needs your attention</p>
                </div>
                <button className="text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer">
                  View All
                </button>
              </div>
            </div>
          )}

          {pendingLoading && (
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-5 shadow-xs animate-pulse">
              <div className="h-4 w-32 bg-red-100 rounded mb-4" />
              <div className="h-10 w-full bg-red-50 rounded" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
