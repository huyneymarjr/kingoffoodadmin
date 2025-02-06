import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message, notification } from 'antd';
import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import { callDeletePermission, callFetchPermission } from '@/apis/role';
import { ALL_PERMISSIONS } from '@/apis/Config/permissions';
import TableDefault from '@/components/TableCustom';

import ViewDetailPermission from './Modal/ViewDetailPermission';
import ModalPermission from './Modal/ModalPermission';
import { setBreadcrumb, setTitle } from '@/stores/slices/commonSlice';
import { useAppDispatch } from '@/stores/configureStore';

const ManagementPermissions = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<IPermission | null>(null);
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState({ pageIndex: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const dispatch = useAppDispatch();
  const fetchDataPermissions = async () => {
    try {
      setLoading(true);
      const response = await callFetchPermission({
        current: page.pageIndex,
        pageSize: page.pageSize,
      });
      if (response.data) {
        setPermissions(response?.data?.result);
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
    fetchDataPermissions();
  }, [page]);
  const handleDeletePermission = async (_id: string | undefined) => {
    if (_id) {
      try {
        const res = await callDeletePermission(_id);
        if (res && res.data) {
          message.success('Xóa Permission thành công');
          fetchDataPermissions();
        }
      } catch (error) {
        console.log('Failed');
      }
    }
  };
  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: 'Home',
          path: '/',
        },
        {
          name: 'Quản lý danh mục quyền hạn',
          // path: '',
        },
        // {
        //   name: 'Tài khoản nhân viên',
        //   // path: '',
        // },
      ]),
    );
    dispatch(setTitle('Danh sách quyền hạn'));
  }, [dispatch]);

  const columns: ProColumns<IPermission>[] = [
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
      render: (text, record, index, action) => {
        return (
          <a
            href="#"
            onClick={() => {
              setOpenViewDetail(true);
              setDataInit(record);
            }}
          >
            {record._id}
          </a>
        );
      },
      hideInSearch: true,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: 'API',
      dataIndex: 'apiPath',
      sorter: true,
    },
    {
      title: 'Phương thức',
      dataIndex: 'method',
      sorter: true,
      render(dom, entity, index, action, schema) {
        return (
          <p
            style={{
              paddingLeft: 10,
              fontWeight: 'bold',
              marginBottom: 0,
            }}
          >
            {entity?.method || ''}
          </p>
        );
      },
    },
    {
      title: 'Module',
      dataIndex: 'module',
      sorter: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 200,
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>;
      },
      hideInSearch: true,
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      width: 200,
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</>;
      },
      hideInSearch: true,
    },
    {
      title: 'Thao tác',
      hideInSearch: true,
      width: 50,
      render: (_value, entity, _index, _action) => (
        <Space>
          <EditOutlined
            style={{
              fontSize: 20,
              color: '#ffa500',
            }}
            type=""
            onClick={() => {
              setOpenModal(true);
              setDataInit(entity);
            }}
          />

          <Popconfirm
            placement="leftTop"
            title={'Xác nhận xóa quyền hạn'}
            description={'Bạn có chắc chắn muốn xóa quyền hạn này ?'}
            onConfirm={() => handleDeletePermission(entity._id)}
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
        dataSource={permissions}
        isPagination={true}
        scroll={{
          x: 'max-content',
        }}
        loading={loading}
        total={total}
        page={page}
        setPage={setPage}
      />

      <ModalPermission
        openModal={openModal}
        setOpenModal={setOpenModal}
        dataInit={dataInit}
        setDataInit={setDataInit}
        reloadTable={fetchDataPermissions}
      />

      <ViewDetailPermission
        onClose={setOpenViewDetail}
        open={openViewDetail}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </div>
  );
};

export default ManagementPermissions;
