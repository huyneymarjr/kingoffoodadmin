import CustomFormItem from '@/components/FormInputCustom';
import { setBreadcrumb, setTitle } from '@/stores/slices/commonSlice';
import { Button, Form, message, Modal } from 'antd';
import React, { useEffect } from 'react';

import { getListRole } from '@/apis/role';

import { useNavigate, useParams } from 'react-router';
import { registerUser, getUserById, updateUser } from '@/apis/usersApi';
import { useAppDispatch } from '@/stores/configureStore';
import { addNewData } from '@/stores/slices/managenmentEmployeeSlice';

import { useLocation } from 'react-router-dom';
import { getQueryParams } from '@/utils/helpers/getQuery';
const AddAccountPage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: 'Home',
          path: '/',
        },
        {
          name: 'Quản lý nhân viên',
          path: 'tai-khoan-nhan-vien',
        },
        {
          name: 'Tài khoản nhân viên',
          path: '#',
        },
      ]),
    );
    dispatch(setTitle('Thông tin tài khoản'));
  }, [dispatch]);
  const [form] = Form.useForm();
  const [listRole, setListRole] = React.useState<any[]>([]);
  const { id } = useParams();
  const location = useLocation();
  const queryParams = getQueryParams(location.search);
  const type = queryParams.get('type');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListRole({
          current: '1',
          pageSize: '10',
        });
        if (response.data) {
          setListRole(response?.data?.result);
        }
      } catch (error) {
        console.log('Failed', error);
        message.error('Lỗi lấy danh sách vai trò');
      }
    };
    fetchData();
  }, []);
  // const listRole = useAppSelector((state) => state.managenmentRoles);
  const fetchDataUserById = async () => {
    try {
      const response = (await getUserById({
        id: id!,
      })) as any;
      if (response.data) {
        form.setFieldsValue({
          name: response?.data?.name,
          phoneNumber: response?.data?.phoneNumber,
          email: response?.data?.email,
          address: response?.data?.address,
          role: response?.data?.role._id,
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {
    if (id) {
      fetchDataUserById();
    }
  }, [id]);
  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      const newData = {
        name: values.name,
        phoneNumber: values.phoneNumber,
        email: values.email,
        password: values.password,
        address: values.address,
        role: values.role,
      };

      if (id) {
        await updateUser({ id: id }, newData);
        message.success('Sửa tài khoản thành công');
      } else {
        const response = await registerUser(newData);
        if (response.data) {
          message.success('Thêm tài khoản thành công');
          dispatch(
            addNewData({
              id: response.data._id as string,
              name: values.name,
              phoneNumber: values.phoneNumber,
              email: values.email,
              password: values.password,
              address: values.address,
              role: values.role,
            }),
          );
        }
      }
      form.resetFields();
      navigate(-1);
    } catch (errorInfo: any) {
      console.log('Failed:', errorInfo);
      message.error(errorInfo?.response?.data?.message || 'Lỗi thêm tài khoản');
    }
  };
  return (
    <>
      <Form className="" form={form} onFinish={onFinish}>
        <div className="flex w-[100%] flex-wrap justify-around">
          <div>
            <CustomFormItem
              label="Tên nhân viên *"
              name="name"
              formType="input"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên nhân viên',
                },
              ]}
              propsFormChildType={{
                placeholder: 'Nhập tên nhân viên',
                autoComplete: false,
                className: 'w-[500px]',
              }}
            />
            <CustomFormItem
              label="Email *"
              name="email"
              formType="input"
              rules={[
                {
                  type: 'email',
                  message: 'Email không đúng định dạng',
                },
                {
                  required: true,
                  message: 'Vui lòng nhập email',
                },
              ]}
              propsFormChildType={{
                placeholder: 'Nhập email',
                autoComplete: false,
                disabled: id ? true : false,
              }}
            />
            <CustomFormItem
              label="Số điện thoại *"
              name="phoneNumber"
              formType="input"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số điện thoại',
                },
                {
                  pattern: /^[0-9\b]+$/,
                  message: 'Số điện thoại không đúng định dạng',
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
              label="Địa chỉ"
              name="address"
              formType="input"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập địa chỉ',
                },
              ]}
              propsFormChildType={{
                placeholder: 'Nhập địa chỉ',
                autoComplete: false,
              }}
            />
          </div>
          <div>
            <CustomFormItem
              label="Mật khẩu *"
              name="password"
              formType="input"
              rules={[
                {
                  required: id ? false : true,
                  message: 'Vui lòng nhập mật khẩu',
                },
                {
                  pattern: /^(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{6,}$/,
                  message: 'Mật khẩu phải chứa ít nhất 6 ký tự và 1 ký tự đặc biệt',
                },
              ]}
              propsFormChildType={{
                type: 'password',
                placeholder: 'Nhập mật khẩu',
                autoComplete: false,
                className: 'w-[500px]',
                disabled: id ? true : false,
              }}
            />

            <CustomFormItem
              label="Xác nhận mật khẩu *"
              name="passwordAgain"
              formType="input"
              rules={[
                {
                  required: id ? false : true,
                  message: 'Vui lòng xác nhận mật khẩu',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp'));
                  },
                }),
              ]}
              propsFormChildType={{
                type: 'password',
                placeholder: 'Nhập lại mật khẩu',
                autoComplete: false,
                disabled: id ? true : false,
              }}
            />
            <CustomFormItem
              label="Vai trò"
              name="role"
              formType="select"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn vai trò',
                },
              ]}
              propsFormChildType={{
                placeholder: 'Chọn vai trò',
                options: listRole.map((item) => ({
                  label: item.name,
                  value: item._id,
                })),
              }}
            />
          </div>
        </div>
        <Form.Item className="float-end w-[200px] ">
          <Button
            htmlType="submit"
            className={`mr-5 w-[40%]`}
            disabled={type && type === 'view' ? true : false}
          >
            Lưu
          </Button>
          <Button
            type="primary"
            className=" w-[50%]"
            onClick={() => {
              // if(form.isFieldsTouched())
              if (type === 'view') {
                navigate(-1);
                return;
              }
              Modal.confirm({
                title: 'Bạn có chắc chắn muốn thoát?',
                content: 'Dữ liệu bạn đã nhập sẽ không được lưu',
                onOk: () => {
                  navigate(-1);
                },
                onCancel() {},
              });
            }}
          >
            Thoát
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddAccountPage;
