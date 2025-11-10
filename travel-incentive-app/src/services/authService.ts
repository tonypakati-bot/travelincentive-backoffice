import api from '../../api';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const login = async (email: string, password: string) => {
  try {
    console.log('Attempting login with:', { email, password: '***' });
    const res = await api.post('/auth/login', { email, password });
    console.log('Login response:', res.data);
    return res.data;
  } catch (error: any) {
    console.log('Login error details:', error.response?.data);
    console.log('Full error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });
    
    if (error.response?.status === 401 || error.response?.status === 400) {
      // Gestisce sia msg che message come possibili chiavi per il messaggio di errore
      const errorMessage = error.response?.data?.msg || error.response?.data?.message || 'Credenziali non valide';
      throw new AuthError(errorMessage);
    }
    if (error.code === 'ERR_NETWORK') {
      throw new AuthError('Impossibile raggiungere il server. Verifica la tua connessione.');
    }
    throw new AuthError('Errore durante il login. Riprova più tardi.');
  }
};

export const register = async (userData) => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get('/auth/profile');
  return res.data;
};
