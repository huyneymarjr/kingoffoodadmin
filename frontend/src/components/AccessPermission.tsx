import { useAppSelector } from '@/stores/configureStore';
import { ROLES } from '@/utils/constants/role';

import { Button, Result, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

const AccessPermission = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [user]);
  return (
    <>
      <Spin spinning={loading}>
        {!user._id ? null : user?.role?._id == ROLES.ADMIN ? (
          children
        ) : (
          <Result
            status="403"
            title="Truy cập bị từ chối"
            subTitle="Xin lỗi, bạn không có quyền hạn truy cập thông tin này"
            extra={
              <Button
                type="primary"
                onClick={() => {
                  if (user?.role?._id === ROLES.ADMIN) {
                    window.location.href = '/';
                  } else {
                    window.location.href = '/dat-mon';
                  }
                }}
              >
                Trở về trang chủ
              </Button>
            }
          />
        )}
      </Spin>
    </>
  );
};

export default AccessPermission;
