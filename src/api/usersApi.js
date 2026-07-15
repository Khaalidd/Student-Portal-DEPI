import { supabase } from '../lib/supabaseClient';

export async function getUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw new Error(error.message);
  return data;
}

export async function createUser(user) {
  const { data, error } = await supabase.from('users').insert(user).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateUser(id, updates) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteUser(id) {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function changeUserPassword(id, currentPassword, newPassword) {
  // First, verify current password
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('password')
    .eq('id', id)
    .single();

  if (fetchError || !user) {
    throw new Error('User not found or database error.');
  }

  if (user.password !== currentPassword) {
    throw new Error('Current password is incorrect.');
  }

  // Update to new password
  const { data, error: updateError } = await supabase
    .from('users')
    .update({ password: newPassword })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    throw new Error(updateError.message);
  }

  return data;
}

