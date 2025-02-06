import { Button, message, Modal, Table } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ComponentToPrint } from './ComponentToPrint';
import { updateOrders } from '@/apis/ordersApi';

const expandColumns = [
  { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
  { title: 'Đơn vị tính', dataIndex: 'unit', key: 'unit' },
  { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
  { title: 'Giá bán sản phẩm', dataIndex: 'price', key: 'price' },
  {
    title: 'Thành tiền',
    dataIndex: 'priceLive',
    key: 'priceLive',
    render: (_value: any, record: any) => {
      return <span>{record?.price * record?.quantity}</span>;
    },
  },
];
const InfoOrder = ({ expandDataSource, setListOrder }: any) => {
  const totalMoney = expandDataSource?.order?.orderdetails?.reduce((acc: any, item: any) => {
    return acc + item.price * item.quantity;
  }, 0);
  const discountTotal =
    expandDataSource?.order?.point * 100 + (totalMoney * expandDataSource?.order?.promotion.discount) / 100;
  const customPaind =
    expandDataSource?.payment?.paymentMethod['Chuyển khoản'] +
      expandDataSource?.payment?.paymentMethod['Thẻ ghi nợ'] +
      expandDataSource?.payment?.paymentMethod['Tiền mặt'] || 0;

  const componentRef = useRef(null);

  const handleAfterPrint = useCallback(() => {
    console.log('`onAfterPrint` called');
  }, []);

  const handleBeforePrint = useCallback(() => {
    console.log('`onBeforePrint` called');
    return Promise.resolve();
  }, []);

  const printFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Hung123',
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });

  const handlCancelOrders = () => {
    Modal.confirm({
      title: 'Hủy đơn hàng',
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
      async onOk() {
        try {
          await updateOrders(
            { id: expandDataSource?.order?._id },
            {
              status: 'Hủy',
            },
          );
          await setListOrder((prev: any) => {
            return prev.map((item: any) => {
              if (item?._id == expandDataSource?.order?._id) {
                return {
                  ...item,
                  status: 'Hủy',
                };
              }
              return item;
            });
          });
          message.success('Hủy đơn hàng thành công');
        } catch (error) {
          console.log('Failed:', error);
          message.error('Hủy đơn hàng thất bại');
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  return (
    <>
      <>
        <Table
          columns={expandColumns}
          dataSource={expandDataSource?.order?.orderdetails || []}
          pagination={false}
        />
        <div className="flex flex-col items-end w-full gap-1 mt-5">
          <div>Tổng số lượng : {expandDataSource?.order?.orderdetails?.length || 0}</div>
          <div>Tổng tiền hàng : {totalMoney?.toLocaleString() || 0}</div>
          <div>Giảm giá : {discountTotal || 0}</div>
          <div>VAT: 10%</div>
          <div>Khách cần trả : {expandDataSource?.payment?.totalAmount?.toLocaleString() || 0}</div>
          <div>Khách đã trả : {customPaind?.toLocaleString() || 0}</div>
          <Button onClick={() => printFn()}>In</Button>
          <ComponentToPrint ref={componentRef} expandDataSource={expandDataSource} />
        </div>
        <Button onClick={handlCancelOrders}>Hủy đơn hàng</Button>
      </>
    </>
  );
};

export default InfoOrder;
