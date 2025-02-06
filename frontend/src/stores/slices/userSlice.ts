import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  user: {} as useType,
  permissions: [] as any[],
  // departments: [] as any[],
  // selectedDepartment: null as number | null,
  // userDepartment: [] as [],
};

const userSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<any>) => ({
      ...state,
      user: action.payload,
      permissions: action?.payload?.permissions?.map((item: any) => item._id),
    }),
    // setDepartment: (state, action: PayloadAction<any[]>) => {
    //   state.departments = action.payload;
    // },
    // setSelectedDepartment: (state, action: PayloadAction<number>) => {
    //   state.selectedDepartment = action.payload;
    // },
    // setUserDepartment: (state, action: any) => {
    //   state.userDepartment = action.payload;
    // },
  },
});

export const {
  setUsers,
  //  setDepartment, setSelectedDepartment, setUserDepartment
} = userSlice.actions;
export default userSlice.reducer;
