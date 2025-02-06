import TableDefault from '@/components/TableCustom';
import { Button, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBreadcrumb, setTitle } from '@/stores/slices/commonSlice';
import { EditFilled, EyeFilled, PauseCircleFilled, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useAppSelector } from '@/stores/configureStore';
import ModalAddInventories from './Modal/ModalAddInventories';
import { deleteInventories, getListInventories } from '@/apis/inventoriesApi';
import { deleteDataInventories, setListDataInventories } from '@/stores/slices/managementInventoriesSlice';

const ManagenmentInventories = () => {
  // const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState({ pageIndex: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const [isOpenModalInventories, setIsOpenModalInventories] = useState(false);
  const dataSource = useAppSelector((state) => state.managenmentInventories);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getListInventories({
        current: page.pageIndex,
        pageSize: page.pageSize,
      });
      if (response.data) {
        // setDataSource(response?.data?.result);
        dispatch(setListDataInventories(response?.data?.result));
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
      title: 'Mã sản phẩm kho',
      dataIndex: '_id',
      key: '_id',
      width: 100,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      filters: dataSource.map((item: any) => ({ text: item.name, value: item.name })),
      onFilter: (value: any, record: any) => record.name.startsWith(value as string),
      filterSearch: true,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a: any, b: any) => a.quantity - b.quantity,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      key: 'price',
      sorter: (a: any, b: any) => a.price - b.price,
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
              setIsOpenModalInventories(true);
            }}
          ></Button>
          <Button
            className="border-none"
            icon={<PauseCircleFilled style={{ fontSize: '18px', color: '#217ca3' }} />}
            onClick={async () => {
              Modal.confirm({
                title: 'Xác nhận',
                content: `Bạn có chắc chắn muốn xóa sản phẩm ${record.name} này không?`,
                onOk: async () => {
                  await deleteInventories({ id: record._id });
                  await fetchData();
                  dispatch(deleteDataInventories(record._id));
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
                  setSelectedRecord({ type: 'edit', data: record });
                  setIsOpenModalInventories(true);
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
          name: 'Quản lý kho',
          // path: '',
        },
        // {
        //   name: 'Tài khoản nhân viên',
        //   // path: '',
        // },
      ]),
    );
    dispatch(setTitle('Danh sách kho hàng'));
  }, [dispatch]);

  const handlerAddNewEmployee = () => {
    setIsOpenModalInventories(true);
  };
  return (
    <div>
      <Button type="primary" onClick={handlerAddNewEmployee} className="float-end mb-4 py-4">
        <PlusOutlined /> Thêm mới
      </Button>
      {isOpenModalInventories && (
        <ModalAddInventories
          isOpenModal={isOpenModalInventories}
          setIsOpenModal={setIsOpenModalInventories}
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

export default ManagenmentInventories;
