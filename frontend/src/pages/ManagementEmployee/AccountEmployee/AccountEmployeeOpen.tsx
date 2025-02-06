import TableDefault from '@/components/TableCustom';
import { Button, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBreadcrumb, setTitle } from '@/stores/slices/commonSlice';
import { EditFilled, EyeFilled, PauseCircleFilled, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { use } from 'i18next';
import { deleteUser, getListUser } from '@/apis/usersApi';
import { getListRole } from '@/apis/role';
import { setListDataRoles } from '@/stores/slices/managenmentRolesSlice';
import { useAppSelector } from '@/stores/configureStore';
import { deleteData, setListData } from '@/stores/slices/managenmentEmployeeSlice';

const AccountEmployeeOpen = ({ activeKey }: { activeKey: string }) => {
  // const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [listRole, setListRole] = useState<any[]>([]);
  const [page, setPage] = useState({ pageIndex: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const dataSource = useAppSelector((state) => state.managenmentEmployee);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getListUser({
        current: page.pageIndex,
        pageSize: page.pageSize,
        isDeleted: 'false',
      });
      if (response.data) {
        // setDataSource(response?.data?.result);
        dispatch(setListData(response?.data?.result));
        setTotal(response?.data?.meta.total);
      }
      setLoading(false);
    } catch (error) {
      console.log('Failed', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (page && activeKey == '1') fetchData();
  }, [page, activeKey]);
  // lấy danh sách role
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListRole({
          current: '1',
          pageSize: '10',
        });
        if (response.data) {
          setListRole(response?.data?.result);
        }
      } catch (error) {
        console.log('Failed', error);
        message.error('Lỗi lấy danh sách vai trò');
      }
    };
    fetchData();
  }, []);
  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (_text: any, _record: any, index: number) => index + 1,
      width: 50,
      align: 'center',
    },
    {
      title: 'Mã nhân viên',
      dataIndex: '_id',
      key: '_id',
      width: 100,
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },

    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (_text: any, record: any) => {
        const role = listRole.find((item) => item._id === record?.role);
        return role?.name;
      },
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_text: any, record: any) => {
        return record.createdAt
          ? `${new Date(record.createdAt).toLocaleDateString()} ${new Date(
              record.createdAt,
            ).toLocaleTimeString()}`
          : '';
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      render: (_text: any, record: any) => (
        <div className="flex gap-2 items-center justify-center">
          <Button
            className="border-none"
            icon={<EyeFilled style={{ fontSize: '20px', color: '#217ca3' }} />}
            onClick={() => {
              navigate(`/tai-khoan-nhan-vien/thiet-lap-tai-khoan/${record._id}?type=view`);
            }}
          ></Button>
          <Button
            className="border-none"
            icon={<PauseCircleFilled style={{ fontSize: '18px', color: '#217ca3' }} />}
            onClick={async () => {
              Modal.confirm({
                title: 'Xác nhận',
                content: `Bạn có chắc chắn muốn xóa nhân viên ${record.name} này không?`,
                onOk: async () => {
                  await deleteUser({ id: record._id });
                  await fetchData();
                  dispatch(deleteData(record._id));
                  message.success('Xóa thành công');
                },
                okText: 'Xác nhận',
                okButtonProps: {
                  danger: true,
                },
                cancelText: 'Huỷ',
              });
            }}
          ></Button>
          <Button
            className="border-none"
            icon={
              <EditFilled
                style={{ fontSize: '18px', color: '#217ca3' }}
                onClick={() => {
                  navigate(`/tai-khoan-nhan-vien/thiet-lap-tai-khoan/${record._id}?type=edit`);
                }}
              />
            }
          ></Button>
        </div>
      ),
      align: 'center',
      width: 100,
    },
  ];

  const handlerAddNewEmployee = () => {
    // setIsOpenModal(true);
    navigate('/tai-khoan-nhan-vien/thiet-lap-tai-khoan');
  };
  return (
    <div>
      <Button type="primary" onClick={handlerAddNewEmployee} className="float-end mb-4 py-4">
        <PlusOutlined /> Thêm mới
      </Button>
      <TableDefault
        columns={columns}
        dataSource={dataSource}
        isPagination={true}
        scroll={{
          x: 'max-content',
        }}
        loading={loading}
        total={total}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default AccountEmployeeOpen;
