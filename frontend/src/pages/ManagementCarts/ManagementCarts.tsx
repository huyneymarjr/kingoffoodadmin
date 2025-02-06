// đơn hàng
import { useAppDispatch, useAppSelector } from '@/stores/configureStore';
import { setBreadcrumb, setTitle } from '@/stores/slices/commonSlice';
import { Button, DatePicker, message, Tabs, TabsProps } from 'antd';
import React, { useEffect, useState } from 'react';
import AllOrder from './components/AllOrders';
import UnpaidOrder from './components/UnpaidOrders';
import PaindOrders from './components/PaindOrders';
import ConfirmedOrders from './components/ConfirmedOrders';
import PreOrders from './components/PreOrders';
import * as XLSX from 'xlsx';
import { getOrdersById } from '@/apis/ordersApi';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;
import customParseFormat from 'dayjs/plugin/customParseFormat';
const ManagementCarts = () => {
  const dispatch = useAppDispatch();
  const [activeKey, setActiveKey] = useState('1');
  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const { selectedRowKeys } = useAppSelector((state) => state.clickExportExcel);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tất cả đơn hàng',
      children: <AllOrder startDate={startDate} endDate={endDate} />,
    },
    {
      key: '2',
      label: 'Chưa thanh toán',
      children: <UnpaidOrder startDate={startDate} endDate={endDate} />,
    },
    {
      key: '3',
      label: 'Đã thanh toán',
      children: <PaindOrders startDate={startDate} endDate={endDate} />,
    },
    {
      key: '4',
      label: 'Đã xác nhận',
      children: <ConfirmedOrders startDate={startDate} endDate={endDate} />,
    },
    {
      key: '5',
      label: 'Đã đặt trước',
      children: <PreOrders startDate={startDate} endDate={endDate} />,
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
          name: 'Quản lý đơn hàng',
          // path: '',
        },
      ]),
    );
    dispatch(setTitle('Danh sách đơn hàng'));
  }, [dispatch]);
  const [template, setTemplate] = useState<any>([]);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const getTemplateList = async () => {
    try {
      setLoadingTemplate(true);
      const data = await Promise.all(
        selectedRowKeys.map(async (id) => {
          const response = await getOrdersById({
            id,
          });
          return response.data;
        }),
      );

      setTemplate(data.map((item) => item.order));

      setLoadingTemplate(false);
    } catch (error) {
      setLoadingTemplate(false);
    }
  };
  useEffect(() => {
    if (selectedRowKeys) {
      getTemplateList();
    }
  }, [selectedRowKeys]);

  const downloadExcel = () => {
    if (loadingTemplate) return;
    if (!template || !Array.isArray(template) || template.length === 0) {
      message.error('Vui lòng chọn dữ liệu để xuất file');
      return;
    }
    const mappedData = template.map((item: any) => ({
      'Mã hóa đơn': item._id,
      'Khách hàng': item.customerId,
      'Ngày giờ bán hàng': new Date(item.createdAt).toLocaleString(),
      'Nhân viên bán hàng': item.userId,
      'Tổng tiền': item.orderdetails.reduce(
        (acc: number, detail: any) => acc + detail.price * detail.quantity,
        0,
      ),
      'Trạng thái': item.status,
      'Trạng thái thanh toán': item.paymentId ? 'Đã thanh toán' : 'Chưa thanh toán',
    }));
    const header = [
      'Mã hóa đơn',
      'Khách hàng',
      'Ngày giờ bán hàng',
      'Nhân viên bán hàng',
      'Tổng tiền',
      'Trạng thái',
      'Trạng thái thanh toán',
    ];
    const worksheet = XLSX.utils.json_to_sheet(mappedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const sheet = workbook.Sheets['Sheet1'];

    // Thêm comment cho cột "Tham gia không"
    // sheet['C1'].c = [{ t: '1: có tham gia, 0: không tham gia', v: '' }];

    XLSX.writeFile(workbook, 'xuat-don-hang.xlsx');
  };

  return (
    <>
      <RangePicker
        picker="date"
        value={[startDate, endDate]}
        format={'DD/MM/YYYY'}
        onChange={(dates) => {
          if (dates) {
            setStartDate(dates[0]!);
            setEndDate(dates[1]!);
          } else {
            setStartDate(null);
            setEndDate(null);
          }
        }}
      />

      <Tabs
        activeKey={activeKey}
        items={items}
        onChange={onChange}
        tabBarExtraContent={<Button onClick={downloadExcel}>Xuất excel</Button>}
      />
    </>
  );
};

export default ManagementCarts;
