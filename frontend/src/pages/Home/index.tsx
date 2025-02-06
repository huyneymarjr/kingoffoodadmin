import { setBreadcrumb, setTitle } from '@/stores/slices/commonSlice';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import DashBoardUser from './DashBoard/DashBoardUser';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import 'dayjs/locale/vi';
import { useAppSelector } from '@/stores/configureStore';
import { useNavigate } from 'react-router';
import { ROLES } from '@/utils/constants/role';
import DashBoardCustomer from './DashBoard/DashBoardCustomer';
import DashBoardPayment from './DashBoard/DashBoardPayment';
import DashBoardTransaction from './DashBoard/DashBoardTransaction';

const { RangePicker } = DatePicker;
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: 'Trang chủ',
          path: '/',
        },
        {
          name: 'Tổng quan',
          // path: '',
        },
      ]),
    );
    dispatch(setTitle('Tổng quan'));
  }, [dispatch]);
  const [startDate, setStartDate] = useState(dayjs().subtract(4, 'month'));
  const [endDate, setEndDate] = useState(dayjs().add(0, 'month'));
  const render = () => {
    if (user?.role?._id == ROLES.ADMIN) {
      return (
        <div className="relative flex flex-col justify-center items-center w-full">
          <RangePicker
            picker="month"
            value={[startDate, endDate]}
            format={'MM/YYYY'}
            onChange={(dates) => {
              if (dates) {
                setStartDate(dates[0]!);
                setEndDate(dates[1]!);
              }
            }}
            // disabledDate={disabledDate}
            className="absolute top-0 right-0"
          />

          <DashBoardUser startDate={startDate} endDate={endDate} />
          <DashBoardTransaction startDate={startDate} endDate={endDate} />
          <DashBoardPayment startDate={startDate} endDate={endDate} />
          <DashBoardCustomer startDate={startDate} endDate={endDate} />
        </div>
      );
    } else {
      navigate('dat-mon');
    }
  };
  return render();
};

export default Home;
