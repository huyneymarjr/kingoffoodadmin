import { useAppSelector } from '@/stores/configureStore';

const TemplatePrintPayment = () => {
  const { infoBill } = useAppSelector((state) => state.clickPrint);
  console.log('infoBill 111', infoBill);
  return (
    <div className="print:block hidden">
      <div>Thông tin khách hàng : {infoBill?.customer?.name}</div>
      <div>Địa chỉ : {infoBill?.customer?.address || 'Đại học sư phạm Hà Nội'}</div>
      <div>Số điện thoại : {infoBill?.customer?.phoneNumber || ''}</div>
      <div>Email : {infoBill?.customer?.email || ''}</div>
      <div>Ngày in : {new Date().toLocaleDateString()}</div>
      <div>Ngày thanh toán : {infoBill?.orderBill?.order?.updateAt}</div>
      <div>Tổng tiền hóa đơn : {infoBill?.sumTotalMoney}</div>
      <div>Tổng tiền khách trả : {infoBill?.customerHasPaid}</div>
      <div>
        Mã giảm giá - Giảm giá : {infoBill?.promotionValid?.name} - {infoBill?.promotionValid?.discount}
      </div>

      <div>
        <div>Món ăn</div>
        {infoBill?.orderBill?.order?.orderdetails?.map((item: any, index: number) => {
          return (
            <div className="flex justify-between" key={index}>
              <div>Tên:{item.name}</div>
              <div>Số lượng:{item.quantity}</div>
              <div>Đơn giá:{item.price}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TemplatePrintPayment;
