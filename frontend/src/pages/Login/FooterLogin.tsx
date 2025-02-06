import { GlobalOutlined, PhoneOutlined } from '@ant-design/icons';

const FooterLogin = () => {
  return (
    <div className="flex text-white md:justify-evenly md:gap-0 gap-3 items-center bg-black  w-full p-5 flex-wrap mt-5">
      <div className="flex flex-col gap-3">
        <p className="uppercase font-bold md:text-[18px] text-[16px]">Công ty cổ phần công nghệ 5 TV</p>
        <p className="flex gap-2">
          <PhoneOutlined />
          <div>0968327160 (từ 8h00 đến 22h00 hằng ngày)</div>
        </p>
        <p className="flex gap-2">
          <GlobalOutlined />
          <div> http://localhost:5173/login</div>
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <p className="uppercase font-bold md:text-[18px] text-[16px]">Chính sách & điều khoản sử dụng</p>
        <p>Chính sách bảo mật thông tin</p>
        <p>Thỏa thuận quyền sử dụng</p>
      </div>
      <div className="flex flex-col gap-3">
        <p className="uppercase font-bold md:text-[18px] text-[16px]">Liên hệ</p>
        <a href="https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+H%E1%BB%8Dc+S%C6%B0+Ph%E1%BA%A1m+H%C3%A0+N%E1%BB%99i/@21.0374713,105.7807876,17z/data=!3m1!4b1!4m6!3m5!1s0x3135ab355cc2239b:0x9ae247114fb38da3!8m2!3d21.0374663!4d105.7833679!16s%2Fm%2F03qp6jc?entry=ttu&g_ep=EgoyMDI0MTExOS4yIKXMDSoASAFQAw%3D%3D">
          Trụ sở: Đại học Sư phạm Hà Nội
        </a>
        <p>Email:hunglaiyen2k3@gmail.com </p>
      </div>
    </div>
  );
};

export default FooterLogin;
