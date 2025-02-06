import { apiAdmin } from './Config/baseApi';

export const addInventories = (body: { name: string; quantity: number; unit: string; price: number }) => {
  return apiAdmin.post('/api/v1/inventories', body);
};

export const getListInventories = (params: { current: number; pageSize: number }) => {
  return apiAdmin.get(`/api/v1/inventories?current=${params.current}&pageSize=${params.pageSize}`);
};

export const updateInventories = (params: { id: string }, body: any) => {
  return apiAdmin.patch(`/api/v1/inventories/${params.id}`, body);
};

export const deleteInventories = (params: { id: string }) => {
  return apiAdmin.delete(`/api/v1/inventories/${params.id}`);
};

export const getInventoriesById = (params: { id: string }) => {
  return apiAdmin.get(`/api/v1/inventories/${params.id}`);
};
