import TableCustom from './TableCustom';

const ConfirmedOrders = ({ startDate, endDate }: any) => {
  return <TableCustom type={3} startDate={startDate} endDate={endDate} />;
};

export default ConfirmedOrders;
