import { apiAdmin } from './Config/baseApi';
export const getListRole = (params: { current: string; pageSize: string }) => {
  return apiAdmin.get(`/api/v1/roles?current=${params.current}&pageSize=${params.pageSize}`);
};

export const callCreatePermission = (permission: IPermission) => {
  return apiAdmin.post('/api/v1/permissions', { ...permission });
};

export const callUpdatePermission = (permission: IPermission, id: string) => {
  return apiAdmin.patch(`/api/v1/permissions/${id}`, { ...permission });
};

export const callDeletePermission = (id: string) => {
  return apiAdmin.delete(`/api/v1/permissions/${id}`);
};

export const callFetchPermission = (params: { current: number; pageSize: number }) => {
  return apiAdmin.get(`/api/v1/permissions?current=${params.current}&pageSize=${params.pageSize}`);
};

export const callFetchPermissionById = (id: string) => {
  return apiAdmin.get(`/api/v1/permissions/${id}`);
};

export const callCreateRole = (role: IRole) => {
  return apiAdmin.post('/api/v1/roles', { ...role });
};

export const callUpdateRole = (role: IRole, id: string) => {
  return apiAdmin.patch(`/api/v1/roles/${id}`, { ...role });
};

export const callDeleteRole = (id: string) => {
  return apiAdmin.delete(`/api/v1/roles/${id}`);
};

export const callFetchRole = (params: { current: number; pageSize: number }) => {
  return apiAdmin.get(`/api/v1/roles?current=${params.current}&pageSize=${params.pageSize}`);
};

export const callFetchRoleById = (id: string) => {
  return apiAdmin.get(`/api/v1/roles/${id}`);
};
