import { addInventories, updateInventories } from '@/apis/inventoriesApi';
import CustomFormItem from '@/components/FormInputCustom';
import { useAppSelector } from '@/stores/configureStore';
import { Button, Form, message, Modal, Radio, Switch } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
interface ModalAddCategoriesProps {
  isOpenModal: boolean;
  setIsOpenModal: (value: boolean) => void;
  selectedRecord: any;
  fetchData: any;
  setSelectedRecord: any;
}
const ModalAddInventories: FC<ModalAddCategoriesProps> = ({
  isOpenModal,
  setIsOpenModal,
  selectedRecord,
  fetchData,
  setSelectedRecord,
}) => {
  const dispatch = useDispatch();
  const { user } = useAppSelector((state) => state.user);

  const [form] = Form.useForm();
  const onCancel = () => {
    setIsOpenModal(false);
    form.resetFields();
    setSelectedRecord(null);
  };
  const onOk = async () => {
    const values = await form.validateFields();
    if (selectedRecord?.type === 'view') return;
    if (selectedRecord?.type === 'edit') {
      const response = await updateInventories(
        {
          id: selectedRecord?.data._id,
        },
        {
          name: values.name,
          quantity: Number(values.quantity),
          unit: values.unit,
          price: Number(values.price),
        },
      );
      if (response.data) {
        await fetchData();
        message.success(`Chỉnh sửa sản phẩm kho ${values.name} thành công`);
        setIsOpenModal(false);
        form.resetFields();
        setSelectedRecord(null);
      }
      return;
    } else {
      try {
        const response = await addInventories({
          name: values.name,
          quantity: Number(values.quantity),
          unit: values.unit,
          price: Number(values.price),
        });
        if (response.data) {
          await fetchData();
          message.success('Thêm mới sản phẩm kho thành công');
          setIsOpenModal(false);
          form.resetFields();
        }
      } catch (error) {
        console.log('Failed:', error);
      }
    }
    setSelectedRecord(null);
  };
  useEffect(() => {
    if (selectedRecord?.data) {
      form.setFieldsValue({
        name: selectedRecord?.data.name,
        quantity: selectedRecord?.data.quantity,
        unit: selectedRecord?.data.unit,
        price: selectedRecord?.data.price,
      });
    }
  }, [selectedRecord]);
  return (
    <Modal
      open={isOpenModal}
      onCancel={onCancel}
      onOk={onOk}
      title={
        selectedRecord?.type == 'view'
          ? 'Xem chi tiết sản phẩm kho'
          : selectedRecord?.type === 'edit'
          ? 'Chỉnh sửa sản phẩm kho'
          : 'Thêm mới sản phẩm kho'
      }
      footer={null}
      centered
    >
      <div>
        <Form layout="vertical" form={form} onFinish={onOk}>
          <CustomFormItem
            label="Tên sản phẩm kho *"
            name="name"
            formType="input"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm kho' }]}
            propsFormChildType={{
              placeholder: 'Nhập tên sản phẩm kho',
              autoComplete: false,
            }}
          />
          <CustomFormItem
            label="Số lượng *"
            name="quantity"
            formType="input"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng sản phẩm kho' },
              {
                pattern: /^[0-9]*$/,
                message: 'Số lượng không hợp lệ',
              },
            ]}
            propsFormChildType={{
              placeholder: 'Nhập số lượng sản phẩm',
              autoComplete: false,
            }}
          />
          <CustomFormItem
            label="Đơn vị *"
            name="unit"
            formType="input"
            rules={[{ required: true, message: 'Vui lòng nhập đơn vị sản phẩm kho' }]}
            propsFormChildType={{
              placeholder: 'Nhập đơn vị',
              autoComplete: false,
            }}
          />
          <CustomFormItem
            label="Giá sản phẩm *"
            name="price"
            formType="input"
            rules={[
              { required: true, message: 'Vui lòng nhập giá sản phẩm' },
              {
                pattern: /^[0-9]*$/,
                message: 'Giá sản phẩm không hợp lệ vui lòng nhập số',
              },
            ]}
            propsFormChildType={{
              placeholder: 'Nhập giá sản phẩm',
              autoComplete: false,
            }}
          />

          <Form.Item
            style={{
              display: selectedRecord?.type === 'view' ? 'none' : 'block',
            }}
          >
            <div className={`flex gap-2 justify-center items-center `}>
              <Button htmlType="submit" className="text-[#217ca3]">
                {selectedRecord?.type == 'edit' ? 'Chỉnh sửa' : 'Thêm mới'}
              </Button>
              <Button onClick={onCancel} type="primary" className="">
                Hủy
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalAddInventories;
