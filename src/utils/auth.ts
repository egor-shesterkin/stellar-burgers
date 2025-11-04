import { getCookie } from './cookie';

export const isAuthenticated = (): boolean => {
  const accessToken = getCookie('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  return !!(accessToken && refreshToken);
};

export const getAccessToken = (): string | undefined =>
  getCookie('accessToken');
