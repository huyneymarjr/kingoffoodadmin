import { addTables, updateTables } from '@/apis/tablesApi';
import CustomFormItem from '@/components/FormInputCustom';
import { Button, Form, message, Modal } from 'antd';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
interface ModalAddCategoriesProps {
  isOpenModal: boolean;
  setIsOpenModal: (value: boolean) => void;
  selectedRecord: any;
  fetchDataTables: (areaId: string) => Promise<void>;
  setSelectedRecord: any;
  areaTable: any;
  setAreaTable: any;
}
const ModalAddTable: FC<ModalAddCategoriesProps> = ({
  isOpenModal,
  setIsOpenModal,
  selectedRecord,
  fetchDataTables,
  setSelectedRecord,
  areaTable,
  setAreaTable,
}) => {
  const dispatch = useDispatch();
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
      const response = await updateTables(
        {
          id: selectedRecord?.data._id,
        },
        {
          areaId: areaTable?._id,
          tableNumber: Number(values.tableNumber),
          status: 'Trống',
          capacity: 0,
        },
      );
      if (response.data) {
        await fetchDataTables(areaTable?._id);
        message.success('Chỉnh sửa bàn ăn thành công');
        setIsOpenModal(false);
        form.resetFields();
        setSelectedRecord(null);
      }
      return;
    } else {
      try {
        const response = await addTables({
          areaId: areaTable?._id,
          tableNumber: Number(values.tableNumber),
          status: 'Trống',
          capacity: 0,
        });
        if (response.data) {
          await fetchDataTables(areaTable?._id);
          message.success('Thêm mới bàn ăn thành công');
          setIsOpenModal(false);
          form.resetFields();
        }
      } catch (error) {
        console.log('Failed:', error);
      }
    }
    setSelectedRecord(null);
    setAreaTable(null);
  };
  useEffect(() => {
    if (selectedRecord?.data) {
      form.setFieldsValue({
        tableNumber: selectedRecord?.data.tableNumber,
        capacity: selectedRecord?.data.capacity,
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
          ? 'Xem chi tiết bàn ăn'
          : selectedRecord?.type === 'edit'
          ? 'Chỉnh sửa bàn ăn'
          : 'Thêm mới bàn ăn'
      }
      footer={null}
    >
      <div>
        <Form layout="vertical" form={form} onFinish={onOk}>
          <CustomFormItem
            label="Khu vực"
            name="areaNumber"
            formType="input"
            propsFormChildType={{
              defaultValue: `Tầng ${areaTable?.areaNumber}`,
              autoComplete: false,
              disabled: true,
            }}
          />
          <CustomFormItem
            label="Tên bàn ăn *"
            name="tableNumber"
            formType="input"
            rules={[
              { required: true, message: 'Vui lòng nhập tên bàn ăn' },
              {
                pattern: /^[0-9]*$/,
                message: 'Vui lòng nhập số',
              },
            ]}
            propsFormChildType={{
              placeholder: 'Nhập tên bàn ăn',
              autoComplete: false,
            }}
          />

          {/* <CustomFormItem
            label="Số người *"
            name="capacity"
            formType="input"
            rules={[
              { required: true, message: 'Vui lòng nhập số người' },
              {
                pattern: /^[0-9]*$/,
                message: 'Vui lòng nhập số',
              },
            ]}
            propsFormChildType={{
              placeholder: 'Nhập số người',
              autoComplete: false,
            }}
          /> */}
          {/* <CustomFormItem
            label="Trạng thái"
            name="status"
            formType="select"
            propsFormChildType={{
              options: [
                { label: 'Đặt trước', value: 'Đặt trước' },
                { label: 'Trống', value: 'Trống' },
                { label: 'Đã có khách', value: 'Đã có khách' },
              ],
              placeholder: 'Chọn trạng thái',
            }}
          /> */}
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

export default ModalAddTable;
