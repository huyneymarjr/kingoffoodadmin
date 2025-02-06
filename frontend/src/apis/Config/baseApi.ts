import { BASE_DOMAINS } from '@/utils/constants/domain';
import { getInstanceAxios } from './requestApi';

export const apiAdmin = getInstanceAxios(BASE_DOMAINS.pathAPI);
