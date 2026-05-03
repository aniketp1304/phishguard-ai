import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const scanUrl = async (url: string) => {
  const response = await apiClient.post('/scan', { url });
  return response.data;
};

export const getScanStats = async () => {
  const response = await apiClient.get('/scan/stats');
  return response.data;
};

export const getLogs = async (page = 1, limit = 20) => {
  const response = await apiClient.get(`/logs?page=${page}&limit=${limit}`);
  return response.data;
};
