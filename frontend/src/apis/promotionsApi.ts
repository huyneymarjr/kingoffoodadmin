import { apiAdmin } from './Config/baseApi';

export const addPromotions = (body: {
  name: string;
  discount: number;
  startDate: string;
  endDate: string;
  status: 'Hoạt động' | 'Không hoạt động';
}) => {
  return apiAdmin.post('/api/v1/promotions', body);
};

export const getListPromotions = (params: { current: number; pageSize: number }) => {
  return apiAdmin.get(`/api/v1/promotions?current=${params.current}&pageSize=${params.pageSize}`);
};

export const updatePromotions = (params: { id: string }, body: any) => {
  return apiAdmin.patch(`/api/v1/promotions/${params.id}`, body);
};

export const deletePromotions = (params: { id: string }) => {
  return apiAdmin.delete(`/api/v1/promotions/${params.id}`);
};

export const getPromotionsById = (params: { id: string }) => {
  return apiAdmin.get(`/api/v1/promotions/${params.id}`);
};

export const checkValidatePromotions = (body: { name: string }) => {
  return apiAdmin.post(`/api/v1/promotions/check-promotion`, body);
};
