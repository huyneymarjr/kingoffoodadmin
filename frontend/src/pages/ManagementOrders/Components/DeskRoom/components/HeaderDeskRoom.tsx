import { getListAreas } from '@/apis/areasApi';
import { Segmented } from 'antd';
import { useEffect, useState } from 'react';

const HeaderDeskRoom = ({ floor, setFloor }: any) => {
  const [listFloor, setListFloor] = useState<any[]>([]);
  const fetchlistFloor = async () => {
    try {
      const response = await getListAreas({
        current: 1,
        pageSize: 10,
      });
      if (response.data) {
        setListFloor(response.data.result);
        setFloor(response.data.result[0]?._id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchlistFloor();
  }, []);
  return (
    <Segmented
      options={listFloor.map((item) => {
        return {
          label: `Tầng ${item.areaNumber}`,
          value: item._id,
        };
      })}
      onChange={(value) => {
        setFloor(value);
      }}
      value={floor || ''}
    />
  );
};

export default HeaderDeskRoom;
