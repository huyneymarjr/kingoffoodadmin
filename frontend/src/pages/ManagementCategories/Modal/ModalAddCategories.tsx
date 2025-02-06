import { addCategories, updateCategories } from '@/apis/categoriesApi';
import CustomFormItem from '@/components/FormInputCustom';
import { addNewDataCategories, updateDataCategories } from '@/stores/slices/managenmentCategoriesSlice';
import { Button, Form, message, Modal, Switch } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
interface ModalAddCategoriesProps {
  isOpenModal: boolean;
  setIsOpenModal: (value: boolean) => void;
  selectedRecord: any;
  setSelectedRecord: any;
  fetchData: () => void;
}
const ModalAddCategories: FC<ModalAddCategoriesProps> = ({
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
    setIsOpenModal(false);
    form.resetFields();
    setSelectedRecord(null);
  };
  const onOk = async () => {
    const values = await form.validateFields();
    if (selectedRecord?.type === 'view') return;
    if (selectedRecord?.type === 'edit') {
      const response = await updateCategories(
        {
          id: selectedRecord?.data._id,
        },
        {
          name: values.nameGroup,
          description: values.description,
          status: status ? 'Hoạt động' : 'Không hoạt động',
        },
      );
      if (response.data) {
        dispatch(
          updateDataCategories({
            _id: selectedRecord?.data._id,
            name: values.nameGroup,
            description: values.description,
            status: status ? 'Hoạt động' : 'Không hoạt động',
          }),
        );
        message.success('Chỉnh sửa món ăn thành công');
        fetchData();
        setIsOpenModal(false);
        form.resetFields();
        setStatus(false);
      }
      return;
    } else {
      try {
        const response = await addCategories({
          name: values.nameGroup,
          description: values.description,
          status: status ? 'Hoạt động' : 'Không hoạt động',
        });
        if (response.data) {
          dispatch(addNewDataCategories(response.data));
          fetchData();
          message.success('Thêm mới món ăn thành công');
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
        nameGroup: selectedRecord?.data.name,
        description: selectedRecord?.data.description,
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
          ? 'Xem chi tiết nhóm'
          : selectedRecord?.type === 'edit'
          ? 'Chỉnh sửa nhóm'
          : 'Thêm mới'
      }
      footer={null}
    >
      <div>
        <Form layout="vertical" form={form} onFinish={onOk}>
          <CustomFormItem
            label="Tên nhóm *"
            name="nameGroup"
            formType="input"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhóm' }]}
            propsFormChildType={{
              placeholder: 'Nhập tên nhóm',
              autoComplete: false,
              //   value: nameGroup,
              //   onChange: (e: any) => {
              //     setNameGroup(e.target.value);
              //   },
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

          <CustomFormItem
            label="Miêu tả"
            name="description"
            formType="textarea"
            propsFormChildType={{
              placeholder: 'Nhập miêu tả',
              autoComplete: false,
              //   value: description,
              //   onChange: (e: any) => {
              //     setDescription(e.target.value);
              //   },
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

export default ModalAddCategories;
