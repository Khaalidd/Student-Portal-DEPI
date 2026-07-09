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

  // We will connect this to the real API later.
  async function login(email, password) {
    throw new Error('login() is not connected to an API yet.');
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