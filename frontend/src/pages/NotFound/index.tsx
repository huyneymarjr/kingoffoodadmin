import { Button, Result } from 'antd';
import { useNavigate } from 'react-router';

const NotFoundScreen = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Trang bạn truy cập không tồn tại"
      extra={
        <Button
          type="primary"
          onClick={() => {
            navigate('/');
          }}
        >
          Trang chủ
        </Button>
      }
    />
  );
};

export default NotFoundScreen;
