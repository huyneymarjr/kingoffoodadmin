import { dashBoardPayment } from '@/apis/paymentsApi';
import { dashBoardTransactions } from '@/apis/transactionsApi';
import React, { useEffect, useState } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const DashBoardTransaction = ({ startDate, endDate }: any) => {
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
        // const data = await Promise.all(
        //   time.map(async (item) => {
        //     const response = await dashBoardPayment({
        //       month: item.month,
        //       year: item.year,
        //     });
        //     return response.data;
        //   }),
        // );
        const data = await Promise.all(
          time.map(async (item) => {
            const response = await dashBoardTransactions({
              month: item.month,
              year: item.year,
            });
            return response.data;
          }),
        );
        setDataDashBoard(() => {
          return data.flatMap((item) => {
            return {
              ...item,
              profit: item.sumTypeExportMoney - item.sumTypeImportMoney,
            };
          });
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [startDate, endDate]);
  console.log('dataDashBoard', dataDashBoard);
  return (
    <>
      <div className="w-full">
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart
            width={500}
            height={300}
            data={dataDashBoard.map((item) => {
              return {
                ...item,
                name: `${item.month}-${item.year}`,
                //  lãi xuất
                profit: item.sumTypeExportMoney - item.sumTypeImportMoney,
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
            <Area type="monotone" dataKey="profit" name="Lãi xuất" stroke="#8884d8" fill="#8884d8" />
            <Line type="monotone" dataKey="sumTypeExportMoney" name="Tổng doanh thu xuất" stroke="#82ca9d" />
            <Line type="monotone" dataKey="sumTypeImportMoney" name="Tổng doanh thu nhập" stroke="#8884d8" />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="text-center text-[18px] italic">
          Biểu đồ doanh thu xuất nhập của nhà hàng theo các tháng
        </div>
      </div>
    </>
  );
};

export default DashBoardTransaction;
