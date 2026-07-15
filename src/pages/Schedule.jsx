// Schedule.jsx
import { useState, useEffect } from 'react';
import { getScheduleClasses } from '../api/scheduleApi';

// The 5 days we show in the timetable — static labels, not fetched data.
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
  var labels = [];
  for (var hour = START_HOUR; hour < END_HOUR; hour++) {
    var isAM = hour < 12;
    var displayHour = hour > 12 ? hour - 12 : hour;
    labels.push(displayHour + ' ' + (isAM ? 'AM' : 'PM'));
  }
  return labels;
}

var HOUR_LABELS = buildHourLabels();

// Figures out which day abbreviation ("Mon", "Tue", ...) today is,
// so we can highlight the current day in the schedule.
function getTodayDayId() {
  var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dayNames[new Date().getDay()];
}

// One class block positioned inside a day column, based on its start/end time.
function ClassBlock({ classItem }) {
  var topOffset = (classItem.start_hour - START_HOUR) * HOUR_ROW_HEIGHT;
  var blockHeight = (classItem.end_hour - classItem.start_hour) * HOUR_ROW_HEIGHT;

  return (
    <div
      className="absolute left-1 right-1 rounded-lg bg-teal-100 border border-teal-300 p-2 overflow-hidden"
      style={{ top: topOffset + 'px', height: blockHeight + 'px' }}
    >
      <p className="text-xs font-semibold text-teal-900 truncate">{classItem.course_code}</p>
      <p className="text-xs text-teal-700">{classItem.time_label}</p>
    </div>
  );
}

// Desktop / tablet view: a proper grid with days across the top and hours down the side.
function WeekGridView({ classes }) {
  var todayId = getTodayDayId();
  var gridHeight = (END_HOUR - START_HOUR) * HOUR_ROW_HEIGHT;

  return (
    <div className="hidden md:flex rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Hour labels column */}
      <div className="w-16 shrink-0 border-r border-gray-200">
        <div className="h-10 border-b border-gray-200" /> {/* empty corner above the labels */}
        {HOUR_LABELS.map(function (label) {
          return (
            <div
              key={label}
              className="flex items-start justify-center pt-1 text-xs text-gray-500 border-b border-gray-100"
              style={{ height: HOUR_ROW_HEIGHT + 'px' }}
            >
              {label}
            </div>
          );
        })}
      </div>

      {/* One column per day */}
      {DAYS.map(function (day) {
        var isToday = day.id === todayId;
        var classesForDay = classes.filter(function (c) { return c.day === day.id; });

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
            <div className="relative" style={{ height: gridHeight + 'px' }}>
              {HOUR_LABELS.map(function (_, index) {
                return (
                  <div
                    key={index}
                    className="border-b border-gray-100"
                    style={{ height: HOUR_ROW_HEIGHT + 'px' }}
                  />
                );
              })}
              {classesForDay.map(function (classItem) {
                return <ClassBlock key={classItem.id} classItem={classItem} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Mobile view: pick a day with tabs, then see that day's classes as a simple list.
function DayListView({ classes }) {
  var todayId = getTodayDayId();
  var defaultDay = DAYS.some(function (d) { return d.id === todayId; }) ? todayId : 'Mon';
  var [selectedDay, setSelectedDay] = useState(defaultDay);

  var classesForSelectedDay = classes
    .filter(function (c) { return c.day === selectedDay; })
    .sort(function (a, b) { return a.start_hour - b.start_hour; });

  return (
    <div className="md:hidden rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Day tabs */}
      <div className="flex border-b border-gray-200">
        {DAYS.map(function (day) {
          var isSelected = day.id === selectedDay;
          var isToday = day.id === todayId;
          return (
            <button
              key={day.id}
              onClick={function () { setSelectedDay(day.id); }}
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
        {classesForSelectedDay.map(function (classItem) {
          return (
            <div key={classItem.id} className="rounded-lg bg-teal-50 border border-teal-200 p-3">
              <p className="text-sm font-semibold text-teal-900">{classItem.course_code}</p>
              <p className="text-sm text-teal-700">{classItem.time_label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Schedule() {
  var [classes, setClasses] = useState([]);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState('');

  useEffect(function fetchClasses() {
    setLoading(true);
    getScheduleClasses()
      .then(function (data) {
        setClasses(data);
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
    return <p className="text-sm text-gray-500">Loading schedule...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">Error: {error}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Schedule</h1>
        <p className="text-sm text-gray-600 sm:text-base">Your weekly class timetable.</p>
      </div>

      {/* Only one of these two renders at a time, controlled by Tailwind's md: breakpoint */}
      <WeekGridView classes={classes} />
      <DayListView classes={classes} />
    </div>
  );
}