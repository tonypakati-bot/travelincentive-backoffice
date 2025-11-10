import { useState, useEffect, useCallback } from 'react';
import { getProfile } from "../src/services/authService";
import { Profile } from '../types';

export interface AuthHook {
  user: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const useAuth = (): AuthHook => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      setError('Errore nel caricamento del profilo');
      localStorage.removeItem('token');
    }
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await refreshProfile();
        // Se il refresh del profilo ha successo, siamo autenticati
        setIsAuthenticated(true);
      } catch (error) {
        // Se c'è un errore, rimuoviamo il token non valido
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [refreshProfile]);

  const login = async (token: string) => {
    localStorage.setItem('token', token);
    setLoading(true);
    try {
      await refreshProfile();
      // Se il refresh è riuscito, aggiorniamo lo stato
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      // Se fallisce, rimuoviamo il token e manteniamo lo stato non autenticato
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    // Rimuovi il token
    localStorage.removeItem('token');
    
    // Resetta lo stato
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    
    // Pulisci eventuali altri dati salvati
    localStorage.removeItem('user_preferences');
    sessionStorage.clear();
    
    // Reindirizza alla pagina di login
    window.location.href = '/';
  }, []);

  return { user, loading, error, isAuthenticated, login, logout, refreshProfile };
};

export default useAuth;
