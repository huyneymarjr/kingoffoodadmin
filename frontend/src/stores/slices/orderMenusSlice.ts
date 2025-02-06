import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: any = {
  customer: {},
  order: {},
  table: {},
  selectOrderId: '',
  reloadTable: false,
};

const orderMenusSlice = createSlice({
  name: 'orderMenusSlice',
  initialState,
  reducers: {
    setOrderBill: (state, action: PayloadAction<any>) => {
      state.order = action.payload.order;
      state.table = action.payload.table;
      state.customer = action.payload.customer;
    },
    resetOrderBill: (state) => {
      state.order = {};
      state.table = {};
      state.customer = {};
      state.selectOrderId = '';
    },

    setSelectOrderId: (state, action: PayloadAction<string>) => {
      state.selectOrderId = action.payload;
    },
    setOrderdetailsBill: (state, action: PayloadAction<any>) => {
      const existingItem = state.order.orderdetails.find(
        (item: any) => item.menuId === action.payload.menuId,
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.order.orderdetails.unshift({
          ...action.payload,
          menuId: action.payload.menuId,
          name: action.payload.name,
          price: action.payload.price,
          quantity: action.payload.quantity,
        });
      }
    },
    setChangeQuantityOrderdetailsBill: (state, action: PayloadAction<any>) => {
      if (action.payload.type === 'plus') {
        state.order.orderdetails.map((item: any) => {
          if (item.menuId === action.payload.menuId) {
            item.quantity += 1;
          }
        });
      } else if (action.payload.type === 'minus') {
        state.order.orderdetails.map((item: any) => {
          if (item.menuId === action.payload.menuId && item.quantity > 1) {
            item.quantity -= 1;
          }
        });
      } else {
        state.order.orderdetails.map((item: any) => {
          if (item.menuId === action.payload.menuId) {
            item.quantity = action.payload.quantity;
          }
        });
      }
    },
    setOrderdetailsBillModal: (state, action: PayloadAction<any>) => {
      const existingItem = state.order.orderdetails.find(
        (item: any) => item.menuId === action.payload.menuId,
      );

      if (existingItem) {
        existingItem.quantity = action.payload.quantity;
        existingItem.note = action.payload.note;
      } else {
        state.order.orderdetails.unshift({
          ...action.payload,
          menuId: action.payload.menuId,
          name: action.payload.name,
          price: action.payload.price,
          quantity: action.payload.quantity,
        });
      }
    },
    setReloadTable: (state, action: PayloadAction<boolean>) => {
      state.reloadTable = action.payload;
    },
  },
});

export const {
  setOrderBill,
  setSelectOrderId,
  setOrderdetailsBill,
  setOrderdetailsBillModal,
  setChangeQuantityOrderdetailsBill,
  resetOrderBill,
  setReloadTable,
} = orderMenusSlice.actions;
export default orderMenusSlice.reducer;
