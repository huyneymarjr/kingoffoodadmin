import { apiAdmin } from './Config/baseApi';

export const loginAdmin = async (data: { password: string; username: string }) => {
  return await apiAdmin.post('/admin/login', data);
};
export const signupAdmin = async (data: { email: string; fullname: string; password: string }) => {
  return await apiAdmin.post('/admin/register', data);
};
