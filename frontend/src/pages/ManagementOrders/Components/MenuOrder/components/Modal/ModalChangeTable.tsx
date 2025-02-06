import { Button, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import HeaderDeskRoom from '../../../DeskRoom/components/HeaderDeskRoom';
import { changeTable, getListTables } from '@/apis/tablesApi';
import { useAppDispatch, useAppSelector } from '@/stores/configureStore';
import { setReloadTable } from '@/stores/slices/orderMenusSlice';

const ModalChangeTable = ({
  isOpenModalChangeTable,
  setIsOpenModalChangeTable,
  fetchDataBill,
}: {
  isOpenModalChangeTable: boolean;
  setIsOpenModalChangeTable: React.Dispatch<React.SetStateAction<boolean>>;
  fetchDataBill: any;
}) => {
  const [floor, setFloor] = useState<string>('');
  const [listTable, setListTable] = useState<any[]>([]);
  const orderBill = useAppSelector((state) => state.orderMenus);
  const { reloadTable } = useAppSelector((state) => state.orderMenus);
  const dispatch = useAppDispatch();
  const fetchTable = async () => {
    try {
      const response = await getListTables({
        areaId: floor,
        current: 1,
        pageSize: 50,
      });
      if (response.data) {
        setListTable(response.data.result);
        console.log('listTable', response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (floor) fetchTable();
  }, [floor]);
  const onOk = () => {
    setIsOpenModalChangeTable(false);
  };
  const onCancel = async () => {
    setIsOpenModalChangeTable(false);
  };

  return (
    <Modal
      title="Chuyển bàn"
      open={isOpenModalChangeTable}
      onOk={onOk}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="back" type="primary" onClick={onCancel}>
          Hủy
        </Button>,
      ]}
    >
      <HeaderDeskRoom floor={floor} setFloor={setFloor} />
      <div className="flex gap-2 w-full">
        <div className="flex gap-2 flex-wrap w-[100%] mt-3 ">
          {listTable.length > 0 &&
            listTable?.map((table) => (
              <div>
                <div
                  className={`${
                    table._id === orderBill.table._id ? 'bg-yellow-400' : ''
                  } border-2 rounded-xl w-[180px]  flex justify-center items-center flex-col gap-1 hover:cursor-pointer`}
                  onClick={async () => {
                    if (table.status === 'Đặt trước' || table.status === 'Đã có khách') {
                      message.error('Bàn đã có khách hoặc đã đặt trước');
                      return;
                    } else {
                      await changeTable({
                        orderId: orderBill.order._id,
                        newTableId: table._id,
                        tableId: orderBill.table._id,
                      });
                      await fetchDataBill();
                      dispatch(setReloadTable(!reloadTable));
                      setIsOpenModalChangeTable(false);
                      message.success('Chuyển bàn thành công');
                    }
                  }}
                >
                  <p>Bàn số {table.tableNumber}</p>
                  <p>Số lượng bàn: {table.capacity}</p>
                  <p> {table.status}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};

export default ModalChangeTable;
