import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'spd_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When the app first loads, check if we already saved a user before.
  // This runs one time only, because of the empty [] at the end.
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // Mock login implementation
  async function login(email, password) {
    // Simulate a brief network delay (e.g., 500ms) for a realistic feel
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (password !== '123456') {
      throw new Error('Invalid email or password.');
    }

    let role = '';
    let name = '';

    if (email === 'student@depi.com') {
      role = 'student';
      name = 'John Student';
    } else if (email === 'instructor@depi.com') {
      role = 'instructor';
      name = 'Jane Instructor';
    } else if (email === 'admin@depi.com') {
      role = 'admin';
      name = 'System Admin';
    } else {
      throw new Error('User not found. Use one of the demo emails.');
    }

    const authenticatedUser = { email, role, name };
    setUser(authenticatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
    return authenticatedUser;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  const isLoggedIn = user !== null;

  const authValue = {
    user,
    loading,
    isLoggedIn,
    login,
    logout,
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