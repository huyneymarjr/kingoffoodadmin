export const setSessionStorage = (key: string, value: any) => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (error) {}
};

// Hàm lấy dữ liệu từ sessionStorage
export const getSessionStorage = (key: string) => {
  try {
    const serializedValue = sessionStorage.getItem(key);
    if (serializedValue === null) return undefined;
    return JSON.parse(serializedValue);
  } catch (error) {
    return undefined;
  }
};
