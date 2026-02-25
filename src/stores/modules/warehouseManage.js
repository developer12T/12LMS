import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'
import { useAuthStore } from './auth';

export const useWarehouseManageStore = defineStore('warehouseManage', () => {
  const warehouses = ref([])
  const loading = ref(false)
  const error = ref(null)
  const authStore = useAuthStore()
  async function fetchWarehouses() {
    loading.value = true
    error.value = null
    try {
      const res = await api.get(`/api/warehouse/all`,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          }
      })
      console.log(res.data.data)
      warehouses.value = Array.isArray(res.data.data) ? res.data.data : []
    } catch (e) {
      error.value = e
      warehouses.value = []
    } finally {
      loading.value = false
    }
  }

  async function addWarehouse({ warehouse_id, warehouse_name, status = '1' }) {
    error.value = null
    try {
      const res = await api.post(`/api/warehouse`, { warehouse_id, warehouse_name, status },{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          }
      })
      await fetchWarehouses()
      return res.data
    } catch (e) {
      error.value = e
      throw e
    }
  }

  async function updateWarehouse({ id, warehouse_name, status = '1' }) {
    error.value = null
    try {
      const res = await api.put(`/api/warehouse/${id}`, { warehouse_name, status },{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          }
      })
      await fetchWarehouses()
      return res.data
    } catch (e) {
      error.value = e
      throw e
    }
  }

  async function toggleWarehouseStatus(id) {
    error.value = null
    try {
      const res = await api.patch(`/api/warehouse/${id}/toggle`,{},{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          }
      })
      await fetchWarehouses()
      return res.data
    } catch (e) {
      error.value = e
      throw e
    }
  }

  async function deleteWarehouse(id) {
    error.value = null
    try {
      const res = await api.delete(`/api/warehouse/${id}`,{},{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          }
      })
      await fetchWarehouses()
      return res.data
    } catch (e) {
      error.value = e
      throw e
    }
  }

  return {
    warehouses,
    loading,
    error,
    fetchWarehouses,
    addWarehouse,
    updateWarehouse,
    toggleWarehouseStatus,
    deleteWarehouse,
  }
}) 