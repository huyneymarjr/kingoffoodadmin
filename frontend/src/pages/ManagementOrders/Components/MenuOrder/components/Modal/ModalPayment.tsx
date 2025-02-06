import { getListCustomer, updateCustomer } from '@/apis/customerApi';
import { checkValidatePromotions } from '@/apis/promotionsApi';

import ModalAddCustomer from '@/pages/ManagementCustomers/Modal/ModalAddCustomer';
import { CloseOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Input, InputNumber, message, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { addPayments } from '@/apis/paymentsApi';
import { updateOrders } from '@/apis/ordersApi';
import { useAppDispatch } from '@/stores/configureStore';
import { resetOrderBill } from '@/stores/slices/orderMenusSlice';
import { updateTables } from '@/apis/tablesApi';

import { setClickPrint, setInfoBill } from '@/stores/slices/clickPrintSlice';
import { updateDataTablesCustomer } from '@/stores/slices/managementTableCustomSlice';
const ModalPayment = ({
  isOpenModalPayment,
  setIsOpenModalPayment,
  orderBill,
  setActiveKey,
}: {
  isOpenModalPayment: boolean;
  setIsOpenModalPayment: React.Dispatch<React.SetStateAction<boolean>>;
  orderBill: any;
  setActiveKey: any;
}) => {
  const totalMoney = orderBill?.order?.orderdetails?.reduce((acc: any, item: any) => {
    return item.price * item.quantity + acc;
  }, 0);

  const [pageCustomer, setPageCustomer] = useState({ pageIndex: 1, pageSize: 10 });
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [listCustomer, setListCustomer] = useState<any>([]);
  // const [loading, setLoading] = useState(false);
  const [isOpenModalAddCustomer, setIsOpenModalAddCustomer] = useState<boolean>(false);
  const [customerSelected, setCustomerSelected] = useState<any>(orderBill?.customer || null);
  const [codePromotion, setCodePromotion] = useState<string>('');
  const [promotionValid, setPromotionValid] = useState<any>({});
  const [point, setPoint] = useState<number>(0);
  const [tax, setTax] = useState<number>(10);
  const [note, setNote] = useState<string>('');
  const [checkExportInvoice, setCheckExportInvoice] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  type PaymentMethod = 'Tiền mặt' | 'Chuyển khoản' | 'Thẻ ghi nợ';

  const [selectedMethod, setSelectedMethod] = useState<string[]>(['Tiền mặt']);
  const [paymentMethod, setPaymentMethod] = useState<Record<PaymentMethod, number>>({
    'Tiền mặt': 0,
    'Chuyển khoản': 0,
    'Thẻ ghi nợ': 0,
  });
  const fetchListCustomer = async () => {
    try {
      const response = await getListCustomer({
        current: pageCustomer.pageIndex,
        pageSize: pageCustomer.pageSize,
        type: 'Khách hàng',
      });
      console.log('response', response);
      setListCustomer(() => {
        return [...listCustomer, ...response.data.result].reduce((acc: any, item: any) => {
          if (!acc.find((i: any) => i._id === item._id)) {
            acc.push(item);
          }
          return acc;
        }, []);
      });
      setTotalCustomer(response.data.meta.total);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (pageCustomer) fetchListCustomer();
  }, [pageCustomer]);
  const onCancel = () => {
    setIsOpenModalPayment(false);
    setPageCustomer({ pageIndex: 1, pageSize: 10 });
    setTotalCustomer(0);
    setListCustomer([]);
  };

  const handlePopupScroll = (e: any) => {
    const { target } = e;
    if (pageCustomer.pageIndex * pageCustomer.pageSize >= totalCustomer) {
      console.log('No more customers to load');
      return;
    }
    const threshold = 5;
    if (target.scrollTop + target.offsetHeight >= target.scrollHeight - threshold) {
      console.log('Fetch more customers', pageCustomer);
      setPageCustomer((prevPage) => {
        return { ...prevPage, pageIndex: prevPage.pageIndex + 1 };
      });
    }
  };
  console.log('orderBill', orderBill);
  const handleCheckCodePromotion = async () => {
    try {
      const response = await checkValidatePromotions({
        name: codePromotion,
      });
      if (!response.data) {
        message.error('Mã giảm giá không tồn tại');
      } else if (response.data.status === 'Không hoạt động') {
        message.error('Mã giảm giá không còn hoạt động');
      } else if (dayjs(response.data.endDate).isBefore(dayjs())) {
        message.error('Mã giảm giá đã hết hạn');
      } else {
        message.success('Mã giảm giá hợp lệ');
        setPromotionValid(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // khách cần trả
  const sumTotalMoney =
    totalMoney -
    (totalMoney * Number(promotionValid?.discount || 0)) / 100 -
    point * 100 +
    (totalMoney * tax) / 100;
  // khách đã trả
  const customerHasPaid =
    Number(paymentMethod['Tiền mặt']) +
    Number(paymentMethod['Chuyển khoản']) +
    Number(paymentMethod['Thẻ ghi nợ']);

  const handlerPayment = async () => {
    console.log('orderBill', orderBill);
    console.log('customerSelected', customerSelected);
    const customerCopy = { ...customerSelected };

    if (customerCopy.email === '') {
      delete customerCopy.email;
    }
    if (customerCopy.phoneNumber === '') {
      delete customerCopy.phoneNumber;
    }
    if (customerCopy.address === '') {
      delete customerCopy.address;
    }

    // Use customerCopy for further processing
    console.log('customerCopy', customerCopy);
    const createPayment = await addPayments({
      method: selectedMethod,
      paymentMethod: paymentMethod,
      totalAmount: sumTotalMoney,
      status: 'Đã thanh toán',
      paymentTime: dayjs().format('YYYY-MM-DD'),
    });
    await updateOrders(
      {
        id: orderBill.order._id,
      },
      {
        status: 'Đã xác nhận',
        paymentId: createPayment.data._id,
        userId: orderBill?.user?.userId,
        customerId: customerSelected?._id,
        promotionId: promotionValid?._id,
        note: note,
        point: point,
        sumTotalMoney: sumTotalMoney,
        customerHasPaid: customerHasPaid,
      },
    );
    await updateCustomer(
      {
        id: customerSelected?._id,
      },
      {
        ...customerCopy,
        point: customerSelected?.point - point + Math.floor(sumTotalMoney / 100),
      },
    );
    await updateTables(
      {
        id: orderBill?.table?._id,
      },
      {
        status: 'Trống',
        ownerTable: null,
      },
    );

    if (checkExportInvoice) {
      dispatch(
        setInfoBill({
          orderBill: orderBill,
          payment: createPayment.data,
          promotionValid: promotionValid,
          note: note,
          point: point,
          customer: customerSelected,
        }),
      );
      dispatch(
        updateDataTablesCustomer({
          _id: orderBill?.table?._id,
          ownerTable: null,
          status: 'Trống',
          areaId: orderBill?.table?.areaId,
          tableNumber: orderBill?.table?.tableNumber,
          capacity: orderBill?.table?.capacity,
        }),
      );
      onCancel();
      dispatch(resetOrderBill());
      dispatch(setClickPrint({ type: 'bill', value: true }));
      setActiveKey('1');
    } else {
      message.success('Thanh toán thành công');
      dispatch(
        updateDataTablesCustomer({
          _id: orderBill?.table?._id,
          ownerTable: null,
          status: 'Trống',
          areaId: orderBill?.table?.areaId,
          tableNumber: orderBill?.table?.tableNumber,
          capacity: orderBill?.table?.capacity,
        }),
      );
      onCancel();
      dispatch(resetOrderBill());
      setActiveKey('1');
    }
  };
  return (
    <>
      <Modal
        title={`Hóa đơn bàn số ${orderBill?.table?.tableNumber} Tầng ${orderBill?.table?.areaNumber?.areaNumber}`}
        open={isOpenModalPayment}
        footer={null}
        width={800}
        className="print:hidden block modalPayment"
        onCancel={onCancel}
      >
        <div className="grid grid-cols-2 px-3 ">
          <div className="flex flex-col gap-5 border-r-2 pr-3">
            <div className="flex justify-between">
              <b>Tạm tính</b> <b>{totalMoney?.toLocaleString('US-UK')}</b>
            </div>
            <div className="flex gap-5">
              <Select
                className="w-full"
                placeholder={'Vui lòng chọn khách hàng'}
                options={listCustomer.map((item: any) => ({
                  label: item.name,
                  value: item._id,
                }))}
                // loading={loading}
                onPopupScroll={handlePopupScroll}
                // popupClassName="scrollbar"
                dropdownRender={(menu) => (
                  <div style={{ maxHeight: 200, overflowY: 'auto' }} onScroll={handlePopupScroll}>
                    {menu}
                  </div>
                )}
                value={customerSelected?._id}
                onChange={(value) => {
                  setCustomerSelected(listCustomer.find((item: any) => item._id === value));
                }}
              />
              <Button icon={<UserAddOutlined />} onClick={() => setIsOpenModalAddCustomer(true)}></Button>
              {isOpenModalAddCustomer && (
                <ModalAddCustomer
                  isOpenModal={isOpenModalAddCustomer}
                  setIsOpenModal={setIsOpenModalAddCustomer}
                  fetchData={fetchListCustomer}
                />
              )}
            </div>

            <div className="flex flex-col gap-3 relative">
              <div className="flex">
                <div className="w-full font-bold"> Giảm giá </div>
                <Input disabled value={promotionValid?.discount || 0} addonAfter="%" className="w-[50%]" />
              </div>

              <div className="flex gap-4">
                <Input
                  placeholder="Nhập mã giảm giá"
                  value={codePromotion}
                  onChange={(e) => setCodePromotion(() => e.target.value)}
                />
                <Button onClick={handleCheckCodePromotion} disabled={!codePromotion}>
                  Kiểm tra mã
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-full font-bold">Giảm giá tích điểm</div>

                <Input
                  disabled
                  value={(point * 100)?.toLocaleString()}
                  addonAfter="vnđ"
                  className="w-[50%]"
                ></Input>
              </div>
              <InputNumber
                className="w-full"
                placeholder="Điểm khách hàng hiện có 1 điểm = 100vnđ"
                value={point === 0 ? undefined : point}
                min={0}
                step={1}
                // max={orderBill?.customer?.point}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => (value ? parseInt(value.replace(/,/g, ''), 10) : 0)}
                onChange={(value) => {
                  if (value === undefined || value === null) {
                    return;
                  }
                  const isInteger = /^[0-9]+$/;
                  if (!isInteger.test(String(value))) {
                    return;
                  }
                  if (orderBill?.customer?.point < (value as number)) {
                    message.error(
                      `Không đủ điểm để giảm giá, bạn đang có ${orderBill?.customer?.point} điểm`,
                    );
                    return;
                  }
                  setPoint(value);
                }}
              />
            </div>
            <div className="flex justify-between">
              <div className="w-full">Thuế hóa đơn</div>
              <InputNumber
                // className="w-[20%]"
                value={tax}
                placeholder="Nhập thuế"
                onChange={(value) => {
                  const isInteger = /^[0-9]+$/;
                  if (!isInteger.test(String(value))) {
                    return;
                  }
                  setTax(value || 0);
                }}
                // addonAfter="vnđ"
                disabled
                controls={false}
                suffix="%"
              ></InputNumber>
            </div>
            <div className="mb-[50px]">
              <Input.TextArea
                placeholder="Ghi chú"
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />
            </div>
            <div className="absolute bottom-0 bg-blue-600 w-[50%] p-2 left-0 flex justify-between text-white font-bold">
              <p>Tổng tiền</p> <p>{sumTotalMoney?.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex flex-col pl-3 relative">
            <div>
              <div className="font-bold flex justify-between">
                <div>Khách cần trả</div>
                <div>{sumTotalMoney?.toLocaleString()}</div>{' '}
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-3">
              <b>Hình thức thanh toán</b>
              <div className="flex gap-4">
                {['Tiền mặt', 'Chuyển khoản', 'Thẻ ghi nợ'].map((item) => {
                  return (
                    <div
                      className={`border rounded-sm w-[120px] h-[50px] flex items-center justify-center  ${
                        selectedMethod.includes(item) ? 'bg-blue-500 text-white' : 'bg-gray-200'
                      }`}
                      onClick={() => {
                        setSelectedMethod((prev) => {
                          if (prev.includes(item)) {
                            return prev.filter((i) => i !== item);
                          }
                          return prev.concat(item);
                        });
                      }}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col gap-3">
                {selectedMethod.map((item) => {
                  return (
                    <div className="flex items-center" key={item}>
                      <Button
                        className="border-none shadow-none text-red-600"
                        icon={<CloseOutlined />}
                        onClick={() => {
                          setPaymentMethod((prev) => {
                            return {
                              ...prev,
                              [item]: 0,
                            };
                          });
                          setSelectedMethod((prev) => {
                            return prev.filter((i) => i !== item);
                          });
                        }}
                      />
                      <div className="w-full ml-3">{item}</div>{' '}
                      <InputNumber
                        className="w-full"
                        addonAfter="vnđ"
                        controls={false}
                        min={0}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        // parser={(value) => (value ? parseInt(value.replace(/,/g, ''), 10) : 0)}
                        value={paymentMethod[item as PaymentMethod]}
                        onChange={(value) => {
                          setPaymentMethod((prev) => {
                            return {
                              ...prev,
                              [item]: value,
                            };
                          });
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <Divider />
            </div>
            <div className="flex justify-between mb-3">
              <b>Khách đã trả </b>
              <b>{customerHasPaid?.toLocaleString()}</b>
            </div>
            <Checkbox checked={checkExportInvoice} onChange={(e) => setCheckExportInvoice(e.target.checked)}>
              Xuất HDĐT khi thanh toán
            </Checkbox>
            <div className="flex absolute bottom-2 w-full left-[40%]">
              <Button
                htmlType="submit"
                disabled={customerHasPaid < sumTotalMoney}
                onClick={handlerPayment}
                type="primary"
                className="border-none bg-[#2563eb]  font-bold "
              >
                Thanh toán
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalPayment;
