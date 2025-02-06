import { QRCode, Table } from 'antd';
import * as React from 'react';
import bgr_remove_logo_black from '/assets/images/bgr_remove_logo_black.png';
interface ComponentToPrintProps {
  expandDataSource: any;
}

export const ComponentToPrint = React.forwardRef<HTMLDivElement, ComponentToPrintProps>((props, ref) => {
  const { expandDataSource } = props;
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
  const totalMoney = expandDataSource?.order?.orderdetails?.reduce((acc: any, item: any) => {
    return acc + item.price * item.quantity;
  }, 0);
  const discountTotal =
    expandDataSource?.order?.point * 100 + (totalMoney * expandDataSource?.order?.promotion.discount) / 100;
  const customPaind =
    expandDataSource?.payment?.paymentMethod['Chuyển khoản'] +
      expandDataSource?.payment?.paymentMethod['Thẻ ghi nợ'] +
      expandDataSource?.payment?.paymentMethod['Tiền mặt'] || 0;
  return (
    <div className="w-full h-full print:block hidden" ref={ref}>
      <div>Xin chào quý khách chào mừng quý khách đến với King Of Food</div>
      <Table
        columns={expandColumns}
        dataSource={expandDataSource?.order?.orderdetails || []}
        pagination={false}
      />
      <div>Tổng số lượng {expandDataSource?.order?.orderdetails?.length || 0}</div>
      <div>Tổng tiền hàng {totalMoney?.toLocaleString('US-UK') || 0}</div>
      <div>Giảm giá {discountTotal || 0}</div>
      <div>VAT: 10%</div>
      <div>Khách cần trả {expandDataSource?.payment?.totalAmount?.toLocaleString('US-UK') || 0}</div>
      <div>Khách đã trả {customPaind?.toLocaleString('US-UK') || 0}</div>
      <QRCode
        className=" block print:!w-[100%] print:!h-[100%]"
        errorLevel="H"
        value="https://firebasestorage.googleapis.com/v0/b/locketproject.appspot.com/o/9f9700b8-143f-40e1-8364-1b94012a2749?alt=media&token=99aa4442-d3b3-4ba5-8bb4-f8280b25924e"
        icon={bgr_remove_logo_black}
      />
    </div>
  );
});
