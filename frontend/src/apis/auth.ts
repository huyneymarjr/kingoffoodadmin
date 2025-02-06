import { apiAdmin } from './Config/baseApi';
export const login = (body: { username: string; password: string }) => {
  return apiAdmin.post('/api/v1/auth/login', body);
};

export const logout = () => {
  return apiAdmin.post('/api/v1/auth/logout');
};

export const getAccessToken = () => {
  return apiAdmin.get('/api/v1/auth/refresh');
};

export const getInfoUser = () => {
  return apiAdmin.get('/api/v1/auth/account');
};

export const getModules = () => {
  return apiAdmin.get('/api/v1/modules');
};

export const retryPassword = (body: { email: string }) => {
  return apiAdmin.post('/api/v1/auth/retry-password', body);
};

export const forgotPassword = (body: {
  code: string;
  password: string;
  confirmPassword: string;
  email: string;
}) => {
  return apiAdmin.post('/api/v1/auth/forgot-password', body);
};
export const checkCode = (body: { _id: string; code: string }) => {
  return apiAdmin.post('/api/v1/auth/check-code', body);
};
export const retryActive = (body: { email: string }) => {
  return apiAdmin.post('/api/v1/auth/retry-active', body);
};
