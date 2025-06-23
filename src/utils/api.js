import { useAuthStore } from '@/stores/modules/auth';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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
export default apiClient; 