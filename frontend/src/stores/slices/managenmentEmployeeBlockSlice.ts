import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

const initialState: EmployeeType[] = [];

const managenmentEmployeeBlockSlice = createSlice({
  name: 'managenmentEmployeeBlock',
  initialState,
  reducers: {
    setListDataBlock: (_state, action: PayloadAction<any>) => {
      return action.payload;
    },
    deleteDataBlock: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item.id !== action.payload);
    },
  },
});

export const { setListDataBlock, deleteDataBlock } = managenmentEmployeeBlockSlice.actions;
export default managenmentEmployeeBlockSlice.reducer;
