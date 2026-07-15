import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

var AuthContext = createContext(null);
var STORAGE_KEY = 'spd_user';

export function AuthProvider({ children }) {
  var [user, setUser] = useState(null);
  var [loading, setLoading] = useState(true);

  // When the app first loads, check if we already saved a user before.
  useEffect(function () {
    var savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login against the real Supabase users table with password check.
  async function login(email, password) {
    var _a = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (_a.error) {
      throw new Error('Something went wrong. Please try again.');
    }

    var dbUser = _a.data;

    if (!dbUser) {
      throw new Error('No account found with that email.');
    }

    if (dbUser.password !== password) {
      throw new Error('Invalid email or password.');
    }

    var authenticatedUser = {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
      name: dbUser.name,
      phone: dbUser.phone,
      bio: dbUser.bio,
    };

    // Update last_login
    supabase
      .from('users')
      .update({ last_login: 'Just now' })
      .eq('id', dbUser.id)
      .then(function () {});

    setUser(authenticatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
    return authenticatedUser;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  var isLoggedIn = user !== null;

  var authValue = {
    user: user,
    loading: loading,
    isLoggedIn: isLoggedIn,
    login: login,
    logout: logout,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
