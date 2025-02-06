import { addAreas, updateAreas } from '@/apis/areasApi';
import CustomFormItem from '@/components/FormInputCustom';
import { Button, Form, message, Modal, Radio, Switch } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
interface ModalAddCategoriesProps {
  isOpenModal: boolean;
  setIsOpenModal: (value: boolean) => void;
  selectedRecord: any;
  fetchDataAreas: any;
  setSelectedRecord: any;
}
const ModalAddAreas: FC<ModalAddCategoriesProps> = ({
  isOpenModal,
  setIsOpenModal,
  selectedRecord,
  fetchDataAreas,
  setSelectedRecord,
}) => {
  const dispatch = useDispatch();
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
      const response = await updateAreas(
        {
          id: selectedRecord?.data._id,
        },
        {
          areaNumber: Number(values.areaNumber),
          capacity: Number(values.capacity),
        },
      );
      if (response.data) {
        await fetchDataAreas();
        message.success(`Chỉnh sửa khu vực Tầng ${values.areaNumber} thành công`);
        setIsOpenModal(false);
        form.resetFields();
        setSelectedRecord(null);
      }
      return;
    } else {
      try {
        const response = await addAreas({
          areaNumber: Number(values.areaNumber),
          status: 'Hoạt động',
          capacity: Number(values.capacity),
        });
        if (response.data) {
          await fetchDataAreas();
          message.success('Thêm mới khu vực thành công');
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
        areaNumber: selectedRecord?.data.areaNumber,
        capacity: selectedRecord?.data.capacity,
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
          ? 'Xem chi tiết khu vực'
          : selectedRecord?.type === 'edit'
          ? 'Chỉnh sửa khu vực'
          : 'Thêm mới khu vực'
      }
      footer={null}
    >
      <div>
        <Form layout="vertical" form={form} onFinish={onOk}>
          <CustomFormItem
            label="Tên khu vực *"
            name="areaNumber"
            formType="input"
            rules={[
              { required: true, message: 'Vui lòng nhập tên khu vực' },
              {
                pattern: /^[0-9]*$/,
                message: 'Vui lòng nhập số',
              },
            ]}
            propsFormChildType={{
              placeholder: 'Nhập tên khu vực',
              autoComplete: false,
            }}
          />

          <CustomFormItem
            label="Số bàn *"
            name="capacity"
            formType="input"
            rules={[
              { required: true, message: 'Vui lòng nhập tên khu vực' },
              {
                pattern: /^[0-9]*$/,
                message: 'Vui lòng nhập số',
              },
            ]}
            propsFormChildType={{
              placeholder: 'Nhập số bàn',
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

export default ModalAddAreas;
