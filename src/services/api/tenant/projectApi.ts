// src/services/api/tenant/projectApi.ts

import axiosInstance from '../../../services/axiosInstance';

export interface Project {
  _id?: string;
  name: string;
  description?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  startDate?: string;
  endDate?: string;
  budget?: number;
  client?: string;
  teamMembers?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const getProjects = async (params = {}) => {
  const response = await axiosInstance.get('/tenant/projects', { params });
  return response.data;
};

export const getProjectById = async (projectId: string) => {
  const response = await axiosInstance.get(`/tenant/projects/${projectId}`);
  return response.data;
};

export const createProject = async (projectData: Partial<Project>) => {
  const response = await axiosInstance.post('/tenant/projects', projectData);
  return response.data;
};

export const updateProject = async (projectId: string, projectData: Partial<Project>) => {
  const response = await axiosInstance.put(`/tenant/projects/${projectId}`, projectData);
  return response.data;
};

export const deleteProject = async (projectId: string) => {
  const response = await axiosInstance.delete(`/tenant/projects/${projectId}`);
  return response.data;
};

export const getProjectsPaginated = async (page = 1, limit = 10, filters = {}) => {
  const params = { page, limit, ...filters };
  const response = await axiosInstance.get('/tenant/projects', { params });
  return response.data;
};

export const getProjectStatistics = async () => {
  const response = await axiosInstance.get('/tenant/projects/statistics');
  return response.data;
};

export const addProjectTeamMember = async (projectId: string, memberData: any) => {
  const response = await axiosInstance.post(`/tenant/projects/${projectId}/team`, memberData);
  return response.data;
};

export const removeProjectTeamMember = async (projectId: string, memberId: string) => {
  const response = await axiosInstance.delete(`/tenant/projects/${projectId}/team/${memberId}`);
  return response.data;
};

export const updateProjectStatus = async (projectId: string, status: string) => {
  const response = await axiosInstance.put(`/tenant/projects/${projectId}/status`, { status });
  return response.data;
};

export default {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectsPaginated,
  getProjectStatistics,
  addProjectTeamMember,
  removeProjectTeamMember,
  updateProjectStatus,
};