import { apiAdmin } from './Config/baseApi';

export const addOrderdetails = (body: {
  menuId: string;
  orderId: string;
  quantity: number;
  price: number;
}) => {
  return apiAdmin.post('/api/v1/orderdetails', body);
};

export const getListOrderdetails = (params: { current: number; pageSize: number }) => {
  return apiAdmin.get(`/api/v1/orderdetails?current=${params.current}&pageSize=${params.pageSize}`);
};

export const updateOrderdetails = (params: { id: string }, body: any) => {
  return apiAdmin.patch(`/api/v1/orderdetails/${params.id}`, body);
};

export const deleteOrderdetails = (params: { id: string }) => {
  return apiAdmin.delete(`/api/v1/orderdetails/${params.id}`);
};

export const getOrderdetailsById = (params: { id: string }) => {
  return apiAdmin.get(`/api/v1/orderdetails/${params.id}`);
};
