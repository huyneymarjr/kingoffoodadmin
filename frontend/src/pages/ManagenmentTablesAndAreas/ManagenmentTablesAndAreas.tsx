import { deleteAreas, getListAreas } from '@/apis/areasApi';
import { Button, Menu, message, Modal, QRCode, Segmented, Tabs } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ButtonScanQR from '@/components/ButtonScanQR';
import { useReactToPrint } from 'react-to-print';
import { deleteTables, getListTables } from '@/apis/tablesApi';
import ModalAddAreas from './Modal/ModalAddAreas';
import { EditFilled, MoreOutlined, PauseCircleFilled, PlusOutlined } from '@ant-design/icons';
import ModalAddTable from './Modal/Table/ModalAddTable';
import { useAppDispatch } from '@/stores/configureStore';
import { setBreadcrumb, setTitle } from '@/stores/slices/commonSlice';
const ManagenmentTablesAndAreas = () => {
  const [listDataAreas, setListDataAreas] = useState<AreasType[]>([]);
  const [isOpenModalAreas, setIsOpenModalAreas] = useState(false);
  const [isOpenModalTables, setIsOpenModalTables] = useState(false);
  const [areaTable, setAreaTable] = useState<any>(null);
  const [visibleMenu, setVisibleMenu] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [checkIsCallApi, setCheckIsCallApi] = useState([]);
  const dispatch = useAppDispatch();
  const fetchDataTables = async (areaId: string) => {
    try {
      const response = await getListTables({
        current: 1,
        pageSize: 20,
        areaId: areaId,
      });
      if (response.data) {
        setListDataAreas((prev) => {
          return prev.map((item) => {
            if (item._id === areaId) {
              return { ...item, tables: response?.data?.result };
            }
            return item;
          });
        });
      }
    } catch (error) {
      console.log('Failed', error);
    }
  };
  const fetchDataAreas = async () => {
    try {
      const response = await getListAreas({
        current: 1,
        pageSize: 10,
      });
      if (response.data) {
        setListDataAreas(response?.data?.result);
        setCheckIsCallApi(response?.data?.result[0]?._id);
        await fetchDataTables(response?.data?.result[0]?._id);
      }
    } catch (error) {
      console.log('Failed', error);
    }
  };

  useEffect(() => {
    fetchDataAreas();
  }, []);

  const componentRef = useRef(null);
  const handleAfterPrint = useCallback(() => {
    console.log('`onAfterPrint` called');
  }, []);

  const handleBeforePrint = useCallback(() => {
    console.log('`onBeforePrint` called');
    return Promise.resolve();
  }, []);

  const printFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Hung123',
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });
  const handlerClickQR = () => {
    printFn();
  };
  const handlerAddAres = () => {
    setIsOpenModalAreas(true);
  };

  const handleMenuClick = (key: any) => {
    setVisibleMenu((prevVisibleMenu) => (prevVisibleMenu === key ? null : key));
  };
  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: 'Home',
          path: '/',
        },
        {
          name: 'Quản lý danh sách phòng bàn',
          // path: '',
        },
        // {
        //   name: 'Tài khoản nhân viên',
        //   // path: '',
        // },
      ]),
    );
    dispatch(setTitle('Danh sách phòng bàn'));
  }, [dispatch]);

  return (
    <div className="">
      <div className="flex justify-between">
        <Tabs
          items={listDataAreas.map((item) => {
            console.log('item', item);
            return {
              key: item._id,
              label: (
                <div
                  className="flex items-center gap-2"
                  onClick={() => {
                    fetchDataTables(item._id);
                  }}
                >
                  <p>Tầng {item.areaNumber} </p>
                  <Button
                    className="border-none shadow-none !w-3"
                    icon={<MoreOutlined />}
                    onClick={() => handleMenuClick(item._id)}
                  ></Button>
                  {visibleMenu === item._id && (
                    <Menu
                      items={[
                        {
                          key: '1',
                          label: <EditFilled />,
                          onClick: () => {
                            setSelectedRecord({
                              type: 'edit',
                              data: item,
                            });
                            setIsOpenModalAreas(true);
                          },
                        },
                        {
                          key: '2',
                          label: <PauseCircleFilled />,
                          onClick: async () => {
                            Modal.confirm({
                              title: 'Xác nhận',
                              content: 'Bạn có chắc chắn muốn xóa khu vực này không?',
                              onOk: async () => {
                                await deleteAreas({ id: item._id });
                                await fetchDataAreas();
                                message.success('Xóa thành công');
                              },
                              okText: 'Xác nhận',
                              okButtonProps: {
                                danger: true,
                              },
                              cancelText: 'Huỷ',
                            });
                          },
                        },
                      ]}
                    />
                  )}
                </div>
              ),
              children: (
                <div className="flex gap-2 w-full">
                  <div
                    className=" relative border-2 rounded-xl w-[180px] h-[100px] flex justify-center items-center flex-col gap-1"
                    onClick={() => {
                      if (item.capacity === item?.tables?.length) {
                        message.warning('Số bàn đã tối đa không thể thêm bàn nữa');
                        return;
                      }
                      setIsOpenModalTables(true);
                      setAreaTable(item);
                    }}
                  >
                    <PlusOutlined />
                    Thêm bàn
                  </div>
                  <div className="flex gap-2 flex-wrap w-[100%]">
                    {item?.tables?.map((table) => (
                      <div
                        className={`relative border-2 rounded-xl w-[180px]  flex justify-center items-center flex-col gap-1 ${
                          visibleMenu === table._id ? 'h-auto' : 'h-[100px]'
                        }`}
                      >
                        {visibleMenu === table._id && (
                          <Menu
                            mode="horizontal"
                            items={[
                              {
                                key: '1',
                                label: <EditFilled />,
                                onClick: () => {
                                  setSelectedRecord({
                                    type: 'edit',
                                    data: table,
                                  });
                                  setIsOpenModalTables(true);
                                  setAreaTable(item);
                                },
                              },
                              {
                                key: '2',
                                label: <PauseCircleFilled />,
                                onClick: async () => {
                                  Modal.confirm({
                                    title: 'Xác nhận',
                                    content: 'Bạn có chắc chắn muốn xóa bàn này không?',
                                    onOk: async () => {
                                      await deleteTables({ id: table._id });
                                      await fetchDataTables(item._id);
                                      message.success('Xóa thành công');
                                    },
                                    okText: 'Xác nhận',
                                    okButtonProps: {
                                      danger: true,
                                    },
                                    cancelText: 'Huỷ',
                                  });
                                },
                              },
                            ]}
                          />
                        )}
                        <p>Bàn số {table.tableNumber}</p>
                        {/* <p>Số người: {table.capacity}</p> */}
                        <p> {table.status}</p>
                        <Button
                          className="border-none shadow-none !w-3 absolute top-2 right-2"
                          icon={<MoreOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuClick(table._id);
                          }}
                        ></Button>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            };
          })}
          className="w-[90%] mx-auto"
        />
        <Button className="mr-4" onClick={handlerAddAres}>
          Thêm khu vực
        </Button>
        {isOpenModalAreas && (
          <ModalAddAreas
            isOpenModal={isOpenModalAreas}
            setIsOpenModal={setIsOpenModalAreas}
            fetchDataAreas={fetchDataAreas}
            selectedRecord={selectedRecord}
            setSelectedRecord={setSelectedRecord}
          />
        )}
        {isOpenModalTables && (
          <ModalAddTable
            isOpenModal={isOpenModalTables}
            setIsOpenModal={setIsOpenModalTables}
            areaTable={areaTable}
            fetchDataTables={fetchDataTables}
            selectedRecord={selectedRecord}
            setSelectedRecord={setSelectedRecord}
            setAreaTable={setAreaTable}
          />
        )}
        <Button onClick={handlerClickQR}>In QR bàn</Button>
        <ButtonScanQR ref={componentRef} />
      </div>
    </div>
  );
};

export default ManagenmentTablesAndAreas;
