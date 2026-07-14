
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';

const ACTIVE_COURSES = [
  {
    id: 'cs301',
    code: 'CS',
    name: 'CS301: Data Structures',
    meta: 'MWF 10:00 AM • Room 402',
    students: 120,
    avgGrade: '88%',
    color: 'bg-[#E9F1FF] text-[#4568A9]',
  },
  {
    id: 'cs101',
    code: 'CS',
    name: 'CS101: Intro to Programming',
    meta: 'TTh 2:00 PM • Online',
    students: 128,
    avgGrade: '82%',
    color: 'bg-[#676B73] text-white',
  },
];

const NEEDS_ATTENTION = [
  {
    id: 1,
    title: 'Midterm Grades Due',
    meta: 'CS301 • Tomorrow, 5:00 PM',
    dot: 'bg-red-500',
  },
  {
    id: 2,
    title: '3 Student Extension Requests',
    meta: 'CS101 • Assignment 4',
    dot: 'bg-teal-600',
  },
];

export default function InstructorDashboard() {
  const [announcement, setAnnouncement] = useState('');
  const [scope, setScope] = useState('All Courses');

  return (
  <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">

    {/* Header */}

    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

      <div>

        <p className="mb-2 text-sm text-gray-500">
          Welcome back, Dr. Smith
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl lg:text-5xl">
          Instructor Dashboard
        </h1>

      </div>

      <button
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-6 text-sm font-medium text-white transition hover:bg-teal-800 sm:w-auto"
      >
        <span className="text-lg">＋</span>
        Create Assignment
      </button>

    </div>

    {/* Stat Cards */}

    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

      <StatCard
        label="TOTAL ENROLLED"
        value="248"
        trend="+12 from last semester"
      />

      <StatCard
        label="PENDING GRADING"
        value="86"
        tag="Action needed"
        trend="Across 3 assignments"
      />

      <StatCard
        label="UNREAD MESSAGES"
        value="14"
        trend="From students & TAs"
      />

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

          {ACTIVE_COURSES.map((course) => (

            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="flex flex-col gap-5 rounded-xl px-4 py-5 transition hover:bg-gray-50 lg:flex-row lg:items-center lg:justify-between"
            >

              {/* Left */}

              <div className="flex items-center gap-4">

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-lg font-bold ${course.color}`}
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
                    onClick={(e) => e.preventDefault()}
                    className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100"
                  >
                    ⋮
                  </button>

                </div>

              </div>

            </Link>

          ))}

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
            onChange={(e) => setScope(e.target.value)}
            className="mb-4 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-teal-700"
          >
            <option>All Courses</option>
            <option>CS301: Data Structures</option>
            <option>CS101: Intro to Programming</option>
          </select>

          <textarea
            rows={4}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
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
              disabled={!announcement.trim()}
              className="w-full rounded-lg bg-teal-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Post Now
            </button>

          </div>

        </div>

        {/* Needs Attention */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5 flex items-center gap-2">

            <span className="text-lg text-red-500 sm:text-xl">
              △
            </span>

            <h2 className="text-2xl font-semibold text-slate-800 sm:text-3xl">
              Needs Attention
            </h2>

          </div>

          <div className="space-y-4">

            {NEEDS_ATTENTION.map((item) => (

              <div
                key={item.id}
                className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-gray-50"
              >

                <span
                  className={`mt-2 h-2 w-2 shrink-0 rounded-full ${item.dot}`}
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

            ))}

          </div>

        </div>

      </div>

    </div>

  </div>
);
}
