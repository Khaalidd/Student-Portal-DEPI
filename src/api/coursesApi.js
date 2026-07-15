import { supabase } from '../lib/supabaseClient';

export async function getCourse(courseId) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getAllCourses() {
  const { data, error } = await supabase.from('courses').select('*');
  if (error) throw new Error(error.message);
  return data;
}

export async function createCourse(course) {
  const { data, error } = await supabase
    .from('courses')
    .insert(course)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateCourse(id, updates) {
  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCourse(id) {
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function getCourseStudents(courseId) {
  const { data, error } = await supabase
    .from('course_students')
    .select('*')
    .eq('course_id', courseId);
  if (error) throw new Error(error.message);
  return data;
}

export async function getCourseSessions(courseId) {
  const { data, error } = await supabase
    .from('course_sessions')
    .select('*')
    .eq('course_id', courseId)
    .order('id');
  if (error) throw new Error(error.message);
  return data;
}

export async function createCourseSession(session) {
  const { data, error } = await supabase
    .from('course_sessions')
    .insert(session)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getCourseWeeks(courseId) {
  const { data, error } = await supabase
    .from('course_weeks')
    .select('*')
    .eq('course_id', courseId)
    .order('id');
  if (error) throw new Error(error.message);
  return data;
}

export async function getWeekMaterials(weekId) {
  const { data, error } = await supabase
    .from('course_materials')
    .select('*')
    .eq('week_id', weekId);
  if (error) throw new Error(error.message);
  return data;
}

export async function getCourseFiles(courseId) {
  const { data, error } = await supabase
    .from('course_files')
    .select('*')
    .eq('course_id', courseId);
  if (error) throw new Error(error.message);
  return data;
}
