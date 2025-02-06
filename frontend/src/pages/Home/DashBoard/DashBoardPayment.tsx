import { dashBoardPayment } from '@/apis/paymentsApi';
import React, { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const DashBoardPayment = ({ startDate, endDate }: any) => {
  const [dataDashBoard, setDataDashBoard] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const monthsCheck = [];
      let currentDate = startDate;
      while (currentDate <= endDate) {
        monthsCheck.push(currentDate);
        currentDate = currentDate.add(1, 'month');
      }
      const time = monthsCheck.map((month) => ({
        month: month.month() + 1,
        year: month.year(),
      }));

      try {
        const data = await Promise.all(
          time.map(async (item) => {
            const response = await dashBoardPayment({
              month: item.month,
              year: item.year,
            });
            return response.data;
          }),
        );
        setDataDashBoard(() => {
          return data.flatMap((item) => item);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [startDate, endDate]);
  const monthTotalMax = dataDashBoard?.reduce(
    (prev, current) => (prev.total > current.total ? prev : current),
    0,
  );

  return (
    <>
      <div className="w-full">
        <ResponsiveContainer width="100%" height={500}>
          <LineChart
            width={500}
            height={300}
            data={dataDashBoard.map((item) => {
              return {
                name: `${item.month}-${item.year}`,
                total: item.total,
              };
            })}
            margin={{
              top: 20,
              right: 60,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <ReferenceLine
              x={monthTotalMax.month + '-' + monthTotalMax.year}
              stroke="red"
              label="Doanh thu cao nhất"
            />
            <ReferenceLine y={monthTotalMax.total} label="Cao nhất" stroke="red" />
            <Line type="monotone" dataKey="total" name="Tổng doanh thu của tháng" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
        <div className="text-center text-[18px] italic">Biểu đồ doanh thu của nhà hàng theo các tháng</div>
      </div>
    </>
  );
};

export default DashBoardPayment;
