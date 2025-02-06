import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Col, Form, Row, message, notification } from 'antd';
import { getModules } from '@/apis/auth';
import { callCreatePermission, callUpdatePermission } from '@/apis/role';
import { useEffect, useState } from 'react';

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  dataInit?: IPermission | null;
  setDataInit: (v: any) => void;
  reloadTable: () => void;
}

const ModalPermission = (props: IProps) => {
  const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
  const [form] = Form.useForm();
  const [modules, setModules] = useState<any>({});
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await getModules();
        if (response.data) {
          setModules(response.data);
        }
      } catch (error) {
        console.log('Failed:', error);
      }
    };
    fetchModules();
  }, []);
  const submitPermission = async (valuesForm: any) => {
    const { name, apiPath, method, module } = valuesForm;
    if (dataInit?._id) {
      //update
      const permission = {
        name,
        apiPath,
        method,
        module,
      };
      try {
        const res = await callUpdatePermission(permission, dataInit._id);
        if (res.data) {
          message.success('Cập nhật quyền hạn thành công');
          handleReset();
          reloadTable();
        }
      } catch (error) {
        console.log('Failed:', error);
      }
    } else {
      //create
      const permission = {
        name,
        apiPath,
        method,
        module,
      };
      try {
        const res = await callCreatePermission(permission);
        if (res.data) {
          message.success('Thêm mới quyền hạn mới thành công');
          handleReset();
          reloadTable();
        }
      } catch (error) {
        console.log('Failed:', error);
      }
    }
  };

  const handleReset = async () => {
    form.resetFields();
    setDataInit(null);
    setOpenModal(false);
  };

  return (
    <>
      <ModalForm
        title={<>{dataInit?._id ? 'Cập nhật quyền hạn' : 'Tạo mới quyền hạn'}</>}
        open={openModal}
        modalProps={{
          onCancel: () => {
            handleReset();
          },
          afterClose: () => handleReset(),
          destroyOnClose: true,
          width: '100%',
          keyboard: false,
          maskClosable: false,
          okText: <>{dataInit?._id ? 'Cập nhật' : 'Tạo mới'}</>,
          cancelText: 'Hủy',
        }}
        scrollToFirstError={true}
        preserve={false}
        form={form}
        onFinish={submitPermission}
        initialValues={dataInit?._id ? dataInit : {}}
      >
        <Row gutter={16}>
          <Col lg={12} md={12} sm={24} xs={24}>
            <ProFormText
              label="Tên quyền hạn"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng không bỏ trống tên quyền hạn',
                },
              ]}
              placeholder="Nhập tên quyền hạn"
            />
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <ProFormText
              label="API Path"
              name="apiPath"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng không bỏ trống',
                },
              ]}
              placeholder="Nhập path"
            />
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <ProFormSelect
              name="method"
              label="Phương thức"
              valueEnum={{
                GET: 'GET',
                POST: 'POST',
                PUT: 'PUT',
                PATCH: 'PATCH',
                DELETE: 'DELETE',
              }}
              placeholder="Vui lòng chọn phương thức"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn phương thức!',
                },
              ]}
            />
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <ProFormSelect
              name="module"
              label="Thuộc Module"
              valueEnum={{ ...modules, AUTH: 'AUTH' }}
              placeholder="Please select a module"
              rules={[{ required: true, message: 'Vui lòng chọn module!' }]}
            />
          </Col>
        </Row>
      </ModalForm>
    </>
  );
};

export default ModalPermission;
