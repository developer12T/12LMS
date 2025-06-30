import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const useReportTmsStore = defineStore('reportTms', () => {
  // State
  const dailyStockData = ref([]);
  const nobillList = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // State สำหรับ DC (nobill-wh)
  const nobillWhList = ref([]);
  const loadingNoBillWh = ref(false);
  const errorNoBillWh = ref(null);

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

  // เพิ่ม state, actions, และ getter สำหรับ transport-cost options
  const roudcosPayOptions = ref([]);
  const codeTruckOptions = ref([]);

  // Computed
  const getDailyStockData = computed(() => dailyStockData.value);
  const getDailyStockCount = computed(() => dailyStockData.value.length);
  const hasDailyStockData = computed(() => dailyStockData.value.length > 0);

  // Actions
  const fetchDailyStockData = async () => {
    loading.value = true;
    error.value = null;
    try {
      const authStore = useAuthStore();
      const response = await axios.get(`${API_BASE_URL}/api/report-tms/daily-stock`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        }
      });
      const data = response.data;
      if (data.status && data.status.code === 200) {
        dailyStockData.value = data.data || [];
        return { success: true, data: dailyStockData.value };
      } else {
        throw new Error(data.status?.message || 'Failed to fetch daily stock data');
      }
    } catch (err) {
      let errorMessage = 'เกิดข้อผิดพลาดในการดึงข้อมูล Daily Stock';
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Session expired. Please login again.';
        } else {
          errorMessage = err.response.data?.message || errorMessage;
        }
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = err.message || errorMessage;
      }
      error.value = errorMessage;
      console.error('Error fetching daily stock data:', err);
      return { success: false, message: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  const fetchNoBillReport = async (warehouse, dateStart, dateEnd) => {
    loading.value = true;
    error.value = null;
    try {
      const authStore = useAuthStore();
      // console.log(API_BASE_URL);
      
      const response = await axios.get(`${API_BASE_URL}/api/report-tms/nobill`, {
        params: { warehouse, dateStart, dateEnd },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        }
      });
      const data = response.data;
      if (data.status && data.status.code === 200) {
        nobillList.value = data.data || [];
        return { success: true, data: nobillList.value };
      } else {
        throw new Error(data.status?.message || 'Failed to fetch no bill report');
      }
    } catch (err) {
      error.value = err.message || 'Unknown error';
      nobillList.value = [];
      return { success: false, error: error.value };
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
    nobillList.value = [];
    loading.value = false;
    error.value = null;
  };

  // Action สำหรับโหลด DC (nobill-wh)
  const fetchNoBillWhList = async () => {
    loadingNoBillWh.value = true;
    errorNoBillWh.value = null;
    try {
      const response = await axios.get(`${API_BASE_URL}/api/report-tms/nobill-wh`);
      nobillWhList.value = response.data || [];
      console.log(nobillWhList.value);
    } catch (err) {
      errorNoBillWh.value = 'ไม่สามารถโหลดข้อมูล DC ได้';
      nobillWhList.value = [];
    } finally {
      loadingNoBillWh.value = false;
    }
  };

  const fetchTransportCostOptions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/report-tms/transport-cost`);
      const data = res.data;
      if (data.status && data.status.code === 200) {
        roudcosPayOptions.value = data.data.roudcos_pay || [];
        codeTruckOptions.value = data.data.code_truck || [];
      }
    } catch (e) {
      // handle error ตามเหมาะสม
      roudcosPayOptions.value = [];
      codeTruckOptions.value = [];
    }
  };

  const fetchTransportCostData = async ({ shipmentId, channelId, truckId }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/report-tms/transport-cost/show-data?shipmentId=${shipmentId}&channelId=${channelId}&truckId=${truckId}`);
      const data = res.data;
      if (data.status && data.status.code === 200) {
        return data;
      } else {
        return { data: { show_data: [], summaryDataObj: {} } };
      }
    } catch (e) {
      return { data: { show_data: [], summaryDataObj: {} } };
    }
  };

  return {
    // State
    dailyStockData,
    nobillList,
    loading,
    error,
    nobillWhList,
    loadingNoBillWh,
    errorNoBillWh,
    roudcosPayOptions,
    codeTruckOptions,
    
    // Computed
    getDailyStockData,
    getDailyStockCount,
    hasDailyStockData,
    
    // Actions
    fetchDailyStockData,
    fetchNoBillReport,
    fetchNoBillWhList,
    fetchTransportCostOptions,
    fetchTransportCostData,
    clearError,
    reset,
  };
}); 