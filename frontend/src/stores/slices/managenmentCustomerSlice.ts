import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

const initialState: CustomerType[] = [];

const managenmentCustomerSlice = createSlice({
  name: 'managenmentCustomer',
  initialState,
  reducers: {
    setListDataCustomer: (_state, action: PayloadAction<any>) => {
      return action.payload;
    },
    addNewDataCustomer: (state, action: PayloadAction<CustomerType>) => {
      return [action.payload, ...state];
    },
    updateDataCustomer: (state, action: PayloadAction<CustomerType>) => {
      return state.map((item) => (item._id === action.payload._id ? { ...item, ...action.payload } : item));
    },
    deleteDataCustomer: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item._id !== action.payload);
    },
  },
});

export const { setListDataCustomer, addNewDataCustomer, updateDataCustomer, deleteDataCustomer } =
  managenmentCustomerSlice.actions;
export default managenmentCustomerSlice.reducer;
