// Grades.jsx
import { Fragment } from 'react';

// Colors for each letter grade. Keeping this in one place makes it easy
// to change a color later without hunting through the JSX.
const GRADE_STYLES = {
  A: { bg: 'bg-teal-100', text: 'text-teal-800' },
  'A-': { bg: 'bg-teal-100', text: 'text-teal-800' },
  'B+': { bg: 'bg-blue-100', text: 'text-blue-800' },
  B: { bg: 'bg-blue-100', text: 'text-blue-800' },
  'B-': { bg: 'bg-blue-100', text: 'text-blue-800' },
  C: { bg: 'bg-amber-100', text: 'text-amber-800' },
  D: { bg: 'bg-orange-100', text: 'text-orange-800' },
  F: { bg: 'bg-rose-100', text: 'text-rose-800' },
};

// Overall GPA numbers shown in the summary card.
const GPA_SUMMARY = {
  cumulativeGpa: '3.84',
  completedCredits: 112,
  majorGpa: '3.91',
  minorGpa: '3.70',
  semesterGpa: '3.95',
};

// Every semester and the courses taken that semester.
const SEMESTERS = [
  {
    id: 'fall-2024',
    label: 'Fall 2024',
    courses: [
      { id: 1, name: 'Data Structures & Algorithms', code: 'CS 301', subject: 'Computer Science', credits: 4, grade: 'A' },
      { id: 2, name: 'Linear Algebra', code: 'MATH 240', subject: 'Mathematics', credits: 3, grade: 'A-' },
    ],
  },
  {
    id: 'spring-2024',
    label: 'Spring 2024',
    courses: [
      { id: 3, name: 'Artificial Intelligence', code: 'CS 410', subject: 'Computer Science', credits: 4, grade: 'A' },
      { id: 4, name: 'Technical Writing', code: 'ENG 205', subject: 'English', credits: 3, grade: 'B+' },
    ],
  },
];

// The colored pill showing a letter grade, e.g. "A" or "B+".
function GradeBadge({ grade }) {
  const styles = GRADE_STYLES[grade] || { bg: 'bg-gray-100', text: 'text-gray-700' };

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${styles.bg} ${styles.text}`}>
      {grade}
    </span>
  );
}

// The card on the left (desktop) / top (mobile) with overall GPA numbers.
function GpaSummaryCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Cumulative GPA</h2>
        <p className="text-sm text-gray-500">Based on {GPA_SUMMARY.completedCredits} completed credits</p>
        <p className="mt-2 text-4xl font-bold text-teal-800">{GPA_SUMMARY.cumulativeGpa}</p>
      </div>

      <div className="flex flex-col divide-y divide-gray-100 border-t border-gray-100">
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-gray-600">Major GPA</span>
          <span className="text-sm font-semibold text-gray-900">{GPA_SUMMARY.majorGpa}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-gray-600">Minor GPA</span>
          <span className="text-sm font-semibold text-gray-900">{GPA_SUMMARY.minorGpa}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-gray-600">This Semester</span>
          <span className="text-sm font-semibold text-gray-900">{GPA_SUMMARY.semesterGpa}</span>
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
function TranscriptTable() {
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
          {SEMESTERS.map((semester) => (
            <Fragment key={semester.id}>
              <tr>
                <td colSpan={3} className="pt-6 pb-2 text-sm font-semibold text-gray-700">
                  {semester.label}
                </td>
              </tr>
              {semester.courses.map((course) => (
                <TranscriptTableRow key={course.id} course={course} />
              ))}
            </Fragment>
          ))}
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
function TranscriptCardList() {
  return (
    <div className="md:hidden flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-gray-900">Course History</h2>
      {SEMESTERS.map((semester) => (
        <div key={semester.id} className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-600">{semester.label}</h3>
          {semester.courses.map((course) => (
            <TranscriptCard key={course.id} course={course} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Grades() {
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
          <GpaSummaryCard />
        </div>

        <div className="flex-1">
          <TranscriptTable />
          <TranscriptCardList />
        </div>
      </div>
    </div>
  );
}