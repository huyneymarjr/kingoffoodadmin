import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

const initialState: InventoriesType[] = [];

const managenmentInventoriesSlice = createSlice({
  name: 'managementInventories',
  initialState,
  reducers: {
    setListDataInventories: (_state, action: PayloadAction<any>) => {
      return action.payload;
    },
    addNewDataInventories: (state, action: PayloadAction<InventoriesType>) => {
      return [action.payload, ...state];
    },
    updateDataInventories: (state, action: PayloadAction<InventoriesType>) => {
      return state.map((item) => (item._id === action.payload._id ? { ...item, ...action.payload } : item));
    },
    deleteDataInventories: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item._id !== action.payload);
    },
  },
});

export const { setListDataInventories, addNewDataInventories, deleteDataInventories, updateDataInventories } =
  managenmentInventoriesSlice.actions;
export default managenmentInventoriesSlice.reducer;
