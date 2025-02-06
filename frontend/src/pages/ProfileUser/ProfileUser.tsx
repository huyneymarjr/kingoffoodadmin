import { getInfoUser } from '@/apis/auth';
import { updateUser } from '@/apis/usersApi';
import CustomFormItem from '@/components/FormInputCustom';
import UserDefaultIcon from '@/components/Icons/UserDefaultIcon';
import { useAppSelector } from '@/stores/configureStore';
import { setBreadcrumb, setTitle } from '@/stores/slices/commonSlice';
import { setUsers } from '@/stores/slices/userSlice';
import { Button, Form, message } from 'antd';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const ProfileUser = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { user } = useAppSelector((state) => state.user);
  const fetchDetailUser = async () => {
    try {
      const response = await getInfoUser();
      if (response.data) {
        dispatch(setUsers(response.data.user));
      }
    } catch (error) {
      console.log('Failed', error);
      message.error('Lấy thông tin người dùng thất bại vui lòng đăng nhập lại');
    }
  };
  useEffect(() => {
    if (!user) fetchDetailUser();
  }, [user]);
  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: 'Home',
          path: '/',
        },
        {
          name: 'Thiết lập',
          path: '#',
        },
        {
          name: 'Thông tin cá nhân',
          // path: '',
        },
      ]),
    );
    dispatch(setTitle('Cập nhật thông tin cá nhân'));
  }, [dispatch]);
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        phoneNumber: user?.phoneNumber,
        email: user?.email,
        address: user?.address,
      });
    }
  }, [user]);
  const onFinish = async () => {
    try {
      await updateUser(
        {
          id: user?._id,
        },
        {
          name: form.getFieldValue('name'),
          phoneNumber: form.getFieldValue('phoneNumber'),
          email: form.getFieldValue('email'),
          address: form.getFieldValue('address'),
          role: user.role._id,
        },
      );
      fetchDetailUser();
      message.success('Cập nhật thông tin thành công');
    } catch (error) {
      console.log('Failed:', error);
      message.error('Cập nhật thông tin thất bại');
    }
  };
  return (
    <>
      <div className="flex w-full items-center justify-around">
        <Form
          className="w-[50%]"
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <CustomFormItem
            label="Tên đầy đủ *"
            name="name"
            formType="input"
            rules={[{ required: true, message: 'Vui lòng nhập tên đầy đủ ' }]}
            propsFormChildType={{
              placeholder: 'Nhập tên đầy đủ',
              autoComplete: false,
            }}
          />
          <CustomFormItem
            label="Số điện thoại *"
            name="phoneNumber"
            formType="input"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              {
                pattern: /^[0-9\b]+$/,
                message: 'Số điện thoại không hợp lệ',
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
          <CustomFormItem
            label="Email *"
            name="email"
            formType="input"
            propsFormChildType={{
              placeholder: 'Nhập địa chỉ email',
              autoComplete: false,
              disabled: true,
            }}
          />
          <CustomFormItem
            label="Địa chỉ *"
            name="address"
            formType="input"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            propsFormChildType={{
              placeholder: 'Nhập địa chỉ',
              autoComplete: false,
            }}
          />
          <Form.Item>
            {' '}
            <div className={`flex gap-2 justify-center items-center `}>
              <Button htmlType="submit" className="text-[#217ca3]">
                Cập nhật
              </Button>
            </div>
          </Form.Item>
        </Form>
        <div className="p-5 w-[25%]">
          <div className="flex justify-center">
            <UserDefaultIcon textContent={user?.name ? user?.name?.trim()?.[0].toUpperCase() : ''} />
          </div>
          <div className="text-center mt-5">
            <p className="text-gray-500">Vai trò: {user?.role?.name ?? ''}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileUser;
