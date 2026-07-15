import { supabase } from '../lib/supabaseClient';

export async function getSemesters() {
  const { data, error } = await supabase.from('semesters').select('*').order('id');
  if (error) throw new Error(error.message);
  return data;
}

export async function getSemesterCourses() {
  const { data, error } = await supabase
    .from('semester_courses')
    .select('*')
    .order('id');
  if (error) throw new Error(error.message);
  return data;
}
