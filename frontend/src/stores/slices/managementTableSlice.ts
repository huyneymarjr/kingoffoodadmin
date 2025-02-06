import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

const initialState: TablesType[] = [];

const managenmentTablesSlice = createSlice({
  name: 'managenmentTables',
  initialState,
  reducers: {
    setListDataTables: (_state, action: PayloadAction<any>) => {
      return action.payload;
    },
    addNewDataTables: (state, action: PayloadAction<TablesType>) => {
      return [action.payload, ...state];
    },
    updateDataTables: (state, action: PayloadAction<TablesType>) => {
      return state.map((item) => (item._id === action.payload._id ? { ...item, ...action.payload } : item));
    },
    deleteDataTables: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item._id !== action.payload);
    },
  },
});

export const { setListDataTables, addNewDataTables, deleteDataTables, updateDataTables } =
  managenmentTablesSlice.actions;
export default managenmentTablesSlice.reducer;
