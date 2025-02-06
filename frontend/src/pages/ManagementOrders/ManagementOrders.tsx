//đặt món
import { useAppDispatch, useAppSelector } from '@/stores/configureStore';
import { setBreadcrumb } from '@/stores/slices/commonSlice';
import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import DeskRoom from './Components/DeskRoom/DeskRoom';
import MenuOrder from './Components/MenuOrder/MenuOrder';
import TemplatePrintKitchen from './Components/MenuOrder/components/Modal/TemplatePrintKitchen';
import { setClickPrint } from '@/stores/slices/clickPrintSlice';
import TemplatePrintPayment from './Components/MenuOrder/components/Modal/TemplatePrintPayment';

const ManagementOrders = () => {
  const dispatch = useAppDispatch();
  const [activeKey, setActiveKey] = useState('1');
  const orderBill = useAppSelector((state) => state.orderMenus);
  const [listSelected, setListSelected] = useState<boolean[]>([]);
  const { onClickPrintKitchen, onClickPrintBill } = useAppSelector((state) => state.clickPrint);
  useEffect(() => {
    setListSelected(Array(orderBill?.order?.orderdetails?.length)?.fill(false) || []);
  }, [orderBill]);
  const items = [
    {
      key: '1',
      label: 'Phòng bàn',
      children: <DeskRoom setActiveKey={setActiveKey} />,
    },
    {
      key: '2',
      label: 'Thực đơn',
      children: (
        <MenuOrder
          setListSelected={setListSelected}
          listSelected={listSelected}
          setActiveKey={setActiveKey}
        />
      ),
      disabled: !orderBill?.order?._id,
    },
  ];
  const onChange = (key: string) => {
    setActiveKey(key);
  };

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: 'Home',
          path: '/',
        },
        {
          name: 'Quản lý bán hàng',
        },
      ]),
    );
  }, [dispatch]);
  useEffect(() => {
    if (onClickPrintKitchen || onClickPrintBill) {
      setTimeout(() => {
        window.print();
        dispatch(setClickPrint({ type: 'kitchen', value: false }));
      }, 1000);
    }
  }, [onClickPrintBill, onClickPrintKitchen]);
  return (
    <>
      <Tabs className="print:hidden block" activeKey={activeKey} items={items} onChange={onChange} />
      {onClickPrintKitchen && (
        <div className="print:block hidden">
          <TemplatePrintKitchen orderBill={orderBill} listSelected={listSelected} />
        </div>
      )}
      {onClickPrintBill && (
        <div className="print:block hidden">
          <TemplatePrintPayment />
        </div>
      )}
    </>
  );
};

export default ManagementOrders;
