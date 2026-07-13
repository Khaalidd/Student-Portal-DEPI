import React, { useState } from "react";

const STUDENTS = [
  {
    id: "98210",
    name: "Alice Williams",
    initials: "AW",
    overall: "92.5%",
    hw1: 95,
    quiz1: 48,
    midterm: 185,
    hw2: 90,
    attention: false,
    excused: false,
  },
  {
    id: "98211",
    name: "Bob Chen",
    initials: "BC",
    overall: "68.0%",
    hw1: 80,
    quiz1: "--",
    midterm: 140,
    hw2: 75,
    attention: true,
    excused: false,
  },
  {
    id: "98212",
    name: "David Miller",
    initials: "DM",
    overall: "85.0%",
    hw1: 85,
    quiz1: 40,
    midterm: "EXC",
    hw2: 88,
    attention: false,
    excused: true,
  },
];

export default function Gradebook() {
  const [section, setSection] = useState("All Sections");
  const [filter, setFilter] = useState("Needs Attention");

  return (
  <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">

    {/* Header */}

    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

      <div>

        <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl lg:text-5xl">
          CS101: Intro to Computer Science
        </h1>

        <p className="mt-2 text-base text-gray-500 sm:text-lg">
          Fall 2024 Gradebook
        </p>

      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">

        <button className="rounded-lg border border-teal-700 px-5 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-50">
          ⬇ Export to CSV
        </button>

        <button className="rounded-lg bg-teal-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-teal-800">
          + New Assignment
        </button>

      </div>

    </div>

    {/* Gradebook Card */}

    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Toolbar */}

      <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Filters */}

        <div className="flex flex-col gap-3 sm:flex-row">

          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option>All Sections</option>
          </select>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option>Needs Attention</option>
            <option>All Students</option>
          </select>

        </div>

        {/* Legend */}

        <div className="flex flex-wrap gap-4 text-xs text-gray-600">

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-red-600"></span>

            Attention Required

          </div>

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-gray-300"></span>

            Excused

          </div>

        </div>

      </div>

      {/* Responsive Table */}

      <div className="overflow-x-auto">

        <table className="min-w-[900px] w-full">

          <thead className="sticky top-0 border-b bg-gray-50">

            <tr className="text-left text-xs uppercase tracking-wide text-gray-500">

              <th className="px-4 py-4">
                Student Name
              </th>

              <th className="py-4">
                Overall Grade
                <div className="font-normal normal-case text-[10px] text-gray-400">
                  Calculated
                </div>
              </th>

              <th className="py-4">
                HW 1
                <div className="font-normal normal-case text-[10px] text-gray-400">
                  Out of 100
                </div>
              </th>

              <th className="py-4">
                Quiz 1
                <div className="font-normal normal-case text-[10px] text-gray-400">
                  Out of 50
                </div>
              </th>

              <th className="py-4 text-red-600">
                Midterm
                <div className="font-normal normal-case text-[10px] text-gray-400">
                  Out of 200
                </div>
              </th>

              <th className="py-4">
                HW 2
                <div className="font-normal normal-case text-[10px] text-gray-400">
                  Out of 100
                </div>
              </th>

            </tr>

          </thead>

          <tbody>

  {STUDENTS.map((student) => (

    <tr
      key={student.id}
      className={`border-b transition hover:bg-gray-50 ${
        student.attention ? "bg-red-50/40" : ""
      }`}
    >

      {/* Student */}

      <td className="px-4 py-4">

        <div className="flex min-w-[220px] items-center gap-3">

          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${
              student.initials === "AW"
                ? "bg-teal-700"
                : "bg-gray-400"
            }`}
          >
            {student.initials}
          </div>

          <div className="min-w-0">

            <p className="truncate text-sm font-semibold text-slate-800">
              {student.name}
            </p>

            <p className="text-xs text-gray-500">
              ID: {student.id}
            </p>

          </div>

          {student.attention && (
            <span className="ml-auto text-lg leading-none text-red-600">
              ●
            </span>
          )}

        </div>

      </td>

      {/* Overall */}

      <td className="whitespace-nowrap">

        <span
          className={`font-semibold ${
            student.overall === "68.0%"
              ? "text-red-600"
              : "text-teal-700"
          }`}
        >
          {student.overall}
        </span>

      </td>

      {/* HW1 */}

      <td className="text-sm text-slate-700">
        {student.hw1}
      </td>

      {/* Quiz */}

      <td>

        {student.quiz1 === "--" ? (

          <span className="inline-flex h-8 w-12 items-center justify-center rounded-md border border-red-300 bg-red-50 text-sm font-medium text-red-600">
            --
          </span>

        ) : (

          <span className="text-sm text-slate-700">
            {student.quiz1}
          </span>

        )}

      </td>

      {/* Midterm */}

      <td>

        {student.excused ? (

          <span className="rounded-md bg-gray-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
            EXC
          </span>

        ) : (

          <span
            className={`font-medium ${
              student.attention
                ? "text-red-600"
                : "text-slate-700"
            }`}
          >
            {student.midterm}
          </span>

        )}

      </td>

      {/* HW2 */}

      <td className="text-sm text-slate-700">
        {student.hw2}
      </td>

    </tr>

  ))}

                  </tbody>

        </table>

      </div>

    </div>

  </div>
);
}