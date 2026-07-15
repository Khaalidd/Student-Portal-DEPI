import { supabase } from '../lib/supabaseClient';

export async function getGradebookEntries(courseId) {
  const { data, error } = await supabase
    .from('gradebook_entries')
    .select('*')
    .eq('course_id', courseId);
  if (error) throw new Error(error.message);
  return data;
}

export async function updateGradebookEntry(id, updates) {
  const { data, error } = await supabase
    .from('gradebook_entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
