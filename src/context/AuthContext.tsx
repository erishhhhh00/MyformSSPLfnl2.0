import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

export type UserRole = 'user' | 'admin' | 'assessor' | 'moderator';

// Storage keys
const TOKEN_KEY = 'hye_auth_token';
const USER_KEY = 'hye_auth_user';

// Legacy session storage keys (for backward compatibility)
const SESSION_KEYS = {
  admin: 'hye_admin_session',
  assessor: 'hye_assessor_session',
  moderator: 'hye_moderator_session',
};

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  // New: Real user management
  user: User | null;
  token: string | null;
  isLoading: boolean;
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => void;

  // Legacy: Backward compatible
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAdmin: boolean;
  isLoggedIn: boolean;
  login: (role?: UserRole) => void;
  logout: (role?: UserRole) => void;
  isAdminLoggedIn: boolean;
  isAssessorLoggedIn: boolean;
  isModeratorLoggedIn: boolean;
  loginAsAdmin: () => void;
  loginAsAssessor: () => void;
  loginAsModerator: () => void;
  logoutAdmin: () => void;
  logoutAssessor: () => void;
  logoutModerator: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // New: Real user state
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Legacy: Role-based state
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isAssessorLoggedIn, setIsAssessorLoggedIn] = useState<boolean>(false);
  const [isModeratorLoggedIn, setIsModeratorLoggedIn] = useState<boolean>(false);

  // Load persisted sessions on mount
  useEffect(() => {
    // Check for new auth token first
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      const userData = JSON.parse(storedUser) as User;
      setToken(storedToken);
      setUser(userData);
      setUserRole(userData.role);
      setIsLoggedIn(true);

      // Set role-specific flags
      if (userData.role === 'admin') setIsAdminLoggedIn(true);
      if (userData.role === 'assessor') setIsAssessorLoggedIn(true);
      if (userData.role === 'moderator') setIsModeratorLoggedIn(true);

      // Verify token is still valid
      verifyToken(storedToken);
    } else {
      // Fall back to legacy session check
      const adminSession = localStorage.getItem(SESSION_KEYS.admin);
      const assessorSession = localStorage.getItem(SESSION_KEYS.assessor);
      const moderatorSession = localStorage.getItem(SESSION_KEYS.moderator);

      if (adminSession === 'true') {
        setIsAdminLoggedIn(true);
        setIsLoggedIn(true);
        setUserRole('admin');
      }
      if (assessorSession === 'true') {
        setIsAssessorLoggedIn(true);
        setIsLoggedIn(true);
        setUserRole('assessor');
      }
      if (moderatorSession === 'true') {
        setIsModeratorLoggedIn(true);
        setIsLoggedIn(true);
        setUserRole('moderator');
      }
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (authToken: string) => {
    try {
      const response = await fetch(`${api.baseUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setUserRole(userData.role);
      } else {
        // Token invalid, clear storage
        logoutUser();
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      // Don't logout on network error, just use cached data
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Login with real credentials
  const loginWithCredentials = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${api.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      // Store session
      const authToken = data.session.access_token;
      const userData: User = data.user;

      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      // Also set legacy session for compatibility
      if (userData.role === 'admin') localStorage.setItem(SESSION_KEYS.admin, 'true');
      if (userData.role === 'assessor') localStorage.setItem(SESSION_KEYS.assessor, 'true');
      if (userData.role === 'moderator') localStorage.setItem(SESSION_KEYS.moderator, 'true');

      setToken(authToken);
      setUser(userData);
      setUserRole(userData.role);
      setIsLoggedIn(true);

      if (userData.role === 'admin') setIsAdminLoggedIn(true);
      if (userData.role === 'assessor') setIsAssessorLoggedIn(true);
      if (userData.role === 'moderator') setIsModeratorLoggedIn(true);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // NEW: Logout real user
  const logoutUser = async () => {
    // Clear localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SESSION_KEYS.admin);
    localStorage.removeItem(SESSION_KEYS.assessor);
    localStorage.removeItem(SESSION_KEYS.moderator);

    // Clear Supabase session
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut error:', e);
    }

    // Clear state
    setToken(null);
    setUser(null);
    setUserRole('user');
    setIsLoggedIn(false);
    setIsAdminLoggedIn(false);
    setIsAssessorLoggedIn(false);
    setIsModeratorLoggedIn(false);
  };

  // ========================================
  // LEGACY FUNCTIONS (backward compatible)
  // ========================================

  const loginAsAdmin = () => {
    setIsAdminLoggedIn(true);
    setIsLoggedIn(true);
    setUserRole('admin');
    localStorage.setItem(SESSION_KEYS.admin, 'true');
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setIsLoggedIn(false);
    setUserRole('user');
    localStorage.removeItem(SESSION_KEYS.admin);
    logoutUser();
  };

  const loginAsAssessor = () => {
    setIsAssessorLoggedIn(true);
    setIsLoggedIn(true);
    setUserRole('assessor');
    localStorage.setItem(SESSION_KEYS.assessor, 'true');
  };

  const logoutAssessor = () => {
    setIsAssessorLoggedIn(false);
    setIsLoggedIn(false);
    setUserRole('user');
    localStorage.removeItem(SESSION_KEYS.assessor);
    logoutUser();
  };

  const loginAsModerator = () => {
    setIsModeratorLoggedIn(true);
    setIsLoggedIn(true);
    setUserRole('moderator');
    localStorage.setItem(SESSION_KEYS.moderator, 'true');
  };

  const logoutModerator = () => {
    setIsModeratorLoggedIn(false);
    setIsLoggedIn(false);
    setUserRole('user');
    localStorage.removeItem(SESSION_KEYS.moderator);
    logoutUser();
  };

  const login = (role: UserRole = 'admin') => {
    if (role === 'admin') loginAsAdmin();
    else if (role === 'assessor') loginAsAssessor();
    else if (role === 'moderator') loginAsModerator();
    else {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  };

  const logout = (role?: UserRole) => {
    if (role === 'admin') logoutAdmin();
    else if (role === 'assessor') logoutAssessor();
    else if (role === 'moderator') logoutModerator();
    else {
      if (userRole === 'admin') logoutAdmin();
      else if (userRole === 'assessor') logoutAssessor();
      else if (userRole === 'moderator') logoutModerator();
      else {
        setIsLoggedIn(false);
        setUserRole('user');
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      // New auth
      user,
      token,
      isLoading,
      loginWithCredentials,
      logoutUser,
      // Legacy
      userRole,
      setUserRole,
      isAdmin: userRole === 'admin',
      isLoggedIn,
      login,
      logout,
      isAdminLoggedIn,
      isAssessorLoggedIn,
      isModeratorLoggedIn,
      loginAsAdmin,
      loginAsAssessor,
      loginAsModerator,
      logoutAdmin,
      logoutAssessor,
      logoutModerator,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};