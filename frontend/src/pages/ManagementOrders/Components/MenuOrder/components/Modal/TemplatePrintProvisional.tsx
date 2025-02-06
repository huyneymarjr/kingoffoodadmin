// in tạm tính
import React from 'react';

const TemplatePrintProvisional = React.forwardRef<HTMLDivElement, any>((prop, ref) => {
  const { orderBill, totalMoney } = prop;
  return (
    <div ref={ref} className="print:block hidden ml-10">
      <div className="text-center text-[16px] font-bold">
        Bàn số {orderBill?.table?.tableNumber} Tầng {orderBill?.table?.areaNumber?.areaNumber}
      </div>
      <div className=" flex flex-col gap-1">
        <div className="font-bold">Thông tin khách hàng</div>
        <div className="max-w-full truncate">Tên khách hàng:{orderBill?.customer?.name}</div>
        <div>
          {orderBill?.customer?.phoneNumber ? 'Số điện thoại' : 'Địa chỉ email'}
          {orderBill?.customer?.phoneNumber
            ? orderBill?.customer?.phoneNumber
            : orderBill?.customer?.email
            ? orderBill?.customer?.email
            : ''}
        </div>
        <div>Điểm tích lũy: {orderBill?.customer?.point || 0} điểm</div>
      </div>
      <div className="">
        <div className="font-bold">Món ăn trong bàn</div>
        {orderBill?.order?.orderdetails?.map((item: any, index: number) => {
          return (
            <div className="w-full ">
              <div className="flex items-center gap-4 mt-3" key={index}>
                <div className="flex items-center gap-3">
                  <div>{index + 1}</div>
                  <div className="flex flex-col">
                    <div className="font-bold ">{item.name}</div>

                    <div>Đơn giá: {item?.price?.toLocaleString('US-UK')}</div>
                  </div>

                  {/* <div>Số lượng:{item.quantity}</div> */}
                  <div className="flex gap-1">
                    <div> Số lượng {item.quantity}</div>
                  </div>

                  <div className="">Tổng tiền{(item.price * item.quantity)?.toLocaleString('US-UK')}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <div>
          Tạm tính:
          {totalMoney?.toLocaleString('US-UK')}
        </div>
        <div>Thuế : 10%</div>
        <div className="flex justify-between ">
          <div>
            <div>Thành tiền: {(totalMoney + (totalMoney * 10) / 100)?.toLocaleString('US-UK')}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TemplatePrintProvisional;
