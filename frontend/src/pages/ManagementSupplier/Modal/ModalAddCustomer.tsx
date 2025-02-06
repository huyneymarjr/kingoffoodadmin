import { addCustomer, updateCustomer } from '@/apis/customerApi';
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
            point: 0,
            type: 'Nhà cung cấp',
            address: values.address,
            gender: '',
            note: values.note || '',
          },
        );
        if (response.data) {
          await fetchData();
          message.success(`Chỉnh sửa nhà cung cấp ${values.name} thành công`);
          setIsOpenModal(false);
          form.resetFields();
          setSelectedRecord(null);
        }
      } catch (error: any) {
        message.error(error?.response?.data?.message || 'Cập nhật nhà cung cấp thất bại');
      }
      return;
    } else {
      try {
        const response = await addCustomer({
          userId: user?._id,
          name: values.name,
          email: values.email,
          phoneNumber: values.phoneNumber,
          point: 0,
          type: 'Nhà cung cấp',
          address: values.address,
          gender: '',
          note: values.note || '',
        });
        if (response.data) {
          await fetchData();
          message.success('Thêm mới nhà cung cấp thành công');
          setIsOpenModal(false);
          form.resetFields();
        }
      } catch (error: any) {
        message.error(error?.response?.data?.message || 'Thêm mới nhà cung cấp thất bại');
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
        // point: selectedRecord?.data.point,
        address: selectedRecord?.data.address,
        note: selectedRecord?.data.note || '',
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
          ? 'Xem chi tiết nhà cung cấp'
          : selectedRecord?.type === 'edit'
          ? 'Chỉnh sửa nhà cung cấp'
          : 'Thêm mới nhà cung cấp'
      }
      footer={null}
      centered
    >
      <div>
        <Form layout="vertical" form={form} onFinish={onOk}>
          <CustomFormItem
            label="Tên nhà cung cấp *"
            name="name"
            formType="input"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }]}
            propsFormChildType={{
              placeholder: 'Nhập tên nhà cung cấp',
              autoComplete: false,
            }}
          />
          <CustomFormItem
            label="Email *"
            name="email"
            formType="input"
            rules={[
              { required: true, message: 'Vui lòng nhập email nhà cung cấp' },
              {
                type: 'email',
                message: 'Địa chỉ email không hợp lệ',
              },
            ]}
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
              { required: true, message: 'Vui lòng nhập số điện thoại nhà cung cấp' },
              {
                pattern: /^[0-9]*$/,
                message: 'Số điện thoại không hợp lệ vui lòng nhập số',
              },
              {
                min: 10,
                message: 'Số điện thoại phải có ít nhất 10 số',
              },
            ]}
            propsFormChildType={{
              placeholder: 'Nhập số điện thoại',
              autoComplete: false,
              maxLength: 11,
            }}
          />
          {/* <CustomFormItem
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
          /> */}
          <CustomFormItem
            label="Địa chỉ *"
            name="address"
            formType="input"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ nhà cung cấp' }]}
            propsFormChildType={{
              placeholder: 'Nhập địa chỉ',
              autoComplete: false,
            }}
          />

          {/* <CustomFormItem
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
            classNameLable="top-[-10px] left-[1px]"
          /> */}

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
