import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, Tag, message, notification } from 'antd';
import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import TableDefault from '@/components/TableCustom';
import { useAppDispatch } from '@/stores/configureStore';
import ModalRole from './Modal/ModalRole';
import { callDeleteRole, callFetchRole } from '@/apis/role';

const ManagementRoles = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [roles, setRoles] = useState<IRole[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState({ pageIndex: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const fetchDataRoles = async () => {
    try {
      setLoading(true);
      const response = await callFetchRole({
        current: page.pageIndex,
        pageSize: page.pageSize,
      });
      if (response.data) {
        setRoles(response?.data?.result);
        setTotal(response?.data?.meta.total);
      }
      setLoading(false);
    } catch (error) {
      console.log('Failed', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDataRoles();
  }, []);
  const handleDeleteRole = async (_id: string | undefined) => {
    if (_id) {
      try {
        await callDeleteRole(_id);
        message.success('Xóa Role thành công');
        fetchDataRoles();
      } catch (error) {
        console.log('Failed', error);
      }
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (_text: any, _record: any, index: number) => index + 1,
      width: 50,
      align: 'center',
    },
    {
      title: 'Mã',
      dataIndex: '_id',
      width: 250,
      render: (text: any, record: any) => {
        return <span>{record._id}</span>;
      },
      hideInSearch: true,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      render(text: any, record: any) {
        return (
          <>
            <Tag color={record.isActive ? 'lime' : 'red'}>
              {record.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
            </Tag>
          </>
        );
      },
      hideInSearch: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 200,
      sorter: true,
      render: (text: any, record: any) => {
        return <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>;
      },
      hideInSearch: true,
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      width: 200,
      sorter: true,
      render: (text: any, record: any) => {
        return <>{dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</>;
      },
      hideInSearch: true,
    },
    {
      title: 'Thao tác',
      hideInSearch: true,
      width: 50,
      render: (_value: any, record: any) => (
        <Space>
          <EditOutlined
            style={{
              fontSize: 20,
              color: '#ffa500',
            }}
            type=""
            onClick={() => {
              setOpenModal(true);
              setSelectedRecord(record);
            }}
          />

          <Popconfirm
            placement="leftTop"
            title={'Xác nhận xóa vai trò'}
            description={'Bạn có chắc chắn muốn xóa vai trò này ?'}
            onConfirm={() => handleDeleteRole(record._id)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <span style={{ cursor: 'pointer', margin: '0 10px' }}>
              <DeleteOutlined
                style={{
                  fontSize: 20,
                  color: '#ff4d4f',
                }}
              />
            </span>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setOpenModal(true)} className="float-end mb-4 py-4">
        <PlusOutlined /> Thêm mới
      </Button>
      <TableDefault
        columns={columns}
        dataSource={roles}
        isPagination={true}
        scroll={{
          x: 'max-content',
        }}
        loading={loading}
        total={total}
        page={page}
        setPage={setPage}
      />

      <ModalRole
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={fetchDataRoles}
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
      />
    </div>
  );
};

export default ManagementRoles;
