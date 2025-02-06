import React from 'react';

import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UnlockOutlined, UserOutlined } from '@ant-design/icons';
import FooterLogin from './FooterLogin';
import { useNavigate } from 'react-router';
import { setCookie } from '@/utils/helpers/cookie';
import { useDispatch } from 'react-redux';
import { setUsers } from '@/stores/slices/userSlice';
import bgr_remove_logo_black from '/assets/images/bgr_remove_logo_black.png';
import { login } from '@/apis/auth';
import ModalValidateEmail from './Modal/ModalValidateEmail';
import ModalChangePassword from './Modal/ModalChangePassword';
import ModalAuthenAccount from './Modal/ModalAuthenAccount';
type FieldType = {
  username?: string;
  password?: string;
};

const Login: React.FC = () => {
  const [form] = Form.useForm<FieldType>();
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isModalVisibleAuthen, setIsModalVisibleAuthen] = React.useState<boolean>(false);
  const onFinish = async () => {
    if (loading) return;
    try {
      const values = await form.validateFields();
      setLoading(true);
      const response = await login({
        username: values?.username!,
        password: values?.password!,
      });

      if (response.data.access_token) {
        setCookie('access_token', response.data.access_token, 0.5);
        dispatch(
          setUsers({
            accessToken: response.data.access_token,
          }),
        );
        navigate('/');
      }
      setLoading(false);
    } catch (error: any) {
      console.log('Failed:', error);
      message.error(error.response.data.message || 'Tài khoản hoặc mật khẩu không chính xác');
      if (error.response.data.message === 'Tài khoản chưa được kích hoạt') {
        setIsModalVisibleAuthen(true);
      }
    } finally {
      setLoading(false);
    }
  };
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const [isOpenModalChangePassword, setIsOpenModalChangePassword] = React.useState<boolean>(false);
  const [otp, setOtp] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  return (
    <div className="h-screen flex flex-col ">
      <div className="flex flex-col gap-3 flex-1 justify-center items-center w-full bg-login ">
        <div className="-mt-[30px]">
          <img src={bgr_remove_logo_black} alt="" className="scale-[0.6]" />
        </div>
        <div className="flex flex-col gap-10 bg-white p-5 rounded-[20px] border mt-[-30px]">
          <div className="flex flex-col gap-0">
            <p className="font-normal text-[40px] text-center">Đăng nhập</p>
            <p className="text-center text-[#0000008a]">Vui lòng đăng nhập để quản lý nhân viên, dịch vụ</p>
          </div>
          <Form
            name="basic"
            className="min-w-[350px] mx-auto w-full"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            form={form}
          >
            <Form.Item<FieldType>
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Tên đăng nhập *"
                size="large"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                autoComplete="off"
              />
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password
                prefix={password == '' ? <LockOutlined /> : <UnlockOutlined />}
                placeholder="Mật khẩu *"
                size="large"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <p
              className="flex justify-end"
              onClick={() => {
                setIsOpenModal(true);
              }}
            >
              Quên mật khẩu ?
            </p>

            <Form.Item>
              <Button type="primary" size="large" htmlType="submit" className="w-full mt-5" loading={loading}>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="">
        <FooterLogin />
      </div>
      {isOpenModal && (
        <ModalValidateEmail
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          setOtp={setOtp}
          setIsOpenModalChangePassword={setIsOpenModalChangePassword}
          email={email}
          setEmail={setEmail}
        />
      )}
      {isOpenModalChangePassword && (
        <ModalChangePassword
          isOpenModal={isOpenModalChangePassword}
          setIsOpenModal={setIsOpenModalChangePassword}
          otp={otp}
          email={email}
        />
      )}
      {isModalVisibleAuthen && (
        <ModalAuthenAccount isOpenModal={isModalVisibleAuthen} setIsOpenModal={setIsModalVisibleAuthen} />
      )}
    </div>
  );
};

export default Login;
