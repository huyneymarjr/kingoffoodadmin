type NotificationType = 'success' | 'warning' | 'error';

type AlignType = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';

interface LocationType {
  pathName?: string;
  prevPathName?: string;
  params?: Record<string, any>;
  query?: Record<string, any>;
}

interface BreadcrumbType {
  name: string;
  path?: string;
}

interface DepartmentType {
  id: number;
  name: string;
}

type useType = {
  _id: string;
  name: string;
  acessToken: string;
  refreshToken: string;
  role: any;
  email?: string;
  phoneNumber?: string;
  name?: string;
  address?: string;
  permissions?: any;
};
