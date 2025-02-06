import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

const initialState: PromotionsType[] = [];

const managenmentPromotionsSlice = createSlice({
  name: 'managementPromotions',
  initialState,
  reducers: {
    setListDataPromotions: (_state, action: PayloadAction<any>) => {
      return action.payload;
    },
    addNewDataPromotions: (state, action: PayloadAction<PromotionsType>) => {
      return [action.payload, ...state];
    },
    updateDataPromotions: (state, action: PayloadAction<PromotionsType>) => {
      return state.map((item) => (item._id === action.payload._id ? { ...item, ...action.payload } : item));
    },
    deleteDataPromotions: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item._id !== action.payload);
    },
  },
});

export const { setListDataPromotions, addNewDataPromotions, deleteDataPromotions, updateDataPromotions } =
  managenmentPromotionsSlice.actions;
export default managenmentPromotionsSlice.reducer;
