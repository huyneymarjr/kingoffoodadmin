import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

const initialState = {
  selectedRowKeys: [],
};

const clickExportExcelSlice = createSlice({
  name: 'clickExportExcel',
  initialState,
  reducers: {
    setSelectedRowKeys: (state, action: PayloadAction<any>) => {
      state.selectedRowKeys = action.payload;
    },
  },
});

export const { setSelectedRowKeys } = clickExportExcelSlice.actions;
export default clickExportExcelSlice.reducer;
