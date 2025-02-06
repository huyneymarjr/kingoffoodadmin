import { apiAdmin } from './Config/baseApi';

export const addTables = (body: {
  areaId: string;
  tableNumber: number;
  status: 'Đặt trước' | 'Trống' | 'Đã có khách';
  capacity: number;
}) => {
  return apiAdmin.post('/api/v1/tables', body);
};

export const getListTables = (params: { current: number; pageSize: number; areaId: string }) => {
  return apiAdmin.get(
    `/api/v1/tables?current=${params.current}&pageSize=${params.pageSize}&areaId=${params.areaId}`,
  );
};

export const updateTables = (params: { id: string }, body: any) => {
  return apiAdmin.patch(`/api/v1/tables/${params.id}`, body);
};

export const deleteTables = (params: { id: string }) => {
  return apiAdmin.delete(`/api/v1/tables/${params.id}`);
};

export const getTablesById = (params: { id: string }) => {
  return apiAdmin.get(`/api/v1/tables/${params.id}`);
};

export const assignTable = (body: {
  tableId: string;
  bookerId: string;
  nameCustomer?: string;
  emailCustomer?: string;
  phoneNumberCustomer?: string;
  type: 'Đặt bàn' | 'Hủy bàn' | 'Đã có khách';
  time?: Date;
}) => {
  return apiAdmin.post(`/api/v1/tables/assign-customer`, body);
};

export const changeTable = (body: { tableId: string; newTableId: string; orderId: string }) => {
  return apiAdmin.post(`/api/v1/tables/change-table`, body);
};
