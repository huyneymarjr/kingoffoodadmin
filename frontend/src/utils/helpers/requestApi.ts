import axios from 'axios';
import { getCookie } from './cookie';
import { message } from 'antd';

export function getInstanceAxios(baseAPI: string) {
  const instance = axios.create({
    baseURL: baseAPI,
  });

  instance.interceptors.request.use(
    function (config: any) {
      const accessToken = getCookie('access_token');
      config.headers = {
        ...config.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      if (accessToken) config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : '';

      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    function (response) {
      try {
        if (response.status !== 200) return Promise.reject(response.data);
        return response.data.data;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  return instance;
}
