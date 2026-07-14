// Schedule.jsx
import { useState } from 'react';

// The 5 days we show in the timetable.
const DAYS = [
  { id: 'Mon', label: 'Mon' },
  { id: 'Tue', label: 'Tue' },
  { id: 'Wed', label: 'Wed' },
  { id: 'Thu', label: 'Thu' },
  { id: 'Fri', label: 'Fri' },
];

// The timetable runs from 8 AM to 4 PM, one row per hour.
const START_HOUR = 8;
const END_HOUR = 16;
const HOUR_ROW_HEIGHT = 60; // pixels tall for one hour, used for positioning class blocks

// Builds the list of hour labels shown down the left side, e.g. "8 AM", "9 AM"...
function buildHourLabels() {
  const labels = [];
  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    const isAM = hour < 12;
    const displayHour = hour > 12 ? hour - 12 : hour;
    labels.push(`${displayHour} ${isAM ? 'AM' : 'PM'}`);
  }
  return labels;
}

const HOUR_LABELS = buildHourLabels();

// Every class in the weekly schedule. startHour/endHour are in 24-hour time
// as decimals, so 9:30 AM is 9.5, 2:00 PM is 14, etc.
const CLASSES = [
  { id: 1, day: 'Mon', courseCode: 'CS 101', startHour: 9, endHour: 10.5, timeLabel: '9:00 - 10:30' },
  { id: 2, day: 'Wed', courseCode: 'CS 101', startHour: 9, endHour: 10.5, timeLabel: '9:00 - 10:30' },
  { id: 3, day: 'Fri', courseCode: 'CS 101', startHour: 9, endHour: 10.5, timeLabel: '9:00 - 10:30' },
  { id: 4, day: 'Tue', courseCode: 'MATH 202', startHour: 10, endHour: 11.5, timeLabel: '10:00 - 11:30' },
  { id: 5, day: 'Thu', courseCode: 'MATH 202', startHour: 10, endHour: 11.5, timeLabel: '10:00 - 11:30' },
  { id: 6, day: 'Mon', courseCode: 'ENG 105', startHour: 13, endHour: 14, timeLabel: '1:00 - 2:00' },
  { id: 7, day: 'Wed', courseCode: 'ENG 105', startHour: 13, endHour: 14, timeLabel: '1:00 - 2:00' },
  { id: 8, day: 'Fri', courseCode: 'ENG 105', startHour: 13, endHour: 14, timeLabel: '1:00 - 2:00' },
  { id: 9, day: 'Tue', courseCode: 'HIST 300', startHour: 14.5, endHour: 16, timeLabel: '2:30 - 4:00' },
  { id: 10, day: 'Thu', courseCode: 'HIST 300', startHour: 14.5, endHour: 16, timeLabel: '2:30 - 4:00' },
];

// Figures out which day abbreviation ("Mon", "Tue", ...) today is,
// so we can highlight the current day in the schedule.
function getTodayDayId() {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dayNames[new Date().getDay()];
}

// One class block positioned inside a day column, based on its start/end time.
function ClassBlock({ classItem }) {
  const topOffset = (classItem.startHour - START_HOUR) * HOUR_ROW_HEIGHT;
  const blockHeight = (classItem.endHour - classItem.startHour) * HOUR_ROW_HEIGHT;

  return (
    <div
      className="absolute left-1 right-1 rounded-lg bg-teal-100 border border-teal-300 p-2 overflow-hidden"
      style={{ top: `${topOffset}px`, height: `${blockHeight}px` }}
    >
      <p className="text-xs font-semibold text-teal-900 truncate">{classItem.courseCode}</p>
      <p className="text-xs text-teal-700">{classItem.timeLabel}</p>
    </div>
  );
}

// Desktop / tablet view: a proper grid with days across the top and hours down the side.
function WeekGridView() {
  const todayId = getTodayDayId();
  const gridHeight = (END_HOUR - START_HOUR) * HOUR_ROW_HEIGHT;

  return (
    <div className="hidden md:flex rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Hour labels column */}
      <div className="w-16 shrink-0 border-r border-gray-200">
        <div className="h-10 border-b border-gray-200" /> {/* empty corner above the labels */}
        {HOUR_LABELS.map((label) => (
          <div
            key={label}
            className="flex items-start justify-center pt-1 text-xs text-gray-500 border-b border-gray-100"
            style={{ height: `${HOUR_ROW_HEIGHT}px` }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* One column per day */}
      {DAYS.map((day) => {
        const isToday = day.id === todayId;
        const classesForDay = CLASSES.filter((c) => c.day === day.id);

        return (
          <div key={day.id} className="flex-1 border-r border-gray-100 last:border-r-0">
            {/* Day header */}
            <div
              className={`h-10 flex items-center justify-center text-sm font-medium border-b border-gray-200
                ${isToday ? 'bg-teal-50 text-teal-800' : 'text-gray-600'}`}
            >
              {day.label}
            </div>

            {/* Hour rows background + class blocks positioned on top */}
            <div className="relative" style={{ height: `${gridHeight}px` }}>
              {HOUR_LABELS.map((_, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100"
                  style={{ height: `${HOUR_ROW_HEIGHT}px` }}
                />
              ))}
              {classesForDay.map((classItem) => (
                <ClassBlock key={classItem.id} classItem={classItem} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Mobile view: pick a day with tabs, then see that day's classes as a simple list.
// A grid this wide doesn't fit on a phone screen, so we switch to this instead.
function DayListView() {
  const todayId = getTodayDayId();
  const defaultDay = DAYS.some((d) => d.id === todayId) ? todayId : 'Mon';
  const [selectedDay, setSelectedDay] = useState(defaultDay);

  const classesForSelectedDay = CLASSES
    .filter((c) => c.day === selectedDay)
    .sort((a, b) => a.startHour - b.startHour);

  return (
    <div className="md:hidden rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Day tabs */}
      <div className="flex border-b border-gray-200">
        {DAYS.map((day) => {
          const isSelected = day.id === selectedDay;
          const isToday = day.id === todayId;
          return (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`flex-1 py-3 text-sm font-medium border-b-2
                ${isSelected ? 'border-teal-700 text-teal-800' : 'border-transparent text-gray-500'}`}
            >
              {day.label}
              {isToday && <span className="ml-1 text-teal-600">•</span>}
            </button>
          );
        })}
      </div>

      {/* Classes for the selected day */}
      <div className="flex flex-col gap-3 p-4">
        {classesForSelectedDay.length === 0 && (
          <p className="text-sm text-gray-500">No classes scheduled.</p>
        )}
        {classesForSelectedDay.map((classItem) => (
          <div key={classItem.id} className="rounded-lg bg-teal-50 border border-teal-200 p-3">
            <p className="text-sm font-semibold text-teal-900">{classItem.courseCode}</p>
            <p className="text-sm text-teal-700">{classItem.timeLabel}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Schedule() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Schedule</h1>
        <p className="text-sm text-gray-600 sm:text-base">Your weekly class timetable.</p>
      </div>

      {/* Only one of these two renders at a time, controlled by Tailwind's md: breakpoint */}
      <WeekGridView />
      <DayListView />
    </div>
  );
}