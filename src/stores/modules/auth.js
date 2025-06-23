import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  const isAuthenticated = ref(false);
  const loading = ref(false);
  const error = ref(null);

  // Computed
  const currentUser = computed(() => user.value);
  const userFullName = computed(() => user.value?.fullName || '');
  const userFullNameThai = computed(() => user.value?.fullNameThai || '');
  const userPosition = computed(() => user.value?.position || '');
  const userDepartment = computed(() => user.value?.department || '');
  const userCompany = computed(() => user.value?.company || '');
  const userImgUrl = computed(() => user.value?.imgUrl || '');

  // Actions
  const login = async (credentials) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials, {
        headers: { 'Content-Type': 'application/json' }
      });
      const data = response.data;
      console.log(data);
      user.value = data.user;
      token.value = data.token;
      isAuthenticated.value = true;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, message: data.message, code: data.code, error: data.error };
    } catch (err) {
      let msg = 'เข้าสู่ระบบไม่สำเร็จ';
      let code = '';
      if (err.response) {
        code = err.response.data?.code || '';
        if (code === 'PASSWORD_EXPIRED') {
          msg = err.response.data?.message || 'รหัสผ่านหมดอายุ กรุณาเปลี่ยนรหัสผ่านใหม่';
        } else if (code === 'INVALID_CREDENTIALS') {
          msg = err.response.data?.message || 'รหัสผ่านไม่ถูกต้อง';
        } else if (code === 'USER_NOT_FOUND') {
          msg = err.response.data?.message || 'ไม่พบผู้ใช้';
        } else {
          msg = err.response.data?.message || msg;
        }
      } else if (err.message) {
        msg = err.message;
      }
      error.value = msg;
      return { success: false, message: msg, code };
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      if (token.value) {
        await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token.value}` }
        });
      }
    } catch (error) {
      // ไม่ต้องจัดการ error ตรงนี้
    } finally {
      user.value = null;
      token.value = null;
      isAuthenticated.value = false;
      error.value = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const changePassword = async ({ username, oldPassword, newPassword }) => {
    loading.value = true;
    error.value = null;
    try {
      await axios.post(`${API_BASE_URL}/api/auth/change-password`, {
        username,
        oldPassword,
        newPassword
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      return { success: true };
    } catch (err) {
      let msg = 'เปลี่ยนรหัสผ่านไม่สำเร็จ';
      if (err.response && err.response.data?.message) {
        msg = err.response.data.message;
      } else if (err.message) {
        msg = err.message;
      }
      error.value = msg;
      return { success: false, message: msg };
    } finally {
      loading.value = false;
    }
  };

  const checkAuth = () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        token.value = storedToken;
        user.value = JSON.parse(storedUser);
        isAuthenticated.value = true;
        return true;
      } catch (err) {
        logout();
        return false;
      }
    }
    return false;
  };

  const clearError = () => {
    error.value = null;
  };

  const initAuth = () => {
    checkAuth();
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    currentUser,
    userFullName,
    userFullNameThai,
    userPosition,
    userDepartment,
    userCompany,
    userImgUrl,
    login,
    logout,
    changePassword,
    checkAuth,
    clearError,
    initAuth,
  };
});
