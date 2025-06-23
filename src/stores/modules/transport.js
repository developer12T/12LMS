import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';
import { showError } from '@/utils/toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const useTransportStore = defineStore('transport', () => {
  // State
  const transportList = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const selectedTransport = ref(null);

  // Computed
  const getTransportOptions = computed(() => {
    return transportList.value.map(transport => ({
      value: transport.who_no,
      label: transport.who_name
    }));
  });

  const getTransportById = computed(() => {
    return (id) => transportList.value.find(transport => transport.who_no === id);
  });

  const getTransportByName = computed(() => {
    return (name) => transportList.value.find(transport => transport.who_name === name);
  });

  // Actions
  const fetchTransportList = async () => {
    loading.value = true;
    error.value = null;
    try {
      const authStore = useAuthStore();
      
      const response = await axios.get(`${API_BASE_URL}/api/transport`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        }
      });
      
      const data = response.data;
      
      if (data.status && data.status.code === 200) {
        transportList.value = data.data || [];
        return { success: true, data: data.data };
      } else {
        throw new Error(data.status?.message || 'Failed to fetch transport data');
      }
    } catch (err) {
      let errorMessage = 'เกิดข้อผิดพลาดในการดึงข้อมูล Transport';
      
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
          const authStore = useAuthStore();
          authStore.logout();
          errorMessage = 'Session expired. Please login again.';
        } else {
          errorMessage = err.response.data?.message || errorMessage;
        }
      } else if (err.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Other error
        errorMessage = err.message || errorMessage;
      }
      
      error.value = errorMessage;
      showError(errorMessage);
      console.error('Error fetching transport list:', err);
      return { success: false, message: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  const setSelectedTransport = (transport) => {
    selectedTransport.value = transport;
  };

  const clearError = () => {
    error.value = null;
  };

  const reset = () => {
    transportList.value = [];
    selectedTransport.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    transportList,
    loading,
    error,
    selectedTransport,
    
    // Computed
    getTransportOptions,
    getTransportById,
    getTransportByName,
    
    // Actions
    fetchTransportList,
    setSelectedTransport,
    clearError,
    reset,
  };
}); 