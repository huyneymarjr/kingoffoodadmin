import { BASE_DOMAINS } from '../constants/domain';

export const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + date.toUTCString();
  if (document) document.cookie = name + '=' + value + ';' + expires + `;path=/;domain=${BASE_DOMAINS.path}`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + '=';
  if (document) {
    const listCookie = document.cookie.split(';');
    for (let i = 0; i < listCookie.length; i++) {
      let c = listCookie[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
  }
  return null;
};

export const deleteCookie = (name: string) => {
  if (document) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;domain=${BASE_DOMAINS.path}`;
  }
};
