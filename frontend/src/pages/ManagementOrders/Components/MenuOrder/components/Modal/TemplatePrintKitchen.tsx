import { Table } from 'antd';

const TemplatePrintKitchen = ({ orderBill, listSelected }: { orderBill: any; listSelected: boolean[] }) => {
  const columns = [
    {
      title: 'Tên món ăn',
      dataIndex: 'name',
      key: 'name',
      render: (text: any, record: any) => {
        return (
          <div>
            {text}({record.unit})
          </div>
        );
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
  ];

  return (
    <div>
      <div className="print:text-[red] print:block hidden">
        Đây là món ăn bếp phải in cho Bàn số {orderBill?.table?.tableNumber || ''} Tầng{' '}
        {orderBill?.table?.areaNumber?.areaNumber || ''}
      </div>
      <Table
        className="print:block hidden"
        columns={columns}
        dataSource={orderBill?.order?.orderdetails?.filter((_item: any, index: number) => {
          return listSelected[index];
        })}
        pagination={false}
      />
    </div>
  );
};

export default TemplatePrintKitchen;
