import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useUserStore = defineStore('user', () => {
  const users = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchUsers() {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || ''}/api/user`);
      const arr = res.data?.data;
      if (Array.isArray(arr)) {
        users.value = arr;
      } else {
        users.value = [];
      }
      console.log(users.value);
    } catch (e) {
      error.value = e;
      users.value = [];
    } finally {
      loading.value = false;
    }
  }

//   async function fetchUserAccess(employeeID) {
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || ''}/api/user/${employeeID}/access`);
//       return res.data?.data || null;
//     } catch (e) {
//       return null;
//     }
//   }

  async function updateUserRole(employeeID, role) {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL || ''}/api/user/${employeeID}/role`, { role });
      return res.data;
    } catch (e) {
      throw e;
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUserRole,
  };
}); 