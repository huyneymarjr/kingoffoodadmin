import axios from 'axios';

export const callUploadSingleFile = (file: any, folderType: string) => {
  const bodyFormData = new FormData();
  bodyFormData.append('fileUpload', file);
  return axios({
    method: 'post',
    url: 'http://localhost:8000/api/v1/files/upload',
    data: bodyFormData,
    headers: {
      'Content-Type': 'multipart/form-data',
      folder_type: folderType,
    },
  });
};
