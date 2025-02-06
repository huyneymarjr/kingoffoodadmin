import CustomFormItem from '@/components/FormInputCustom';
import { Button, Form, message, Modal, Radio, Switch } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { addTransactions, updateTransactions } from '@/apis/transactionsApi';
import { addNewDataTransactions, updateDataTransactions } from '@/stores/slices/managementTransactionsSlice';
import { getListInventories } from '@/apis/inventoriesApi';
import { listCustomerSupplier } from '@/apis/customerApi';

interface ModalAddPromotionProps {
  isOpenModal: boolean;
  setIsOpenModal: (value: boolean) => void;
  selectedRecord: any;
  setSelectedRecord: any;
  fetchDataTransactions: any;
}
const ModalAddPromotion: FC<ModalAddPromotionProps> = ({
  isOpenModal,
  setIsOpenModal,
  selectedRecord,
  setSelectedRecord,
  fetchDataTransactions,
}) => {
  const [status, setStatus] = useState(false);
  const dispatch = useDispatch();
  const [page, setPage] = useState({ pageIndex: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [dataOption, setDataOption] = useState<any[]>([]);
  const [listSupplier, setListSupplier] = useState<any[]>([]);
  const [type, setType] = useState('');
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getListInventories({
        current: page.pageIndex,
        pageSize: page.pageSize,
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
    } finally {
      setLoading(false);
    }
  };
  const fetchListDataSupplier = async () => {
    try {
      const response = await listCustomerSupplier();
      setListSupplier(response.data);
    } catch (error) {
      console.log('Failed', error);
    }
  };
  useEffect(() => {
    fetchListDataSupplier();
  }, []);
  useEffect(() => {
    if (page) fetchData();
  }, [page]);
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
      try {
        const response = await updateTransactions(
          {
            id: selectedRecord?.data._id,
          },
          {
            inventoryId: values.name,
            customerId: values.type === 'Nhập' ? values.customerId : null,
            type: values.type,
            quantity: Number(values.quantity),
          },
        );
        if (response.data) {
          // dispatch(
          //   updateDataTransactions({
          //     _id: selectedRecord?.data._id,
          //     inventoryId: values.name,
          //     type: values.type,
          //     quantity: Number(values.quantity),
          //   }),
          // );
          await fetchDataTransactions();
          message.success('Chỉnh sửa giao dịch thành công');
          setIsOpenModal(false);
          form.resetFields();
          setStatus(false);
        }
      } catch (error: any) {
        message.error(error?.response?.data?.message || 'Chỉnh sửa giao dịch thất bại');
      }

      return;
    } else {
      try {
        const response = await addTransactions({
          inventoryId: values.name,
          customerId: values.type === 'Nhập' ? values.customerId : null,
          type: values.type,
          quantity: Number(values.quantity),
        });
        if (response.data) {
          // dispatch(addNewDataTransactions(response.data));
          await fetchDataTransactions();
          message.success('Thêm mới giao dịch thành công');
          setIsOpenModal(false);
          form.resetFields();
          setStatus(false);
        }
      } catch (error: any) {
        message.error(error?.response?.data?.message || 'Thêm mới giao dịch thất bại');
      }
    }
  };
  useEffect(() => {
    if (selectedRecord?.data) {
      form.setFieldsValue({
        name: selectedRecord?.data.inventoryId,
        type: selectedRecord?.data.type,
        quantity: selectedRecord?.data.quantity,
        customerId: selectedRecord?.data.customerId,
      });
    }
    setType(selectedRecord?.data?.type);
  }, [selectedRecord]);
  const handlePopupScroll = (e: any) => {
    const { target } = e;
    if (page.pageIndex * page.pageSize >= total) return;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      setPage((prevPage) => {
        return { ...prevPage, pageIndex: prevPage.pageIndex + 1 };
      });
    }
  };
  return (
    <Modal
      open={isOpenModal}
      onCancel={onCancel}
      onOk={onOk}
      title={
        selectedRecord?.type == 'view'
          ? 'Xem chi tiết giao dịch'
          : selectedRecord?.type === 'edit'
          ? 'Chỉnh sửa giao dịch'
          : 'Thêm mới giao dịch'
      }
      footer={null}
    >
      <div>
        <Form layout="vertical" form={form} onFinish={onOk}>
          <CustomFormItem
            label="Sản phẩm *"
            name="name"
            formType="select"
            rules={[{ required: true, message: 'Vui lòng chọn sản phẩm giao dịch' }]}
            propsFormChildType={{
              placeholder: 'Vui lòng chọn sản phẩm giao dịch',
              autoComplete: false,
              options: dataOption.map((item: any) => ({
                label: item.name,
                value: item._id,
              })),
              onPopupScroll: handlePopupScroll,
              loading: loading,
            }}
          />
          <CustomFormItem
            label="Kiểu giao dịch *"
            name="type"
            formType="select"
            rules={[{ required: true, message: 'Vui lòng chọn Kiểu giao dịch' }]}
            propsFormChildType={{
              placeholder: 'Vui lòng chọn Kiểu giao dịch',
              autoComplete: false,
              options: [
                { label: 'Nhập kho', value: 'Nhập' },
                { label: 'Xuất kho', value: 'Xuất' },
              ],
              value: type,
              onChange: (value: string) => {
                setType(value);
              },
            }}
          />
          {/* nếu nhập kho thì sẽ có nhà cung cấp */}
          {type === 'Nhập' && (
            <CustomFormItem
              label="Nhà cung cấp*"
              name="customerId"
              formType="select"
              rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}
              propsFormChildType={{
                placeholder: 'Vui lòng chọn nhà cung cấp',
                autoComplete: false,
                options: listSupplier?.map((item: any) => ({
                  label: item.name,
                  value: item._id,
                })),
              }}
            />
          )}

          <CustomFormItem
            label="Số lượng *"
            name="quantity"
            formType="input"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng sản phẩm' },
              {
                pattern: /^[0-9]*$/,
                message: 'Số lượng không hợp lệ',
              },
            ]}
            propsFormChildType={{
              placeholder: 'Nhập số lượng sản phẩm',
              autoComplete: false,
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

export default ModalAddPromotion;
