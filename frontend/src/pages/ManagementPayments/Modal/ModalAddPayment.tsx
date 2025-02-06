import { addPayments, updatePayments } from '@/apis/paymentsApi';
import CustomFormItem from '@/components/FormInputCustom';
import { addNewDataPayments, updateDataPayments } from '@/stores/slices/managementPaymentsSlice';

import { Button, Form, InputNumber, message, Modal, Radio, Switch } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { CloseOutlined } from '@ant-design/icons';
interface ModalAddPaymentProps {
  isOpenModal: boolean;
  setIsOpenModal: (value: boolean) => void;
  selectedRecord: any;
  setSelectedRecord: any;
  fetchData: () => void;
}
const ModalAddPayment: FC<ModalAddPaymentProps> = ({
  isOpenModal,
  setIsOpenModal,
  selectedRecord,
  setSelectedRecord,
  fetchData,
}) => {
  const [status, setStatus] = useState(false);
  const dispatch = useDispatch();
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [paymentedMethod, setPaymentedMethod] = useState({
    'Chuyển khoản': 0,
    'Tiền mặt': 0,
    'Thẻ ghi nợ': 0,
  });
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
      const response = await updatePayments(
        {
          id: selectedRecord?.data._id,
        },
        {
          method: values.method,
          paymentMethod: {
            'Chuyển khoản': values['Chuyển khoản'],
            'Tiền mặt': values['Tiền mặt'],
            'Thẻ ghi nợ': values['Thẻ ghi nợ'],
          },
          paymentTime: values.paymentTime,
          totalAmount: Number(values.totalAmount),
          status: values.status,
        },
      );
      if (response.data) {
        dispatch(
          updateDataPayments({
            _id: selectedRecord?.data._id,
            method: values.method,
            paymentMethod: {
              'Chuyển khoản': values['Chuyển khoản'],
              'Tiền mặt': values['Tiền mặt'],
              'Thẻ ghi nợ': values['Thẻ ghi nợ'],
            },
            paymentTime: values.paymentTime,
            totalAmount: Number(values.totalAmount),
            status: values.status,
          }),
        );
        message.success('Chỉnh sửa thanh toán thành công');
        fetchData();
        setIsOpenModal(false);
        form.resetFields();
        setStatus(false);
        setSelectedMethods([]);
        setPaymentedMethod({
          'Chuyển khoản': 0,
          'Tiền mặt': 0,
          'Thẻ ghi nợ': 0,
        });
      }
      return;
    } else {
      try {
        const response = await addPayments({
          method: values.method,
          paymentMethod: {
            'Chuyển khoản': values['Chuyển khoản'],
            'Tiền mặt': values['Tiền mặt'],
            'Thẻ ghi nợ': values['Thẻ ghi nợ'],
          },
          paymentTime: values.paymentTime,
          totalAmount: Number(values.totalAmount),
          status: values.status,
        });
        if (response.data) {
          dispatch(addNewDataPayments(response.data));
          fetchData();
          message.success('Thêm mới thanh toán thành công');
          setIsOpenModal(false);
          form.resetFields();
          setStatus(false);
          setSelectedMethods([]);
          setPaymentedMethod({
            'Chuyển khoản': 0,
            'Tiền mặt': 0,
            'Thẻ ghi nợ': 0,
          });
        }
      } catch (error) {
        console.log('Failed:', error);
      }
    }
  };
  useEffect(() => {
    if (selectedRecord?.data) {
      form.setFieldsValue({
        method: selectedRecord?.data?.method,
        paymentTime: dayjs(selectedRecord?.data?.paymentTime),
        totalAmount: selectedRecord?.data?.totalAmount,
        status: selectedRecord?.data?.status,
        'Chuyển khoản': selectedRecord?.data?.paymentMethod['Chuyển khoản'],
        'Tiền mặt': selectedRecord?.data?.paymentMethod['Tiền mặt'],
        'Thẻ ghi nợ': selectedRecord?.data?.paymentMethod['Thẻ ghi nợ'],
      });
      setSelectedMethods(selectedRecord?.data?.method);
      setPaymentedMethod({
        'Chuyển khoản': selectedRecord?.data?.paymentMethod['Chuyển khoản'],
        'Tiền mặt': selectedRecord?.data?.paymentMethod['Tiền mặt'],
        'Thẻ ghi nợ': selectedRecord?.data?.paymentMethod['Thẻ ghi nợ'],
      });
    }
  }, [selectedRecord]);
  useEffect(() => {
    let total = 0;
    selectedMethods.forEach((method) => {
      total += Number(paymentedMethod[method]) || 0;
    });
    form.setFieldsValue({ totalAmount: total });
  }, [selectedMethods, paymentedMethod]);
  return (
    <Modal
      open={isOpenModal}
      onCancel={onCancel}
      onOk={onOk}
      title={
        selectedRecord?.type == 'view'
          ? 'Xem chi tiết thanh toán'
          : selectedRecord?.type === 'edit'
          ? 'Chỉnh sửa thanh toán'
          : 'Thêm mới thanh toán'
      }
      footer={null}
    >
      <div>
        <Form layout="vertical" form={form} onFinish={onOk}>
          <CustomFormItem
            label="Phương thức thanh toán *"
            name="method"
            formType="select"
            rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán' }]}
            propsFormChildType={{
              mode: 'multiple',
              placeholder: 'Chọn phương thức thanh toán',
              options: [
                { label: 'Chuyển khoản', value: 'Chuyển khoản' },
                { label: 'Tiền mặt', value: 'Tiền mặt' },
                { label: 'Thẻ ghi nợ', value: 'Thẻ ghi nợ' },
              ],
              value: selectedMethods,
              onChange: (value: any) => {
                setSelectedMethods(value);
              },
              className: 'select-multiple-method',
            }}
          />

          {selectedMethods?.map((item) => (
            <div key={item} className="flex ">
              <CustomFormItem
                label={`Số tiền ${item} *`}
                name={item}
                formType="input"
                rules={[
                  { required: true, message: `Vui lòng nhập số tiền ${item}` },
                  {
                    pattern: /^[0-9]*\.?[0-9]*$/,
                    message: `Số tiền ${item} phải là số`,
                  },
                ]}
                propsFormChildType={{
                  placeholder: `Nhập số tiền ${item}`,
                  autoComplete: 'off',
                  className: ' md:w-[450px] w-[250px]',
                  value: paymentedMethod[item],
                  onChange: (e: any) => {
                    setPaymentedMethod((prev) => ({ ...prev, [item]: e.target.value }));
                  },
                }}
              />
              <Button
                className="border-none bg-[white] shadow-none text-[red] mt-[10px] ml-2 "
                icon={<CloseOutlined />}
                onClick={() => {
                  const newMethods = selectedMethods.filter((method) => method !== item);
                  form.setFieldsValue({ method: newMethods });
                  setSelectedMethods(newMethods);
                }}
              />
            </div>
          ))}
          <CustomFormItem
            label="Ngày thanh toán *"
            name="paymentTime"
            formType="datepicker"
            rules={[{ required: true, message: 'Vui lòng chọn ngày thanh toán' }]}
            propsFormChildType={{
              placeholder: 'Chọn ngày thanh toán',

              format: 'DD/MM/YYYY',
              autoComplete: false,
            }}
          />

          <CustomFormItem
            label="Tổng tiền"
            name="totalAmount"
            formType="input"
            propsFormChildType={{
              placeholder: 'Nhập số tiền',
              autoComplete: false,
              disabled: true,
            }}
          />

          <CustomFormItem
            label="Trạng thái *"
            name="status"
            formType="select"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            propsFormChildType={{
              placeholder: 'Chọn trạng thái',
              options: [
                { label: 'Đã thanh toán', value: 'Đã thanh toán' },
                { label: 'Chưa thanh toán', value: 'Chưa thanh toán' },
              ],
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

export default ModalAddPayment;
