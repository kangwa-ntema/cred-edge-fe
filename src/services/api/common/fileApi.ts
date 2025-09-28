// fe/src/services/api/common/fileApi.ts
import axiosInstance from '../../../services/axiosInstance';
import { apiCall } from './apiUtils';

export const uploadFile = async (file: File, folder = 'general') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  return apiCall(() => axiosInstance.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }));
};

export const deleteFile = async (fileId: string) =>
  apiCall(() => axiosInstance.delete(`/files/${fileId}`));