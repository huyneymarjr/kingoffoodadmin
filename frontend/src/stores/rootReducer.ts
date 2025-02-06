import commonSlice from './slices/commonSlice';
import managementInventoriesSlice from './slices/managementInventoriesSlice';
import managementPromotionsSlice from './slices/managementPromotionsSlice';
import managementTableSlice from './slices/managementTableSlice';
import managenmentCategoriesSlice from './slices/managenmentCategoriesSlice';
import managenmentCustomerSlice from './slices/managenmentCustomerSlice';
import managenmentEmployeeSlice from './slices/managenmentEmployeeSlice';
import managenmentRolesSlice from './slices/managenmentRolesSlice';
import managementTransactionsSlice from './slices/managementTransactionsSlice';
import userSlice from './slices/userSlice';
import managementPaymentsSlice from './slices/managementPaymentsSlice';
import managementMenusSlice from './slices/managementMenusSlice';
import orderMenusSlice from './slices/orderMenusSlice';
import clickPrintSlice from './slices/clickPrintSlice';
import managementTableCustomSlice from './slices/managementTableCustomSlice';
import clickExportExcelSlice from './slices/clickExportExcelSlice';
import managenmentEmployeeBlockSlice from './slices/managenmentEmployeeBlockSlice';

const rootReducer = {
  common: commonSlice,
  user: userSlice,
  managenmentEmployee: managenmentEmployeeSlice,
  managenmentEmployeeBlock: managenmentEmployeeBlockSlice,
  managenmentRoles: managenmentRolesSlice,
  managenmentCategories: managenmentCategoriesSlice,
  managenmentTables: managementTableSlice,
  managenmentCustomer: managenmentCustomerSlice,
  managenmentPromotions: managementPromotionsSlice,
  managenmentInventories: managementInventoriesSlice,
  managenmentTransactions: managementTransactionsSlice,
  managementPayments: managementPaymentsSlice,
  managementMenus: managementMenusSlice,
  orderMenus: orderMenusSlice,
  clickPrint: clickPrintSlice,
  clickExportExcel: clickExportExcelSlice,
  managementTableCustomer: managementTableCustomSlice,
};

export default rootReducer;
