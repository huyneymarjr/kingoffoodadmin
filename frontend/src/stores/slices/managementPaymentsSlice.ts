import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

const initialState: PaymentsType[] = [];

const managementPaymentsSlice = createSlice({
  name: 'managementPayments',
  initialState,
  reducers: {
    setListDataPayments: (_state, action: PayloadAction<any>) => {
      return action.payload;
    },
    addNewDataPayments: (state, action: PayloadAction<PaymentsType>) => {
      return [action.payload, ...state];
    },
    updateDataPayments: (state, action: PayloadAction<PaymentsType>) => {
      return state.map((item) => (item._id === action.payload._id ? { ...item, ...action.payload } : item));
    },
    deleteDataPayments: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item._id !== action.payload);
    },
  },
});

export const { setListDataPayments, addNewDataPayments, deleteDataPayments, updateDataPayments } =
  managementPaymentsSlice.actions;
export default managementPaymentsSlice.reducer;
