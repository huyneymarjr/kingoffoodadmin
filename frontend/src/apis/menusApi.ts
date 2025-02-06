import { apiAdmin } from './Config/baseApi';

export const addMenus = (body: {
  categoryId: string;
  name: string;
  price: number;
  description: string;
  status: string;
  unit: string;
  image: string;
}) => {
  return apiAdmin.post('/api/v1/menus', body);
};

export const getListMenus = (params: { current: number; pageSize: number; filter?: any }) => {
  return apiAdmin.get(
    `/api/v1/menus?current=${params.current}&pageSize=${params.pageSize}&${params?.filter || ''}`,
  );
};

export const updateMenus = (params: { id: string }, body: any) => {
  return apiAdmin.patch(`/api/v1/menus/${params.id}`, body);
};

export const deleteMenus = (params: { id: string }) => {
  return apiAdmin.delete(`/api/v1/menus/${params.id}`);
};

export const getMenusById = (params: { id: string }) => {
  return apiAdmin.get(`/api/v1/menus/${params.id}`);
};
