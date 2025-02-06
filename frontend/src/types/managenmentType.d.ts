interface EmployeeType {
  id: string;
  name: string;
  phoneNumber: number;
  email: string;
  password: string;
  address: string;
  role: string;
}

interface UserData {
  _id: string;
  email: string;
}

interface CategoriesType {
  createdAt?: string;
  createdBy?: UserData;
  deletedAt?: string | null;
  description: string;
  isDeleted?: boolean;
  name: string;
  status: string;
  updatedAt?: string;
  __v?: number;
  _id?: string;
}

interface CreatedBy {
  _id: string;
  email: string;
}

interface AreasType {
  areaNumber: number;
  status: string;
  capacity: number;
  createdBy?: CreatedBy;
  isDeleted?: boolean;
  deletedAt?: string | null;
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  tables?: TablesType[];
}

interface TablesType {
  areaId: string;
  tableNumber: number;
  status: string;
  capacity: number;
  ownerTable?: {
    _id: string;
    note: string;
    time: string;
  };
  createdBy?: CreatedBy;
  isDeleted?: boolean;
  deletedAt?: string | null;
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface TablesCustomerType {
  areaId: string;
  tableNumber: number;
  status: string;
  capacity: number;
  ownerTable?: any;
  createdBy?: CreatedBy;
  isDeleted?: boolean;
  deletedAt?: string | null;
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface CustomerType {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  point: number;
  type: 'Khách hàng' | 'Nhà cung cấp';
  address: string;
  gender: string;
  note: string;
  createdBy: {
    _id: string;
    email: string;
  };
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  updatedBy: {
    _id: string;
    email: string;
  };
}

interface PromotionsType {
  _id: string;
  name: string;
  discount: number;
  startDate: string;
  endDate: string;
  status: 'Hoạt động' | 'Không hoạt động';
  createdBy?: {
    _id: string;
    email: string;
  };
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
interface InventoriesType {
  _id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  createdBy?: {
    _id: string;
    email: string;
  };
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface TransactionsType {
  _id: string;
  inventoryId: string;
  type: 'Nhập' | 'Xuất';
  quantity: number;
  createdBy?: {
    _id: string;
    email: string;
  };
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface IPermission {
  _id?: string;
  name?: string;
  apiPath?: string;
  method?: string;
  module?: string;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

interface IRole {
  _id?: string;
  name: string;
  description: string;
  isActive: boolean;
  permissions: IPermission[] | string[];

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

interface PaymentsType {
  _id: string;
  method: 'Chuyển khoản' | 'Tiền mặt' | 'Thẻ ghi nợ';
  paymentMethod: {
    'Chuyển khoản': number;
    'Tiền mặt': number;
    'Thẻ ghi nợ': number;
  };
  paymentTime: string;
  totalAmount: number;
  status: 'Đã thanh toán' | 'Chưa thanh toán';
  createdBy?: {
    _id: string;
    email: string;
  };
  isDeleted?: false;
  deletedAt?: null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface MenusType {
  _id: string;
  categoryId: string;
  name: string;
  price: number;
  description: string;
  status: string;
  unit: string;
  image: string;
  createdBy?: {
    _id: string;
    email: string;
  };
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
