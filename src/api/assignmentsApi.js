import { supabase } from '../lib/supabaseClient';

export async function getAssignments(courseId) {
  var _a = await supabase
    .from('assignments')
    .select('*')
    .eq('course_id', courseId)
    .order('id', { ascending: false });
  if (_a.error) throw new Error(_a.error.message);
  return _a.data;
}

export async function createAssignment(assignment) {
  var _a = await supabase
    .from('assignments')
    .insert(assignment)
    .select()
    .single();
  if (_a.error) throw new Error(_a.error.message);
  return _a.data;
}

export async function updateAssignment(id, updates) {
  var _a = await supabase
    .from('assignments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (_a.error) throw new Error(_a.error.message);
  return _a.data;
}

export async function deleteAssignment(id) {
  var _a = await supabase.from('assignments').delete().eq('id', id);
  if (_a.error) throw new Error(_a.error.message);
}

export async function getSubmissions(assignmentId, userId) {
  var query = supabase
    .from('assignment_submissions')
    .select('*')
    .eq('assignment_id', assignmentId);
  if (userId) {
    query = query.eq('user_id', userId);
  }
  var _a = await query;
  if (_a.error) throw new Error(_a.error.message);
  return _a.data;
}

export async function submitAssignment(assignmentId, userId, submissionText, fileUrl) {
  var _a = await supabase
    .from('assignment_submissions')
    .insert({
      assignment_id: assignmentId,
      user_id: userId,
      submission_text: submissionText,
      file_url: fileUrl,
    })
    .select()
    .single();
  if (_a.error) throw new Error(_a.error.message);
  return _a.data;
}

export async function registerForCourse(userId, code, title, instructor, term) {
  var _a = await supabase
    .from('my_courses')
    .insert({
      user_id: userId,
      code: code,
      title: title,
      description: '',
      instructor: instructor,
      progress: 0,
      term: term,
      status_text: 'Just enrolled',
      status_type: 'success',
      banner_key: 'computer-science',
    })
    .select()
    .single();
  if (_a.error) throw new Error(_a.error.message);
  return _a.data;
}
