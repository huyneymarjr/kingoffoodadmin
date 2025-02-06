import React, { PureComponent, useEffect, useState } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { dashBoardTransactions } from '@/apis/transactionsApi';
import { dashBoardCustomer } from '@/apis/customerApi';
import useWindowSize from '@/utils/hooks/useWindowSize';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const DashBoardCustomer = ({ startDate, endDate }: any) => {
  const getWidthWindow = useWindowSize(window);
  // useEffect(() => {
  //   if (getWidthWindow.width > 1024) {
  //     dispatch(setMenu(false));
  //   }
  // }, [getWidthWindow]);
  const [dataCustomer, setdataCustomer] = useState<any>([]);

  useEffect(() => {
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
    const fetchData = async () => {
      try {
        const data = await Promise.all(
          time.map(async (item) => {
            const response = await dashBoardCustomer({
              month: item.month,
              year: item.year,
            });
            return response.data;
          }),
        );

        setdataCustomer(() => {
          return data
            .map((item) => {
              return item.result.map((item: any) => {
                return {
                  time: `${item._id.month}-${item._id.year}`,
                  type: item._id.type,
                  total: item.totalCreated,
                };
              });
            })
            .flatMap((item: any) => item);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  const assignColorsByTime = (data: any[]) => {
    const colorMap: { [key: string]: string } = {}; // Lưu màu theo `time`
    return data.map((item: any) => {
      const time = item.time;
      if (!colorMap[time]) {
        colorMap[time] = generateRandomColor(); // Gán màu mới nếu `time` chưa có
      }
      return {
        name: `${item.type} - ${item.time}`,
        value: item.total,
        color: colorMap[time],
        type: item.type,
        time: item.time,
      };
    });
  };

  const coloredData = assignColorsByTime(dataCustomer);

  const COLORCUSTOMER = coloredData.filter((item: any) => item.type == 'Khách hàng');
  const COLORSUPPLIER = coloredData.filter((item: any) => item.type == 'Nhà cung cấp');
  return (
    <>
      <div className="flex w-full flex-wrap">
        <div
          className={`${getWidthWindow.width > 1100 ? 'w-[50%]' : 'w-[100%]'}  flex flex-col justify-between`}
        >
          <ResponsiveContainer width="100%" height={400}>
            <PieChart width={200} height={200}>
              <Tooltip />
              <Pie
                data={dataCustomer
                  .filter((item: any) => item.type == 'Khách hàng')
                  ?.map((item: any) => {
                    return {
                      name: `${item.type} - ${item.time}`,
                      value: item.total,
                    };
                  })}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={180}
                fill="#8884d8"
                dataKey="value"
              >
                {dataCustomer
                  ?.filter((item: any) => item.type == 'Khách hàng')
                  .map((entry: any, index: any) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORCUSTOMER.find((item) => item.name === `${entry.type} - ${entry.time}`)?.color
                      }
                    />
                  ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center font-bold">Biểu đồ Khách hàng qua các tháng</div>
        </div>
        <div
          className={`${getWidthWindow.width > 1100 ? 'w-[50%]' : 'w-[100%]'}  flex flex-col justify-between`}
        >
          <ResponsiveContainer width="100%" height={400}>
            <PieChart width={200} height={200}>
              <Tooltip />
              <Pie
                data={dataCustomer
                  .filter((item: any) => item.type == 'Nhà cung cấp')
                  ?.map((item: any) => {
                    return {
                      name: `${item.type} - ${item.time}`,
                      value: item.total,
                    };
                  })}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={180}
                fill="#8884d8"
                dataKey="value"
              >
                {dataCustomer
                  ?.filter((item: any) => item.type == 'Nhà cung cấp')
                  .map((entry: any, index: any) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORSUPPLIER.find((item) => item.name === `${entry.type} - ${entry.time}`)?.color
                      }
                    />
                  ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center font-bold">Biểu đồ Nhà cung cấp qua các tháng</div>
        </div>
      </div>
    </>
  );
};
// Hàm tạo màu ngẫu nhiên
function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
export default DashBoardCustomer;
