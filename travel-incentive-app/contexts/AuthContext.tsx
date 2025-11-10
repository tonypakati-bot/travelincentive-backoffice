import React, { createContext, useContext, ReactNode } from 'react';
import useAuth, { AuthHook } from '../hooks/useAuth';

const AuthContext = createContext<AuthHook | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthHook => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
