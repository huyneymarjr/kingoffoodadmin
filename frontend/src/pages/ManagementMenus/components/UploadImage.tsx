import React, { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Flex, message, Upload } from 'antd';
import { Image } from 'antd';
import type { GetProp, UploadProps } from 'antd';
import { callUploadSingleFile } from '@/apis/uploads';
import { linkImage } from '@/utils/helpers/getLinkImage';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UploadImage: React.FC<{
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  fileList: any[];
  setFileList: React.Dispatch<React.SetStateAction<any[]>>;
}> = ({ imageUrl, setImageUrl, fileList, setFileList }) => {
  const [loading, setLoading] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const beforeUpload = async (file: FileType) => {
    console.log('file', file);
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể tải lên file ảnh JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps['onChange'] = async (info) => {
    try {
      const response = await callUploadSingleFile(info.file.originFileObj, 'menus');
      setImageUrl(response.data.data?.data?.fileName);
      setFileList([
        {
          uid: '1',
          name: `${linkImage(response.data.data?.data?.fileName, 'menus')}`,
          status: 'done',
          url: linkImage(response.data.data?.data?.fileName, 'menus'),
        },
      ]);
      message.success('Tải ảnh lên thành công');
    } catch (error) {
      console.log('Failed to upload image', error);
      message.error('Tải ảnh lên thất bại');
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
    </button>
  );

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  const handleRemove = async (file: any) => {
    return new Promise((resolve, _reject) => {
      setFileList((prevFileList) => {
        const newFileList = prevFileList.filter((item) => item.uid !== file.uid);
        setPreviewImage('');
        setImageUrl('');
        resolve(true);
        message.success('Xóa ảnh thành công');
        return newFileList;
      });
    }).then(() => false);
  };
  return (
    <>
      <Upload
        name="image"
        listType="picture-card"
        showUploadList={true}
        action={`${linkImage(imageUrl, 'menus')}`}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onPreview={handlePreview}
        onRemove={handleRemove}
        maxCount={1}
        fileList={fileList}
      >
        {imageUrl ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={linkImage(imageUrl, 'menus')}
        />
      )}
    </>
  );
};

export default UploadImage;
