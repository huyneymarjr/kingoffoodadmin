import { useState, useEffect } from 'react';

import HeaderDeskRoom from './components/HeaderDeskRoom';
import { assignTable, getListTables } from '@/apis/tablesApi';
import { Button, message, Modal, Spin } from 'antd';
import { useAppDispatch, useAppSelector } from '@/stores/configureStore';
import ModalNote from './components/Modal/ModalNote';
import { EditFilled, EyeFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { resetOrderBill, setSelectOrderId } from '@/stores/slices/orderMenusSlice';
import {
  accessTableCustomer,
  cancelTableCustomer,
  setListDataTablesCustomer,
} from '@/stores/slices/managementTableCustomSlice';
import axios from 'axios';

dayjs.extend(utc);

const DeskRoom = ({ setActiveKey }: { setActiveKey: any }) => {
  const [floor, setFloor] = useState<any>(null);
  // const [listTable, setListTable] = useState<any[]>([]);
  const { user } = useAppSelector((state) => state.user);
  const { reloadTable } = useAppSelector((state) => state.orderMenus);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [typeTable, setTypeTable] = useState<string>('');
  const dispatch = useAppDispatch();
  // const orderBill = useAppSelector((state) => state.orderMenus);
  const listDataTables = useAppSelector((state) => state.managementTableCustomer);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchListTable = async () => {
    try {
      setLoading(true);
      const response = await getListTables({
        areaId: floor,
        current: 1,
        pageSize: 20,
      });
      if (response.data) {
        dispatch(setListDataTablesCustomer(response.data.result));
        //setListTable(response.data.result);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (floor) fetchListTable();
  }, [floor, reloadTable]);

  const handerSendMessageTelegram = async (type: string) => {
    try {
      await axios.post(`https://api.telegram.org/bot${import.meta.env.VITE_TELE_TOKEN}/sendMessage`, {
        chat_id: import.meta.env.VITE_CHAT_ID,
        text: `Có khách hàng ${type} bàn số ${selectedTable?.tableNumber} vào lúc ${dayjs().format(
          'DD/MM/YYYY HH:mm',
        )}`,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {/* {loading && <Spin className="flex justify-center items-center" fullscreen spinning={loading} />} */}
      <>
        <HeaderDeskRoom floor={floor} setFloor={setFloor} />
        <div className="flex gap-2 flex-wrap w-[100%] mt-3">
          {listDataTables.length > 0 ? (
            listDataTables?.map((table) => (
              <div>
                <div
                  className={` border-2 rounded-xl min-w-[180px]  flex justify-center items-center flex-col gap-1 `}
                >
                  <p>Bàn số {table.tableNumber}</p>
                  {/* <p>Số lượng bàn: {table.capacity}</p> */}
                  <p>Trạng thái: {table.status}</p>
                  <div className="flex gap-2">
                    {table?.ownerTable?._id === user._id && table.status === 'Đặt trước' && (
                      <Button
                        onClick={() => {
                          Modal.info({
                            title: 'Thông tin đặt bàn',
                            content: (
                              <div>
                                
                                <p>Tên khách hàng: {table.ownerTable?.nameCustomer || ''} </p>
                                <p>Email: {table.ownerTable?.emailCustomer || ''} </p>
                                <p>Số điện thoại: {table.ownerTable?.phoneNumberCustomer || ''} </p>
                                <p>Trạng thái hóa đơn:{table.ownerTable?.statusOrder || ''}</p>
                                <p>
                                  Thời gian:{' '}
                                  {dayjs(table?.ownerTable?.time).utc().format('DD/MM/YYYY HH:mm') || ''}
                                </p>
                              </div>
                            ),
                          });
                        }}
                        icon={<EyeFilled />}
                      />
                    )}
                    {(table.status === 'Đặt trước' || table.status === 'Đã có khách') && (
                      <Button
                        onClick={() => {
                          setActiveKey('2');
                          dispatch(setSelectOrderId(table.ownerTable?.orderId));
                        }}
                        icon={<EditFilled />}
                      ></Button>
                    )}
                  </div>
                </div>

                {table.status === 'Đã có khách' ? null : table?.ownerTable?._id === user._id &&
                  table.status === 'Đặt trước' ? (
                  <div className="mt-2 flex gap-2">
                    <Button
                      className=""
                      onClick={() =>
                        Modal.confirm({
                          title: `Hủy đặt bàn ${table.tableNumber}`,
                          content: 'Bạn có chắc chắn muốn hủy đặt bàn này không?',
                          onOk: async () => {
                            await assignTable({
                              tableId: table?._id,
                              bookerId: user?._id,
                              type: 'Hủy bàn',
                            });
                            dispatch(cancelTableCustomer({ tableId: table?._id }));
                            dispatch(resetOrderBill());
                            await handerSendMessageTelegram('hủy');
                            message.success('Hủy bàn thành công');
                          },
                        })
                      }
                    >
                      Hủy đặt bàn
                    </Button>
                    <Button
                      className=""
                      onClick={() =>
                        Modal.confirm({
                          title: `Chuyển trạng thái bàn ${table.tableNumber}`,
                          content: 'Bạn có chắc chắn muốn bàn này đã có khách không?',
                          onOk: async () => {
                            await assignTable({
                              tableId: table?._id,
                              bookerId: user?._id,
                              type: 'Đã có khách',
                            });
                            dispatch(accessTableCustomer({ tableId: table?._id }));
                            // dispatch(setOrderBill({}));
                            await handerSendMessageTelegram('đến');
                            message.success('Chuyển trạng thái bàn thành công');
                          },
                        })
                      }
                    >
                      Đã có khách
                    </Button>
                  </div>
                ) : (
                  <div className=" flex gap-2 flex-wrap">
                    <Button
                      className="mt-2"
                      onClick={async () => {
                        setIsModalOpen(true);
                        setSelectedTable(table);
                        setTypeTable('Đặt trước');
                      }}
                    >
                      Đặt bàn trước
                    </Button>
                    <Button
                      className="mt-2"
                      onClick={async () => {
                        setIsModalOpen(true);
                        setSelectedTable(table);
                        setTypeTable('Đã có khách');
                      }}
                    >
                      Đã có khách
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div>Chưa có bàn nào được thiết lập</div>
          )}
        </div>
      </>
      {/* )} */}

      {isModalOpen && (
        <ModalNote
          isModalOpen={isModalOpen}
          // setListTable={setListTable}
          setIsModalOpen={setIsModalOpen}
          tableId={selectedTable?._id || ''}
          userId={user._id}
          tableName={selectedTable?.tableNumber || ''}
          setActiveKey={setActiveKey}
          floor={floor}
          handerSendMessageTelegram={handerSendMessageTelegram}
          typeTable={typeTable}
          setTypeTable={setTypeTable}
        />
      )}
    </>
  );
};

export default DeskRoom;
