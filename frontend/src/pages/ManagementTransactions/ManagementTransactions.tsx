import TableDefault from '@/components/TableCustom';
import { Button, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBreadcrumb, setTitle } from '@/stores/slices/commonSlice';
import { EditFilled, EyeFilled, PauseCircleFilled, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useAppSelector } from '@/stores/configureStore';
import dayjs from 'dayjs';
import ModalAddTransactions from './Modal/ModalAddTransactions';
import { deleteTransactions, getListTransactions } from '@/apis/transactionsApi';
import { deleteDataTransactions, setListDataTransactions } from '@/stores/slices/managementTransactionsSlice';
import { getInventoriesById } from '@/apis/inventoriesApi';
const ManagementTransactions = () => {
  // const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [page, setPage] = useState({ pageIndex: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const dataSource = useAppSelector((state) => state.managenmentTransactions);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState<any>({});
  const handleChange = (pagination: any, filters: any, _sorter: any) => {
    setPage && setPage({ pageIndex: pagination.current, pageSize: pagination.pageSize });
    setFilteredInfo(filters);
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getListTransactions({
        current: page.pageIndex,
        pageSize: page.pageSize,
        filter: `&type=${filteredInfo?.type || ''}`,
      });
      if (response.data) {
        // setDataSource(response?.data?.result);
        const dataCustomer = await Promise.all(
          response.data.result.map(async (item: any) => {
            const inventoriesName = await getInventoriesById({
              id: item.inventoryId,
            });
            return {
              ...item,
              inventoriesName: inventoriesName?.data?.name,
            };
          }),
        );

        dispatch(setListDataTransactions(dataCustomer));
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
  }, [page, filteredInfo]);

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (_text: any, _record: any, index: number) => index + 1,
      width: 50,
      align: 'center',
    },
    {
      title: 'Mã giao dịch',
      dataIndex: '_id',
      key: '_id',
      width: 220,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'inventoriesName',
      key: 'inventoriesName',
    },
    {
      title: 'Loại giao dịch',
      dataIndex: 'type',
      key: 'type',
      filters: [
        {
          text: 'Nhập',
          value: 'Nhập',
        },
        {
          text: 'Xuất',
          value: 'Xuất',
        },
      ],
      filteredValue: filteredInfo?.type || null,
      filterSearch: false,
    },

    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
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
              setSelectedRecord({
                type: 'view',
                data: record,
              });
              setIsOpenModal(true);
            }}
          ></Button>
          <Button
            className="border-none"
            icon={<PauseCircleFilled style={{ fontSize: '18px', color: '#217ca3' }} />}
            onClick={async () => {
              Modal.confirm({
                title: 'Xác nhận',
                content: `Bạn có chắc chắn muốn xóa giao dịch ${record.inventoriesName} này không?`,
                onOk: async () => {
                  await deleteTransactions({ id: record._id });
                  dispatch(deleteDataTransactions(record._id));
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
                  setSelectedRecord({
                    type: 'edit',
                    data: record,
                  });
                  setIsOpenModal(true);
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
    dispatch(setTitle('Danh sách giao dịch'));
  }, [dispatch]);

  const handlerAddNewEmployee = () => {
    setIsOpenModal(true);
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
        onChange={handleChange}
      />
      {isOpenModal && (
        <ModalAddTransactions
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          selectedRecord={selectedRecord}
          setSelectedRecord={setSelectedRecord}
          fetchDataTransactions={fetchData}
        />
      )}
    </div>
  );
};

export default ManagementTransactions;
