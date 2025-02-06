import { forgotPassword } from '@/apis/auth';
import CustomFormItem from '@/components/FormInputCustom';
import { Form, message, Modal } from 'antd';
import React, { Dispatch } from 'react';

const ModalChangePassword = ({
  isOpenModal,
  setIsOpenModal,
  otp,
  email,
}: {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<React.SetStateAction<boolean>>;
  otp: string;
  email: string;
}) => {
  const onCancel = () => {
    setIsOpenModal(false);
  };
  const onOk = async () => {
    const values = await form.validateFields();
    try {
      const response = await forgotPassword({
        code: otp,
        password: values.newpassword,
        confirmPassword: values.confirmpassword,
        email: email,
      });
      console.log('Success:', response);
      message.success('Đổi mật khẩu thành công');
    } catch (error: any) {
      console.log('Failed:', error);
      message.error(error.response.data.message);
    }
    setIsOpenModal(false);
  };
  const [form] = Form.useForm();
  return (
    <Modal open={isOpenModal} onCancel={onCancel} onOk={onOk} title={'Xác nhận email'}>
      <Form form={form} name="form" onFinish={onOk}>
        <CustomFormItem
          label="Mã xác nhận"
          name="otp"
          formType="input"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mã xác nhận của bạn',
            },
            {
              validator: async (_rule, value) => {
                if (!value) return;
                if (value !== otp) {
                  throw new Error('Mã xác nhận không đúng');
                }
              },
            },
          ]}
          propsFormChildType={{
            placeholder: 'Nhập mã xác nhận của bạn',
            autoComplete: false,
          }}
        />
        <CustomFormItem
          label="Mật khẩu mới"
          name="newpassword"
          formType="input"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu của bạn',
            },
            {
              pattern: /^(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{6,}$/,
              message: 'Mật khẩu phải chứa ít nhất 6 ký tự và 1 ký tự đặc biệt',
            },
          ]}
          propsFormChildType={{
            type: 'password',
            placeholder: 'Nhập mật khẩu mới ',
            autoComplete: false,
          }}
        />
        <CustomFormItem
          label="Xác nhận mật khẩu mới"
          name="confirmpassword"
          formType="input"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu mới của bạn',
            },
            {
              validator: async (_rule, value) => {
                if (value !== form.getFieldValue('newpassword')) {
                  throw new Error('Mật khẩu không trùng khớp');
                }
              },
            },
          ]}
          propsFormChildType={{
            type: 'password',
            placeholder: 'Nhập lại mật khẩu mới',
            autoComplete: false,
          }}
        />
      </Form>
    </Modal>
  );
};

export default ModalChangePassword;
