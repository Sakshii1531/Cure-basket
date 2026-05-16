import api from './api';

const uploadImage = async (file, folder = 'cure-basket') => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post(`/upload?folder=${folder}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.url;
};

export default uploadImage;
