import { changePassword } from '@/apis/usersApi';
import CustomFormItem from '@/components/FormInputCustom';
import { useAppDispatch } from '@/stores/configureStore';
import { setBreadcrumb, setTitle } from '@/stores/slices/commonSlice';
import { Button, Form, message } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const ChangePassword = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: 'Home',
          path: '/',
        },
        {
          name: 'Đổi mật khẩu',
          // path: '',
        },
        // {
        //   name: 'Tài khoản nhân viên',
        //   // path: '',
        // },
      ]),
    );
    dispatch(setTitle('Đổi mật khẩu'));
  }, [dispatch]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      return message.error('Mật khẩu mới không trùng khớp');
    }
    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      message.success('Đổi mật khẩu thành công');
    } catch (error: any) {
      console.log('Failed:', error);
      message.error(error?.data?.message);
    }
  };
  return (
    <>
      <Form
        form={form}
        name="basic"
        className="min-w-[350px] mx-auto w-full"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <CustomFormItem
          label="Mật khẩu cũ"
          name="oldPassword"
          formType="input"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu cũ!',
            },
          ]}
          propsFormChildType={{
            type: 'password',
            placeholder: 'Nhập mật khẩu cũ',
          }}
        />
        <CustomFormItem
          label="Mật khẩu mới"
          name="newPassword"
          formType="input"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu mới!',
            },
            {
              pattern: /^(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{6,}$/,
              message: 'Mật khẩu phải chứa ít nhất 6 ký tự và 1 ký tự đặc biệt',
            },
          ]}
          propsFormChildType={{
            type: 'password',
            placeholder: 'Nhập mật khẩu mới',
          }}
        />
        <CustomFormItem
          label="Nhập lại mật khẩu mới"
          name="confirmPassword"
          formType="input"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập lại mật khẩu mới!',
            },
          ]}
          propsFormChildType={{
            type: 'password',
            placeholder: 'Nhập lại mật khẩu mới',
          }}
        />
        <Form.Item>
          <div className="flex items-center justify-center gap-2">
            <Button
              className="btn-primary"
              onClick={() => {
                navigate('/');
              }}
            >
              Thoát
            </Button>
            <Button htmlType="submit" className="btn-primary">
              Đổi mật khẩu
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default ChangePassword;
