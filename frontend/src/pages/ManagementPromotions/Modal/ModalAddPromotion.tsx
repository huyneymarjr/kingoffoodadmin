import { addPromotions, updatePromotions } from '@/apis/promotionsApi';
import CustomFormItem from '@/components/FormInputCustom';
import { addNewDataPromotions, updateDataPromotions } from '@/stores/slices/managementPromotionsSlice';

import { Button, Form, message, Modal, Radio, Switch } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
interface ModalAddPromotionProps {
  isOpenModal: boolean;
  setIsOpenModal: (value: boolean) => void;
  selectedRecord: any;
  setSelectedRecord: any;
  fetchData: () => void;
}
const ModalAddPromotion: FC<ModalAddPromotionProps> = ({
  isOpenModal,
  setIsOpenModal,
  selectedRecord,
  setSelectedRecord,
  fetchData,
}) => {
  const [status, setStatus] = useState(false);
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
      const response = await updatePromotions(
        {
          id: selectedRecord?.data._id,
        },
        {
          name: values.name,
          discount: Number(values.discount),
          startDate: values.startDate,
          endDate: values.endDate,
          status: status ? 'Hoạt động' : 'Không hoạt động',
        },
      );
      if (response.data) {
        dispatch(
          updateDataPromotions({
            _id: selectedRecord?.data._id,
            name: values.name,
            discount: Number(values.discount),
            startDate: values.startDate,
            endDate: values.endDate,
            status: status ? 'Hoạt động' : 'Không hoạt động',
          }),
        );
        message.success('Chỉnh sửa mã khuyến mãi thành công');
        fetchData();
        setIsOpenModal(false);
        form.resetFields();
        setStatus(false);
      }
      return;
    } else {
      try {
        const response = await addPromotions({
          name: values.name,
          discount: Number(values.discount),
          startDate: values.startDate,
          endDate: values.endDate,
          status: status ? 'Hoạt động' : 'Không hoạt động',
        });
        if (response.data) {
          dispatch(addNewDataPromotions(response.data));
          fetchData();
          message.success('Thêm mới mã khuyến mãi thành công');
          setIsOpenModal(false);
          form.resetFields();
          setStatus(false);
        }
      } catch (error) {
        console.log('Failed:', error);
      }
    }
  };
  useEffect(() => {
    if (selectedRecord?.data) {
      form.setFieldsValue({
        name: selectedRecord?.data.name,
        discount: selectedRecord?.data.discount,
        startDate: dayjs(selectedRecord?.data.startDate),
        endDate: dayjs(selectedRecord?.data.endDate),
      });
      setStatus(selectedRecord?.data.status === 'Hoạt động' ? true : false);
    }
  }, [selectedRecord]);
  return (
    <Modal
      open={isOpenModal}
      onCancel={onCancel}
      onOk={onOk}
      title={
        selectedRecord?.type == 'view'
          ? 'Xem chi tiết mã khuyến mãi'
          : selectedRecord?.type === 'edit'
          ? 'Chỉnh sửa mã khuyến mãi'
          : 'Thêm mới mã khuyến mãi'
      }
      footer={null}
    >
      <div>
        <Form layout="vertical" form={form} onFinish={onOk}>
          <CustomFormItem
            label="Mã khuyến mãi *"
            name="name"
            formType="input"
            rules={[{ required: true, message: 'Vui lòng nhập mã khuyến mãi' }]}
            propsFormChildType={{
              placeholder: 'Nhập mã khuyến mãi',
              autoComplete: false,
            }}
          />
          <CustomFormItem
            label="Khuyến mãi (%)*"
            name="discount"
            formType="input"
            rules={[
              { required: true, message: 'Vui lòng nhập mã khuyến mãi' },
              {
                pattern: /^[0-9]*$/,
                message: 'Vui lòng nhập số',
              },
            ]}
            propsFormChildType={{
              placeholder: 'Nhập khuyến mãi',

              autoComplete: false,
            }}
          />
          <CustomFormItem
            label="Ngày phát hành *"
            name="startDate"
            formType="datepicker"
            rules={[{ required: true, message: 'Vui lòng chọn ngày phát hành' }]}
            propsFormChildType={{
              placeholder: 'Chọn ngày phát hành',

              format: 'DD/MM/YYYY',
              autoComplete: false,
            }}
          />
          <CustomFormItem
            label="Ngày kết thúc *"
            name="endDate"
            formType="datepicker"
            rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
            propsFormChildType={{
              placeholder: 'Chọn ngày kết thúc',
              format: 'DD/MM/YYYY',
              autoComplete: false,
              // ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu
              disabledDate: (current: any) => {
                if (!form.getFieldValue('startDate')) return true;
                return current && current < form.getFieldValue('startDate');
              },
            }}
          />
          <div className="flex flex-col mb-5 gap-2 ">
            <div className="text-[#217ca3]">Trạng thái </div>
            <Switch
              className="w-[50px]"
              value={status}
              onChange={(e) => {
                setStatus(e);
              }}
            />
          </div>

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

export default ModalAddPromotion;
