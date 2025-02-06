import React, { useEffect, useState } from 'react';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import type { TableColumnsType, TableProps, TabsProps } from 'antd';
import { Badge, Button, Divider, Dropdown, Input, Space, Table, Tabs } from 'antd';
import InfoOrder from './TabsComponents/InfoOrder';
import HistoryOrder from './TabsComponents/HistoryOrder';
import { getListOrders, getListOrdersCustomer, getOrdersById } from '@/apis/ordersApi';
import { getCustomerById, listCustomer } from '@/apis/customerApi';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '@/stores/configureStore';
import { setSelectedRowKeys } from '@/stores/slices/clickExportExcelSlice';
import { on } from 'events';
import { getListAllUser } from '@/apis/usersApi';
type OnChange = NonNullable<TableProps<any>['onChange']>;
type Filters = Parameters<OnChange>[1];
const TableCustom = ({
  type,
  startDate,
  endDate,
}: {
  type: 0 | 1 | 2 | 3 | 4;
  startDate: any;
  endDate: any;
}) => {
  const [activeKey, setActiveKey] = useState('1');
  const [listOrder, setListOrder] = useState<any>([]);
  const [page, setPage] = useState({ pageIndex: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeKeyTable, setActiveKeyTable] = useState<string[]>([]);
  const [expandDataSource, setExpandDataSource] = useState<any>([]);
  const [checkCallApi, setCheckCallApi] = useState<any>([]);
  const { selectedRowKeys } = useAppSelector((state) => state.clickExportExcel);
  const [listDataCustomer, setListDataCustomer] = useState<any[]>([]);
  const [listDataUser, setListDataUser] = useState<any[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<any>({});
  const [sorterdInfo, setSorterdInfo] = useState<any>({});
  const dispatch = useAppDispatch();

  const handleChangeTable: OnChange = (pagination, filters, sorter) => {
    console.log({ pagination, filters, sorter });
    setFilteredInfo(filters);
    setSorterdInfo(sorter);
  };
  const fetchListCustomer = async () => {
    try {
      const response = await listCustomer();
      setListDataCustomer(response.data.map((item: any) => ({ text: item.name, value: item._id })));
    } catch (error) {
      console.log(error);
    }
  };
  const fetchListUser = async () => {
    try {
      const response = await getListAllUser();
      setListDataUser(response.data.map((item: any) => ({ text: item.name, value: item._id })));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchListCustomer();
    fetchListUser();
  }, []);
  const fetchListData = async (filter = '') => {
    try {
      setLoading(true);
      const response = await getListOrdersCustomer({
        current: page.pageIndex,
        pageSize: page.pageSize,
        type: type,
        filter: filter,
      });
      console.log(response);
      if (response.data) {
        setListOrder(
          response?.data?.result.map((item: any) => {
            return {
              ...item,
              key: item._id,
            };
          }),
        );
        setTotal(response?.data?.meta.total);
        // setActiveKeyTable([response?.data?.result[0]?._id]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const buildFilterQuery = () => {
    const { _id, nameCustomer, nameBooker, status } = filteredInfo || {};
    // const sortOrder = sorterdInfo?.sorter?.order === 'ascend' ? '' : '-';
    // const sortField = sorterdInfo?.sorter?.field || '';

    // Lọc các trường hợp undefined/null
    const queryParams = new URLSearchParams();
    if (_id) queryParams.append('_id', _id);
    if (nameCustomer) queryParams.append('customerId', nameCustomer);
    if (nameBooker) queryParams.append('userId', nameBooker);
    if (status) queryParams.append('status', status);
    if (startDate && endDate) {
      queryParams.append('startDate', dayjs(startDate).add(7, 'hours').format('YYYY-MM-DDTHH:mm:ss'));
      queryParams.append('endDate', dayjs(endDate).add(7, 'hours').format('YYYY-MM-DDTHH:mm:ss'));
    }
    // if (sortField) queryParams.append('sort', `${sortOrder}${sortField}`);

    return queryParams.toString();
  };

  useEffect(() => {
    if (page) {
      const filterQuery = buildFilterQuery();
      fetchListData(filterQuery);
    }

    // if (sorterdInfo?.sorter?.order === 'ascend') {
    //   fetchListData(
    //     `_id=${filteredInfo._id}&customerId=${filteredInfo?.nameCustomer}&userId=${filteredInfo?.nameBooker}&status=${filteredInfo?.status}&sort=${sorterdInfo?.field}`,
    //   );
    // } else {
    //   fetchListData(
    //     `_id=${filteredInfo._id}&customerId=${filteredInfo?.nameCustomer}&userId=${filteredInfo?.nameBooker}&status=${filteredInfo?.status}&sort=-${sorterdInfo?.field}`,
    //   );
    // }
  }, [page, type, filteredInfo, sorterdInfo, startDate, endDate]);
  const onChange = (key: string) => {
    setActiveKey(key);
  };
  const [searchText, setSearchText] = useState('');
  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
  };
  const columns = [
    {
      title: 'Mã hóa đơn',
      dataIndex: '_id',
      key: '_id',
      filterDropdown: ({ confirm, clearFilters, close }: any) => (
        <div className="p-[8px] min-w-[200px] max-w-[250px]">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm mã hóa đơn"
            value={searchText}
            onChange={handleSearch}
          />
          <Divider className="h-0 m-0 relative top-[6px]" />
          <div className="flex justify-between px-5 mt-3">
            <Button
              onClick={async () => {
                setSearchText('');
                setFilteredInfo((prev: any) => ({ ...prev, _id: undefined }));
                clearFilters();
                close();
              }}
              type="default"
              size="small"
              className="text-[#6559cd] border-[#6559cd]"
            >
              Reset
            </Button>
            <Button
              type="primary"
              onClick={async () => {
                setFilteredInfo((prev: any) => ({ ...prev, _id: searchText }));
                confirm();
                close();
              }}
              size="small"
              className="px-3"
            >
              OK
            </Button>
          </div>
        </div>
      ),
      filtered: !!filteredInfo._id,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'nameCustomer',
      key: 'nameCustomer',
      render: (text: any) => {
        return <div>{text}</div>;
      },
      filters: listDataCustomer,
      filteredValue: filteredInfo?.nameCustomer || null,
      filterSearch: true,
    },
    {
      title: 'Ngày giờ bán hàng',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: any) => {
        return <div>{dayjs(text).format('DD/MM/YYYY HH:mm:ss')}</div>;
      },
    },
    {
      title: 'Nhân viên bán hàng',
      dataIndex: 'nameBooker',
      key: 'nameBooker',
      filters: listDataUser,
      filteredValue: filteredInfo?.nameBooker || null,
      filterSearch: true,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (_text: any, record: any) => {
        return <div>{record?.paymentId?.totalAmount?.toLocaleString('en-US') || 0} đ</div>;
      },
      // sorter: (a: any, b: any) => {
      //   return a.totalAmount - b.totalAmount;
      // },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        {
          text: 'Đã xác nhận',
          value: 'Đã xác nhận',
        },
        {
          text: 'Hủy',
          value: 'Hủy',
        },
        {
          text: 'Đặt trước',
          value: 'Đặt trước',
        },
      ],
      filteredValue: filteredInfo?.status || null,
      filterSearch: true,
    },
    {
      title: 'Trạng thái thanh toán',
      key: 'operation',
      render: (_text: any, record: any) => {
        return <div>{record?.paymentId?.status || 'Chưa thanh toán'} </div>;
      },
    },
  ];

  const expandedRowRender = (record: any) => {
    return (
      <>
        {Object.keys(record?.paymentId).length >= 0 ? (
          <Tabs
            activeKey={activeKey}
            items={[
              {
                key: '1',
                label: 'Thông tin',
                children: (
                  <InfoOrder
                    activeKeyTable={activeKeyTable}
                    record={record}
                    expandDataSource={expandDataSource?.find((item: any) => item.order._id === record._id)}
                    setListOrder={setListOrder}
                  />
                ),
              },
              // {
              //   key: '2',
              //   label: 'Lịch sử thanh toán',
              //   children: <HistoryOrder />,
              // },
            ]}
            onChange={onChange}
          />
        ) : (
          <div>Chưa có dữ liệu</div>
        )}
      </>
    );
  };
  const fetchData = async (record: any) => {
    try {
      const response = await getOrdersById({
        id: record._id,
      });
      setExpandDataSource((prev: any) => [...prev, response.data]);
      setCheckCallApi((prev: any) => [...prev, record._id]);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handlerOnExpand = (expanded: boolean, record: any) => {
    if (expanded) {
      if (checkCallApi.some((item: any) => item === record._id)) {
        console.log('call api');
      } else {
        fetchData(record);
      }

      setActiveKeyTable((prev) => [...prev, record?._id]);
    } else {
      setActiveKeyTable((prev) => prev.filter((item) => item !== record?._id));
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    dispatch(setSelectedRowKeys(newSelectedRowKeys));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <>
      <Table
        rowKey="_id"
        rowSelection={rowSelection}
        loading={loading}
        columns={columns}
        onChange={handleChangeTable}
        expandable={{
          expandedRowRender: (record) =>
            Object.keys(record.paymentId || {}).length > 0 && expandedRowRender(record),
          expandedRowKeys: activeKeyTable,
          onExpand: handlerOnExpand,
          rowExpandable: (record) => Object.keys(record.paymentId || {}).length > 0,
        }}
        dataSource={listOrder}
        pagination={{
          current: page.pageIndex,
          pageSize: page.pageSize,
          total: total,
          onChange: (pageIndex, pageSize) => {
            setPage({ pageIndex, pageSize });
          },
        }}
      />
    </>
  );
};

export default TableCustom;
