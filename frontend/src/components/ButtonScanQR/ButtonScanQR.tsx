import { QRCode } from 'antd';
import React from 'react';

import bgr_remove_logo_black from '/assets/images/bgr_remove_logo_black.png';
const ButtonScanQR = (_props: any, ref: any) => {
  return (
    <div>
      <div className="w-full h-full" ref={ref}>
        <div className="print:text-[red] print:block hidden">Mã QR của bàn</div>
        <QRCode
          className="print:block hidden print:!w-[100%] print:!h-[100%]"
          errorLevel="H"
          value="https://firebasestorage.googleapis.com/v0/b/locketproject.appspot.com/o/9f9700b8-143f-40e1-8364-1b94012a2749?alt=media&token=99aa4442-d3b3-4ba5-8bb4-f8280b25924e"
          icon={bgr_remove_logo_black}
        />
      </div>
    </div>
  );
};

export default React.forwardRef<HTMLDivElement>(ButtonScanQR);
