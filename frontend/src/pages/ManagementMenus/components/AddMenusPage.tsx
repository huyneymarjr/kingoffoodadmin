import { addMenus } from '@/apis/menusApi';
import CustomFormItem from '@/components/FormInputCustom';
import { addNewDataMenus, updateDataMenus } from '@/stores/slices/managementMenusSlice';

import { Button, Form, message, Modal, Radio, Switch, Upload } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { getListCategories } from '@/apis/categoriesApi';
import UploadImage from './UploadImage';
import { setBreadcrumb, setTitle } from '@/stores/slices/commonSlice';
import { useNavigate } from 'react-router-dom';

const AddMenusPage = () => {
  const [status, setStatus] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [dataOption, setDataOption] = useState<any[]>([]);
  const [page, setPage] = useState({ pageIndex: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [fileList, setFileList] = useState<any[]>([]);
  const navigate = useNavigate();
  const fetchDataCategories = async () => {
    try {
      setLoading(true);
      const response = await getListCategories({
        current: page.pageIndex,
        pageSize: page.pageSize,
        filter: `status=Hoạt động`,
      });
      if (response.data) {
        setDataOption((prevData) => {
          const existingIds = new Set(prevData.map((item: any) => item._id));
          const newData = response?.data?.result.filter((item: any) => !existingIds.has(item._id));
          return [...prevData, ...newData];
        });
        setTotal(response?.data?.meta.total);
      }
      setLoading(false);
    } catch (error) {
      console.log('Failed', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (page) fetchDataCategories();
  }, [page]);
  const onCancel = () => {
    form.resetFields();
    navigate('/danh-muc-mon-an');
    // setSelectedRecord(null);
  };
  const onOk = async () => {
    const values = await form.validateFields();

    try {
      const response = await addMenus({
        categoryId: values.categoryId,
        name: values.name,
        price: Number(values.price),
        description: values.description,
        status: values.status ? 'Hoạt động' : 'Không hoạt động',
        unit: values.unit,
        image: imageUrl,
      });
      if (response.data) {
        dispatch(addNewDataMenus(response.data));
        message.success('Thêm mới món ăn thành công');
        form.resetFields();
        setImageUrl('');
        setStatus(false);
        setFileList([]);
      }
    } catch (error) {
      console.log('Failed:', error);
    }
  };

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: 'Home',
          path: '/',
        },
        {
          name: 'Quản lý danh sách món ăn',
          // path: '',
        },
        // {
        //   name: 'Tài khoản nhân viên',
        //   // path: '',
        // },
      ]),
    );
    dispatch(setTitle('Thêm mới món ăn'));
  }, [dispatch]);

  const handlePopupScroll = (e: any) => {
    const { target } = e;
    if (page.pageIndex * page.pageSize >= total) return;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      setPage((prevPage) => {
        return { ...prevPage, pageIndex: prevPage.pageIndex + 1 };
      });
    }
  };
  useEffect(() => {
    if (imageUrl) {
      form.setFieldsValue({
        image: imageUrl,
      });
    }
  }, [imageUrl]);
  useEffect(() => {
    form.setFieldsValue({
      status: status,
    });
  }, [status]);
  return (
    <div>
      <Form layout="vertical" form={form} onFinish={onOk}>
        <CustomFormItem
          label="Nhóm món ăn *"
          name="categoryId"
          formType="select"
          rules={[{ required: true, message: 'Vui lòng chọn nhóm món ăn' }]}
          propsFormChildType={{
            placeholder: 'Vui lòng chọn nhóm món ăn',
            autoComplete: false,
            options: dataOption.map((item: any) => ({
              label: item.name,
              value: item._id,
            })),
            loading: loading,
            onPopupScroll: handlePopupScroll,
            dropdownRender: (menu: any) => <div className="max-h-[300px]">{menu}</div>,
          }}
        />

        <CustomFormItem
          label="Tên món ăn *"
          name="name"
          formType="input"
          rules={[{ required: true, message: 'Vui lòng nhập tên món ăn' }]}
          propsFormChildType={{
            placeholder: 'Nhập tên món ăn',
            autoComplete: false,
          }}
        />

        <CustomFormItem
          label="Giá bán *"
          name="price"
          formType="input"
          rules={[
            { required: true, message: 'Vui lòng nhập giá bán' },
            {
              pattern: /^[0-9\b]+$/,
              message: 'Giá bán không hợp lệ',
            },
          ]}
          propsFormChildType={{
            placeholder: 'Nhập giá bán',
            autoComplete: false,
          }}
        />
        <CustomFormItem
          label="Mô tả *"
          name="description"
          formType="textarea"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          propsFormChildType={{
            placeholder: 'Nhập mô tả',
            autoComplete: false,
          }}
        />

        <CustomFormItem
          label="Trạng thái bán"
          name="status"
          formType="checkbox"
          classNameLable="text-[#217ca3] ml-3 mt-[2px] !text-[14px]"
          propsFormChildType={{
            placeholder: 'Chọn trạng thái',
            autoComplete: false,
            checked: status,
            onChange: (e: any) => {
              setStatus(e.target.checked);
            },
          }}
        />

        <CustomFormItem
          label="Đơn vị *"
          name="unit"
          formType="input"
          rules={[{ required: true, message: 'Vui lòng nhập đơn vị' }]}
          propsFormChildType={{
            placeholder: 'Nhập đơn vị',
            autoComplete: false,
          }}
        />
        <Form.Item name="image" rules={[{ required: true, message: 'Vui lòng chọn ảnh' }]}>
          <div className="text-[#217ca3]">Ảnh đại diện*:</div>
          <UploadImage
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            setFileList={setFileList}
            fileList={fileList}
          />
        </Form.Item>

        <Form.Item
        //   style={{
        //     display: selectedRecord?.type === 'view' ? 'none' : 'block',
        //   }}
        >
          <div className={`flex gap-2 justify-center items-center `}>
            <Button htmlType="submit" className="text-[#217ca3]">
              {/* {selectedRecord?.type == 'edit' ? 'Chỉnh sửa' : 'Thêm mới'} */}
              Thêm mới
            </Button>
            <Button onClick={onCancel} type="primary" className="">
              Hủy
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddMenusPage;
