import { deleteOrderdetails, updateOrderdetails } from '@/apis/orderdetailsApi';
import { getOrdersById, updateOrders } from '@/apis/ordersApi';
import { useAppDispatch, useAppSelector } from '@/stores/configureStore';
import { setChangeQuantityOrderdetailsBill, setOrderBill } from '@/stores/slices/orderMenusSlice';
import {
  DeleteFilled,
  EditFilled,
  MenuUnfoldOutlined,
  MoreOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, InputNumber, message, Modal, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ModalNoteOrderDetail from './Modal/ModalNoteOrderDetail';
import ModalChangeTable from './Modal/ModalChangeTable';
import ModalKitchenPrinting from './Modal/ModalKitchenPrinting';
import ModalPayment from './Modal/ModalPayment';
// import { setClickPrint } from '@/stores/slices/clickPrintSlice';
import TemplatePrintProvisional from './Modal/TemplatePrintProvisional';
import { useReactToPrint } from 'react-to-print';

const Payments = ({ setListSelected, listSelected, setActiveKey }: any) => {
  const orderBill = useAppSelector((state) => state.orderMenus);
  // const [dataBill, setDataBill] = useState<any>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalChangeTable, setIsOpenModalChangeTable] = useState<boolean>(false);
  const [isOpenModalKitchenPrint, setIsOpenModalKitchenPrint] = useState<boolean>(false);

  const [isOpenModalPayment, setIsOpenModalPayment] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<any>(null);
  // const [visibleMenu, setVisibleMenu] = useState('');
  // const [isClickPrintProvisional, setIsClickPrintProvisional] = useState<boolean>(false);
  const refPrintProvisional = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const fetchDataBill = async () => {
    try {
      const response = await getOrdersById({ id: orderBill.selectOrderId });
      if (response.data) {
        // setDataBill(response.data);
        dispatch(
          setOrderBill({
            customer: response.data?.customer,
            order: response.data?.order,
            table: response.data?.table,
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (orderBill.selectOrderId) {
      fetchDataBill();
    }
  }, [orderBill.selectOrderId]);

  const totalMoney = orderBill?.order?.orderdetails?.reduce((acc: any, item: any) => {
    return item.price * item.quantity + acc;
  }, 0);
  const changeQuantity = ({ id, quantity }: any) => {
    try {
      updateOrderdetails({ id: id }, { quantity: quantity });
      message.success('Cập nhật số lượng thành công');
    } catch (error) {
      message.error('Cập nhật số lượng thất bại');
    }
  };
  const handlePlus = (item: any) => {
    dispatch(setChangeQuantityOrderdetailsBill({ type: 'plus', menuId: item.menuId }));
    changeQuantity({
      id: item._id || item.orderDetailId,
      quantity: item.quantity + 1,
    });
  };
  const handleMinus = (item: any) => {
    if (item.quantity === 1) {
      message.error('Số lượng không thể nhỏ hơn 1');
      return;
    }
    dispatch(setChangeQuantityOrderdetailsBill({ type: 'minus', menuId: item.menuId }));
    changeQuantity({
      id: item._id || item.orderDetailId,
      quantity: item.quantity - 1,
    });
  };
  const onChangeQuantity = (value: any, item: any) => {
    dispatch(setChangeQuantityOrderdetailsBill({ type: 'change', menuId: item.menuId, quantity: value }));
    changeQuantity({
      id: item._id || item.orderDetailId,
      quantity: value,
    });
  };

  const printFn = useReactToPrint({
    contentRef: refPrintProvisional,
    documentTitle: 'Hung123',
  });
  const handleOrder = () => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn đặt những món này không?',
      async onOk() {
        await updateOrders(
          { id: orderBill.selectOrderId || orderBill.order._id },
          {
            ...orderBill.order,
            status: 'Đã đặt',
            orderdetails: orderBill.order.orderdetails.map((item: any) => item._id),
          },
        );
        await fetchDataBill();
        message.success('Đặt món thành công');
      },
      onCancel() {},
    });
  };
  const handlePayment = () => {
    setIsOpenModalPayment(true);
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F10') {
        handleOrder();
      } else if (event.key === 'F9') {
        handlePayment();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="block print:hidden border  rounded-2xl pl-3 pr-2 pb-5">
        <div className="text-center text-[16px] font-bold mt-2">
          Bàn số {orderBill?.table?.tableNumber} Tầng {orderBill?.table?.areaNumber?.areaNumber}
        </div>
        <div className=" flex flex-col gap-1">
          <div className="font-bold">Thông tin khách hàng</div>
          <div className="max-w-full truncate">Tên khách hàng : {orderBill?.customer?.name}</div>
          <div>
            {orderBill?.customer?.phoneNumber ? 'Số điện thoại : ' : 'Địa chỉ email : '}
            {orderBill?.customer?.phoneNumber
              ? orderBill?.customer?.phoneNumber
              : orderBill?.customer?.email
              ? orderBill?.customer?.email
              : ''}
          </div>
          <div>Điểm tích lũy : {orderBill?.customer?.point || 0} điểm</div>
        </div>
        <div className="">
          <div className="font-bold">Món ăn trong bàn</div>
          {orderBill?.order?.orderdetails?.map((item: any, index: number) => {
            return (
              <div className="w-full relative">
                <div className="flex items-center gap-4 mt-3" key={index}>
                  <div className="flex w-[87%] items-center gap-3">
                    <div>{index + 1}</div>
                    <div className="flex flex-col">
                      <Tooltip title={item.name}>
                        <div className="font-bold w-[40px] truncate">{item.name}</div>
                      </Tooltip>

                      <div>{item.price}</div>
                    </div>

                    {/* <div>Số lượng:{item.quantity}</div> */}
                    <div className="flex gap-1">
                      <Button
                        className="rounded-l-lg rounded-none "
                        size="small"
                        onClick={() => handlePlus(item)}
                      >
                        +
                      </Button>
                      <InputNumber
                        min={1}
                        value={item.quantity}
                        onChange={(e) => onChangeQuantity(e, item)}
                        controls={false}
                        className="inputQuantity rounded-none"
                        size="small"
                      />

                      <Button
                        className="rounded-r-lg rounded-none"
                        size="small"
                        onClick={() => handleMinus(item)}
                      >
                        -
                      </Button>
                    </div>
                    <Tooltip title={`${(item.price * item.quantity)?.toLocaleString('US-UK')} vnđ`}>
                      <div className="truncate">{item.price * item.quantity}</div>
                    </Tooltip>
                  </div>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'delete',
                          icon: <DeleteFilled />,
                          onClick: async () => {
                            Modal.confirm({
                              title: 'Xác nhận',
                              content: `Bạn có chắc chắn muốn xóa món ăn ${item.name} không?`,
                              async onOk() {
                                await deleteOrderdetails({ id: item._id });
                                dispatch(
                                  setOrderBill({
                                    ...orderBill,
                                    order: {
                                      ...orderBill.order,
                                      orderdetails: orderBill?.order?.orderdetails?.filter(
                                        (order: any) => order._id !== item._id,
                                      ),
                                    },
                                  }),
                                );
                                message.success('Xóa món ăn thành công');
                              },
                            });
                          },
                        },
                        {
                          key: 'update',
                          icon: <EditFilled />,
                          onClick: () => {
                            setIsOpenModal(true);
                            setSelectItem(item);
                          },
                        },
                      ],
                    }}
                    trigger={['click']}
                    placement="top"
                  >
                    <Button icon={<MoreOutlined />} size="small"></Button>
                  </Dropdown>

                  {isOpenModal && (
                    <ModalNoteOrderDetail
                      isOpenModal={isOpenModal}
                      setIsOpenModal={setIsOpenModal}
                      selectItem={selectItem}
                      setSelectItem={setSelectItem}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <div>
            Tạm tính:
            <b>{totalMoney?.toLocaleString('US-UK')}</b>
          </div>
          <div>Thuế : 10%</div>
          <div className="flex justify-between mt-1">
            <div onClick={() => printFn()} className="flex flex-col items-center">
              <PrinterOutlined />
              <div className="hover:cursor-pointer hover:text-[#217ca3]">In tạm tính</div>
            </div>
            <div>
              <div>Thành tiền</div>{' '}
              <div className="text-[green] font-bold">
                {' '}
                {Number(totalMoney + (totalMoney * 10) / 100)?.toLocaleString('US-UK')}
              </div>
            </div>
          </div>

          <div className="flex gap-0 items-center justify-between mt-1 flex-wrap">
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'in',
                    label: 'In bếp',
                    onClick: () => {
                      setIsOpenModalKitchenPrint(true);
                    },
                  },
                  {
                    key: 'in tạm tính',
                    label: 'Chuyển bàn',
                    onClick: () => {
                      setIsOpenModalChangeTable(true);
                    },
                  },
                ],
              }}
              trigger={['hover']}
              placement="top"
            >
              <Button className="rounded-none" icon={<MenuUnfoldOutlined />}></Button>
            </Dropdown>

            <Button className="rounded-none" onClick={handleOrder}>
              Đặt món (F10)
            </Button>
            <Button className="rounded-none" type="primary" onClick={handlePayment}>
              Thanh toán (F9)
            </Button>
          </div>
        </div>
      </div>

      <TemplatePrintProvisional ref={refPrintProvisional} orderBill={orderBill} totalMoney={totalMoney} />
      {isOpenModalChangeTable && (
        <ModalChangeTable
          isOpenModalChangeTable={isOpenModalChangeTable}
          setIsOpenModalChangeTable={setIsOpenModalChangeTable}
          fetchDataBill={fetchDataBill}
        />
      )}

      {isOpenModalKitchenPrint && (
        <ModalKitchenPrinting
          isOpenModalKitchenPrint={isOpenModalKitchenPrint}
          setIsOpenModalKitchenPrint={setIsOpenModalKitchenPrint}
          listSelected={listSelected}
          setListSelected={setListSelected}
        />
      )}
      {isOpenModalPayment && (
        <ModalPayment
          isOpenModalPayment={isOpenModalPayment}
          setIsOpenModalPayment={setIsOpenModalPayment}
          orderBill={orderBill}
          setActiveKey={setActiveKey}
        />
      )}
    </>
  );
};

export default Payments;
