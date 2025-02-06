import { assignTable } from '@/apis/tablesApi';
import { Button, Form, message, Modal } from 'antd';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import CustomFormItem from '@/components/FormInputCustom';
import { useAppDispatch } from '@/stores/configureStore';
import { setOrderBill, setSelectOrderId } from '@/stores/slices/orderMenusSlice';
import { assignTableCustomer } from '@/stores/slices/managementTableCustomSlice';
dayjs.locale('vi');
const ModalNote = ({
  isModalOpen,
  setIsModalOpen,
  tableId,
  userId,
  setActiveKey,
  tableName,
  handerSendMessageTelegram,
  typeTable,
  setTypeTable,
}: any) => {
  const disabledDate = (current: any) => {
    return current && current < dayjs().startOf('day');
  };
  const disabledTime = (current: any) => {
    if (!current) {
      return {};
    }
    const now = dayjs();
    if (current.isSame(now, 'day')) {
      // Vô hiệu hóa các thời gian trong quá khứ cho ngày hiện tại
      const hours: any = [];
      for (let i = 0; i < 24; i++) {
        if (i < now.hour()) {
          hours.push(i);
        }
      }
      const minutes: any = [];
      const currentMinute = now.minute();
      for (let i = 0; i < 60; i++) {
        if (now.hour() === current.hour() && i < currentMinute + 5) {
          minutes.push(i);
        }
      }
      return {
        disabledHours: () => hours,
        disabledMinutes: () => minutes,
      };
    }
    return {};
  };
  const dispatch = useAppDispatch();
  const [nameCustomer, setNameCustomer] = useState<string>('');
  const [emailCustomer, setEmailCustomer] = useState<string>('');
  const [phoneNumberCustomer, setPhoneNumberCustomer] = useState<string>('');
  const [time, setTime] = useState<Dayjs>(dayjs().add(5, 'minute'));
  const [form] = Form.useForm();
  const handlerOnOk = async () => {
    if (!time) {
      message.error('Vui lòng chọn thời gian đặt bàn');
      return;
    }
    const values = await form.validateFields();
    console.log('values', values);
    try {
      const response = await assignTable({
        tableId: tableId,
        bookerId: userId,
        nameCustomer: nameCustomer,
        emailCustomer: emailCustomer,
        phoneNumberCustomer: phoneNumberCustomer,
        type: typeTable,
        time: time?.format('YYYY-MM-DDTHH:mm:ss') as unknown as Date,
      });
      dispatch(
        assignTableCustomer({
          tableId: tableId,
          userId: userId,
          nameCustomer: nameCustomer,
          emailCustomer: emailCustomer,
          phoneNumberCustomer: phoneNumberCustomer,
          time: time?.format('YYYY-MM-DDTHH:mm:ss'),
          typeTable: typeTable,
        }),
      );
      dispatch(setOrderBill(response.data));
      dispatch(setSelectOrderId(response.data.order._id));

      setIsModalOpen(false);
      setTypeTable('');
      await handerSendMessageTelegram(typeTable === 'Đặt trước' ? 'đặt' : 'đã có khách');
      message.success('Đặt bàn thành công');
      setActiveKey('2');
    } catch (error) {
      message.error('Đặt bàn thất bại');
    }
  };
  const validateFields = (_: any, _value: any) => {
    const emailCustomer = form.getFieldValue('emailCustomer');
    const phoneNumberCustomer = form.getFieldValue('phoneNumberCustomer');
    if (!emailCustomer && !phoneNumberCustomer) {
      return Promise.reject(
        new Error('Vui lòng nhập ít nhất một trong hai trường: email hoặc số điện thoại'),
      );
    }
    return Promise.resolve();
  };
  const onCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <Modal title={`Đặt bàn ${tableName}`} open={isModalOpen} onCancel={onCancel} footer={null}>
      <div className="flex flex-col gap-2">
        <Form form={form} onFinish={handlerOnOk}>
          <CustomFormItem
            label="Tên khách hàng*"
            name="nameCustomer"
            formType="input"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
            propsFormChildType={{
              placeholder: 'Nhập tên khách hàng',
              autoComplete: false,
              value: nameCustomer,
              onChange: (e: any) => {
                setNameCustomer(e.target.value);
              },
            }}
          />
          <CustomFormItem
            label="Số điện thoại"
            name="phoneNumberCustomer"
            formType="input"
            rules={[
              {
                pattern: /^[0-9]*$/,
                message: 'Số điện thoại không hợp lệ vui lòng nhập số',
              },
              {
                min: 10,
                message: 'Số điện thoại phải có ít nhất 10 số',
              },
              { validator: validateFields },
            ]}
            propsFormChildType={{
              placeholder: 'Nhập số điện thoại khách hàng',
              autoComplete: false,
              value: phoneNumberCustomer,
              maxLength: 11,
              onChange: (e: any) => {
                setPhoneNumberCustomer(e.target.value);
              },
            }}
          />
          <CustomFormItem
            label="Email"
            name="emailCustomer"
            formType="input"
            rules={[{ type: 'email', message: 'Địa chỉ email không hợp lệ' }, { validator: validateFields }]}
            propsFormChildType={{
              placeholder: 'Nhập địa chỉ email khách hàng',
              autoComplete: false,
              value: emailCustomer,
              onChange: (e: any) => {
                setEmailCustomer(e.target.value);
              },
            }}
          />
          <CustomFormItem
            label="Thời gian"
            name="time"
            formType="datepicker"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian đặt bàn' }]}
            propsFormChildType={{
              placeholder: 'Chọn thời gian đặt bàn',
              autoComplete: false,
              value: time,
              onChange: (current: Dayjs) => {
                setTime(current);
              },
              showTime: { format: 'HH:mm', minuteStep: 1 },
              format: 'DD/MM/YYYY HH:mm',
              disabledDate: disabledDate,
              disabledTime: disabledTime,
            }}
          />
          <Form.Item>
            <div className="flex items-center justify-center gap-4">
              <Button className="px-10" onClick={onCancel}>
                Hủy
              </Button>
              <Button htmlType="submit" type="primary" className="px-8">
                Đặt bàn
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalNote;
