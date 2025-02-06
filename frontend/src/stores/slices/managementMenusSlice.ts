import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

const initialState: MenusType[] = [];

const managementMenusSlice = createSlice({
  name: 'managementMenus',
  initialState,
  reducers: {
    setListDataMenus: (_state, action: PayloadAction<any>) => {
      return action.payload;
    },
    addNewDataMenus: (state, action: PayloadAction<MenusType>) => {
      return [action.payload, ...state];
    },
    updateDataMenus: (state, action: PayloadAction<MenusType>) => {
      return state.map((item) => (item._id === action.payload._id ? { ...item, ...action.payload } : item));
    },
    deleteDataMenus: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item._id !== action.payload);
    },
  },
});

export const { setListDataMenus, addNewDataMenus, deleteDataMenus, updateDataMenus } =
  managementMenusSlice.actions;
export default managementMenusSlice.reducer;
