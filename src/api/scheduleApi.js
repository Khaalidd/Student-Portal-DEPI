import { supabase } from '../lib/supabaseClient';

export async function getScheduleClasses() {
  const { data, error } = await supabase.from('schedule_classes').select('*');
  if (error) throw new Error(error.message);
  return data;
}
