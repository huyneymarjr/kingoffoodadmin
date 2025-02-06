import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

const initialState: TransactionsType[] = [];

const managenmentTransactionsSlice = createSlice({
  name: 'managementTransactions',
  initialState,
  reducers: {
    setListDataTransactions: (_state, action: PayloadAction<any>) => {
      return action.payload;
    },
    addNewDataTransactions: (state, action: PayloadAction<TransactionsType>) => {
      return [action.payload, ...state];
    },
    updateDataTransactions: (state, action: PayloadAction<TransactionsType>) => {
      return state.map((item) => (item._id === action.payload._id ? { ...item, ...action.payload } : item));
    },
    deleteDataTransactions: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item._id !== action.payload);
    },
  },
});

export const {
  setListDataTransactions,
  addNewDataTransactions,
  deleteDataTransactions,
  updateDataTransactions,
} = managenmentTransactionsSlice.actions;
export default managenmentTransactionsSlice.reducer;
