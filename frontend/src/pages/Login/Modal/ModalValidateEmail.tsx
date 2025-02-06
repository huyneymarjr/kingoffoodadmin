import { retryPassword } from '@/apis/auth';
import CustomFormItem from '@/components/FormInputCustom';
import { message, Modal } from 'antd';
import React, { Dispatch } from 'react';

const ModalValidateEmail = ({
  isOpenModal,
  setIsOpenModal,
  setOtp,
  setIsOpenModalChangePassword,
  email,
  setEmail,
}: {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<React.SetStateAction<boolean>>;
  setOtp: Dispatch<React.SetStateAction<string>>;
  setIsOpenModalChangePassword: Dispatch<React.SetStateAction<boolean>>;
  email: string;
  setEmail: Dispatch<React.SetStateAction<string>>;
}) => {
  const onCancel = () => {
    setIsOpenModal(false);
  };
  const onOk = async () => {
    try {
      const response = await retryPassword({ email });
      setOtp(response.data.codeId);
      setIsOpenModalChangePassword(true);
      setIsOpenModal(false);
    } catch (error: any) {
      console.log('Failed:', error);
      message.error(error?.response?.data?.message);
    }
  };

  return (
    <Modal open={isOpenModal} onCancel={onCancel} onOk={onOk} title={'Xác nhận email'}>
      <div>
        <CustomFormItem
          label="Email"
          name="email"
          formType="input"
          propsFormChildType={{
            type: 'email',
            placeholder: 'Nhập email của bạn',
            autoComplete: false,
            value: email,
            onChange: (e: any) => {
              setEmail(e.target.value);
            },
          }}
        />
      </div>
    </Modal>
  );
};

export default ModalValidateEmail;
