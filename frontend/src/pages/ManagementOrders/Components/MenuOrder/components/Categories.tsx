import { getListCategories } from '@/apis/categoriesApi';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';

const Categories = ({ selectedCategory, setSelectedCategory }: any) => {
  const [categories, setCategories] = useState<CategoriesType[]>([]);
  // const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState({ pageIndex: 1, pageSize: 100 });
  const [total, setTotal] = useState<number>(0);
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getListCategories({
        current: page.pageIndex,
        pageSize: page.pageSize,
        filter: `status=Hoạt động`,
      });
      if (response.data) {
        setCategories(() => {
          const optionAll = {
            _id: 'all',
            name: 'Tất cả',
            status: 'Hoạt động',
          };
          return [optionAll, ...response.data.result];
        });
        setTotal(response.data.meta.total);
        setSelectedCategory('all');
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (page) fetchCategories();
  }, [page]);
  return (
    <div className="flex flex-col gap-4 print:hidden ">
      {categories.map((category: any) => {
        return (
          <Button
            className={`transition-colors duration-300 ${
              selectedCategory === category._id ? 'bg-amber-200 hover:!bg-amber-200' : 'bg-white'
            } `}
            key={category._id}
            onClick={() => {
              setSelectedCategory(category._id);
            }}
          >
            <div className="truncate">{category.name}</div>
          </Button>
        );
      })}
    </div>
  );
};

export default Categories;
