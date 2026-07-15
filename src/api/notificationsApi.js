import { supabase } from '../lib/supabaseClient';

export async function getNotifications(userId) {
  var query = supabase.from('notifications').select('*');
  if (userId) {
    query = query.eq('user_id', userId);
  }
  var _a = await query;
  if (_a.error) throw new Error(_a.error.message);
  return _a.data;
}

export async function markNotificationRead(id) {
  var _a = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id);
  if (_a.error) throw new Error(_a.error.message);
}

export async function markAllNotificationsRead(userId) {
  var query = supabase
    .from('notifications')
    .update({ read: true })
    .eq('read', false);
  if (userId) {
    query = query.eq('user_id', userId);
  }
  var _a = await query;
  if (_a.error) throw new Error(_a.error.message);
}
