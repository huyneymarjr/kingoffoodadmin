import { createBrowserRouter, Outlet } from 'react-router-dom';

import MainLayout from '../layout/MainLayout';
// import { rootLoader } from './rootLoader';;
import {
  AccountEmployee,
  Login,
  Home,
  NotFoundScreen,
  ManagementRoles,
  AddAccountPage,
  ProfileUser,
  ManagementCustomers,
  ManagementCategories,
  ManagenmentTablesAndAreas,
  ManagementSupplier,
  ManagementPromotions,
  ManagenmentInventories,
  ManagementTransactions,
  ManagementPermissions,
  ManagementPayments,
  ContactUs,
  ManagementMenus,
  AddMenusPage,
  ViewOrUpdateMenusPage,
  ManagementOrders,
  ManagementCarts,
  ChangePassword,
} from '@/pages';
import AccessPermission from '@/components/AccessPermission';

export const router = createBrowserRouter([
  {
    element: <MainLayout children={<Outlet />} />,
    // loader: () => rootLoader(),
    children: [
      {
        path: '/',
        element: (
          <AccessPermission>
            <Home />
          </AccessPermission>
        ),
      },
      {
        path: '/tai-khoan-nhan-vien',
        element: (
          <AccessPermission>
            <AccountEmployee />
          </AccessPermission>
        ),
      },
      {
        path: '/tai-khoan-nhan-vien/thiet-lap-tai-khoan/:id?',
        element: (
          <AccessPermission>
            <AddAccountPage />
          </AccessPermission>
        ),
      },
      {
        path: '/thiet-lap-vai-tro',
        element: (
          <AccessPermission>
            <ManagementRoles />
          </AccessPermission>
        ),
      },
      {
        path: '/thiet-lap-quyen',
        element: (
          <AccessPermission>
            <ManagementPermissions />
          </AccessPermission>
        ),
      },
      {
        path: '/thong-tin-ca-nhan',
        element: <ProfileUser />,
      },
      {
        path: '/khach-hang',
        element: <ManagementCustomers />,
      },
      {
        path: '/nha-cung-cap',
        element: (
          <AccessPermission>
            <ManagementSupplier />
          </AccessPermission>
        ),
      },
      {
        path: '/nhom-mon-an',
        element: (
          <AccessPermission>
            <ManagementCategories />
          </AccessPermission>
        ),
      },
      {
        path: '/danh-muc-mon-an',
        element: (
          <AccessPermission>
            <ManagementMenus />
          </AccessPermission>
        ),
      },
      {
        path: '/danh-muc-mon-an/them-moi/:id?',
        element: (
          <AccessPermission>
            <AddMenusPage />
          </AccessPermission>
        ),
      },
      {
        path: '/danh-muc-mon-an/chi-tiet/:id?',
        element: (
          <AccessPermission>
            <ViewOrUpdateMenusPage />
          </AccessPermission>
        ),
      },

      {
        path: '/phong-ban',
        element: (
          <AccessPermission>
            <ManagenmentTablesAndAreas />
          </AccessPermission>
        ),
      },
      {
        path: '/khuyen-mai',
        element: <ManagementPromotions />,
      },
      {
        path: '/kho',
        element: (
          <AccessPermission>
            <ManagenmentInventories />
          </AccessPermission>
        ),
      },
      {
        path: '/giao-dich',
        element: (
          <AccessPermission>
            <ManagementTransactions />
          </AccessPermission>
        ),
      },
      {
        path: '/thanh-toan',
        element: <ManagementPayments />,
      },
      {
        path: '/dong-gop-y-kien',
        element: <ContactUs />,
      },
      {
        path: 'dat-mon',
        element: <ManagementOrders />,
      },
      {
        path: 'don-hang',
        element: <ManagementCarts />,
      },
      {
        path: 'doi-mat-khau',
        element: <ChangePassword />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/*',
    element: <NotFoundScreen />,
  },
]);
