import { apiAdmin } from './Config/baseApi';
type PaymentMethod = 'Chuyển khoản' | 'Tiền mặt' | 'Thẻ ghi nợ';
export const addPayments = (body: {
  method: string[];
  paymentMethod: Record<PaymentMethod, number>;
  paymentTime: string;
  totalAmount: number;
  status: 'Đã thanh toán' | 'Chưa thanh toán';
}) => {
  return apiAdmin.post('/api/v1/payments', body);
};

export const getListPayments = (params: { current: number; pageSize: number }) => {
  return apiAdmin.get(`/api/v1/payments?current=${params.current}&pageSize=${params.pageSize}`);
};

export const updatePayments = (params: { id: string }, body: any) => {
  return apiAdmin.patch(`/api/v1/payments/${params.id}`, body);
};

export const deletePayments = (params: { id: string }) => {
  return apiAdmin.delete(`/api/v1/payments/${params.id}`);
};

export const getPaymentsById = (params: { id: string }) => {
  return apiAdmin.get(`/api/v1/payments/${params.id}`);
};

export const dashBoardPayment = (params: { month: number; year: number }) => {
  return apiAdmin.get(`/api/v1/payments/dashboard-payments?month=${params.month}&year=${params.year}`);
};
