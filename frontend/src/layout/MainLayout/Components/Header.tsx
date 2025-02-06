import { Breadcrumb, Layout } from 'antd';
import InlineSVG from 'react-inlinesvg';
import { useLocation } from 'react-router-dom';
import IconHome from '/assets/icons/duotone/house-chimney-user.svg';
import { BellOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../stores/configureStore';
import { setMenu } from '../../../stores/slices/commonSlice';

// import { setSelectedDepartment } from '@/stores/slices/userSlice';
// import { setMenu } from '@/stores/slices/commonSlice';

function Header() {
  const { Header } = Layout;
  const location = useLocation();
  const { breadcrumb: breadcrumbs } = useAppSelector((state) => state.common);

  const dispatch = useAppDispatch();

  const listBreadcrumb =
    breadcrumbs.length > 0
      ? breadcrumbs.map((breadcrumb) => {
          return {
            title:
              breadcrumb.path === '/' ? (
                <InlineSVG src={IconHome} width={18} height={18} />
              ) : location.pathname === breadcrumb.path ? (
                <span className="capitalize text-black-0 ">{breadcrumb.name}</span>
              ) : (
                <span className="capitalize">{breadcrumb.name}</span>
              ),
            href: breadcrumb.path,
          };
        })
      : [];
  return (
    <Header
      className={
        ' bg-white h-[50px]  flex justify-between !items-center px-5 lg:ml-[-30px] ml-[-10px] !mt-0 print:hidden '
      }
    >
      <div className="mt-2">
        <Breadcrumb items={listBreadcrumb} />
      </div>

      <div className="flex md:items-center md:justify-center whitespace-nowrap flex-wrap md:gap-5 justify-between h-auto">
        <BellOutlined
          style={{
            fontSize: 20,
            color: '#000',
          }}
        />

        <div className="flex items-center gap-1 ">
          <div
            className="ml-3 lg:hidden cursor-pointer flex items-center"
            onClick={() => {
              dispatch(setMenu(true));
            }}
          >
            <MenuFoldOutlined style={{ fontSize: 20, color: '#000' }} />
          </div>
        </div>
      </div>
    </Header>
  );
}

export default Header;
