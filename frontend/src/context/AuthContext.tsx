// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// 1. Definisikan bentuk state dan data pengguna
interface User {
  username: string;
  userId: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

// 2. Definisikan Aksi yang bisa dilakukan
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'LOGOUT' };

// 3. Buat Context
const AuthContext = createContext<{
  state: AuthState;
  login: (token: string) => void;
  logout: () => void;
} | undefined>(undefined);

// 4. Buat Reducer untuk mengubah state
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
      };
    default:
      return state;
  }
};

// 5. Buat Provider yang akan "membungkus" aplikasi kita
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    user: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Cek localStorage saat aplikasi pertama kali load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser: { sub: string; username: string } = jwtDecode(token);
      const user: User = { userId: decodedUser.sub, username: decodedUser.username };
      dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
    }
  }, []);

  const login = (token: string) => {
    const decodedUser: { sub: string; username: string } = jwtDecode(token);
    const user: User = { userId: decodedUser.sub, username: decodedUser.username };
    localStorage.setItem('token', token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 6. Buat Custom Hook untuk mempermudah penggunaan context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};