import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const useBacklogStore = defineStore('backlog', () => {
  // State
  const backlogList = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const filters = ref({
    wh: '',
    status: ''
  });

  // Computed
  const getBacklogList = computed(() => backlogList.value);
  const getBacklogCount = computed(() => backlogList.value.length);
  const hasData = computed(() => backlogList.value.length > 0);

  // Actions
  const fetchBacklogData = async (wh, status) => {
    loading.value = true;
    error.value = null;
    
    try {
      const authStore = useAuthStore();
      
      // Update filters
      filters.value = { wh, status };
      
      const response = await axios.get(`${API_BASE_URL}/api/transport/backlog`, {
        params: {
          wh: wh,
          status: status
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        }
      });
      
      const data = response.data;
      
      if (data.status && data.status.code === 200) {
        backlogList.value = data.data || [];
        return { success: true, data: data.data };
      } else {
        throw new Error(data.status?.message || 'Failed to fetch backlog data');
      }
    } catch (err) {
      let errorMessage = 'เกิดข้อผิดพลาดในการดึงข้อมูล Backlog';
      
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
      console.error('Error fetching backlog data:', err);
      return { success: false, message: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const reset = () => {
    backlogList.value = [];
    filters.value = { wh: '', status: '' };
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    backlogList,
    loading,
    error,
    filters,
    
    // Computed
    getBacklogList,
    getBacklogCount,
    hasData,
    
    // Actions
    fetchBacklogData,
    clearError,
    reset,
  };
}); 