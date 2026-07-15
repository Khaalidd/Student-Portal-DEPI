import { supabase } from '../lib/supabaseClient';

export async function getInstructorActiveCourses() {
  const { data, error } = await supabase
    .from('instructor_active_courses')
    .select('*');
  if (error) throw new Error(error.message);
  return data;
}

export async function getInstructorAlerts() {
  const { data, error } = await supabase.from('instructor_alerts').select('*');
  if (error) throw new Error(error.message);
  return data;
}

export async function getStudentMetrics(userId) {
  var query = supabase.from('student_metrics').select('*');
  if (userId) {
    query = query.eq('user_id', userId);
  }
  var _a = await query;
  if (_a.error) throw new Error(_a.error.message);
  return _a.data;
}

export async function getMyCourses(userId) {
  var query = supabase.from('my_courses').select('*');
  if (userId) {
    query = query.eq('user_id', userId);
  }
  var _a = await query;
  if (_a.error) throw new Error(_a.error.message);
  return _a.data;
}

export async function getAdminStats() {
  const { data, error } = await supabase.from('admin_stats').select('*');
  if (error) throw new Error(error.message);
  return data;
}

export async function getAdmins() {
  const { data, error } = await supabase.from('admins').select('*');
  if (error) throw new Error(error.message);
  return data;
}
