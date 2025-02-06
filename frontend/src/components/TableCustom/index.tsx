import type { TableColumnsType, TableProps } from 'antd';
import { ConfigProvider, Table } from 'antd';
import { FilterValue } from 'antd/es/table/interface';
type OnChange = NonNullable<TableProps<any>['onChange']>;

interface TablePropsType {
  columns: TableColumnsType;
  dataSource: any;
  page?: any;
  rowKey: any;
  isPagination?: boolean;
  isFixed?: any;
  rowClassName?: any;
  extraClassName?: any;
  setFilter?: (props: any) => void;
  setOrderBy?: (props: any) => void;
  setPage?: (props: any) => void;
  total?: number;
  loading: boolean;
  scroll?: any;
}

function TableDefault(props: TablePropsType & any) {
  const {
    dataSource,
    columns,
    page,
    loading,
    isPagination,
    isFixed,
    rowKey,
    rowClassName,
    extraClassName,
    setFilter,
    setOrderBy,
    setPage,
    total,
    scroll,
    ...otherProps
  } = props;
  const setFilterChange = (filters: Record<string, FilterValue | null>) => {
    if (!setFilter) return;
    const listKeyFilters = Object.keys(filters);
    let newFilter = {};
    listKeyFilters.forEach((element) => {
      switch (element) {
        case 'UserName':
        case 'userName':
          newFilter = { ...newFilter, userId: filters[element] || [] };
          break;
        case 'departmentName':
          newFilter = { ...newFilter, departmentIds: filters[element] || [] };
          break;
        case 'leaderName':
          newFilter = { ...newFilter, leaderIds: filters[element] || [] };
          break;
        default:
          break;
      }
    });
    setFilter((prevState: any) => ({ ...prevState, ...newFilter }));
  };

  const setSorterChange = (sorter: any) => {
    if (!setOrderBy) return;
    if (!sorter) setOrderBy('');
    if (sorter) {
      if (sorter.length) {
        const result = sorter.map((item: any) => {
          const order = item.order !== '' ? (item.order === 'ascend' ? 'asc' : 'desc') : '';
          return order ? `${item.field} ${order}` : '';
        });
        setOrderBy(result.join(','));
      } else {
        const order = sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '';
        setOrderBy(order ? `${sorter.field} ${order}` : '');
      }
    }
  };

  const handleChange: OnChange = (pagination: any, filters: any, sorter) => {
    setFilterChange(filters);
    setSorterChange(sorter);
    setPage && setPage({ pageIndex: pagination.current, pageSize: pagination.pageSize });
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: '#7ad1f7',
          },
        },
      }}
    >
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        rowKey={rowKey ? rowKey : 'id'}
        onChange={handleChange}
        locale={{
          emptyText: 'Không có dữ liệu',
        }}
        scroll={scroll ? scroll : { x: 'max-content' }}
        pagination={
          isPagination
            ? {
                total,
                pageSize: page?.pageSize || 10,
                current: page?.pageIndex || 1,
                className: 'main-pagination',
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} dòng`,
                showSizeChanger: true,
              }
            : false
        }
        {...otherProps}
      />
    </ConfigProvider>
  );
}
export default TableDefault;
