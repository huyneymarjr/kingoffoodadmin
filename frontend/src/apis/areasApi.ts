import { apiAdmin } from './Config/baseApi';

export const addAreas = (body: { areaNumber: number; status: string; capacity: number }) => {
  return apiAdmin.post('/api/v1/areas', body);
};

export const getListAreas = (params: { current: number; pageSize: number }) => {
  return apiAdmin.get(`/api/v1/areas?current=${params.current}&pageSize=${params.pageSize}`);
};

export const updateAreas = (params: { id: string }, body: any) => {
  return apiAdmin.patch(`/api/v1/areas/${params.id}`, body);
};

export const deleteAreas = (params: { id: string }) => {
  return apiAdmin.delete(`/api/v1/areas/${params.id}`);
};

export const getAreasById = (params: { id: string }) => {
  return apiAdmin.get(`/api/v1/areas/${params.id}`);
};
