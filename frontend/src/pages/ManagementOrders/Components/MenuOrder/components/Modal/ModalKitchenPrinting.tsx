import { useAppDispatch, useAppSelector } from '@/stores/configureStore';
import { Button, Checkbox, Modal } from 'antd';
import React, { useEffect } from 'react';

import { setClickPrint } from '@/stores/slices/clickPrintSlice';

const ModalKitchenPrinting = ({
  isOpenModalKitchenPrint,
  setIsOpenModalKitchenPrint,
  listSelected,
  setListSelected,
}: {
  isOpenModalKitchenPrint: boolean;
  setIsOpenModalKitchenPrint: React.Dispatch<React.SetStateAction<boolean>>;
  listSelected: boolean[];
  setListSelected: React.Dispatch<React.SetStateAction<boolean[]>>;
}) => {
  const orderBill = useAppSelector((state) => state.orderMenus);
  const dispatch = useAppDispatch();
  const onOk = () => {
    dispatch(setClickPrint({ type: 'kitchen', value: true }));
    setIsOpenModalKitchenPrint(false);
  };
  const onCancel = () => {
    setIsOpenModalKitchenPrint(false);
  };
  useEffect(() => {
    if (isOpenModalKitchenPrint) {
      setListSelected((prev) => {
        return prev.map(() => {
          return false;
        });
      });
    }
  }, [isOpenModalKitchenPrint]);

  return (
    <>
      <Modal
        title="Chọn món in bếp"
        open={isOpenModalKitchenPrint}
        onOk={onOk}
        onCancel={onCancel}
        footer={[
          <Button
            key="submit"
            type="primary"
            disabled={listSelected.every((item) => item === false)}
            onClick={onOk}
          >
            In
          </Button>,
          <Button key="back" onClick={onCancel}>
            Hủy
          </Button>,
        ]}
      >
        {listSelected.length > 0 && listSelected.every((item) => item === true) ? (
          <Button
            onClick={() => {
              setListSelected((prev) => {
                return prev.map(() => {
                  return false;
                });
              });
            }}
          >
            Hủy chọn tất cả
          </Button>
        ) : (
          <Button
            onClick={() => {
              setListSelected((prev) => {
                return prev.map(() => {
                  return true;
                });
              });
            }}
          >
            Chọn tất cả
          </Button>
        )}

        {orderBill?.order?.orderdetails?.map((item: any, index: number) => {
          return (
            <div className="flex gap-2" key={index}>
              <Checkbox
                key={item._id}
                checked={listSelected[index]}
                onClick={() => {
                  setListSelected((prev) => {
                    return prev.map((item, i) => {
                      if (i === index) {
                        return !item;
                      }
                      return item;
                    });
                  });
                }}
              >
                {item.name}({item.unit})
              </Checkbox>
            </div>
          );
        })}
      </Modal>
    </>
  );
};

export default ModalKitchenPrinting;
