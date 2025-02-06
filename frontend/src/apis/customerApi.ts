import { apiAdmin } from './Config/baseApi';

export const addCustomer = (body: {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  point: number;
  type: 'Nhà cung cấp' | 'Khách hàng';
  address: string;
  gender: string;
  note: string;
}) => {
  return apiAdmin.post('/api/v1/customers', body);
};

export const getListCustomer = (params: { current: number; pageSize: number; type: string }) => {
  return apiAdmin.get(
    `/api/v1/customers?current=${params.current}&pageSize=${params.pageSize}&type=${params.type}`,
  );
};

export const updateCustomer = (
  params: { id: string },
  body: {
    userId?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    point?: number;
    type?: 'Nhà cung cấp' | 'Khách hàng';
    address?: string;
    gender?: string;
    note?: string;
  },
) => {
  return apiAdmin.patch(`/api/v1/customers/${params.id}`, body);
};

export const deleteCustomer = (params: { id: string }) => {
  return apiAdmin.delete(`/api/v1/customers/${params.id}`);
};

export const getCustomerById = (params: { id: string }) => {
  return apiAdmin.get(`/api/v1/customers/${params.id}`);
};

export const listCustomerSupplier = () => {
  return apiAdmin.get(`api/v1/customers/list-customer-supplier`);
};
export const listCustomer = () => {
  return apiAdmin.get(`api/v1/customers/list-customer-customer`);
};

export const dashBoardCustomer = (params: { month: number; year: number }) => {
  return apiAdmin.get(`/api/v1/customers/dashboard-customers?month=${params.month}&year=${params.year}`);
};
