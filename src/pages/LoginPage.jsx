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
  var [showPassword, setShowPassword] = useState(false);
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
    <div className="flex h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white p-8 md:p-10 shadow-xs flex flex-col items-center"
      >
        {/* Logo Icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-800 text-white mb-4">
          <svg className="h-7 w-7 text-teal-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">EduPortal</h1>
        <p className="text-xs text-slate-500 mt-1 mb-6 text-center">Welcome back. Please enter your details.</p>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 w-full rounded-lg bg-red-50 border border-red-100 p-3">
            <p className="text-xs font-medium text-red-600">{error}</p>
          </div>
        )}

        {/* Student ID / Email Field */}
        <label className="mb-1.5 block text-xs font-semibold text-slate-700 w-full">Student ID or Email</label>
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          <input
            type="email"
            value={email}
            onChange={handleChangeEmail}
            placeholder="Enter your ID or email"
            className={`w-full rounded-lg border pl-10 pr-3 py-2.5 text-sm outline-none transition duration-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600/30 ${
              fieldErrors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-slate-200'
            }`}
            required
          />
        </div>
        {fieldErrors.email && (
          <p className="mt-1 text-[11px] text-red-600 self-start">{fieldErrors.email}</p>
        )}
        <div className="mb-4" />

        {/* Password Field */}
        <label className="mb-1.5 block text-xs font-semibold text-slate-700 w-full">Password</label>
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handleChangePassword}
            placeholder="••••••••"
            className={`w-full rounded-lg border pl-10 pr-10 py-2.5 text-sm outline-none transition duration-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600/30 ${
              fieldErrors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-slate-200'
            }`}
            required
          />
          <button
            type="button"
            onClick={function () { setShowPassword(!showPassword); }}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            {showPassword ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="mt-1 text-[11px] text-red-600 self-start">{fieldErrors.password}</p>
        )}

        {/* Remember me / Forgot Password */}
        <div className="flex w-full items-center justify-between mt-3 mb-6">
          <label className="flex items-center gap-2 text-xs text-slate-500 font-medium cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-600/30"
            />
            Remember me
          </label>
          <a href="#" onClick={function(e) { e.preventDefault(); }} className="text-xs font-semibold text-teal-700 hover:text-teal-800">
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-teal-800 py-2.5 text-sm font-semibold text-white shadow-2xs hover:bg-teal-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
          {!submitting && <span className="text-base">→</span>}
        </button>

        {/* Support Footer */}
        <p className="mt-8 text-center text-[10px] md:text-xs text-slate-500">
          Need help accessing your account?{' '}
          <a href="#" onClick={function(e) { e.preventDefault(); }} className="font-semibold text-teal-700 hover:text-teal-800">
            Contact IT Support
          </a>
        </p>
      </form>
    </div>
  );
}
