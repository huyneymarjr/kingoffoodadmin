import { getCategoriesById } from '@/apis/categoriesApi';
import { getListMenus } from '@/apis/menusApi';
import { addOrderdetails, updateOrderdetails } from '@/apis/orderdetailsApi';
import { useAppDispatch, useAppSelector } from '@/stores/configureStore';
import { setOrderBill, setOrderdetailsBill } from '@/stores/slices/orderMenusSlice';
import { linkImage } from '@/utils/helpers/getLinkImage';
import { Card, message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

const MenusDetailOrder = ({ selectedCategory }: any) => {
  const [listMenusDetail, setListMenusDetail] = useState<MenusType[]>([]);
  const [selectedMenusDetail, setSelectedMenusDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState({ pageIndex: 1, pageSize: 100 });
  const [total, setTotal] = useState<number>(0);
  const dispatch = useAppDispatch();
  const orderBill = useAppSelector((state) => state.orderMenus);
  const [nameCategory, setNameCategory] = useState<string>('');
  useEffect(() => {
    const fetchMenusDetail = async () => {
      try {
        const response = await getCategoriesById({
          id: selectedCategory,
        });
        console.log(response.data);
        setNameCategory(response.data.name);
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedCategory && selectedCategory !== 'all') fetchMenusDetail();
  }, [selectedCategory]);
  const fetchMenusDetail = async () => {
    try {
      setLoading(true);
      const response = await getListMenus({
        current: page.pageIndex,
        pageSize: page.pageSize,
        filter:
          selectedCategory != 'all' ? `categoryId=${selectedCategory}&status=Hoạt động` : `status=Hoạt động`,
      });
      if (response.data) {
        setListMenusDetail(response.data.result);
        setTotal(response.data.meta.total);
        setSelectedMenusDetail(response.data.result[0]?._id);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (page) fetchMenusDetail();
  }, [page, selectedCategory]);
  useEffect(() => {
    console.log('orderBill', orderBill);
  }, [orderBill]);
  return (
    <Spin spinning={loading}>
      <div className="mb-3">
        {selectedCategory && selectedCategory !== 'all' ? (
          <p>
            <b>Thể loại</b>: {nameCategory}
          </p>
        ) : (
          ''
        )}
      </div>
      <div className="w-full flex gap-4 flex-wrap print:hidden ">
        {listMenusDetail.length > 0
          ? listMenusDetail.map((item, index) => {
              return (
                <Card
                  key={index}
                  className="w-[200px]"
                  hoverable
                  cover={
                    <img
                      className="w-[200px] h-[200px] object-cover"
                      src={linkImage(item.image, 'menus')}
                      alt={`Ảnh sản phẩm ${item.name}`}
                    />
                  }
                  onClick={async () => {
                    if (orderBill.selectOrderId === '') {
                      message.error('Vui lòng chọn bàn trước khi chọn món ăn');
                      return;
                    }
                    console.log('orderBill.order?.orderdetails?', orderBill.order?.orderdetails);
                    // nếu trong orderdetails đã có món ăn đó thì gọi api update quantity
                    const check = orderBill.order?.orderdetails?.find(
                      (items: any) => items.menuId === item._id,
                    );
                    if (check) {
                      await updateOrderdetails(
                        {
                          id: check.orderDetailId || check._id,
                        },
                        {
                          quantity: check.quantity + 1,
                          orderId: orderBill.order._id || orderBill.selectOrderId,
                          menuId: item._id,
                          price: item.price,
                        },
                      ); // gọi api update quantity
                      dispatch(
                        setOrderdetailsBill({
                          _id: check.orderDetailId,
                          menuId: item._id,
                          name: item.name,
                          price: item.price,
                          quantity: 1,
                        }),
                      );
                      message.success('Thêm món ăn thành công');
                    } else {
                      const newOrderDetail = await addOrderdetails({
                        orderId: orderBill.order._id || orderBill.selectOrderId,
                        menuId: item._id,
                        quantity: 1,
                        price: item.price,
                      });
                      dispatch(
                        setOrderdetailsBill({
                          _id: newOrderDetail.data._id,
                          menuId: item._id,
                          name: item.name,
                          price: item.price,
                          quantity: 1,
                        }),
                      );
                      message.success('Thêm món ăn thành công');
                    }
                  }}
                >
                  <Card.Meta
                    className="text-center"
                    title={item.name}
                    description={item.price?.toLocaleString()}
                  ></Card.Meta>
                </Card>
              );
            })
          : 'Không có mặt hàng nào'}
      </div>
    </Spin>
  );
};

export default MenusDetailOrder;
