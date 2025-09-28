// fe/src/services/api/common/notificationApi.ts
import axiosInstance from '../../../services/axiosInstance';
import { type ApiResponse } from '../../../types';

export interface Notification {
  _id: string;
  type: 'system' | 'billing' | 'security' | 'user' | 'loan' | 'project';
  title: string;
  message: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionUrl?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export const getNotifications = async (params = {}): Promise<ApiResponse<Notification[]>> => {
  const response = await axiosInstance.get('/notifications', { params });
  return response.data;
};

export const getUnreadNotifications = async (): Promise<ApiResponse<Notification[]>> => {
  const response = await axiosInstance.get('/notifications/unread');
  return response.data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<ApiResponse> => {
  const response = await axiosInstance.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<ApiResponse> => {
  const response = await axiosInstance.patch('/notifications/read-all');
  return response.data;
};

export const getNotificationCount = async (): Promise<ApiResponse<{ total: number; unread: number }>> => {
  const response = await axiosInstance.get('/notifications/count');
  return response.data;
};

export const deleteNotification = async (notificationId: string): Promise<ApiResponse> => {
  const response = await axiosInstance.delete(`/notifications/${notificationId}`);
  return response.data;
};

export const createNotification = async (notificationData: Partial<Notification>): Promise<ApiResponse<Notification>> => {
  const response = await axiosInstance.post('/notifications', notificationData);
  return response.data;
};