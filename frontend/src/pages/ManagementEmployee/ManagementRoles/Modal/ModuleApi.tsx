import { Card, Col, Collapse, Row, Tooltip } from 'antd';
import { ProFormSwitch } from '@ant-design/pro-components';
import { grey } from '@ant-design/colors';
import type { ProFormInstance } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';

const { Panel } = Collapse;

interface IProps {
  onChange?: (data: any[]) => void;
  onReset?: () => void;
  form: ProFormInstance;
  listPermissions:
    | {
        module: string;
        permissions: IPermission[];
      }[]
    | null;
}

const ModuleApi = ({ form, listPermissions }: IProps) => {
  const [checkedAll, setCheckedAll] = useState<boolean[]>([]);
  const handleSwitchAll = (value: boolean, name: string) => {
    const child = listPermissions?.find((item) => item.module === name);
    if (child) {
      child?.permissions?.forEach((item) => {
        if (item._id) form.setFieldValue(['permissions', item._id], value);
      });
      setCheckedAll((prev) => {
        const index = listPermissions?.findIndex((item) => item.module === name);
        if (index !== undefined && index !== -1) {
          const temp = [...prev];

          temp[index] = value;

          return temp;
        }
        return prev;
      });
    }
  };

  const handleSingleCheck = (value: boolean, child: string, parent: string) => {
    form.setFieldValue(['permissions', child], value);

    //check all
    const temp = listPermissions?.find((item) => item.module === parent);
    if (temp) {
      const restPermission = temp?.permissions?.filter((item) => item._id !== child);
      if (restPermission && restPermission.length) {
        const allTrue = restPermission.every((item) =>
          form.getFieldValue(['permissions', item._id as string]),
        );
        form.setFieldValue(['permissions', parent], allTrue && value);
        setCheckedAll((prev) => {
          const index = listPermissions?.findIndex((item) => item.module === parent);
          if (index !== undefined && index !== -1) {
            const temp = [...prev];
            temp[index] = allTrue && value;
            return temp;
          }
          return prev;
        });
      }
    }
  };

  useEffect(() => {
    if (listPermissions) {
      const temp = listPermissions.map((item) => {
        const restPermission = item.permissions.filter(
          (child) => form.getFieldValue(['permissions', child._id as string]) === true,
        );
        return restPermission.length === item.permissions.length;
      });
      setCheckedAll(temp);
    }
  }, []);

  return (
    // <Card size="small" bordered={false} className="border-none">
    <Collapse>
      {listPermissions?.map((item, index) => (
        <Panel
          header={<div>{item.module}</div>}
          key={index}
          forceRender //force to render form item (with collapse mode)
          extra={
            <div className={'customize-form-item'}>
              <ProFormSwitch
                name={['permissions', item.module]}
                fieldProps={{
                  checked: checkedAll[index],
                  onClick: (_u, e) => {
                    e.stopPropagation();
                  },
                  onChange: (v) => handleSwitchAll(v, item.module),
                }}
              />
            </div>
          }
        >
          <Row gutter={[16, 16]}>
            {item.permissions?.map((value, i: number) => (
              <Col lg={12} md={12} sm={24} key={i}>
                <Card
                  size="small"
                  bodyStyle={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'row',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <ProFormSwitch
                      name={['permissions', value._id as string]}
                      fieldProps={{
                        defaultChecked: false,
                        onChange: (v) => handleSingleCheck(v, value._id as string, item.module),
                      }}
                    />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Tooltip title={value?.name}>
                      <p
                        style={{
                          paddingLeft: 10,
                          marginBottom: 3,
                        }}
                      >
                        {value?.name || ''}
                      </p>
                      <div style={{ display: 'flex' }}>
                        <p
                          style={{
                            paddingLeft: 10,
                            fontWeight: 'bold',
                            marginBottom: 0,
                          }}
                        >
                          {value?.method || ''}
                        </p>
                        <p
                          style={{
                            paddingLeft: 10,
                            marginBottom: 0,
                            color: grey[5],
                          }}
                        >
                          {value?.apiPath || ''}
                        </p>
                      </div>
                    </Tooltip>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Panel>
      ))}
    </Collapse>
    // </Card>
  );
};

export default ModuleApi;
