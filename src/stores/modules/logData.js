import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';

export const useLogDataStore = defineStore('logData', () => {
  const statistics = ref(null);
  const recentLogs = ref([]);
  const employeeLogs = ref([]);
  const dateLogs = ref([]);
  const slowLogs = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchStatistics() {
    loading.value = true;
    try {
      const res = await api.get('/api/logs/statistics');
      statistics.value = res.data.data;
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchRecentLogs() {
    loading.value = true;
    try {
      const res = await api.get('/api/logs/recent');
      recentLogs.value = res.data.data;
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchEmployeeLogs(employeeID) {
    loading.value = true;
    try {
      const res = await api.get(`/api/logs/by-employee/${employeeID}`);
      employeeLogs.value = res.data.data;
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchDateLogs(startDate, endDate) {
    loading.value = true;
    try {
      const res = await api.get(`/api/logs/by-date`, { params: { startDate, endDate } });
      dateLogs.value = res.data.data;
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchSlowLogs(threshold = 1000, limit = 50) {
    loading.value = true;
    try {
      const res = await api.get(`/api/logs/slow-calls`, { params: { threshold, limit } });
      slowLogs.value = res.data.data;
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  return {
    statistics,
    recentLogs,
    employeeLogs,
    dateLogs,
    slowLogs,
    loading,
    error,
    fetchStatistics,
    fetchRecentLogs,
    fetchEmployeeLogs,
    fetchDateLogs,
    fetchSlowLogs,
  };
}); 