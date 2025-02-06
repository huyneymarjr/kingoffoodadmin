import TableDefault from '@/components/TableCustom';
import { Button, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBreadcrumb, setTitle } from '@/stores/slices/commonSlice';
import { EditFilled, EyeFilled, PauseCircleFilled, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useAppSelector } from '@/stores/configureStore';

import dayjs from 'dayjs';

import { deleteDataPayments, setListDataPayments } from '@/stores/slices/managementPaymentsSlice';
import ModalAddPayment from './Modal/ModalAddPayment';
import { deletePayments, getListPayments } from '@/apis/paymentsApi';

const ManagementPayments = () => {
  // const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [page, setPage] = useState({ pageIndex: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const dataSource = useAppSelector((state) => state.managementPayments);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getListPayments({
        current: page.pageIndex,
        pageSize: page.pageSize,
      });
      if (response.data) {
        // setDataSource(response?.data?.result);
        dispatch(setListDataPayments(response?.data?.result));
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
      title: 'Mã ',
      dataIndex: '_id',
      key: '_id',
      width: 150,
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'method',
      key: 'method',
      render: (text: any) => {
        return text.map((item: any) => item).join(', ');
      },
      width: 190,
    },
    {
      title: 'Ngày thanh toán',
      dataIndex: 'paymentTime',
      key: 'paymentTime',
      render: (text: any) => {
        return dayjs(text).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Thời gian thanh toán',
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
                content: `Bạn có chắc chắn muốn xóa mã hóa đơn ${record._id} này không?`,
                onOk: async () => {
                  await deletePayments({ id: record._id });
                  dispatch(deleteDataPayments(record._id));
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
          name: 'Quản lý danh mục thanh toán',
          // path: '',
        },
        // {
        //   name: 'Tài khoản nhân viên',
        //   // path: '',
        // },
      ]),
    );
    dispatch(setTitle('Danh sách thanh toán'));
  }, [dispatch]);

  // const handlerAddNewEmployee = () => {
  //   setIsOpenModal(true);
  // };
  return (
    <div>
      {/* <Button type="primary" onClick={handlerAddNewEmployee} className="float-end mb-4 py-4">
        <PlusOutlined /> Thêm mới
      </Button> */}
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
      {isOpenModal && (
        <ModalAddPayment
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          selectedRecord={selectedRecord}
          setSelectedRecord={setSelectedRecord}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default ManagementPayments;
