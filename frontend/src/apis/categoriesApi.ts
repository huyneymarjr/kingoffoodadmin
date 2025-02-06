import { apiAdmin } from './Config/baseApi';

export const addCategories = (body: { name: string; description: string; status: string }) => {
  return apiAdmin.post('/api/v1/categories', body);
};

// export const getListCategories = (params: { current: number; pageSize: number; filter?: any }) => {
//   console.log('params.filter', params.filter);
//   return apiAdmin.get(
//     `/api/v1/categories?current=${params.current}&pageSize=${params.pageSize}&${params.filter}`,
//   );
// };
export const getListCategories = (params: { current: number; pageSize: number; filter?: string }) => {
  const filterQuery = params.filter ? `&${params.filter}` : '';
  return apiAdmin.get(
    `/api/v1/categories?current=${params.current}&pageSize=${params.pageSize}${filterQuery}`,
  );
};

export const updateCategories = (params: { id: string }, body: any) => {
  return apiAdmin.patch(`/api/v1/categories/${params.id}`, body);
};

export const deleteCategories = (params: { id: string }) => {
  return apiAdmin.delete(`/api/v1/categories/${params.id}`);
};

export const getCategoriesById = (params: { id: string }) => {
  return apiAdmin.get(`/api/v1/categories/${params.id}`);
};
