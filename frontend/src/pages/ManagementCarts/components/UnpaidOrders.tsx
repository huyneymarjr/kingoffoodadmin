import TableCustom from './TableCustom';

const UnpaidOrder = ({ startDate, endDate }: any) => {
  return <TableCustom type={2} startDate={startDate} endDate={endDate} />;
};

export default UnpaidOrder;
