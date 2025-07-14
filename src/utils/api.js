import { useAuthStore } from '@/stores/modules/auth';
import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Add Axios request interceptor for employee headers
const api = axios.create({
  // Add base URL
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get client IP
const getClientIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP:', error);
    return '';
  }
};

// Function to get OS
const getOS = () => {
  const userAgent = window.navigator.userAgent;
  if (userAgent.indexOf('Win') !== -1) return 'Windows';
  if (userAgent.indexOf('Mac') !== -1) return 'MacOS';
  if (userAgent.indexOf('Linux') !== -1) return 'Linux';
  if (userAgent.indexOf('Android') !== -1) return 'Android';
  if (userAgent.indexOf('like Mac') !== -1) return 'iOS';
  return 'Unknown';
};

api.interceptors.request.use(async config => {
  const userStr = localStorage.getItem('user');
  let user = {};
  try {
    user = userStr ? JSON.parse(userStr) : {};
  } catch (e) {
    user = {};
  }
  config.headers.employeeID = user.employeeID || '';
  config.headers.fullName = user.fullName || '';
  config.headers.fullNameThai = '';
  config.headers.department = user.department || '';
  config.headers.position = user.position || '';
  
  // Get client IP address
  const clientIP = await getClientIP();
  config.headers.clientIP = clientIP;

  // Device info
  config.headers.deviceName = window.location.hostname || '';
  config.headers.operatingSystem = getOS();
  config.headers.websiteResolution = `${window.innerWidth} x ${window.innerHeight}`;
  config.headers.displayResolution = `${window.screen.width} x ${window.screen.height}`;

  return config;
}, error => Promise.reject(error));

// Create fetch wrapper with authentication
export const apiClient = {
  async request(endpoint, options = {}) {
    const authStore = useAuthStore();
    
    // Add base URL
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists
    if (authStore.token) {
      headers.Authorization = `Bearer ${authStore.token}`;
    }

    // Merge options
    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        authStore.logout();
        throw new Error('Session expired. Please login again.');
      }

      // Handle other errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  },

  // GET request
  async get(endpoint, options = {}) {
    const response = await this.request(endpoint, {
      method: 'GET',
      ...options,
    });
    return response.json();
  },

  // POST request
  async post(endpoint, data, options = {}) {
    const response = await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
    return response.json();
  },

  // PUT request
  async put(endpoint, data, options = {}) {
    const response = await this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
    return response.json();
  },

  // DELETE request
  async delete(endpoint, options = {}) {
    const response = await this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
    return response.json();
  },

  // PATCH request
  async patch(endpoint, data, options = {}) {
    const response = await this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    });
    return response.json();
  },
};

// Auth API methods
export const authAPI = {
  async login(credentials) {
    return apiClient.post('/api/auth/login', credentials);
  },

  async logout() {
    return apiClient.post('/api/auth/logout');
  },

  async refreshToken() {
    return apiClient.post('/api/auth/refresh');
  },

  async getProfile() {
    return apiClient.get('/api/auth/profile');
  },
};

// Export default API client
export default api; 