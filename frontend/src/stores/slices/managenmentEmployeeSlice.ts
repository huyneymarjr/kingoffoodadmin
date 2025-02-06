import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

const initialState: EmployeeType[] = [];

const managenmentEmployeeSlice = createSlice({
  name: 'managenmentEmployee',
  initialState,
  reducers: {
    setListData: (_state, action: PayloadAction<any>) => {
      return action.payload;
    },
    addNewData: (state, action: PayloadAction<EmployeeType>) => {
      return [action.payload, ...state];
    },
    updateData: (state, action: PayloadAction<EmployeeType>) => {
      return state.map((item) => (item.id === action.payload.id ? { ...item, ...action.payload } : item));
    },
    deleteData: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item.id !== action.payload);
    },
  },
});

export const { setListData, addNewData, deleteData, updateData } = managenmentEmployeeSlice.actions;
export default managenmentEmployeeSlice.reducer;
