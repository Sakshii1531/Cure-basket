import api from './api';

const uploadImage = async (file, folder = 'cure-basket') => {
  const formData = new FormData();
  formData.append('file', file);
  // Do NOT set Content-Type manually — axios sets multipart/form-data with the
  // correct boundary automatically when the body is a FormData instance.
  const res = await api.post(`/upload?folder=${folder}`, formData);
  return res.data.url;
};

export default uploadImage;
