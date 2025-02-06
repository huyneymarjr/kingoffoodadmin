import { addCustomer, updateCustomer } from '@/apis/customerApi';
import CustomFormItem from '@/components/FormInputCustom';
import { useAppSelector } from '@/stores/configureStore';
import { Button, Form, message, Modal, Radio, Switch } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
interface ModalAddCategoriesProps {
  isOpenModal: boolean;
  setIsOpenModal: (value: boolean) => void;
  selectedRecord?: any;
  fetchData: any;
  setSelectedRecord?: any;
}
const ModalAddCustomer: FC<ModalAddCategoriesProps> = ({
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
      try {
        const response = await updateCustomer(
          {
            id: selectedRecord?.data._id,
          },
          {
            userId: user?._id,
            name: values.name,
            email: values.email,
            phoneNumber: values.phoneNumber,
            point: Number(values.point),
            type: 'Khách hàng',
            address: values.address,
            gender: values.gender,
            note: values.note || '',
          },
        );
        if (response.data) {
          await fetchData();
          message.success(`Chỉnh sửa khách hàng ${values.name} thành công`);
          setIsOpenModal(false);
          form.resetFields();
          setSelectedRecord(null);
        }
      } catch (error: any) {
        console.log('Failed:', error);
        message.error(error?.response?.data?.message || 'Cập nhật khách hàng thất bại');
      }

      return;
    } else {
      try {
        const response = await addCustomer({
          userId: user?._id,
          name: values.name,
          email: values.email,
          phoneNumber: values.phoneNumber,
          point: Number(values.point),
          type: 'Khách hàng',
          address: values.address,
          gender: values.gender,
          note: values.note || '',
        });
        if (response.data) {
          await fetchData();
          message.success('Thêm mới khách hàng thành công');
          setIsOpenModal(false);
          form.resetFields();
        }
      } catch (error: any) {
        console.log('Failed:', error);
        message.error(error?.response?.data?.message || 'Thêm mới khách hàng thất bại');
      }
    }
    setSelectedRecord(null);
  };
  useEffect(() => {
    if (selectedRecord?.data) {
      form.setFieldsValue({
        name: selectedRecord?.data.name,
        email: selectedRecord?.data.email,
        phoneNumber: selectedRecord?.data.phoneNumber,
        point: selectedRecord?.data.point,
        address: selectedRecord?.data.address,
        gender: selectedRecord?.data.gender,
        note: selectedRecord?.data.note || '',
      });
    }
  }, [selectedRecord]);
  const validateFields = (_: any, value: any) => {
    const email = form.getFieldValue('email');
    const phoneNumber = form.getFieldValue('phoneNumber');
    if (!email && !phoneNumber) {
      return Promise.reject(
        new Error('Vui lòng nhập ít nhất một trong hai trường: email hoặc số điện thoại'),
      );
    }
    return Promise.resolve();
  };
  return (
    <Modal
      open={isOpenModal}
      onCancel={onCancel}
      onOk={onOk}
      title={
        selectedRecord?.type == 'view'
          ? 'Xem chi tiết khách hàng'
          : selectedRecord?.type === 'edit'
          ? 'Chỉnh sửa khách hàng'
          : 'Thêm mới khách hàng'
      }
      footer={null}
      centered
    >
      <div>
        <Form layout="vertical" form={form} onFinish={onOk}>
          <CustomFormItem
            label="Tên khách hàng *"
            name="name"
            formType="input"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
            propsFormChildType={{
              placeholder: 'Nhập tên khách hàng',
              autoComplete: false,
            }}
          />
          <CustomFormItem
            label="Email *"
            name="email"
            formType="input"
            rules={[
              { validator: validateFields },
              {
                type: 'email',
                message: 'Địa chỉ email không hợp lệ',
              },
            ]}
            propsFormItemType={{
              dependencies: ['phoneNumber'],
            }}
            propsFormChildType={{
              placeholder: 'Nhập email',
              autoComplete: false,
            }}
          />
          <CustomFormItem
            label="Số điện thoại *"
            name="phoneNumber"
            formType="input"
            rules={[
              { validator: validateFields },
              {
                pattern: /^[0-9]*$/,
                message: 'Số điện thoại không hợp lệ vui lòng nhập số',
              },
              {
                min: 10,
                message: 'Số điện thoại phải có ít nhất 10 số',
              },
            ]}
            propsFormItemType={{
              dependencies: ['email'],
            }}
            propsFormChildType={{
              placeholder: 'Nhập số điện thoại',
              autoComplete: false,
              maxLength: 11,
            }}
          />
          <CustomFormItem
            label="Điểm tích lũy *"
            name="point"
            formType="input"
            rules={[
              { required: true, message: 'Vui lòng nhập điểm tích lũy' },
              {
                pattern: /^[0-9]*$/,
                message: 'Điểm tích lũy không hợp lệ vui lòng nhập số',
              },
            ]}
            propsFormChildType={{
              placeholder: 'Nhập điểm tích lũy',
              autoComplete: false,
            }}
          />
          <CustomFormItem
            label="Địa chỉ *"
            name="address"
            formType="input"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ khách hàng' }]}
            propsFormChildType={{
              placeholder: 'Nhập địa chỉ',
              autoComplete: false,
            }}
          />

          <CustomFormItem
            label="Giới tính *"
            name="gender"
            formType="radio"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
            propsFormChildType={{
              options: [
                { label: 'Nam', value: 'Nam' },
                { label: 'Nữ', value: 'Nữ' },
                { label: 'Khác', value: 'Khác' },
              ],
            }}
            classNameLable="!top-[-10px] !left-[1px]"
          />

          <CustomFormItem
            label="Ghi chú"
            name="note"
            formType="textarea"
            propsFormChildType={{
              placeholder: 'Nhập ghi chú',
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

export default ModalAddCustomer;
