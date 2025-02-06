import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

const initialState = {
  onClickPrintKitchen: false,
  onClickPrintBill: false,
  infoBill: {} as any,
};

const clickPrintSlice = createSlice({
  name: 'clickPrintSlice',
  initialState,
  reducers: {
    setClickPrint: (state, action: PayloadAction<{ type: 'kitchen' | 'bill'; value: boolean }>) => {
      if (action.payload.type === 'kitchen') {
        state.onClickPrintKitchen = action.payload.value;
        state.onClickPrintBill = false;
      } else {
        state.onClickPrintBill = action.payload.value;
        state.onClickPrintKitchen = false;
      }
    },
    setInfoBill: (state, action: PayloadAction<any>) => {
      state.infoBill = action.payload;
    },
  },
});

export const { setClickPrint, setInfoBill } = clickPrintSlice.actions;
export default clickPrintSlice.reducer;
