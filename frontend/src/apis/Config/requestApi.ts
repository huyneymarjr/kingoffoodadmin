import { getCookie, setCookie } from '@/utils/helpers/cookie';
import axios from 'axios';
import { getAccessToken } from '@/apis/auth';
let isFetchingAccessToken = false;
export function getInstanceAxios(baseAPI: string) {
  const instance = axios.create({
    baseURL: baseAPI,
    withCredentials: true,
  });

  instance.interceptors.request.use(
    async function (config: any) {
      let accessToken = getCookie('access_token');
      if (!accessToken && !isFetchingAccessToken) {
        isFetchingAccessToken = true;
        try {
          const res = await getAccessToken();
          if (res.data.access_token) {
            accessToken = res.data.access_token;
            setCookie('access_token', accessToken!, 0.5);
          }
        } catch (error) {
          console.log('error', error);
        } finally {
          isFetchingAccessToken = false;
        }
      }

      config.headers = {
        ...config.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    function (response) {
      try {
        if (response.status !== 200 && response.status !== 201) return Promise.reject(response.data);
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
