import React, { ReactNode, useEffect, useState } from 'react';
import { Drawer, Layout, Spin, theme } from 'antd';
import Sidebar from './Components/SideBar';
import { setMenu } from '../../stores/slices/commonSlice';
import { useAppDispatch, useAppSelector } from '../../stores/configureStore';
import Header from './Components/Header';
import { useNavigate } from 'react-router';
import { getCookie } from '@/utils/helpers/cookie';
import useWindowSize from '@/utils/hooks/useWindowSize';
import { getInfoUser } from '@/apis/auth';
import { setUsers } from '@/stores/slices/userSlice';
import { Footer } from 'antd/es/layout/layout';
import { ROLES } from '@/utils/constants/role';

const { Sider, Content } = Layout;

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}
const MainLayout: React.FC<MainLayoutProps> = ({ children }: MainLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { title } = useAppSelector((state) => state.common);
  const { user } = useAppSelector((state) => state.user);
  const { openMenu } = useAppSelector((state) => state.common);
  const getWidthWindow = useWindowSize(window);
  useEffect(() => {
    const accessToken = getCookie('access_token');
    // const refreshToken = getCookie('refresh_token');
    if (!accessToken) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    if (user?.role?._id == ROLES.ADMIN) {
      navigate('/');
    } else if (user?.role?._id == ROLES.USER) {
      navigate('/dat-mon');
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getInfoUser();
        if (response.data) {
          dispatch(setUsers(response.data.user));
          // if (response?.data?.user?.role?._id == ROLES.ADMIN) {
          //   navigate('/');
          // } else if (response?.data?.user?.role?._id == ROLES.USER) {
          //   navigate('/dat-mon');
          // }
        }
        setLoading(false);
      } catch (error) {
        console.log('Failed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (getWidthWindow.width > 1024) {
      dispatch(setMenu(false));
    }
  }, [getWidthWindow]);
  return (
    <Spin spinning={loading}>
      <Layout className={'min-h-screen flex'}>
        <div
          className="hidden lg:block "
          style={{
            overflow: 'hidden',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 50,
          }}
        >
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            theme="light"
            className={`!bg-[#217ca3] border  ${
              collapsed
                ? '!min-w-[82px] !max-w-[82px] collapseClose'
                : '!min-w-[255px] !max-w-[255px] collapseOpen'
            }`}
          >
            <Sidebar
              closeOpenMenu={() => dispatch(setMenu(false))}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              isDrawer={false}
            />
          </Sider>
        </div>
        <Layout className={`lg:pl-0 pl-2 ${collapsed ? 'lg:ml-[110px]' : 'lg:ml-[285px]'}`}>
          <Header />
          <div className={'w-full pl-2.5 text-[18px] mt-2 border-l-4 border-[#217ca3] font-bold'}>
            {title}
          </div>

          <Content
            style={{
              margin: '10px 10px 10px 0',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              // height: 'calc(100vh - 142px)',
            }}
          >
            {children}
          </Content>
          <Footer className="!p-0 text-center mb-1 text-[12px] italic ">
            King Of Food ©2024 Implement By @Nhom8
          </Footer>
        </Layout>

        <Drawer
          className="!bg-[#217ca3] collapseLg min-h-screen flex "
          placement="right"
          onClose={() => dispatch(setMenu(false))}
          open={openMenu}
        >
          <div
            style={{
              position: 'fixed',
              overflow: 'hidden',
              top: 40,
              bottom: 0,
              zIndex: 50,
            }}
          >
            <Sidebar
              closeOpenMenu={() => dispatch(setMenu(false))}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              isDrawer={true}
            />
          </div>
        </Drawer>
      </Layout>
    </Spin>
  );
};

export default MainLayout;
