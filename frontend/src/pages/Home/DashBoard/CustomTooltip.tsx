const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const barData = payload.filter(
      (item: any) => item.name === 'Số tài khoản được tạo' || item.name === 'Số tài khoản bị xóa',
    );
    if (barData.length) {
      return (
        <div className="bg-white p-2 rounded shadow-lg">
          <p className="font-bold text-gray-700">{`Thời gian: ${label}`}</p>
          {barData.map((item: any) => (
            <p key={item.dataKey} className="text-sm" style={{ color: item.color }}>
              {`${item.name}: ${item.value}`}
            </p>
          ))}
        </div>
      );
    }
  }

  return null;
};

export default CustomTooltip;
