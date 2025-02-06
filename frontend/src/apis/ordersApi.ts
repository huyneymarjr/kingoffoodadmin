import { apiAdmin } from './Config/baseApi';

export const addOrders = (body: {
  userId: string;
  tableId: string;
  customerId: string;
  promotionId: string;
  paymentId: string;
  orderdetails: string[];
  status: string;
  note: string;
  totalPrice: number;
}) => {
  return apiAdmin.post('/api/v1/orders', body);
};

export const getListOrders = (params: { current: number; pageSize: number }) => {
  return apiAdmin.get(`/api/v1/orders?current=${params.current}&pageSize=${params.pageSize}`);
};

export const updateOrders = (params: { id: string }, body: any) => {
  return apiAdmin.patch(`/api/v1/orders/${params.id}`, body);
};

export const deleteOrders = (params: { id: string }) => {
  return apiAdmin.delete(`/api/v1/orders/${params.id}`);
};

export const getOrdersById = (params: { id: string }) => {
  return apiAdmin.get(`/api/v1/orders/${params.id}`);
};

export const getListOrdersCustomer = (params: {
  current: number;
  pageSize: number;
  type: 0 | 1 | 2 | 3 | 4;
  filter?: string;
}) => {
  return apiAdmin.get(
    `/api/v1/orders/customer?current=${params.current}&pageSize=${params.pageSize}&type=${params.type}&${params.filter}`,
  );
};
