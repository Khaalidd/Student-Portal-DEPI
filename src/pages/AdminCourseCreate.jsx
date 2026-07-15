import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../api/coursesApi";
import { getUsers } from "../api/usersApi";
import { supabase } from "../lib/supabaseClient";
import { courseSchema } from "../validation/courseSchema";
import { PlusCircle, Trash2 } from "lucide-react";

var DAYS = [
  { id: "Mon", label: "Monday" },
  { id: "Tue", label: "Tuesday" },
  { id: "Wed", label: "Wednesday" },
  { id: "Thu", label: "Thursday" },
  { id: "Fri", label: "Friday" },
];

var TIME_REGEX = /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

function timeStringToDecimal(timeStr) {
  if (!timeStr) return 0;
  var parts = timeStr.split(":");
  var hours = parseFloat(parts[0]) || 0;
  var minutes = parseFloat(parts[1]) || 0;
  return hours + minutes / 60;
}

export default function AdminCourseCreate() {
  var navigate = useNavigate();

  var [courseForm, setCourseForm] = useState({
    id: "",
    title: "",
    department: "",
    term: "",
    credits: "",
    description: "",
  });
  var [instructorId, setInstructorId] = useState("");
  var [scheduleEntries, setScheduleEntries] = useState([]);
  var [instructors, setInstructors] = useState([]);
  var [loadingInstructors, setLoadingInstructors] = useState(true);
  var [saving, setSaving] = useState(false);
  var [errors, setErrors] = useState({});

  useEffect(function () {
    var cancelled = false;
    async function fetchInstructors() {
      try {
        var users = await getUsers();
        if (cancelled) return;
        var instructorList = users.filter(function (u) {
          return u.role === "instructor";
        });
        setInstructors(instructorList);
      } catch (err) {
        /* silently ignore */
      } finally {
        if (!cancelled) setLoadingInstructors(false);
      }
    }
    fetchInstructors();
    return function () {
      cancelled = true;
    };
  }, []);

  function handleFormChange(e) {
    var name = e.target.name;
    var value = e.target.value;
    setCourseForm(function (prev) {
      var next = {};
      for (var key in prev) {
        next[key] = prev[key];
      }
      next[name] = value;
      return next;
    });
    setErrors(function (prev) {
      var next = {};
      for (var key in prev) {
        next[key] = prev[key];
      }
      delete next[name];
      return next;
    });
  }

  function handleInstructorChange(e) {
    setInstructorId(e.target.value);
    setErrors(function (prev) {
      var next = {};
      for (var key in prev) {
        next[key] = prev[key];
      }
      delete next.instructor;
      return next;
    });
  }

  function addScheduleEntry() {
    setScheduleEntries(function (prev) {
      return prev.concat([{ day: "Mon", startTime: "", endTime: "" }]);
    });
  }

  function updateScheduleEntry(index, field, value) {
    setScheduleEntries(function (prev) {
      var next = prev.slice();
      var updated = {};
      for (var key in next[index]) {
        updated[key] = next[index][key];
      }
      updated[field] = value;
      next[index] = updated;
      return next;
    });
  }

  function removeScheduleEntry(index) {
    setScheduleEntries(function (prev) {
      return prev.filter(function (_, i) {
        return i !== index;
      });
    });
  }

  async function handleSave() {
    setErrors({});

    var creditsValue = undefined;
    if (courseForm.credits !== "" && courseForm.credits != null) {
      var parsed = Number(courseForm.credits);
      if (!isNaN(parsed)) {
        creditsValue = parsed;
      }
    }

    var courseId = courseForm.id.trim().toLowerCase();

    if (!courseId) {
      setErrors({ id: "Course ID is required." });
      return;
    }

    var existing = await supabase.from("courses").select("id").eq("id", courseId).maybeSingle();
    if (existing.data) {
      setErrors({ id: "A course with this ID already exists. Choose another." });
      return;
    }

    var courseData;
    try {
      courseData = courseSchema.parse({
        id: courseId,
        title: courseForm.title,
        department: courseForm.department || undefined,
        term: courseForm.term || undefined,
        credits: creditsValue,
        description: courseForm.description || undefined,
      });
    } catch (err) {
      var fieldErrors = {};
      err.issues.forEach(function (issue) {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!instructorId) {
      setErrors({ instructor: "Please select an instructor." });
      return;
    }

    if (scheduleEntries.length > 0) {
      for (var idx = 0; idx < scheduleEntries.length; idx++) {
        var entry = scheduleEntries[idx];
        if (!entry.startTime || !entry.endTime) {
          setErrors({ save: "All schedule entries must have start and end times." });
          return;
        }
        if (!TIME_REGEX.test(entry.startTime) || !TIME_REGEX.test(entry.endTime)) {
          setErrors({ save: "Schedule times must be in HH:MM format (e.g. 09:30)." });
          return;
        }
        var startDec = timeStringToDecimal(entry.startTime);
        var endDec = timeStringToDecimal(entry.endTime);
        if (startDec >= endDec) {
          setErrors({ save: "Start time must be before end time." });
          return;
        }
      }
    }

    var selectedInstructor = instructors.find(function (inst) {
      return inst.id === instructorId;
    });

    setSaving(true);
    try {
      var coursePayload = Object.assign({}, courseData, {
        instructor_id: instructorId,
        instructor_name: selectedInstructor ? selectedInstructor.name : "",
        instructor_email: selectedInstructor ? selectedInstructor.email : "",
      });

      var createdCourse = await createCourse(coursePayload);
      var courseId = createdCourse.id;

      if (scheduleEntries.length > 0) {
        var scheduleRows = scheduleEntries.map(function (entry) {
          return {
            course_code: courseId,
            day: entry.day,
            start_hour: timeStringToDecimal(entry.startTime),
            end_hour: timeStringToDecimal(entry.endTime),
            time_label: entry.startTime + " - " + entry.endTime,
            course_id: courseId,
          };
        });
        var result = await supabase.from("schedule_classes").insert(scheduleRows);
        if (result.error) throw new Error(result.error.message);
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setErrors({ save: err.message });
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8 pb-14">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight">Create New Course</h1>
          <p className="text-sm text-gray-500 mt-1">Set up a new course and assign an instructor.</p>
        </div>

        {/* Error banner */}
        {errors.save && (
          <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors.save}
          </div>
        )}

        <div className="space-y-6">
          {/* Course Details Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Course Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Course ID
                </label>
                <input
                  type="text"
                  name="id"
                  value={courseForm.id}
                  onChange={handleFormChange}
                  placeholder="e.g. cs401"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-500"
                />
                {errors.id && (
                  <p className="mt-1 text-xs text-red-600">{errors.id}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Course Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={courseForm.title}
                  onChange={handleFormChange}
                  placeholder="e.g. Machine Learning"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-500"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={courseForm.department}
                  onChange={handleFormChange}
                  placeholder="e.g. Computer Science"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Term
                </label>
                <input
                  type="text"
                  name="term"
                  value={courseForm.term}
                  onChange={handleFormChange}
                  placeholder="e.g. Fall 2024"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Credits
                </label>
                <input
                  type="number"
                  name="credits"
                  value={courseForm.credits}
                  onChange={handleFormChange}
                  placeholder="e.g. 3"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-500"
                />
                {errors.credits && (
                  <p className="mt-1 text-xs text-red-600">{errors.credits}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={courseForm.description}
                  onChange={handleFormChange}
                  placeholder="Brief course description..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Instructor Assignment Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Instructor Assignment</h2>
            {loadingInstructors ? (
              <p className="text-sm text-gray-400">Loading instructors...</p>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Select Instructor
                </label>
                <select
                  value={instructorId}
                  onChange={handleInstructorChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-500"
                >
                  <option value="">-- Choose an instructor --</option>
                  {instructors.map(function (inst) {
                    return (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} ({inst.email})
                      </option>
                    );
                  })}
                </select>
                {errors.instructor && (
                  <p className="mt-1 text-xs text-red-600">{errors.instructor}</p>
                )}
              </div>
            )}
          </div>

          {/* Schedule Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Schedule</h2>
              <button
                type="button"
                onClick={addScheduleEntry}
                className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-500 transition hover:border-teal-700 hover:bg-teal-50 hover:text-teal-700"
              >
                <PlusCircle size={16} />
                Add Class Time
              </button>
            </div>

            {scheduleEntries.length === 0 ? (
              <p className="text-sm text-gray-400">No class times added yet.</p>
            ) : (
              <div className="space-y-3">
                {scheduleEntries.map(function (entry, index) {
                  return (
                    <div
                      key={index}
                      className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 p-3"
                    >
                      <div className="w-full sm:w-auto sm:flex-1 min-w-0">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Day
                        </label>
                        <select
                          value={entry.day}
                          onChange={function (e) {
                            updateScheduleEntry(index, "day", e.target.value);
                          }}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-700"
                        >
                          {DAYS.map(function (day) {
                            return (
                              <option key={day.id} value={day.id}>
                                {day.label}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Start Time
                        </label>
                        <input
                          type="text"
                          value={entry.startTime}
                          onChange={function (e) {
                            updateScheduleEntry(index, "startTime", e.target.value);
                          }}
                          placeholder="e.g. 09:00"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-700"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          End Time
                        </label>
                        <input
                          type="text"
                          value={entry.endTime}
                          onChange={function (e) {
                            updateScheduleEntry(index, "endTime", e.target.value);
                          }}
                          placeholder="e.g. 10:30"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-700"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={function () {
                          removeScheduleEntry(index);
                        }}
                        className="self-end rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Save / Cancel */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={function () {
                navigate("/admin/dashboard");
              }}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Create Course"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
