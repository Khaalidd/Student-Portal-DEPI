import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourse, getCourseStudents, getCourseSessions } from "../api/coursesApi";
import { getAssignments, createAssignment, deleteAssignment } from "../api/assignmentsApi";
import { assignmentSchema } from "../validation/assignmentSchema";

let MANAGEMENT_ACTIONS = [
  { label: "New Assignment", icon: "📝" },
  { label: "Announcement", icon: "📢" },
  { label: "Gradebook", icon: "🎓", to: "/gradebook" },
  { label: "Settings", icon: "⚙️" },
];

export default function CourseManagement() {
  let { courseId = "cs301" } = useParams();
  let navigate = useNavigate();

  let [filter, setFilter] = useState("");
  let [course, setCourse] = useState(null);
  let [students, setStudents] = useState([]);
  let [sessions, setSessions] = useState([]);
  let [assignments, setAssignments] = useState([]);
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState(null);
  let [showAssignForm, setShowAssignForm] = useState(false);
  let [assignForm, setAssignForm] = useState({ title: "", description: "", due_date: "" });
  let [assignError, setAssignError] = useState(null);
  let assignmentsRef = useRef(null);

  useEffect(function () {
    var cancelled = false;
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        let [courseData, studentsData, sessionsData, assignmentsData] = await Promise.all([
          getCourse(courseId),
          getCourseStudents(courseId),
          getCourseSessions(courseId),
          getAssignments(courseId),
        ]);
        if (cancelled) return;
        setCourse(courseData);
        setStudents(studentsData);
        setSessions(sessionsData);
        setAssignments(assignmentsData);
      } catch (err) {
        if (cancelled) return;
        setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return function () {
      cancelled = true;
    };
  }, [courseId]);

  let filteredStudents = useMemo(
    function () {
      return students.filter(function (student) {
        return student.name.toLowerCase().includes(filter.toLowerCase());
      });
    },
    [filter, students]
  );

  function scrollToAssignments() {
    if (assignmentsRef.current) {
      assignmentsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleAssignFormChange(e) {
    var { name, value } = e.target;
    setAssignForm(function (prev) {
      var next = {};
      for (var key in prev) {
        next[key] = prev[key];
      }
      next[name] = value;
      return next;
    });
  }

  async function handleCreateAssignment(e) {
    e.preventDefault();
    setAssignError(null);
    try {
      var parsed = assignmentSchema.parse({
        course_id: courseId,
        title: assignForm.title,
        description: assignForm.description,
        due_date: assignForm.due_date,
      });
      var created = await createAssignment(parsed);
      setAssignments(function (prev) {
        return [created].concat(prev);
      });
      setAssignForm({ title: "", description: "", due_date: "" });
      setShowAssignForm(false);
    } catch (err) {
      if (err.issues) {
        setAssignError(err.issues.map(function (i) { return i.message; }).join(", "));
      } else {
        setAssignError(err.message);
      }
    }
  }

  async function handleDeleteAssignment(id) {
    try {
      await deleteAssignment(id);
      setAssignments(function (prev) {
        return prev.filter(function (a) { return a.id !== id; });
      });
    } catch (err) {
      setAssignError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <p className="text-center text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <p className="text-center text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <p className="text-center text-gray-500">Course not found. This course may not exist yet.</p>
      </div>
    );
  }

  return (
  <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">

    {/* Header */}

    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

      <div>

        <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
          {course.title}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {course.meta}
        </p>

      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">

        <button className="rounded-lg border border-teal-700 px-5 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-50">
          Edit Details
        </button>

        <button className="rounded-lg bg-teal-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-teal-800">
          Post Material
        </button>

      </div>

    </div>

    {/* Main Layout */}

    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">

      {/* Students */}

      <div className="col-span-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:col-span-8">

        <div className="flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

          <h2 className="text-2xl font-semibold text-slate-800">
            Enrolled Students
          </h2>

          <span className="self-start rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 sm:self-auto">
            {filteredStudents.length} Students
          </span>

        </div>

        {/* Search */}

        {students.length > 0 && (
          <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:px-6">

            <input
              value={filter}
              onChange={function (e) { setFilter(e.target.value); }}
              placeholder="Search students..."
              className="h-11 flex-1 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-teal-700"
            />

            <button className="h-11 rounded-lg border border-gray-300 px-4 hover:bg-gray-50">
              Filter
            </button>

          </div>
        )}

        {/* Student Table */}

        <div className="overflow-x-auto">

          {students.length === 0 ? (
            <p className="px-6 py-8 text-center text-gray-400">No students enrolled yet.</p>
          ) : (
            <table className="min-w-[650px] w-full">

            <thead className="border-b bg-gray-50">

              <tr>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Student
                </th>

                <th className="py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  ID
                </th>

                <th className="py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="pr-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredStudents.map(function (student) {

                return (

                <tr
                  key={student.id}
                  className="border-b transition hover:bg-gray-50"
                >

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-semibold text-white">
                        {student.initials}
                      </div>

                      <span className="font-medium text-slate-800">
                        {student.name}
                      </span>

                    </div>

                  </td>

                  <td className="text-sm text-gray-500">
                    {student.id}
                  </td>

                  <td>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        student.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.status}
                    </span>

                  </td>

                  <td className="pr-6 text-right">

                    <button className="rounded-md p-2 hover:bg-gray-100">
                      ⋮
                    </button>

                  </td>

                </tr>

                );

              })}

            </tbody>

          </table>
          )}

        </div>

      </div>

            {/* Right Column */}

      <div className="col-span-1 flex flex-col gap-6 xl:col-span-4">

        {/* Management Actions */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

          <h2 className="mb-5 text-2xl font-semibold text-slate-800">
            Management Actions
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {MANAGEMENT_ACTIONS.map(function (action) {
              return (

              <button
                key={action.label}
                onClick={function () {
                  if (action.label === "New Assignment") {
                    scrollToAssignments();
                  } else if (action.to) {
                    navigate(action.to);
                  }
                }}
                className="rounded-xl border border-gray-200 p-4 text-left transition hover:border-teal-700 hover:bg-teal-50"
              >

                <div className="mb-3 text-2xl">
                  {action.icon}
                </div>

                <p className="font-semibold text-slate-800">
                  {action.label}
                </p>

              </button>

              );
            })}

          </div>

        </div>

        {/* Upcoming Sessions */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

          <h2 className="mb-5 text-2xl font-semibold text-slate-800">
            Upcoming Sessions
          </h2>

          {sessions.length === 0 ? (
            <p className="text-sm text-gray-400">No upcoming sessions.</p>
          ) : (
            <div className="space-y-4">

              {sessions.map(function (session, index) {

                return (

                <div
                  key={index}
                  className="rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
                >

                  <div className="flex gap-4">

                    {/* Date */}

                    <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-100 py-2">

                      <span className="text-[11px] font-semibold uppercase text-gray-500">
                        {session.date.month}
                      </span>

                      <span className="text-xl font-bold text-slate-800">
                        {session.date.day}
                      </span>

                    </div>

                    {/* Details */}

                    <div className="min-w-0 flex-1">

                      <h3 className="font-semibold text-slate-800">
                        {session.title}
                      </h3>

                      <p
                        className={`mt-1 text-sm ${
                          session.tone === "alert"
                            ? "font-medium text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {session.meta}
                      </p>

                    </div>

                  </div>

                </div>

                );

              })}

            </div>
          )}

        </div>

        {/* Assignments */}

        <div ref={assignmentsRef} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

          <h2 className="mb-5 text-2xl font-semibold text-slate-800">
            Assignments
          </h2>

          {assignments.length === 0 ? (
            <p className="text-sm text-gray-400">No assignments yet. Create one below.</p>
          ) : (
            <div className="space-y-3">
              {assignments.map(function (assignment) {
                return (
                  <div
                    key={assignment.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-800">
                        {assignment.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Due: {assignment.due_date}
                      </p>
                    </div>
                    <button
                      onClick={function () { handleDeleteAssignment(assignment.id); }}
                      className="shrink-0 rounded-md p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                      title="Delete assignment"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {assignError && (
            <p className="mt-3 text-sm text-red-600">{assignError}</p>
          )}

          {!showAssignForm && (
            <button
              onClick={function () { setShowAssignForm(true); setAssignError(null); }}
              className="mt-4 w-full rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-500 transition hover:border-teal-700 hover:bg-teal-50 hover:text-teal-700"
            >
              + New Assignment
            </button>
          )}

          {showAssignForm && (
            <form onSubmit={handleCreateAssignment} className="mt-4 rounded-xl border border-gray-200 p-4">
              <div className="space-y-3">
                <input
                  name="title"
                  value={assignForm.title}
                  onChange={handleAssignFormChange}
                  placeholder="Assignment title"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-700"
                  required
                />
                <textarea
                  name="description"
                  value={assignForm.description}
                  onChange={handleAssignFormChange}
                  placeholder="Description (optional)"
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-700"
                />
                <input
                  name="due_date"
                  value={assignForm.due_date}
                  onChange={handleAssignFormChange}
                  type="date"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-700"
                  required
                />
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={function () { setShowAssignForm(false); setAssignError(null); }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>

  </div>
  );
}
