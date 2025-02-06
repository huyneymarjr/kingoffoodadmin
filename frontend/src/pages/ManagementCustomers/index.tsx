import TableDefault from '@/components/TableCustom';
import { Button, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBreadcrumb, setTitle } from '@/stores/slices/commonSlice';
import { EditFilled, EyeFilled, PauseCircleFilled, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { deleteCustomer, getListCustomer } from '@/apis/customerApi';
import { useAppSelector } from '@/stores/configureStore';

import ModalAddCustomer from './Modal/ModalAddCustomer';
import { deleteDataCustomer, setListDataCustomer } from '@/stores/slices/managenmentCustomerSlice';

const ManagementCustomers = () => {
  // const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState({ pageIndex: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const [isOpenModalCustomer, setIsOpenModalCustomer] = useState(false);
  const dataSource = useAppSelector((state) => state.managenmentCustomer);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getListCustomer({
        current: page.pageIndex,
        pageSize: page.pageSize,
        type: 'Khách hàng',
      });
      if (response.data) {
        // setDataSource(response?.data?.result);
        dispatch(setListDataCustomer(response?.data?.result));
        setTotal(response?.data?.meta.total);
      }
      setLoading(false);
    } catch (error) {
      console.log('Failed', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (page) fetchData();
  }, [page]);

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (_text: any, _record: any, index: number) => index + 1,
      width: 50,
      align: 'center',
    },
    {
      title: 'Mã khách hàng',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Tên khách hàng',
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
      dataIndex: 'type',
      key: 'type',
      render: (_text: any) => {
        return _text;
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
      width: 250,
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
              setSelectedRecord({ type: 'view', data: record });
              setIsOpenModalCustomer(true);
            }}
          ></Button>
          <Button
            className="border-none"
            icon={<PauseCircleFilled style={{ fontSize: '18px', color: '#217ca3' }} />}
            onClick={async () => {
              Modal.confirm({
                title: 'Xác nhận',
                content: `Bạn có chắc chắn muốn xóa khách hàng ${record.name} này không?`,
                onOk: async () => {
                  try {
                    await deleteCustomer({ id: record._id });
                    await fetchData();
                    dispatch(deleteDataCustomer(record._id));
                    message.success('Xóa thành công');
                  } catch (error: any) {
                    console.log('Failed:', error);
                   
                  }
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
                  setSelectedRecord({ type: 'edit', data: record });
                  setIsOpenModalCustomer(true);
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
  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: 'Home',
          path: '/',
        },
        {
          name: 'Quản lý đối tác',
          // path: '',
        },
        // {
        //   name: 'Tài khoản nhân viên',
        //   // path: '',
        // },
      ]),
    );
    dispatch(setTitle('Danh sách khách hàng'));
  }, [dispatch]);

  const handlerAddNewEmployee = () => {
    setIsOpenModalCustomer(true);
  };
  return (
    <div>
      <Button type="primary" onClick={handlerAddNewEmployee} className="float-end mb-4 py-4">
        <PlusOutlined /> Thêm mới
      </Button>
      {isOpenModalCustomer && (
        <ModalAddCustomer
          isOpenModal={isOpenModalCustomer}
          setIsOpenModal={setIsOpenModalCustomer}
          fetchData={fetchData}
          setSelectedRecord={setSelectedRecord}
          selectedRecord={selectedRecord}
        />
      )}
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

export default ManagementCustomers;
