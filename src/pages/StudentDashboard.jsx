import { useAuth } from '../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const userName = user?.name?.split(' ')[0] || 'Alex';

  // Mock data representing a unified set of dashboard records
  const metrics = [
    {
      title: 'Cumulative GPA',
      value: '3.84',
      trend: '+0.02 from last semester',
      icon: (
        <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: 'Credits Earned',
      value: '72 / 120',
      progress: 60,
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Missing Assignments',
      value: '2',
      trend: 'View urgent items →',
      trendColor: 'text-red-600 font-medium hover:text-red-700 cursor-pointer',
      isAlert: true,
      icon: (
        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  ];

  const schedule = [
    {
      time: '10:00 AM',
      endTime: '11:15 AM',
      code: 'CS301',
      name: 'Data Structures',
      location: 'Science Building, Room 402',
      isOnline: false,
      action: 'Details',
      actionStyle: 'outline',
    },
    {
      time: '01:00 PM',
      endTime: '02:30 PM',
      code: 'CS350',
      name: 'Web Architecture',
      location: 'Online - Zoom',
      isOnline: true,
      badge: 'QUIZ TODAY',
      action: 'Join',
      actionStyle: 'solid',
    },
  ];

  const recentGrades = [
    {
      course: 'CS301',
      assignment: 'Midterm Project',
      score: '92%',
      scoreColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    {
      course: 'ENG205',
      assignment: 'Essay Draft',
      score: '85%',
      scoreColor: 'bg-blue-50 text-blue-700 border-blue-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Desktop Weather Alert Banner */}
      <div className="hidden md:flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800 shadow-xs">
        <svg className="h-5 w-5 shrink-0 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
        <div>
          <span className="font-bold">Campus Weather Alert: </span>
          All afternoon classes are moved online due to impending severe weather conditions. Please check your course portals for Zoom links.
        </div>
      </div>

      {/* 2. Mobile Weather Widget */}
      <div className="md:hidden flex items-center justify-between rounded-xl bg-blue-50 border border-blue-100 p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-900">Campus Weather</h4>
            <p className="text-xs text-blue-700 mt-0.5">Mild conditions today. No expected disruptions.</p>
          </div>
        </div>
        <span className="text-xl font-bold text-blue-900">68°F</span>
      </div>

      {/* 3. Welcome / Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {/* Responsive title text */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            <span className="hidden md:inline">Good morning, {userName}.</span>
            <span className="md:hidden">Welcome back, {userName}.</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            <span className="hidden md:inline">Computer Science Major • Junior Year</span>
            <span className="md:hidden">Here's what's happening today.</span>
          </p>
        </div>
        <button className="self-start md:self-auto rounded-lg bg-teal-800 hover:bg-teal-900 text-white px-4 py-2 text-sm font-semibold shadow-xs transition-colors cursor-pointer">
          Register for Spring
        </button>
      </div>

      {/* 4. Metric KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className={`rounded-xl border bg-white p-5 shadow-xs transition-all hover:shadow-sm ${
              m.isAlert ? 'border-red-100' : 'border-gray-150'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  {m.title}
                </p>
                <h3 className={`mt-2 text-2xl md:text-3xl font-bold tracking-tight ${
                  m.isAlert ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {m.value}
                </h3>
              </div>
              <div className={`rounded-lg p-2 ${m.isAlert ? 'bg-red-50' : 'bg-gray-50'}`}>
                {m.icon}
              </div>
            </div>

            {m.progress !== undefined && (
              <div className="mt-4">
                <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-teal-600 transition-all duration-500"
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              </div>
            )}

            {m.trend && (
              <p className={`mt-3 text-xs ${m.trendColor || 'text-gray-400'}`}>
                {m.trend}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* 5. Main Dashboard Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Schedule */}
        <div className="lg:col-span-2 rounded-xl border border-gray-150 bg-white p-5 md:p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <h3 className="text-base font-bold text-gray-900">Today's Schedule</h3>
            <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer">
              View Calendar
            </button>
          </div>

          <div className="space-y-4">
            {schedule.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Time block */}
                  <div className="w-20 shrink-0 text-left sm:border-r border-gray-200 sm:pr-4">
                    <span className="block text-xs font-bold text-gray-900">{item.time}</span>
                    <span className="block text-[10px] font-medium text-gray-400 mt-0.5">{item.endTime}</span>
                  </div>

                  {/* Course info */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      {item.name} ({item.code})
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                      {item.isOnline ? (
                        <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      <span>{item.location}</span>
                    </div>

                    {/* Badge below info on mobile, inline otherwise */}
                    {item.badge && (
                      <span className="inline-block mt-2 sm:mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-100 text-red-700 border border-red-200">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Course actions */}
                <button
                  className={`self-start sm:self-auto px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
                    item.actionStyle === 'solid'
                      ? 'bg-teal-700 text-white hover:bg-teal-800'
                      : 'border border-teal-600 text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Grades & Action Required */}
        <div className="space-y-6 flex flex-col">
          {/* Grades Card */}
          <div className="rounded-xl border border-gray-150 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h3 className="text-base font-bold text-gray-900">Recent Grades</h3>
              <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer">
                All Grades
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-2">Assignment</th>
                    <th className="pb-2 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentGrades.map((grade, idx) => (
                    <tr key={idx} className="text-xs">
                      <td className="py-3">
                        <p className="font-bold text-gray-900">{grade.assignment}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{grade.course}</p>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold border ${grade.scoreColor}`}>
                          {grade.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Required Box */}
          <div className="rounded-xl border border-red-100 bg-red-50/50 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-red-800">
              <svg className="h-4.5 w-4.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Action Required</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-red-100 bg-white shadow-2xs">
              <div>
                <h5 className="text-xs font-bold text-red-800">Lab Report 4</h5>
                <p className="text-[10px] text-gray-400 mt-0.5">Due: Yesterday</p>
              </div>
              <button className="text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}