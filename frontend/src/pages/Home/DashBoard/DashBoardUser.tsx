import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Rectangle,
  Line,
  ComposedChart,
} from 'recharts';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import 'dayjs/locale/vi';
import { dashBoardUser } from '@/apis/usersApi';
import CustomTooltip from './CustomTooltip';
const { RangePicker } = DatePicker;
dayjs.locale('vi');
const DashBoardUser = ({ endDate, startDate }: any) => {
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
            const response = await dashBoardUser({
              month: item.month,
              year: item.year,
            });
            return response.data;
          }),
        );
        setDataDashBoard(() => {
          return data.map((item) => ({
            ...item,
            time: `${item.month}-${item.year}`,
          }));
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  // const disabledDate = (current: any) => {
  //   if (!startDate) {
  //     return false;
  //   }
  //   const startYear = startDate.year();
  //   return current && current.year() !== startYear;
  // };
  return (
    <div className=" w-full flex flex-col items-center justify-center">
      <div className="mt-10 w-full">
        <ResponsiveContainer width={'100%'} height={500}>
          <ComposedChart
            width={800}
            height={500}
            data={dataDashBoard}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            {/* <CartesianGrid strokeDasharray="4 10" /> */}
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            <Bar
              dataKey="totalCreated"
              fill="#8884d8"
              name="Số tài khoản được tạo"
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
            <Bar
              dataKey="totalDeleted"
              fill="#82ca9d"
              name="Số tài khoản bị xóa"
              activeBar={<Rectangle fill="gold" stroke="purple" />}
            />
            <Line
              type="monotone"
              dataKey="totalCreated"
              name="Biến thiên số tài khoản được tạo"
              stroke="#ff7300"
            />
            <Line
              type="monotone"
              dataKey="totalDeleted"
              name="Biến thiên số tài khoản bị xóa"
              stroke="black"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="text-center text-[18px] italic">Biểu đồ nhân viên của nhà hàng theo các tháng</div>
      </div>
    </div>
  );
};

export default DashBoardUser;
