// LoginPage.jsx
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../validation/loginSchema';

export default function LoginPage() {
  var { login, isLoggedIn, user } = useAuth();
  var navigate = useNavigate();
  var location = useLocation();

  var [email, setEmail] = useState('');
  var [password, setPassword] = useState('');
  var [fieldErrors, setFieldErrors] = useState({});
  var [error, setError] = useState('');
  var [submitting, setSubmitting] = useState(false);

  // Already logged in? Bounce to their dashboard.
  if (isLoggedIn) {
    var redirectTo = location.state?.from?.pathname || '/' + user.role + '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  function handleChangeEmail(e) {
    setEmail(e.target.value);
    setFieldErrors(function (prev) { var next = { ...prev }; delete next.email; return next; });
    setError('');
  }

  function handleChangePassword(e) {
    setPassword(e.target.value);
    setFieldErrors(function (prev) { var next = { ...prev }; delete next.password; return next; });
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    var parsed = loginSchema.safeParse({ email: email, password: password });
    if (!parsed.success) {
      var zodErrors = {};
      for (var i = 0; i < parsed.error.issues.length; i++) {
        var issue = parsed.error.issues[i];
        zodErrors[issue.path[0]] = issue.message;
      }
      setFieldErrors(zodErrors);
      return;
    }

    setSubmitting(true);
    try {
      var loggedInUser = await login(email, password);
      var redirectTo = location.state?.from?.pathname || '/' + loggedInUser.role + '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
      >
        <h1 className="mb-6 text-xl font-semibold">Sign in</h1>

        <label className="mb-1 block text-sm text-gray-600">Email</label>
        <input
          type="email"
          value={email}
          onChange={handleChangeEmail}
          className={`mb-1 w-full rounded-md border px-3 py-2 text-sm ${fieldErrors.email ? 'border-red-400' : 'border-gray-300'}`}
          required
        />
        {fieldErrors.email && (
          <p className="mb-3 text-xs text-red-600">{fieldErrors.email}</p>
        )}
        {!fieldErrors.email && <div className="mb-3" />}

        <label className="mb-1 block text-sm text-gray-600">Password</label>
        <input
          type="password"
          value={password}
          onChange={handleChangePassword}
          className={`mb-1 w-full rounded-md border px-3 py-2 text-sm ${fieldErrors.password ? 'border-red-400' : 'border-gray-300'}`}
          required
        />
        {fieldErrors.password && (
          <p className="mb-3 text-xs text-red-600">{fieldErrors.password}</p>
        )}
        {!fieldErrors.password && <div className="mb-3" />}

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-gray-900 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
