import TableDefault from '@/components/TableCustom';
import { Button, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBreadcrumb, setTitle } from '@/stores/slices/commonSlice';
import { EditFilled, EyeFilled, PauseCircleFilled, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { use } from 'i18next';
import { deleteCategories, getListCategories } from '@/apis/categoriesApi';
import { getListRole } from '@/apis/role';
import { setListDataRoles } from '@/stores/slices/managenmentRolesSlice';
import { useAppSelector } from '@/stores/configureStore';
import { deleteData, setListData } from '@/stores/slices/managenmentEmployeeSlice';
import ModalAddCategories from './Modal/ModalAddCategories';
import { deleteDataCategories, setListDataCategories } from '@/stores/slices/managenmentCategoriesSlice';

const ManagementCategories = () => {
  // const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [page, setPage] = useState({ pageIndex: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const dataSource = useAppSelector((state) => state.managenmentCategories);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getListCategories({
        current: page.pageIndex,
        pageSize: page.pageSize,
      });
      if (response.data) {
        // setDataSource(response?.data?.result);
        dispatch(setListDataCategories(response?.data?.result));
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
      title: 'Mã nhóm',
      dataIndex: '_id',
      key: '_id',
      width: 100,
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Miêu tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
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
                content: `Bạn có chắc chắn muốn xóa loại ${record.name} này không?`,
                centered: true,
                onOk: async () => {
                  await deleteCategories({ id: record._id });
                  dispatch(deleteDataCategories(record._id));
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
          name: 'Quản lý nhóm món ăn',
          // path: '',
        },
        // {
        //   name: 'Tài khoản nhân viên',
        //   // path: '',
        // },
      ]),
    );
    dispatch(setTitle('Danh sách nhóm món ăn'));
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
      />
      {isOpenModal && (
        <ModalAddCategories
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

export default ManagementCategories;
