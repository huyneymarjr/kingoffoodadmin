import { apiAdmin } from './Config/baseApi';

export const addTransactions = (body: {
  inventoryId: string;
  type: 'Nhập' | 'Xuất';
  quantity: number;
  customerId: string;
}) => {
  return apiAdmin.post('/api/v1/transactions', body);
};

export const getListTransactions = (params: { current: number; pageSize: number; filter: any }) => {
  return apiAdmin.get(
    `/api/v1/transactions?current=${params.current}&pageSize=${params.pageSize}${params.filter}`,
  );
};

export const updateTransactions = (params: { id: string }, body: any) => {
  return apiAdmin.patch(`/api/v1/transactions/${params.id}`, body);
};

export const deleteTransactions = (params: { id: string }) => {
  return apiAdmin.delete(`/api/v1/transactions/${params.id}`);
};

export const getTransactionsById = (params: { id: string }) => {
  return apiAdmin.get(`/api/v1/transactions/${params.id}`);
};

export const dashBoardTransactions = (params: { month: number; year: number }) => {
  return apiAdmin.get(
    `/api/v1/transactions/dashboard-transactions?month=${params.month}&year=${params.year}`,
  );
};
