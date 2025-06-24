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

  // State for PO Details
  const poDetails = ref([]);
  const isDetailsLoading = ref(false);
  const detailsError = ref(null);

  // State for Reasons
  const reasonsList = ref([]);
  const isLoadingReasons = ref(false);
  const reasonsError = ref(null);

  // Computed
  const getBacklogList = computed(() => backlogList.value);
  const getBacklogCount = computed(() => backlogList.value.length);
  const hasData = computed(() => backlogList.value.length > 0);

  const reasonOptions = computed(() => {
    return (reasonsList.value || []).map(reason => ({
      value: reason.reason_id,
      label: reason.reason_name,
    }));
  });

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
        // Map data to ensure reason_id is not null/undefined
        backlogList.value = (data.data || []).map(item => ({
          ...item,
          reason_id: item.reason_id === null || item.reason_id === undefined ? '' : item.reason_id
        }));
        return { success: true, data: backlogList.value };
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

  const fetchPoDetails = async (po_no, wh_no) => {
    isDetailsLoading.value = true;
    detailsError.value = null;
    poDetails.value = [];

    try {
      const authStore = useAuthStore();
      const response = await axios.get(`${API_BASE_URL}/api/transport/po-details`, {
        params: {
          po_no: po_no,
          wh_node: wh_no
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        }
      });
      const data = response.data;
      if (data.status && data.status.code === 200) {
        poDetails.value = data.data || [];
      } else {
        throw new Error(data.status?.message || 'Failed to fetch PO details');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลรายละเอียด';
      detailsError.value = errorMessage;
      console.error('Error fetching PO details:', err);
    } finally {
      isDetailsLoading.value = false;
    }
  };

  const fetchReasons = async () => {
    isLoadingReasons.value = true;
    reasonsError.value = null;
    try {
      const authStore = useAuthStore();
      const response = await axios.get(`${API_BASE_URL}/api/transport/reasons`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        }
      });
      const data = response.data;
      if (data.status && data.status.code === 200) {
        reasonsList.value = data.data || [];
      } else {
        throw new Error(data.status?.message || 'Failed to fetch reasons');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลเหตุผล';
      reasonsError.value = errorMessage;
      console.error('Error fetching reasons:', err);
    } finally {
      isLoadingReasons.value = false;
    }
  };

  const saveMultipleBacklogItems = async (items, progressCallback) => {
    const authStore = useAuthStore();
    const results = [];
    let savedCount = 0;
    let failedCount = 0;

    let delay = 100;
    if (items.length > 30) {
        delay = 10;
    } else if (items.length > 10) {
        delay = 50;
    }

    for (let i = 0; i < items.length; i++) {
        const itemData = items[i];
        try {
            const payload = _preparePayload(itemData, authStore);
            const response = await axios.post(`${API_BASE_URL}/api/transport/backlog/update`, payload, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.token}` }
            });

            if (response.data && response.data.status.code === 200) {
                _updateLocalBacklogItem(payload);
                results.push({ success: true, po_no: itemData.po_no });
                savedCount++;
            } else {
                throw new Error(response.data.status?.message || `Failed to save PO ${itemData.po_no}`);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || `Failed to save PO ${itemData.po_no}`;
            console.error(errorMessage);
            results.push({ success: false, po_no: itemData.po_no, error: errorMessage });
            failedCount++;
        }

        if (progressCallback) {
            progressCallback(i + 1);
        }

        if (i < items.length - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    if (failedCount > 0) {
        const errorMessages = results.filter(r => !r.success).map(f => f.error).join('; ');
        return { 
            success: false,
            error: errorMessages, 
            savedCount: savedCount, 
            failedCount: failedCount 
        };
    }
    
    return { success: true, savedCount: savedCount, failedCount: 0 };
  };

  const saveBacklogItem = async (itemData) => {
    try {
        const authStore = useAuthStore();
        const payload = _preparePayload(itemData, authStore);

        const response = await axios.post(`${API_BASE_URL}/api/transport/backlog/update`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authStore.token}`
            }
        });

        if (response.data && response.data.status.code === 200) {
            _updateLocalBacklogItem(payload);
            return { success: true };
        } else {
            throw new Error(response.data.status?.message || 'Failed to save backlog item');
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'An unknown error occurred';
        console.error('Error saving backlog item:', err);
        return { success: false, error: errorMessage };
    }
  };

  const _preparePayload = (itemData, authStore) => {
    let formattedDate = itemData.po_detail;
    if (formattedDate) {
        if (formattedDate instanceof Date) {
            const year = formattedDate.getFullYear();
            const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
            const day = String(formattedDate.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
        } else if (typeof formattedDate === 'string' && formattedDate.includes('T')) {
            formattedDate = formattedDate.split('T')[0];
        }
    }
    return {
        po_no: itemData.po_no,
        reason: itemData.reason_id,
        other: itemData.otherbl,
        postpone: formattedDate,
        usermodify: authStore.user.username
    };
  };

  const _updateLocalBacklogItem = (payload) => {
    const index = backlogList.value.findIndex(item => item.po_no === payload.po_no);
    if (index !== -1) {
        const updatedItem = {
            ...backlogList.value[index],
            reason_id: payload.reason,
            otherbl: payload.other,
            po_detail: payload.postpone,
        };
        const reason = reasonOptions.value.find(r => r.value === payload.reason);
        if (reason) {
            updatedItem.reason_name = reason.label;
        }
        backlogList.value[index] = updatedItem;
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
    poDetails,
    isDetailsLoading,
    detailsError,
    reasonsList,
    isLoadingReasons,
    reasonsError,
    
    // Computed
    getBacklogList,
    getBacklogCount,
    hasData,
    reasonOptions,
    
    // Actions
    fetchBacklogData,
    fetchPoDetails,
    fetchReasons,
    saveBacklogItem,
    saveMultipleBacklogItems,
    clearError,
    reset,
  };
}); 