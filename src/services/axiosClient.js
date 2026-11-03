import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api', // Thay đổi đường dẫn backend của bạn tại đây
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động đính kèm Token xác thực vào header nếu có
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;
