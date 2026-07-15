import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getGradebookEntries, updateGradebookEntry } from "../api/gradebookApi";
import { getCourse, getCourseStudents } from "../api/coursesApi";
import { supabase } from "../lib/supabaseClient";

function getInitials(name) {
  if (!name) return "??";
  return name
    .split(" ")
    .map(function (w) { return w[0]; })
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

var INITIAL_COLORS = ["bg-teal-700", "bg-gray-400", "bg-indigo-600", "bg-amber-600", "bg-rose-600", "bg-emerald-600", "bg-blue-600", "bg-violet-600"];

function avatarColor(initials) {
  var hash = 0;
  for (var i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  return INITIAL_COLORS[Math.abs(hash) % INITIAL_COLORS.length];
}

export default function Gradebook() {
  var { courseId = "cs301" } = useParams();
  var [course, setCourse] = useState(null);
  var [students, setStudents] = useState([]);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);
  var [editingCell, setEditingCell] = useState(null);
  var [editValue, setEditValue] = useState("");
  var [saving, setSaving] = useState(false);

  var [section, setSection] = useState("All Sections");
  var [filter, setFilter] = useState("Needs Attention");

  useEffect(function () {
    var cancelled = false;
    setLoading(true);
    setError(null);

    getCourse(courseId)
      .then(function (courseData) {
        if (cancelled) return;
        setCourse(courseData);

        return Promise.all([
            getGradebookEntries(courseId),
            getCourseStudents(courseId),
          ])
          .then(function (_a) {
            if (cancelled) return;
            var existingEntries = _a[0] || [];
            var courseStudents = _a[1] || [];

            // Merge: start with enrolled students, then merge any existing grade entries
            var merged = [];
            var seen = {};
            for (var i = 0; i < existingEntries.length; i++) {
              var e = existingEntries[i];
              seen[e.name || e.id] = true;
              merged.push(e);
            }
            for (var j = 0; j < courseStudents.length; j++) {
              var s = courseStudents[j];
              if (!seen[s.name]) {
                merged.push({
                  id: s.id,
                  name: s.name,
                  initials: s.initials,
                  overall: '-',
                  hw1: null, quiz1: null, midterm: null, hw2: null,
                  attention: false, excused: false,
                });
              }
            }
            var rows = merged.map(function (entry) {
              var initials = entry.initials || getInitials(entry.name);
              return Object.assign({}, entry, { initials: initials });
            });
            setStudents(rows);
            setLoading(false);
          })
          .catch(function (err) {
            if (cancelled) return;
            setError(err.message);
            setLoading(false);
          });
      })
      .catch(function (err) {
        if (cancelled) return;
        setCourse(null);
        setLoading(false);
      });

    return function () {
      cancelled = true;
    };
  }, [courseId]);

  function handleCellClick(studentId, field, currentValue) {
    if (saving) return;
    setEditingCell({ studentId: studentId, field: field });
    setEditValue(currentValue == null || currentValue === "--" ? "" : String(currentValue));
  }

  function handleCellChange(e) {
    setEditValue(e.target.value);
  }

  function commitEdit() {
    if (!editingCell || saving) {
      setEditingCell(null);
      return;
    }

    var studentId = editingCell.studentId;
    var field = editingCell.field;
    var rawValue = editValue.trim();

    var updates = {};

    if (rawValue === "" || rawValue.toUpperCase() === "EXC") {
      updates[field] = rawValue.toUpperCase() === "EXC" ? "EXC" : "--";
    } else {
      var num = Number(rawValue);
      if (!isNaN(num)) {
        updates[field] = num;
      } else {
        updates[field] = rawValue || "--";
      }
    }

    setSaving(true);

    updateGradebookEntry(studentId, updates)
      .then(function () {
        setStudents(function (prev) {
          return prev.map(function (s) {
            if (s.id !== studentId) return s;
            var updated = Object.assign({}, s);
            updated[field] = updates[field];

            if (updates[field] === "EXC") {
              updated.excused = true;
            }

            return updated;
          });
        });
        setEditingCell(null);
        setSaving(false);
      })
      .catch(function (err) {
        console.error("Failed to save grade:", err);
        setEditingCell(null);
        setSaving(false);
      });
  }

  function handleCellKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
    } else if (e.key === "Escape") {
      setEditingCell(null);
    }
  }

  function isEditing(studentId, field) {
    return editingCell && editingCell.studentId === studentId && editingCell.field === field;
  }

  function renderScoreCell(student, field, maxPoints) {
    var value = student[field];
    var editing = isEditing(student.id, field);

    if (editing) {
      return (
        <input
          autoFocus
          type="text"
          value={editValue}
          onChange={handleCellChange}
          onBlur={commitEdit}
          onKeyDown={handleCellKeyDown}
          className="w-20 rounded border border-teal-500 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      );
    }

    if (value === "--" || value == null) {
      return (
        <span
          onClick={function () { handleCellClick(student.id, field, value); }}
          className="inline-flex h-8 w-12 cursor-pointer items-center justify-center rounded-md border border-red-300 bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100"
        >
          --
        </span>
      );
    }

    if (value === "EXC") {
      return (
        <span
          onClick={function () { handleCellClick(student.id, field, value); }}
          className="cursor-pointer rounded-md bg-gray-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:bg-gray-300"
        >
          EXC
        </span>
      );
    }

    return (
      <span
        onClick={function () { handleCellClick(student.id, field, value); }}
        className={`cursor-pointer font-medium ${
          student.attention ? "text-red-600" : "text-slate-700"
        } hover:underline`}
      >
        {value}
      </span>
    );
  }

  /* ---- LOADING STATE ---- */
  if (loading) {
    return (
      <div className="mx-auto flex min-h-[400px] w-full max-w-7xl items-center justify-center px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <p className="text-lg text-gray-500">Loading gradebook...</p>
      </div>
    );
  }

  /* ---- COURSE NOT FOUND ---- */
  if (!course) {
    return (
      <div className="mx-auto flex min-h-[400px] w-full max-w-7xl items-center justify-center px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <p className="text-center text-gray-500">Course not found.</p>
      </div>
    );
  }

  /* ---- ERROR STATE ---- */
  if (error) {
    return (
      <div className="mx-auto flex min-h-[400px] w-full max-w-7xl items-center justify-center px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="rounded-lg border border-red-300 bg-red-50 px-6 py-4 text-center">
          <p className="text-lg font-semibold text-red-700">Failed to load gradebook</p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
  <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">

    {/* Header */}

    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

      <div>

        <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl lg:text-5xl">
          {course.title}
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
            onChange={function (e) { setSection(e.target.value); }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option>All Sections</option>
          </select>

          <select
            value={filter}
            onChange={function (e) { setFilter(e.target.value); }}
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

            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No students in gradebook yet.
                </td>
              </tr>
            ) : (
              students.map(function (student) {

              return (
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
                        avatarColor(student.initials)
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
                  {renderScoreCell(student, "hw1")}
                </td>

                {/* Quiz */}

                <td>
                  {renderScoreCell(student, "quiz1")}
                </td>

                {/* Midterm */}

                <td>
                  {renderScoreCell(student, "midterm")}
                </td>

                {/* HW2 */}

                <td className="text-sm text-slate-700">
                  {renderScoreCell(student, "hw2")}
                </td>

              </tr>
              );

              })
            )}

          </tbody>

        </table>

      </div>

    </div>

  </div>
  );
}
