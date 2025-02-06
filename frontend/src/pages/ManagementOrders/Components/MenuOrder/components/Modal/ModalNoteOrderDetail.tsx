import { updateOrderdetails } from '@/apis/orderdetailsApi';
import { useAppDispatch } from '@/stores/configureStore';
import { setOrderBill, setOrderdetailsBill, setOrderdetailsBillModal } from '@/stores/slices/orderMenusSlice';
import { Input, message, Modal } from 'antd';
import React, { useState } from 'react';

const ModalNoteOrderDetail = ({
  isOpenModal,
  setIsOpenModal,
  selectItem,
  setSelectItem,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectItem: any;
  setSelectItem: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [quantity, setQuantity] = useState<number>(selectItem?.quantity || 0);
  const [textNote, setTextNote] = useState<string>(selectItem?.note || '');
  const dispatch = useAppDispatch();
  const onOk = () => {
    const dataUpdate = {
      ...selectItem,
      quantity,
      note: textNote,
    };
    updateOrderdetails(
      {
        id: selectItem?.orderDetailId || selectItem?._id,
      },
      dataUpdate,
    );
    dispatch(setOrderdetailsBillModal(dataUpdate));
    message.success('Cập nhật thành công');
    setIsOpenModal(false);
    setSelectItem(null);
  };
  const onCancel = () => {
    setIsOpenModal(false);
    setSelectItem(null);
  };
  return (
    <Modal title={`Chỉnh sửa ${selectItem?.name || ''}`} open={isOpenModal} onOk={onOk} onCancel={onCancel}>
      <div className="flex flex-col gap-2">
        <div>
          <p>Số lượng</p>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => {
              setQuantity(Number(e.target.value));
            }}
            min={0}
          ></Input>
        </div>
        <div>
          <p>Đơn giá </p>
          <Input type="number" value={selectItem?.price || 0} disabled></Input>
        </div>
        <div>
          <p>Ghi chú</p>{' '}
          <Input.TextArea
            value={textNote}
            onChange={(e) => {
              setTextNote(e.target.value);
            }}
          ></Input.TextArea>
        </div>
      </div>
    </Modal>
  );
};

export default ModalNoteOrderDetail;
