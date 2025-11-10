import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  user: {
    id: string;
  };
}

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    
    // Controlla se il token scade nei prossimi 5 minuti
    return decoded.exp > currentTime + 300;
  } catch {
    return false;
  }
};

export const getTokenExpirationTime = (token: string): number => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp * 1000; // Converte in millisecondi
  } catch {
    return 0;
  }
};

export const setupAutoLogout = (
  token: string,
  logoutCallback: () => void
): NodeJS.Timeout => {
  const expirationTime = getTokenExpirationTime(token);
  const currentTime = Date.now();
  const timeUntilExpiration = expirationTime - currentTime - 300000; // 5 minuti prima della scadenza

  return setTimeout(logoutCallback, timeUntilExpiration);
};