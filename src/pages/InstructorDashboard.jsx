
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getInstructorAlerts } from '../api/dashboardApi';
import { getAllCourses } from '../api/coursesApi';
import { createAssignment } from '../api/assignmentsApi';
import { assignmentSchema } from '../validation/assignmentSchema';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function InstructorDashboard() {
  var _useAuth = useAuth(),
      user = _useAuth.user;
  var navigate = useNavigate();

  var _useState = useState(''),
      announcement = _useState[0],
      setAnnouncement = _useState[1];
  var _useState2 = useState('All Courses'),
      scope = _useState2[0],
      setScope = _useState2[1];
  var _useState3 = useState([]),
      activeCourses = _useState3[0],
      setActiveCourses = _useState3[1];
  var _useState4 = useState([]),
      alerts = _useState4[0],
      setAlerts = _useState4[1];
  var _useState5 = useState(true),
      loading = _useState5[0],
      setLoading = _useState5[1];
  var _useState6 = useState(null),
      error = _useState6[0],
      setError = _useState6[1];
  var _useState7 = useState(0),
      totalEnrolled = _useState7[0],
      setTotalEnrolled = _useState7[1];
  var _useState8 = useState(0),
      pendingGrading = _useState8[0],
      setPendingGrading = _useState8[1];
  var _useState9 = useState(false),
      posting = _useState9[0],
      setPosting = _useState9[1];
  var _useState10 = useState(false),
      showAssignModal = _useState10[0],
      setShowAssignModal = _useState10[1];
  var _useState11 = useState({ courseId: '', title: '', description: '', due_date: '' }),
      assignForm = _useState11[0],
      setAssignForm = _useState11[1];
  var _useState12 = useState(null),
      assignError = _useState12[0],
      setAssignError = _useState12[1];
  var _useState13 = useState(false),
      savingAssign = _useState13[0],
      setSavingAssign = _useState13[1];

  useEffect(function () {
    var cancelled = false;

    async function fetchData() {
      if (!user || !user.id) { setLoading(false); return; }
      setLoading(true);
      setError(null);
      try {
        var _ref = await Promise.all([
          getAllCourses(),
          getInstructorAlerts(),
        ]);
        if (cancelled) return;

        var allCourses = _ref[0];
        var alertsData = _ref[1];

        var instructorCourses = allCourses.filter(function (c) {
          return c.instructor_id === user.id;
        });

        var courseQueries = instructorCourses.map(function (c) {
          return Promise.all([
            supabase.from('course_students').select('*', { count: 'exact', head: true }).eq('course_id', c.id),
            supabase.from('gradebook_entries').select('overall').eq('course_id', c.id),
          ]);
        });

        var courseStats = await Promise.all(courseQueries);

        var mappedCourses = instructorCourses.map(function (c, idx) {
          var studentResult = courseStats[idx][0];
          var gradeResult = courseStats[idx][1];

          var studentCount = (studentResult && !studentResult.error) ? (studentResult.count || 0) : 0;
          var grades = (gradeResult && !gradeResult.error && gradeResult.data) ? gradeResult.data : [];

          var avgGrade = 'N/A';
          if (grades.length > 0) {
            var sum = 0;
            var validCount = 0;
            for (var j = 0; j < grades.length; j++) {
              var g = grades[j];
              if (g.overall && g.overall !== '--' && g.overall !== 'EXC') {
                var num = parseFloat(g.overall);
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

          return {
            id: c.id,
            code: c.id ? c.id.slice(0,2).toUpperCase() : c.id,
            name: c.title,
            meta: c.meta || '',
            students: studentCount,
            avgGrade: avgGrade,
            color: 'bg-[#E9F1FF] text-[#4568A9]',
          };
        });

        var mappedAlerts = alertsData.map(function (a) {
          return {
            id: a.id,
            title: a.title,
            meta: a.meta,
            dot: a.dot,
          };
        });

        setActiveCourses(mappedCourses);
        setAlerts(mappedAlerts);

        var enrolled = mappedCourses.reduce(function (sum, c) {
          var n = Number(c.students);
          return sum + (isNaN(n) ? 0 : n);
        }, 0);
        setTotalEnrolled(enrolled);

        if (mappedCourses.length > 0) {
          var courseIds = mappedCourses.map(function (c) { return c.id; });
          var _a = await supabase
            .from('assignments')
            .select('id', { count: 'exact', head: true })
            .in('course_id', courseIds);
          if (!cancelled && !_a.error && _a.count != null) {
            setPendingGrading(_a.count);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return function () {
      cancelled = true;
    };
  }, [user && user.id]);

  var welcomeName = user && user.name ? user.name : 'Instructor';

  async function handlePostAnnouncement() {
    if (!announcement.trim() || posting) return;

    var selectedCourse = null;
    if (scope === 'All Courses') {
      if (activeCourses.length === 0) return;
      selectedCourse = activeCourses[0];
    } else {
      selectedCourse = activeCourses.find(function (c) {
        return (c.code + ': ' + c.name) === scope;
      });
    }

    if (!selectedCourse) return;

    setPosting(true);
    try {
      var _students = await supabase
        .from('course_students')
        .select('*')
        .eq('course_id', selectedCourse.id);

      if (_students.error) throw new Error(_students.error.message);

      var enrolledStudents = _students.data || [];

      if (enrolledStudents.length > 0) {
        var notifications = enrolledStudents.map(function (s) {
          return {
            user_id: s.user_id || s.student_id || s.id,
            type: 'system',
            category_id: 'academic',
            title: 'Announcement',
            description: announcement.trim(),
            day: 'Today',
            time_label: 'Just now',
            source_label: selectedCourse.name,
            read: false,
          };
        });

        var _insert = await supabase.from('notifications').insert(notifications);
        if (_insert.error) throw new Error(_insert.error.message);
      }

      setAnnouncement('');
      setScope('All Courses');
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  async function handleCreateAssignment(e) {
    e.preventDefault();
    setAssignError(null);
    try {
      assignmentSchema.parse(assignForm);
    } catch (zodErr) {
      setAssignError(zodErr.issues ? zodErr.issues[0].message : zodErr.message);
      return;
    }
    setSavingAssign(true);
    try {
      await createAssignment({
        course_id: assignForm.courseId,
        title: assignForm.title,
        description: assignForm.description,
        due_date: assignForm.due_date,
      });
      setShowAssignModal(false);
      setAssignForm({ courseId: '', title: '', description: '', due_date: '' });
    } catch (err) {
      setAssignError(err.message);
    } finally {
      setSavingAssign(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm text-gray-500">Welcome back, {welcomeName}</p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl lg:text-5xl">
            Instructor Dashboard
          </h1>
        </div>

        <button
          onClick={function () {
            if (activeCourses.length > 0) {
              setAssignForm({ courseId: activeCourses[0].id, title: '', description: '', due_date: '' });
              setShowAssignModal(true);
            }
          }}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-6 text-sm font-medium text-white transition hover:bg-teal-800 sm:w-auto"
        >
          <span className="text-lg">＋</span>
          Create Assignment
        </button>
      </div>


      {/* Main Layout */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Active Courses */}

        <div className="col-span-1 rounded-2xl border border-gray-200 bg-white shadow-sm xl:col-span-8">
          <div className="flex items-center justify-between border-b px-5 py-5 sm:px-6">
            <h2 className="text-2xl font-semibold text-slate-800 sm:text-3xl">
              Active Courses
            </h2>

            <Link
              to="/courses/cs301"
              className="text-sm font-semibold text-teal-700 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="px-2 py-2 sm:px-4">
            {error && (
              <p className="px-4 py-8 text-center text-sm text-red-500">
                {error}
              </p>
            )}

            {loading && !error && (
              <p className="px-4 py-8 text-center text-sm text-gray-500">
                Loading courses...
              </p>
            )}

            {!loading &&
              !error &&
              activeCourses.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-gray-500">
                  No active courses yet.
                </p>
              )}

            {!loading &&
              !error &&
              activeCourses.map(function (course) {
                return (
                  <Link
                    key={course.id}
                    to={'/instructor/courses/' + course.id}
                    className="flex flex-col gap-5 rounded-xl px-4 py-5 transition hover:bg-gray-50 lg:flex-row lg:items-center lg:justify-between"
                  >
                    {/* Left */}

                    <div className="flex items-center gap-4">
                      <div
                        className={
                          'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-lg font-bold ' +
                          course.color
                        }
                      >
                        {course.code}
                      </div>

                      <div>
                        <h3 className="text-[15px] font-semibold text-slate-800">
                          {course.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {course.meta}
                        </p>
                      </div>
                    </div>

                    {/* Right */}

                    <div className="grid w-full grid-cols-3 gap-4 pt-2 lg:flex lg:w-auto lg:items-center lg:gap-10 lg:pt-0">
                      <div className="text-center">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                          Students
                        </p>

                        <p className="mt-1 text-lg font-semibold text-slate-800">
                          {course.students}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                          Avg Grade
                        </p>

                        <p className="mt-1 text-lg font-bold text-teal-700">
                          {course.avgGrade}
                        </p>
                      </div>

                      <div className="flex items-center justify-center lg:block">
                        <button
                          onClick={function (e) {
                            e.preventDefault();
                          }}
                          className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100"
                        >
                          ⋮
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>

        {/* Right Column */}

        <div className="col-span-1 flex flex-col gap-6 xl:col-span-4">
          {/* Quick Announcement */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-5 text-2xl font-semibold text-slate-800 sm:text-3xl">
              Quick Announcement
            </h2>

            <select
              value={scope}
              onChange={function (e) {
                setScope(e.target.value);
              }}
              className="mb-4 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-teal-700"
            >
              <option>All Courses</option>
              {activeCourses.map(function (course) {
                return (
                  <option key={course.id}>
                    {course.code}: {course.name}
                  </option>
                );
              })}
            </select>

            <textarea
              rows={4}
              value={announcement}
              onChange={function (e) {
                setAnnouncement(e.target.value);
              }}
              placeholder="Type your message here..."
              className="mb-5 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-teal-700"
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="w-full rounded-lg px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-gray-100 sm:w-auto"
              >
                Draft
              </button>

              <button
                type="button"
                onClick={handlePostAnnouncement}
                disabled={!announcement.trim() || posting}
                className="w-full rounded-lg bg-teal-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {posting ? 'Posting...' : 'Post Now'}
              </button>
            </div>
          </div>

          {/* Needs Attention */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <span className="text-lg text-red-500 sm:text-xl">△</span>

              <h2 className="text-2xl font-semibold text-slate-800 sm:text-3xl">
                Needs Attention
              </h2>
            </div>

            <div className="space-y-4">
              {loading && !error && (
                <p className="py-4 text-center text-sm text-gray-500">
                  Loading alerts...
                </p>
              )}

              {!loading &&
                !error &&
                alerts.length === 0 && (
                  <p className="py-4 text-center text-sm text-gray-500">
                    No alerts.
                  </p>
                )}

              {!loading &&
                !error &&
                alerts.map(function (item) {
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-gray-50"
                    >
                      <span
                        className={
                          'mt-2 h-2 w-2 shrink-0 rounded-full ' + item.dot
                        }
                      />

                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-semibold text-slate-800">
                          {item.title}
                        </p>

                        <p className="mt-1 break-words text-xs text-gray-500">
                          {item.meta}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form
            onSubmit={handleCreateAssignment}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
          >
            <h2 className="mb-4 text-lg font-bold text-slate-800">Create Assignment</h2>

            <label className="mb-1 block text-sm text-gray-600">Course</label>
            <select
              value={assignForm.courseId}
              onChange={function (e) { setAssignForm(function (p) { return { ...p, courseId: e.target.value }; }); }}
              className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            >
              {activeCourses.map(function (c) {
                return <option key={c.id} value={c.id}>{c.name}</option>;
              })}
            </select>

            <label className="mb-1 block text-sm text-gray-600">Title</label>
            <input
              type="text"
              value={assignForm.title}
              onChange={function (e) { setAssignForm(function (p) { return { ...p, title: e.target.value }; }); }}
              className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Assignment title"
              required
            />

            <label className="mb-1 block text-sm text-gray-600">Description</label>
            <textarea
              value={assignForm.description}
              onChange={function (e) { setAssignForm(function (p) { return { ...p, description: e.target.value }; }); }}
              className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              rows={3}
              placeholder="What should students do?"
            />

            <label className="mb-1 block text-sm text-gray-600">Due Date</label>
            <input
              type="text"
              value={assignForm.due_date}
              onChange={function (e) { setAssignForm(function (p) { return { ...p, due_date: e.target.value }; }); }}
              className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="e.g. Oct 25, 2024"
              required
            />

            {assignError && <p className="mb-3 text-sm text-red-600">{assignError}</p>}

            <div className="flex justify-end gap-3">
              <button type="button" onClick={function () { setShowAssignModal(false); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
                Cancel
              </button>
              <button type="submit" disabled={savingAssign} className="rounded-lg bg-teal-700 px-4 py-2 text-sm text-white disabled:opacity-50">
                {savingAssign ? 'Saving...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
