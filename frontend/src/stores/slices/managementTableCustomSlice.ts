import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: TablesCustomerType[] = [];

const managementTableCustomSlice = createSlice({
  name: 'managementTableCustomer',
  initialState,
  reducers: {
    setListDataTablesCustomer: (_state, action: PayloadAction<any>) => {
      return action.payload;
    },

    updateDataTablesCustomer: (state, action: PayloadAction<TablesCustomerType>) => {
      return state.map((item) => (item._id === action.payload._id ? { ...item, ...action.payload } : item));
    },

    assignTableCustomer: (state, action: PayloadAction<any>) => {
      return state.map((item: any) => {
        if (item._id === action.payload.tableId) {
          return {
            ...item,
            status: action.payload.typeTable,
            ownerTable: {
              _id: action.payload.userId,
              bookerId: action.payload.userId,
              nameCustomer: action.payload.nameCustomer,
              emailCustomer: action.payload.emailCustomer,
              phoneNumberCustomer: action.payload.phoneNumberCustomer,
              time: action.payload.time,
            },
          };
        }
        return item;
      });
    },
    cancelTableCustomer: (state, action: PayloadAction<any>) => {
      return state.map((item) => {
        if (item?._id === action.payload?.tableId) {
          return { ...item, status: 'Trống' };
        }
        return item;
      });
    },
    accessTableCustomer: (state, action: PayloadAction<any>) => {
      return state.map((item) => {
        if (item?._id === action.payload?.tableId) {
          return { ...item, status: 'Đã có khách' };
        }
        return item;
      });
    },
  },
});

export const {
  setListDataTablesCustomer,
  updateDataTablesCustomer,
  assignTableCustomer,
  cancelTableCustomer,
  accessTableCustomer,
} = managementTableCustomSlice.actions;
export default managementTableCustomSlice.reducer;
