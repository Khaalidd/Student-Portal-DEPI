import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env file
const envFile = fs.readFileSync(path.resolve('.env'), 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  try {
    console.log('Starting seed process...');

    // 1. Insert Users
    console.log('Inserting users...');
    const { data: users, error: userError } = await supabase.from('users').upsert([
      { name: 'Alice Admin', email: 'admin@depi.edu', role: 'admin', password: 'password123', phone: '123-456-7890', bio: 'System Administrator', status: 'Active' },
      { name: 'Dr. Bob Smith', email: 'bob@depi.edu', role: 'instructor', password: 'password123', phone: '234-567-8901', bio: 'Computer Science Professor', status: 'Active' },
      { name: 'Charlie Student', email: 'charlie@depi.edu', role: 'student', password: 'password123', phone: '345-678-9012', bio: 'CS Major', status: 'Active' },
      { name: 'Khaled', email: 'khaled@depi.edu', role: 'student', password: 'password123', phone: '456-789-0123', bio: 'IT Major', status: 'Active' }
    ], { onConflict: 'email' }).select();

    if (userError) throw userError;
    
    const admin = users.find(u => u.role === 'admin');
    const instructor = users.find(u => u.role === 'instructor');
    const student = users.find(u => u.email === 'charlie@depi.edu');
    const khaled = users.find(u => u.email === 'khaled@depi.edu');

    // 2. Insert Courses
    console.log('Inserting courses...');
    const { data: courses, error: courseError } = await supabase.from('courses').upsert([
      { id: 'cs301', title: 'Web Development', instructor_id: instructor.id, term: 'Fall 2024', credits: 3, description: 'Learn React and Node.js', instructor_name: instructor.name, department: 'CS' },
      { id: 'cs302', title: 'Database Systems', instructor_id: instructor.id, term: 'Fall 2024', credits: 3, description: 'Learn SQL and NoSQL', instructor_name: instructor.name, department: 'CS' }
    ], { onConflict: 'id' }).select();

    if (courseError) throw courseError;

    // 3. Insert Course Students
    console.log('Inserting course_students...');
    const { error: enrollError } = await supabase.from('course_students').upsert([
      { id: `reg-${student.id}-cs301`, course_id: 'cs301', user_id: student.id, name: student.name, status: 'Active' },
      { id: `reg-${student.id}-cs302`, course_id: 'cs302', user_id: student.id, name: student.name, status: 'Active' },
      { id: `reg-${khaled.id}-cs301`, course_id: 'cs301', user_id: khaled.id, name: khaled.name, status: 'Active' },
      { id: `reg-${khaled.id}-cs302`, course_id: 'cs302', user_id: khaled.id, name: khaled.name, status: 'Active' }
    ], { onConflict: 'id' });
    if (enrollError) throw enrollError;

    // 4. Insert My Courses
    console.log('Inserting my_courses...');
    const { error: myCourseError } = await supabase.from('my_courses').insert([
      { user_id: student.id, code: 'cs301', title: 'Web Development', description: 'Learn React', instructor: instructor.name, progress: 50, term: 'Fall 2024', status_text: 'Active', status_type: 'success', banner_key: 'computer-science' },
      { user_id: student.id, code: 'cs302', title: 'Database Systems', description: 'Learn SQL', instructor: instructor.name, progress: 20, term: 'Fall 2024', status_text: 'Active', status_type: 'success', banner_key: 'computer-science' },
      { user_id: khaled.id, code: 'cs301', title: 'Web Development', description: 'Learn React', instructor: instructor.name, progress: 85, term: 'Fall 2024', status_text: 'Active', status_type: 'success', banner_key: 'computer-science' },
      { user_id: khaled.id, code: 'cs302', title: 'Database Systems', description: 'Learn SQL', instructor: instructor.name, progress: 95, term: 'Fall 2024', status_text: 'Active', status_type: 'success', banner_key: 'computer-science' }
    ]);
    if (myCourseError) throw myCourseError;

    // 5. Insert Assignments
    console.log('Inserting assignments...');
    const { data: assignments, error: assignmentError } = await supabase.from('assignments').insert([
      { course_id: 'cs301', title: 'React Project', description: 'Build a dashboard', due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
      { course_id: 'cs302', title: 'SQL Query', description: 'Write a complex query', due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() }
    ]).select();
    if (assignmentError) throw assignmentError;

    // 6. Insert Gradebook Entries
    console.log('Inserting gradebook entries...');
    const { error: gradeError } = await supabase.from('gradebook_entries').upsert([
      { id: `gb-${student.id}-cs301`, course_id: 'cs301', name: student.name, hw1: 95, quiz1: 90, midterm: 85, hw2: 92, overall: '90%' },
      { id: `gb-${student.id}-cs302`, course_id: 'cs302', name: student.name, hw1: 88, quiz1: 85, midterm: 80, hw2: 89, overall: '85%' },
      { id: `gb-${khaled.id}-cs301`, course_id: 'cs301', name: khaled.name, hw1: 100, quiz1: 95, midterm: 98, hw2: 99, overall: '98%' },
      { id: `gb-${khaled.id}-cs302`, course_id: 'cs302', name: khaled.name, hw1: 90, quiz1: 92, midterm: 89, hw2: 95, overall: '91.5%' }
    ], { onConflict: 'id' });
    if (gradeError) throw gradeError;

    // 7. Insert Notifications
    console.log('Inserting notifications...');
    const { error: notifError } = await supabase.from('notifications').insert([
      { user_id: student.id, day: 'Today', category_id: 'academic', type: 'urgent', source_label: 'CS301', title: 'New Assignment', description: 'React Project is due in 7 days.', time_label: '10 mins ago', read: false },
      { user_id: student.id, day: 'Today', category_id: 'academic', type: 'success', source_label: 'CS302', title: 'Grade Posted', description: 'Your Midterm grade is 80.', time_label: '1 hr ago', read: false },
      { user_id: khaled.id, day: 'Today', category_id: 'academic', type: 'success', source_label: 'CS301', title: 'Perfect Score!', description: 'You received a 100 on HW1.', time_label: '5 mins ago', read: false },
      { user_id: khaled.id, day: 'Yesterday', category_id: 'academic', type: 'urgent', source_label: 'CS302', title: 'Upcoming Quiz', description: 'Quiz 2 is tomorrow.', time_label: '1 day ago', read: false }
    ]);
    if (notifError) throw notifError;

    console.log('Database seeded successfully! 🎉');
  } catch (error) {
    console.error('Error seeding database:', error.message || error);
    if (error.cause) console.error('Cause:', error.cause);
    if (error.stack) console.error('Stack:', error.stack);
  }
}

seed();
