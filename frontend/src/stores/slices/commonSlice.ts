import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  location: {
    pathName: '',
    prevPathName: '',
    params: {},
    query: {},
  } as LocationType,
  breadcrumb: [] as BreadcrumbType[],
  title: '' as any,
  openMenu: false as boolean,
  segmentList: [] as any,
  listAllLeader: [],
  language: 'vi',
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        language: action.payload,
      };
    },
    setLocation: (state, action: PayloadAction<LocationType>) => ({
      ...state,
      location: action.payload,
    }),
    setBreadcrumb: (state, action: PayloadAction<BreadcrumbType[]>) => ({
      ...state,
      breadcrumb: action.payload,
    }),
    setTitle: (state, action: PayloadAction<any>) => ({
      ...state,
      title: action.payload,
    }),
    setMenu: (state, action) => {
      state.openMenu = action.payload;
    },
    setSegmentList: (state, action) => {
      state.segmentList = action.payload;
    },
    setListAllLeader: (state, action) => {
      state.listAllLeader = action.payload;
    },
  },
});

export const {
  setLanguage,
  setLocation,
  setBreadcrumb,
  setTitle,
  setMenu,
  setSegmentList,
  setListAllLeader,
} = commonSlice.actions;
export default commonSlice.reducer;
