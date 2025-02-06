import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

const initialState: CategoriesType[] = [];

const managenmentCategoriesSlice = createSlice({
  name: 'managenmentCategories',
  initialState,
  reducers: {
    setListDataCategories: (_state, action: PayloadAction<any>) => {
      return action.payload;
    },
    addNewDataCategories: (state, action: PayloadAction<CategoriesType>) => {
      return [action.payload, ...state];
    },
    updateDataCategories: (state, action: PayloadAction<CategoriesType>) => {
      return state.map((item) => (item._id === action.payload._id ? { ...item, ...action.payload } : item));
    },
    deleteDataCategories: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item._id !== action.payload);
    },
  },
});

export const { setListDataCategories, addNewDataCategories, deleteDataCategories, updateDataCategories } =
  managenmentCategoriesSlice.actions;
export default managenmentCategoriesSlice.reducer;
