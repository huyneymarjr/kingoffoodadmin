import {
  FooterToolbar,
  ModalForm,
  ProCard,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Col, Form, Row, message, notification } from 'antd';
import { CheckSquareOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/configureStore';
import { callCreateRole, callFetchPermission, callFetchRoleById, callUpdateRole } from '@/apis/role';
import ModuleApi from './ModuleApi';

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  reloadTable: () => void;
  selectedRecord?: any;
  setSelectedRecord?: any;
}

const ModalRole = ({ openModal, setOpenModal, reloadTable, selectedRecord, setSelectedRecord }: IProps) => {
  const [page, setPage] = useState({ pageIndex: 1, pageSize: 100 });
  const [total, setTotal] = useState(0);
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const [listPermissions, setListPermissions] = useState<
    | {
        module: string;
        permissions: IPermission[];
      }[]
    | null
  >(null);

  const groupByPermission = (data: any) => {
    const result = data.reduce((acc: any, item: any) => {
      const index = acc.findIndex((x: any) => {
        return x.module === item.module;
      });

      if (index !== -1) {
        acc[index].permissions.push(item);
      } else {
        acc.push({ module: item.module, permissions: [item] });
      }
      return acc;
    }, []);
    return result;
  };

  useEffect(() => {
    const init = async () => {
      const res = await callFetchPermission({
        current: page.pageIndex,
        pageSize: page.pageSize,
      });
      if (res.data?.result) {
        setListPermissions(groupByPermission(res.data?.result));
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (listPermissions?.length && selectedRecord?._id) {
      form.setFieldsValue({
        name: selectedRecord.name,
        isActive: selectedRecord.isActive,
        description: selectedRecord.description,
      });
      const permissions = selectedRecord.permissions;
      const obj: any = {};
      permissions?.forEach((item: any) => {
        obj[item] = true;
      });
      form.setFieldsValue({
        permissions: obj,
      });
    }
  }, [listPermissions, selectedRecord]);

  const submitRole = async (valuesForm: any) => {
    const { description, isActive, name, permissions } = valuesForm;
    const checkedPermissions = [];

    if (permissions) {
      for (const key in permissions) {
        if (key.match(/^[0-9a-fA-F]{24}$/) && permissions[key] === true) {
          checkedPermissions.push(key);
        }
      }
    }

    if (selectedRecord?._id) {
      //update
      const role = {
        name,
        description,
        isActive,
        permissions: checkedPermissions,
      };
      try {
        const res = await callUpdateRole(role, selectedRecord._id);
        if (res.data) {
          message.success('Cập nhật role thành công');
          handleReset();
          reloadTable();
        }
      } catch (error) {
        console.log('Error', error);
      }
    } else {
      //create
      const role = {
        name,
        description,
        isActive,
        permissions: checkedPermissions,
      };
      try {
        const res = await callCreateRole(role);
        if (res.data) {
          message.success('Thêm mới role thành công');
          handleReset();
          reloadTable();
        }
      } catch (error) {
        console.log('Error', error);
      }
    }
  };

  const handleReset = async () => {
    form.resetFields();
    setOpenModal(false);
    setSelectedRecord(null);
  };
  return (
    <>
      <ModalForm
        title={<>{selectedRecord ? 'Cập nhật vai trò' : 'Tạo mới vai trò'}</>}
        open={openModal}
        modalProps={{
          onCancel: () => {
            handleReset();
          },
          afterClose: () => handleReset(),
          destroyOnClose: true,
          width: 800,
          keyboard: false,
          maskClosable: false,
          centered: true,
        }}
        scrollToFirstError={true}
        preserve={false}
        form={form}
        onFinish={submitRole}
        submitter={{
          submitButtonProps: {
            icon: <CheckSquareOutlined />,
          },
          searchConfig: {
            resetText: 'Hủy',
            submitText: <>{selectedRecord?._id ? 'Cập nhật' : 'Tạo mới'}</>,
          },
        }}
      >
        <Row gutter={16}>
          <Col lg={12} md={12} sm={24} xs={24}>
            <ProFormText
              label="Tên vai trò"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng không bỏ trống tên vai trò',
                },
              ]}
              placeholder="Nhập tên vai trò"
            />
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <ProFormSwitch
              label="Trạng thái"
              name="isActive"
              checkedChildren="Hoạt động"
              unCheckedChildren="Không hoạt động"
              initialValue={true}
              fieldProps={{
                defaultChecked: true,
              }}
            />
          </Col>

          <Col span={24}>
            <ProFormTextArea
              label="Miêu tả"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng không bỏ trống miêu tả',
                },
              ]}
              placeholder="Nhập miêu tả vai trò"
              fieldProps={{
                autoSize: { minRows: 2 },
              }}
            />
          </Col>
          <Col span={24}>
            <ProCard
              title="Quyền hạn"
              subTitle="Các quyền hạn được phép cho vai trò này"
              headStyle={{ color: '#d81921' }}
              style={{ marginBottom: 20 }}
              headerBordered
              size="small"
              bordered
            >
              <ModuleApi form={form} listPermissions={listPermissions} />
            </ProCard>
          </Col>
        </Row>
      </ModalForm>
    </>
  );
};

export default ModalRole;
