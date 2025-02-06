import TableDefault from '@/components/TableCustom';
import { Button, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBreadcrumb, setTitle } from '@/stores/slices/commonSlice';
import { EditFilled, EyeFilled, PauseCircleFilled, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useAppSelector } from '@/stores/configureStore';

import dayjs from 'dayjs';
import { deleteMenus, getListMenus, updateMenus } from '@/apis/menusApi';
import { deleteDataMenus, setListDataMenus } from '@/stores/slices/managementMenusSlice';
import { linkImage } from '@/utils/helpers/getLinkImage';
import { Checkbox } from 'antd/lib';

const ManagementMenus = () => {
  // const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState({ pageIndex: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const dataSource = useAppSelector((state) => state.managementMenus);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getListMenus({
        current: page.pageIndex,
        pageSize: page.pageSize,
      });
      if (response.data) {
        dispatch(setListDataMenus(response?.data?.result));
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
      title: 'Mã hàng hóa',
      dataIndex: '_id',
      key: '_id',
      width: 150,
    },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'image',
      key: 'image',
      render: (text: any) => {
        return (
          <div className="w-full flex items-center justify-center">
            <img src={linkImage(text, 'menus')} className="w-[100px] h-[100px] object-cover" />
          </div>
        );
      },
      width: 150,
      align: 'center',
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Tên hàng hóa',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      render: (text: any) => {
        return <div className="font-bold text-[red]">{text?.toLocaleString('en-US')}</div>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => {
        console.log('record', record);
        return (
          <Checkbox
            className="flex items-center justify-center"
            checked={text == 'Hoạt động'}
            onChange={async () => {
              try {
                await updateMenus(
                  { id: record._id },
                  {
                    ...record,
                    status: record.status === 'Hoạt động' ? 'Không hoạt động' : 'Hoạt động',
                  },
                );
                dispatch(
                  setListDataMenus(
                    dataSource.map((item: any) =>
                      item._id === record._id
                        ? { ...item, status: item.status === 'Hoạt động' ? 'Không hoạt động' : 'Hoạt động' }
                        : item,
                    ),
                  ),
                );
                message.success('Cập nhật trạng thái thành công');
              } catch (error: any) {
                console.log('Failed', error);
                message.error(error?.response?.data?.message || 'Cập nhật trạng thái thất bại');
              }
            }}
          />
        );
      },
      align: 'center',
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
              navigate(`/danh-muc-mon-an/chi-tiet/${record._id}?type=view`);
            }}
          ></Button>
          <Button
            className="border-none"
            icon={<PauseCircleFilled style={{ fontSize: '18px', color: '#217ca3' }} />}
            onClick={async () => {
              Modal.confirm({
                title: 'Xác nhận',
                content: `Bạn có chắc chắn muốn xóa món ăn ${record._id} này không?`,
                onOk: async () => {
                  await deleteMenus({ id: record._id });
                  dispatch(deleteDataMenus(record._id));
                  setTotal(total - 1);
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
                  navigate(`/danh-muc-mon-an/chi-tiet/${record._id}?type=edit`);
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
          name: 'Quản lý danh sách món ăn',
          // path: '',
        },
        // {
        //   name: 'Tài khoản nhân viên',
        //   // path: '',
        // },
      ]),
    );
    dispatch(setTitle('Danh sách món ăn'));
  }, [dispatch]);

  const handlerAddNewEmployee = () => {
    // setIsOpenModal(true);
    navigate('/danh-muc-mon-an/them-moi');
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
      {/* {isOpenModal && (
        <ModalAddPayment
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          selectedRecord={selectedRecord}
          setSelectedRecord={setSelectedRecord}
        />
      )} */}
    </div>
  );
};

export default ManagementMenus;
