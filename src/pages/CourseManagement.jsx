import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const COURSES = {
  cs301: {
    title: "CS301: Advanced Data Structures",
    meta: "Fall 2024 • Sec 01 • Mon/Wed 10:00 AM",
  },
  cs101: {
    title: "CS101: Intro to Programming",
    meta: "Fall 2024 • Sec 02 • Tue/Thu 2:00 PM",
  },
};

const STUDENTS = [
  { id: "1029384", name: "Alice Smith", initials: "AS", status: "Active" },
  { id: "1029385", name: "Bob Johnson", initials: "BJ", status: "Active" },
  { id: "1029386", name: "Charlie Davis", initials: "CD", status: "At Risk" },
  { id: "1029387", name: "Eva Evans", initials: "EE", status: "Active" },
  { id: "1029388", name: "Frank Wright", initials: "FW", status: "Active" },
];

const MANAGEMENT_ACTIONS = [
  { label: "New Assignment", icon: "📝" },
  { label: "Announcement", icon: "📢" },
  { label: "Gradebook", icon: "🎓", to: "/gradebook" },
  { label: "Settings", icon: "⚙️" },
];

const SESSIONS = [
  {
    date: { month: "OCT", day: "14" },
    title: "Lec 12: B-Trees & Heaps",
    meta: "10:00 AM • Rm 402",
    tone: "default",
  },
  {
    date: { month: "OCT", day: "16" },
    title: "Lec 13: Graph Algorithms",
    meta: "10:00 AM • Rm 402",
    tone: "default",
  },
  {
    date: { month: "OCT", day: "18" },
    title: "Midterm Examination",
    meta: "Requires Action",
    tone: "alert",
  },
];

export default function CourseManagement() {
  const { courseId = "cs301" } = useParams();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("");

  const course = COURSES[courseId] ?? COURSES.cs301;

  const filteredStudents = useMemo(
    () =>
      STUDENTS.filter((student) =>
        student.name.toLowerCase().includes(filter.toLowerCase())
      ),
    [filter]
  );

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

        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:px-6">

          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search students..."
            className="h-11 flex-1 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-teal-700"
          />

          <button className="h-11 rounded-lg border border-gray-300 px-4 hover:bg-gray-50">
            Filter
          </button>

        </div>

        {/* Student Table */}

        <div className="overflow-x-auto">

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

              {filteredStudents.map((student) => (

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

              ))}

            </tbody>

          </table>

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

            {MANAGEMENT_ACTIONS.map((action) => (

              <button
                key={action.label}
                onClick={() => action.to && navigate(action.to)}
                className="rounded-xl border border-gray-200 p-4 text-left transition hover:border-teal-700 hover:bg-teal-50"
              >

                <div className="mb-3 text-2xl">
                  {action.icon}
                </div>

                <p className="font-semibold text-slate-800">
                  {action.label}
                </p>

              </button>

            ))}

          </div>

        </div>

        {/* Upcoming Sessions */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

          <h2 className="mb-5 text-2xl font-semibold text-slate-800">
            Upcoming Sessions
          </h2>

          <div className="space-y-4">

            {SESSIONS.map((session, index) => (

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

            ))}

          </div>

        </div>

      </div>

    </div>

  </div>
);
}