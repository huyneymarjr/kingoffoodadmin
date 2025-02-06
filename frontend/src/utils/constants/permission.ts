export const PERMISSIONS = {
  //Permissions
  TAO_VAI_TRO: '648ad613dafdb9754f40b89a', // tạo vai trò
  XOA_VAI_TRO: '648ad650dafdb9754f40b8b0', // xóa vai trò
  LAY_VAI_TRO_THEO_ID: '648ad630dafdb9754f40b8a6', // lấy vai trò theo ID
  LAY_VAI_TRO_CO_PHAN_TRANG: '648ad622dafdb9754f40b89f', // lấy vai trò (phân trang)
  CAP_NHAT_VAI_TRO: '648ad640dafdb9754f40b8ab', // cập nhật vai trò

  // Areas
  TAO_KHU_VUC: '670ced8512541b763fa76321', // tạo khu vực
  XOA_KHU_VUC: '670ced5612541b763fa7631c', // xóa khu vực
  CAP_NHAT_KHU_VUC: '670cebc612541b763fa76317', // cập nhật khu vực

  //Promotions
  TAO_KHUYEN_MAI: '66f6b7398507e38f12ff813d', // tạo khuyến mãi
  XOA_KHUYEN_MAI: '66f6c65200447dc330845ba5', // xóa khuyến mãi
  CAP_NHAT_KHUYEN_MAI: '670ce86b12541b763fa76243', // cập nhật khuyến mãi

  //Users
  TAO_NGUOI_DUNG: '648ab6d3fa16b294212e4033', // tạo người dùng
  LAY_NGUOI_DUNG_THEO_ID: '648ab6e7fa16b294212e4038', // lấy người dùng theo ID
  LAY_NGUOI_DUNG_CO_PHAN_TRANG: '648ab6fdfa16b294212e403d', // lấy người dùng (phân trang)
  XOA_NGUOI_DUNG: '648ab728fa16b294212e4047', // xóa người dùng
  CAP_NHAT_NGUOI_DUNG: '67137702637a84678b2915dd', // cập nhật người dùng
  KHOI_PHUC: '6732afafc897b864565609d1', // khôi phục dữ liệu // khôi phục người dùng

  //Categories
  TAO_DANH_MUC: '670922f4be1afc62d865faf5', // tạo danh mục
  XOA_DANH_MUC: '670cea9712541b763fa762bc', // xóa danh mục
  CAP_NHAT_DANH_MUC: '670cea8312541b763fa762b7', // cập nhật danh mục

  //Customers
  TAO_KHACH_HANG: '66fbfa10dd5e7cb9925301c7', // tạo khách hàng
  XOA_KHACH_HANG: '670ce9b512541b763fa76294', // xóa khách hàng
  CAP_NHAT_KHACH_HANG: '670ce9a312541b763fa7628f', // cập nhật khách hàng

  // menus
  TAO_THUC_DON: '670921debe1afc62d865faed', // tạo thực đơn
  XOA_THUC_DON: '670cea5712541b763fa762ad', // xóa thực đơn
  CAP_NHAT_THUC_DON: '670cea6412541b763fa762b2', // cập nhật thực đơn

  //inventories
  TAO_KHO: '66fa5a47082dc2edf5efaac8', // tạo kho
  XOA_KHO: '670ce95612541b763fa76285', // xóa kho
  CAP_NHAT_KHO: '670ce96712541b763fa7628a', // cập nhật kho

  // orderDetails
  TAO_CHI_TIET_DON_HANG: '670a42ee4c1e277c0fa090e3', // tạo chi tiết đơn hàng
  XOA_CHI_TIET_DON_HANG: '670ceadc12541b763fa762d9', // xóa chi tiết đơn hàng
  CAP_NHAT_CHI_TIET_DON_HANG: '670ceaf212541b763fa762de', // cập nhật chi tiết đơn hàng

  //Orders
  TAO_DON_HANG: '67089225cc90c501132eded4', // tạo đơn hàng
  XOA_DON_HANG: '670cea3512541b763fa762a8', // xóa đơn hàng
  CAP_NHAT_DON_HANG: '670cea2712541b763fa762a3', // cập nhật đơn hàng

  //payments
  TAO_THANH_TOAN: '670cedc312541b763fa76346', // tạo thanh toán
  XOA_THANH_TOAN: '670cedec12541b763fa7634f', // xóa thanh toán
  CAP_NHAT_THANH_TOAN: '670cedf912541b763fa76354', // cập nhật thanh toán

  //permission

  TAO_QUYEN: '648ad59adafdb9754f40b881', // tạo quyền
  XOA_QUYEN: '648ad5ebdafdb9754f40b895', // xóa quyền
  LAY_QUYEN_CO_PHAN_TRANG: '648ad5aedafdb9754f40b886', // lấy quyền (phân trang)
  LAY_QUYEN_THEO_ID: '648ad5c5dafdb9754f40b88b', // lấy quyền theo ID
  CAP_NHAT_QUYEN: '648ad5d4dafdb9754f40b890', // cập nhật quyền

  // transaction
  TAO_GIAO_DICH: '66fe5010b71e34738c48e4bb', // tạo giao dịch
  XOA_GIAO_DICH: '670ce9e712541b763fa76299', // xóa giao dịch
  CAP_NHAT_GIAO_DICH: '670cea0012541b763fa7629e', // cập nhật giao dịch

  // tables
  TAO_BAN: '66f9574569603a430fb03386', // tạo bàn (trong nhà hàng/quán ăn)
  CAP_NHAT_BAN: '670ce90712541b763fa7627b', // cập nhật bàn
  XOA_BAN: '670ce92012541b763fa76280', // xóa bàn
  GAN_KHACH_HANG_VAO_BAN: '672663da64b5f674e6343e50', // gán khách hàng //assign-customer
  CHUYEN_BAN: '6728f286271d4b637c0553b8', // chuyển bàn

  TAI_LEN_MOT_FILE: '648ab750fa16b294212e404c', // tải lên một file
  GIAO_DICH_DASHBOARD: '671fc54a4112ec5fda92329a', // dashboard giao dịch
  NGUOI_DUNG_DASHBOARD: '671fa047d9dfbcafefc63bf8', // dashboard người dùng
  QUEN_MAT_KHAU: '6732c668bc7e64f50b1a0949', // quên mật khẩu
  LAY_DANH_SACH_MODULE: '67272f42da649ab8d533c293', // lấy danh sách module
  XAC_NHAN_EMAIL: '6732c64cbc7e64f50b1a093b', // xác nhận email

  //   XOA_CONG_TY: '648ab4ebf4328bd3153ee220', // xóa công ty
  //   XOA_CONG_VIEC: '648ad4d9dafdb9754f40b85e', // xóa công việc
  //   XOA_SO_YEU_LY_LICH: '648ad53bdafdb9754f40b872', // xóa sơ yếu lý lịch
  //   LAY_SO_YEU_LY_LICH_CO_PHAN_TRANG: '648ad511dafdb9754f40b868', // lấy sơ yếu lý lịch (phân trang)
  //   LAY_SO_YEU_LY_LICH_THEO_NGUOI_DUNG: '648ad56ddafdb9754f40b87c', // lấy sơ yếu lý lịch theo người dùng
  //   LAY_CONG_TY_THEO_ID: '648ab5a8072f2a2ef910638d', // lấy công ty theo ID
  //   LAY_CONG_TY_CO_PHAN_TRANG: '648ab415f4328bd3153ee211', // lấy công ty (phân trang)
  //   LAY_CONG_VIEC_CO_PHAN_TRANG: '648ad4ccdafdb9754f40b859', // lấy công việc (phân trang)
  //   LAY_CONG_VIEC_THEO_ID: '648ad499dafdb9754f40b84b', // lấy công việc theo ID
  //   LAY_SO_YEU_LY_LICH_THEO_ID: '648ad522dafdb9754f40b86d', // lấy sơ yếu lý lịch theo ID
  //   CAP_NHAT_CONG_TY: '648ab4d5f4328bd3153ee21b', // cập nhật công ty
  //   CAP_NHAT_CONG_VIEC: '648ad4a6dafdb9754f40b850', // cập nhật công việc
  //   CAP_NHAT_TRANG_THAI_SO_YEU_LY_LICH: '648ad555dafdb9754f40b877', // cập nhật trạng thái sơ yếu lý lịch
  //   TAO_CONG_TY: '648ab436f4328bd3153ee216', // tạo công ty
  //   TAO_CONG_VIEC: '648ad488dafdb9754f40b846', // tạo công việc
  //   TAO_SO_YEU_LY_LICH: '648ad4fedafdb9754f40b863', // tạo sơ yếu lý lịch
};
