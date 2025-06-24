import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiClient } from '@/utils/api';

export const useReportTmsStore = defineStore('reportTms', () => {
  // State
  const dailyStockData = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Future state for other TMS reports
  // const stockAgeData = ref([]);
  // const stockOnHandData = ref([]);
  // const shipmentCostData = ref([]);
  // const planData = ref([]);
  // const ontimePercentData = ref([]);
  // const sharedVehicleCostData = ref([]);
  // const backlogUnitData = ref([]);
  // const notOpenInvoiceData = ref([]);
  // const percentFillToDCData = ref([]);

  // Computed
  const getDailyStockData = computed(() => dailyStockData.value);
  const getDailyStockCount = computed(() => dailyStockData.value.length);
  const hasDailyStockData = computed(() => dailyStockData.value.length > 0);

  // Actions
  const fetchDailyStockData = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiClient.get('/api/report-tms/daily-stock');
      
      if (response.status && response.status.code === 200) {
        dailyStockData.value = response.data || [];
        return { success: true, data: dailyStockData.value };
      } else {
        throw new Error(response.status?.message || 'Failed to fetch daily stock data');
      }
    } catch (err) {
      let errorMessage = 'เกิดข้อผิดพลาดในการดึงข้อมูล Daily Stock';
      
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
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
      console.error('Error fetching daily stock data:', err);
      return { success: false, message: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  // Future actions for other TMS reports
  // const fetchStockAgeData = async () => { /* Implementation */ };
  // const fetchStockOnHandData = async () => { /* Implementation */ };
  // const fetchShipmentCostData = async () => { /* Implementation */ };
  // const fetchPlanData = async () => { /* Implementation */ };
  // const fetchOntimePercentData = async () => { /* Implementation */ };
  // const fetchSharedVehicleCostData = async () => { /* Implementation */ };
  // const fetchBacklogUnitData = async () => { /* Implementation */ };
  // const fetchNotOpenInvoiceData = async () => { /* Implementation */ };
  // const fetchPercentFillToDCData = async () => { /* Implementation */ };

  const clearError = () => {
    error.value = null;
  };

  const reset = () => {
    dailyStockData.value = [];
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    dailyStockData,
    loading,
    error,
    
    // Computed
    getDailyStockData,
    getDailyStockCount,
    hasDailyStockData,
    
    // Actions
    fetchDailyStockData,
    clearError,
    reset,
  };
}); 