import { apiAdmin } from './Config/baseApi';

export const registerUser = (body: {
  name: string;
  phoneNumber: number;
  email: string;
  password: string;
  address: string;
  role: string;
}) => {
  return apiAdmin.post('/api/v1/users', body);
};

export const getListUser = (params: { current: number; pageSize: number; isDeleted: 'true' | 'false' }) => {
  return apiAdmin.get(
    `/api/v1/users?current=${params.current}&pageSize=${params.pageSize}&isDeleted=${params.isDeleted}`,
  );
};

export const updateUser = (params: { id: string }, body: any) => {
  return apiAdmin.patch(`/api/v1/users/${params.id}`, body);
};

export const deleteUser = (params: { id: string }) => {
  return apiAdmin.delete(`/api/v1/users/${params.id}`);
};

export const getUserById = (params: { id: string }) => {
  return apiAdmin.get(`/api/v1/users/${params.id}`);
};

export const dashBoardUser = (params: { month: number; year: number }) => {
  return apiAdmin.get(`/api/v1/users/dashboard-user?month=${params.month}&year=${params.year}`);
};

export const reStore = (params: { id: string }) => {
  return apiAdmin.patch(`/api/v1/users/${params.id}/restore`);
};
export const changePassword = (body: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  return apiAdmin.post(`api/v1/users/change-password`, body);
};
export const getListAllUser = () => {
  return apiAdmin.get(`api/v1/users/get-list-user`);
};
