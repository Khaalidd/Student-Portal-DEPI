// Grades.jsx
import { Fragment, useState, useEffect } from 'react';
import { getSemesters, getSemesterCourses } from '../api/gradesApi';

// Colors for each letter grade. Keeping this in one place makes it easy
// to change a color later without hunting through the JSX.
var GRADE_STYLES = {
  A: { bg: 'bg-teal-100', text: 'text-teal-800' },
  'A-': { bg: 'bg-teal-100', text: 'text-teal-800' },
  'B+': { bg: 'bg-blue-100', text: 'text-blue-800' },
  B: { bg: 'bg-blue-100', text: 'text-blue-800' },
  'B-': { bg: 'bg-blue-100', text: 'text-blue-800' },
  C: { bg: 'bg-amber-100', text: 'text-amber-800' },
  D: { bg: 'bg-orange-100', text: 'text-orange-800' },
  F: { bg: 'bg-rose-100', text: 'text-rose-800' },
};

// Overall GPA numbers shown in the summary card — computed stats, kept as placeholders.
var GPA_SUMMARY = {
  cumulativeGpa: '3.84',
  completedCredits: 112,
  majorGpa: '3.91',
  minorGpa: '3.70',
  semesterGpa: '3.95',
};

// The colored pill showing a letter grade, e.g. "A" or "B+".
function GradeBadge({ grade }) {
  var styles = GRADE_STYLES[grade] || { bg: 'bg-gray-100', text: 'text-gray-700' };

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${styles.bg} ${styles.text}`}>
      {grade}
    </span>
  );
}

// The card on the left (desktop) / top (mobile) with overall GPA numbers.
function GpaSummaryCard({ hasData }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Cumulative GPA</h2>
        <p className="text-sm text-gray-500">Based on {hasData ? GPA_SUMMARY.completedCredits : 0} completed credits</p>
        <p className="mt-2 text-4xl font-bold text-teal-800">{hasData ? GPA_SUMMARY.cumulativeGpa : 'N/A'}</p>
      </div>

      <div className="flex flex-col divide-y divide-gray-100 border-t border-gray-100">
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-gray-600">Major GPA</span>
          <span className="text-sm font-semibold text-gray-900">{hasData ? GPA_SUMMARY.majorGpa : 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-gray-600">Minor GPA</span>
          <span className="text-sm font-semibold text-gray-900">{hasData ? GPA_SUMMARY.minorGpa : 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-gray-600">This Semester</span>
          <span className="text-sm font-semibold text-gray-900">{hasData ? GPA_SUMMARY.semesterGpa : 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}

// Desktop: one row inside the transcript table.
function TranscriptTableRow({ course }) {
  return (
    <tr className="border-b border-gray-100 last:border-b-0">
      <td className="py-4 pl-2">
        <p className="text-sm font-medium text-gray-900">{course.name}</p>
        <p className="text-xs text-gray-500">{course.code} • {course.subject}</p>
      </td>
      <td className="py-4 text-center text-sm text-gray-600">{course.credits}</td>
      <td className="py-4 pr-2 text-right">
        <GradeBadge grade={course.grade} />
      </td>
    </tr>
  );
}

// Desktop: the full table, split into a header row per semester.
function TranscriptTable({ semesters, coursesBySemester }) {
  return (
    <div className="hidden md:block rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Course History</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="pb-2 pl-2 font-semibold">Course</th>
            <th className="pb-2 text-center font-semibold">Credits</th>
            <th className="pb-2 pr-2 text-right font-semibold">Grade</th>
          </tr>
        </thead>
        <tbody>
          {semesters.map(function (semester) {
            return (
              <Fragment key={semester.id}>
                <tr>
                  <td colSpan={3} className="pt-6 pb-2 text-sm font-semibold text-gray-700">
                    {semester.label}
                  </td>
                </tr>
                {(coursesBySemester[semester.id] || []).map(function (course) {
                  return <TranscriptTableRow key={course.id} course={course} />;
                })}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Mobile: a course shown as a card instead of a table row.
function TranscriptCard({ course }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
      <div>
        <p className="text-sm font-medium text-gray-900">{course.name}</p>
        <p className="text-xs text-gray-500">{course.code} • {course.subject} • {course.credits} credits</p>
      </div>
      <GradeBadge grade={course.grade} />
    </div>
  );
}

// Mobile: semesters stacked as sections of cards instead of a table.
function TranscriptCardList({ semesters, coursesBySemester }) {
  return (
    <div className="md:hidden flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-gray-900">Course History</h2>
      {semesters.map(function (semester) {
        return (
          <div key={semester.id} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-600">{semester.label}</h3>
            {(coursesBySemester[semester.id] || []).map(function (course) {
              return <TranscriptCard key={course.id} course={course} />;
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function Grades() {
  var [semesters, setSemesters] = useState([]);
  var [coursesBySemester, setCoursesBySemester] = useState({});
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState('');

  useEffect(function fetchGrades() {
    setLoading(true);
    Promise.all([getSemesters(), getSemesterCourses()])
      .then(function (_a) {
        var semesterData = _a[0];
        var allCourses = _a[1];

        setSemesters(semesterData);

        // Group courses under their semester
        var grouped = {};
        for (var i = 0; i < allCourses.length; i++) {
          var c = allCourses[i];
          if (!grouped[c.semester_id]) {
            grouped[c.semester_id] = [];
          }
          grouped[c.semester_id].push(c);
        }
        setCoursesBySemester(grouped);
        setError('');
      })
      .catch(function (err) {
        setError(err.message);
      })
      .finally(function () {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading grades...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">Error: {error}</p>;
  }

  var hasData = semesters.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Grades & Transcript</h1>
          <p className="text-sm text-gray-600 sm:text-base">Fall Semester 2024</p>
        </div>
        <button className="self-start rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900 sm:self-auto">
          Request Official Transcript
        </button>
      </div>

      {/* GPA summary + transcript.
          Stacks on mobile (flex-col), side by side on large screens (lg:flex-row). */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="lg:w-80 lg:shrink-0">
          <GpaSummaryCard hasData={hasData} />
        </div>

        <div className="flex-1">
          {hasData ? (
            <>
              <TranscriptTable semesters={semesters} coursesBySemester={coursesBySemester} />
              <TranscriptCardList semesters={semesters} coursesBySemester={coursesBySemester} />
            </>
          ) : (
            <p className="text-sm text-gray-500 py-8">No grades recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}