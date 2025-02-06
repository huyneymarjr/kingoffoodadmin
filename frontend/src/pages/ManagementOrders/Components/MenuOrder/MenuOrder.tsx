import React, { useState } from 'react';
import Categories from './components/Categories';
import MenusDetailOrder from './components/MenusDetailOrder';
import Payments from './components/Payments';
import { Button, Drawer } from 'antd';
import { MenuUnfoldOutlined } from '@ant-design/icons';

const MenuOrder = ({
  listSelected,
  setListSelected,
  setActiveKey,
}: {
  listSelected: boolean[];
  setListSelected: React.Dispatch<React.SetStateAction<boolean[]>>;
  setActiveKey: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="grid justify-between grid-cols-10 md:gap-5 gap-2 ">
      <div className="col-span-2 md:col-span-1">
        <Categories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>
      <div className="col-span-7 xl:col-span-6">
        <MenusDetailOrder selectedCategory={selectedCategory} />
      </div>
      <div className="xl:block hidden col-span-3">
        <Payments listSelected={listSelected} setListSelected={setListSelected} setActiveKey={setActiveKey} />
      </div>
      <Button
        className="xl:hidden block col-span-1"
        icon={<MenuUnfoldOutlined />}
        onClick={showDrawer}
      ></Button>
      <Drawer onClose={onClose} open={open}>
        <Payments listSelected={listSelected} setListSelected={setListSelected} setActiveKey={setActiveKey} />
      </Drawer>
    </div>
  );
};

export default MenuOrder;
