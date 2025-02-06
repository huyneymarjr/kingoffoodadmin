import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

const initialState: any[] = [];

const managenmentRolesSlice = createSlice({
  name: 'managenmentRolesSlice',
  initialState,
  reducers: {
    setListDataRoles: (_state, action: PayloadAction<any>) => {
      return action.payload;
    },
  },
});

export const { setListDataRoles } = managenmentRolesSlice.actions;
export default managenmentRolesSlice.reducer;
