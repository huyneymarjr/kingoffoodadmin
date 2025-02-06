import React, { useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Button, Form, message } from 'antd';
import { useAppDispatch } from '@/stores/configureStore';
import { setBreadcrumb, setTitle } from '@/stores/slices/commonSlice';

const ContactUs = () => {
  const formRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const sendEmail = (e: any) => {
    e.preventDefault();

    emailjs
      .sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        formRef.current as HTMLFormElement,
        {
          publicKey: import.meta.env.VITE_PUBLIC_KEY,
        },
      )
      .then(
        () => {
          console.log('SUCCESS!');
          message.success('Gửi góp ý thành công,cảm ơn bạn rất nhiều!');
          formRef.current.reset();
        },
        (error) => {
          console.log('FAILED...', error.text);
          message.error('Gửi góp ý thất bại!');
        },
      );
  };

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: 'Home',
          path: '/',
        },
        {
          name: 'Góp ý',
          // path: '#',
        },
      ]),
    );
    dispatch(setTitle('Đóng góp ý kiến'));
  }, [dispatch]);
  return (
    <>
      <form
        ref={formRef}
        onSubmit={sendEmail}
        className="flex flex-col gap-4 p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg"
      >
        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-semibold">Tên của bạn:</label>
          <input
            type="text"
            name="to_name"
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Nhập tên của bạn"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-semibold">Email:</label>
          <input
            type="email"
            name="from_name"
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Nhập email của bạn"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-semibold">Góp ý:</label>
          <textarea
            name="message"
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            rows={4}
            placeholder="Viết góp ý của bạn"
          />
        </div>
        <input
          type="submit"
          value="Gửi"
          className="bg-blue-500 text-white p-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-all duration-300"
        />
      </form>
      <div className="w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8805173578226!2d105.78078761196184!3d21.037466280533177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab355cc2239b%3A0x9ae247114fb38da3!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBTxrAgUGjhuqFtIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1732369241595!5m2!1svi!2s"
          // width="600"
          width={'100%'}
          height="450"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy={'no-referrer-when-downgrade'}
        ></iframe>
      </div>
    </>
  );
};
export default ContactUs;
