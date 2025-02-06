import { deleteCookie } from '@/utils/helpers/cookie';
import {
  DesktopOutlined,
  LineChartOutlined,
  MoneyCollectOutlined,
  PayCircleOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  SnippetsOutlined,
  TableOutlined,
  UsergroupDeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ConfigProvider, Menu, MenuProps, Tooltip } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
// import IconBell from '/assets/icons/solid/bell.svg';
import bgr_remove_logo_white from '/assets/images/bgr_remove_logo_white.png';
import { useAppSelector } from '@/stores/configureStore';
import UserDefaultIcon from '@/components/Icons/UserDefaultIcon';
import { useEffect, useState } from 'react';
import { logout } from '@/apis/auth';
import { ROLES } from '@/utils/constants/role';
type MenuItem = Required<MenuProps>['items'][number];

const Sidebar: React.FC<{
  closeOpenMenu: () => void;
  collapsed: boolean;
  setCollapsed: any;
  isDrawer: boolean;
}> = ({ closeOpenMenu, collapsed, isDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.user);
  const [patchActive, setPatchActive] = useState<string[]>([]);
  const routeActive = location.pathname
    .split('/')
    .filter((part) => part)
    .map((part) => `/${part}`);
  useEffect(() => {
    if (user?.role?._id == ROLES.ADMIN) {
      setPatchActive(['/']);
      return;
    } else if (user?.role?._id != ROLES.ADMIN) {
      setPatchActive(['/dat-mon']);
      return;
    }
  }, [user]);

  function getItem(
    label: React.ReactNode,
    path: React.Key,
    permission: boolean,
    icon?: React.ReactNode,
    children?: MenuItem[],
  ): MenuItem | null {
    return permission
      ? {
          key: path,
          icon,
          children,
          label,
        }
      : null;
  }

  const items: MenuItem[] = [
    getItem('Tổng quan', '/', user?.role?._id == ROLES.ADMIN, <LineChartOutlined />),
    getItem('Bán hàng', '/ban-hang', true, <ShoppingCartOutlined />, [
      getItem('Đặt món', '/dat-mon', true),
      getItem('Đơn hàng', '/don-hang', true),
    ]),
    getItem('Quản lý kho', '/quan-ly-kho', user?.role?._id == ROLES.ADMIN, <DesktopOutlined />, [
      getItem('Kho', '/kho', user?.role?._id == ROLES.ADMIN),
      getItem('Giao dịch', '/giao-dich', user?.role?._id == ROLES.ADMIN),
    ]),
    getItem('Nhân viên', '/quan-ly-nhan-vien', user?.role?._id == ROLES.ADMIN, <UserOutlined />, [
      getItem('Tài khoản nhân viên', '/tai-khoan-nhan-vien', user?.role?._id == ROLES.ADMIN),
      getItem('Thiết lập vai trò', '/thiet-lap-vai-tro', user?.role?._id == ROLES.ADMIN),
      getItem('Thiết lập quyền', '/thiet-lap-quyen', user?.role?._id == ROLES.ADMIN),
    ]),
    user?.role?._id == ROLES.ADMIN
      ? getItem('Đối tác', '/doi-tac', true, <UsergroupDeleteOutlined />, [
          getItem('Khách hàng', '/khach-hang', true),
          getItem('Nhà cung cấp', '/nha-cung-cap', true),
        ])
      : getItem('Khách hàng', '/khach-hang', true, <UsergroupDeleteOutlined />),
    getItem('Sản phẩm thực đơn', '##', user?.role?._id == ROLES.ADMIN, <SnippetsOutlined />, [
      getItem('Món ăn', '/danh-muc-mon-an', user?.role?._id == ROLES.ADMIN),
      getItem('Nhóm món ăn', '/nhom-mon-an', user?.role?._id == ROLES.ADMIN),
    ]),
    getItem('Phòng bàn', '/phong-ban', user?.role?._id == ROLES.ADMIN, <TableOutlined />),
    getItem('Khuyến mãi', '/khuyen-mai', true, <MoneyCollectOutlined />),
    getItem('Thanh toán', '/thanh-toan', user?.role?._id == ROLES.ADMIN, <PayCircleOutlined />),
    getItem('Thiết lập', '#', true, <SettingOutlined />, [
      getItem('Thông tin cá nhân', '/thong-tin-ca-nhan', true),
      getItem('Đổi mật khẩu', '/doi-mat-khau', true),
      getItem('Đóng góp ý kiến', '/dong-gop-y-kien', true),
      getItem('Đăng xuất', '/logout', true),
    ]),
  ].filter((item) => item !== null);

  const handleActiveRoute = async (value: any) => {
    if (value.key === '/logout') {
      try {
        await logout();
        deleteCookie('access_token');
        closeOpenMenu();
        navigate('/login');
      } catch (error) {
        console.log('Failed', error);
      }
    } else {
      closeOpenMenu();
      navigate(value.key);
    }
  };

  return (
    <div>
      <div className="flex justify-center !border-y-white mt-1">
        <img
          src={bgr_remove_logo_white}
          alt="logo"
          className={`bg-[#217ca3] !border-y-white ${collapsed ? 'w-[100%]' : 'w-[90%]'}`}
        />
      </div>
      <div className="flex items-center justify-start gap-2 flex-wrap pl-[23px] py-3 border-y-[1px] mb-2">
        <UserDefaultIcon
          textContent={user?.name ? user?.name?.trim()?.[0].toUpperCase() : ''}
          classNameCustome={`ant-menu-item-icon w-[30px] h-[30px]  `}
        />
        <Tooltip title={collapsed ? user?.name || '' : ''}>
          <p className="text-[20px] text-white max-w-[250px] truncate">{user?.name || ''}</p>
        </Tooltip>
      </div>
      <div
        className={`${
          isDrawer ? 'max-h-[calc(100vh_-_270px)]' : 'max-h-[calc(100vh_-_230px)]'
        }  h-[calc(100vh_-_162px)] overflow-y-auto bg-[#217ca3]`}
      >
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemHoverColor: '#ffff',
                itemColor: '#ffff',
                horizontalItemHoverColor: '#1e1e1e',
                groupTitleColor: '#ffff',
                itemHoverBg: '#64a4bf',
                itemSelectedBg: '#64a4bf',
                itemBg: '#ffff',
                popupBg: '#075170',
                iconSize: 20,
                itemSelectedColor: '#8cc342',
              },
            },
            token: {
              colorPrimary: '#ffff',
            },
          }}
        >
          <Menu
            selectedKeys={routeActive.length > 0 ? routeActive : patchActive}
            mode="inline"
            items={items}
            onClick={handleActiveRoute}
            onSelect={handleActiveRoute}
            // font-medium border-e-0 overflow-y-auto h-[calc(100vh_-_142px)]
            className="font-medium border-e-0 overflow-y-auto h-full !border-0 bg-[#217ca3] menuHome "
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Sidebar;
