import { useAppDispatch } from '@/stores/configureStore';
import { setBreadcrumb, setTitle } from '@/stores/slices/commonSlice';
import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import AccountEmployeeOpen from './AccountEmployeeOpen';
import AccountEmployeeBlock from './AccountEmployeeBlock';

const AccountEmployee = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: 'Home',
          path: '/',
        },
        {
          name: 'Quản lý tài khoản nhân viên',
          // path: '',
        },
        // {
        //   name: 'Tài khoản nhân viên',
        //   // path: '',
        // },
      ]),
    );
    dispatch(setTitle('Tài khoản nhân viên'));
  }, [dispatch]);

  const [activeKey, setActiveKey] = useState('1');

  const onChange = (key: string) => {
    setActiveKey(key);
  };
  const items = [
    {
      key: '1',
      label: 'Tài khoản đang hoạt động',
      children: <AccountEmployeeOpen activeKey={activeKey} />,
    },
    {
      key: '2',
      label: 'Tài khoản đã khóa',
      children: <AccountEmployeeBlock activeKey={activeKey} />,
    },
  ];
  return <Tabs activeKey={activeKey} items={items} onChange={onChange} />;
};

export default AccountEmployee;
