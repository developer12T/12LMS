<template>
  <div class="p-4 bg-gray-50 w-full">
    <!-- Header Section -->
    <div class="mb-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          สวัสดี, {{ userFullNameThai || userFullName || 'ผู้ใช้' }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          ยินดีต้อนรับเข้าสู่ระบบจัดการ Logistics Management System
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ userPosition }} • {{ userDepartment }}
        </p>
      </div>
    </div>

    <!-- System Cards Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 mx-auto">
      <!-- OMS - Order Management System -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-white bg-opacity-20 rounded-lg">
              <Icon icon="lets-icons:order-fill" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 class="text-xl font-bold text-white">OMS Order Management System</h4>
            </div>
          </div>
        </div>
        
        <div class="p-4">
          <!-- Reports Section -->
          <div class="mb-4">
            <div class="flex items-center space-x-2 mb-3">
              <Icon icon="mdi:file-document" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">รายงาน</h3>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <router-link 
                to="/tms/report/daily-stock" 
                class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 group"
              >
                <div class="flex items-center space-x-2 mb-2">
                  <div class="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <Icon icon="mdi:chart-line" class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                    Daily Stock
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">รายงานสต็อกประจำวัน</p>
              </router-link>
              
              <router-link 
                to="/tms/report/not-bill" 
                class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 group"
              >
                <div class="flex items-center space-x-2 mb-2">
                  <div class="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <Icon icon="mdi:file-document-outline" class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                    ไม่ได้วางบิล
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">รายการที่ไม่ได้วางบิล</p>
              </router-link>
              
              <router-link 
                to="/tms/report/plan-total" 
                class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 group"
              >
                <div class="flex items-center space-x-2 mb-2">
                  <div class="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <Icon icon="mdi:chart-bar" class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                    วางแผนรวม
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">รายงานแผนรวม</p>
              </router-link>
              
              <router-link 
                to="/tms/report/shipment-cost" 
                class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 group"
              >
                <div class="flex items-center space-x-2 mb-2">
                  <div class="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <Icon icon="mdi:currency-usd" class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                    ค่าขนส่ง
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">ค่าขนส่ง(shipment)</p>
              </router-link>
            </div>
          </div>
          
          <!-- Management Section -->
          <div>
            <div class="flex items-center space-x-2 mb-3">
              <Icon icon="mdi:cog" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">จัดการ</h3>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <router-link 
                to="/tms/manage/backlog" 
                class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 group"
              >
                <div class="flex items-center space-x-2 mb-2">
                  <div class="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <Icon icon="mdi:clipboard-list" class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                    ออเดอร์ค้างส่ง
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">จัดการออเดอร์ค้างส่ง</p>
              </router-link>
              
              <router-link 
                to="/tms/manage/shipcost-management" 
                class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 group"
              >
                <div class="flex items-center space-x-2 mb-2">
                  <div class="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <Icon icon="mdi:settings" class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                    จัดการค่าขนส่ง
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">ตั้งค่าต้นทุนการขนส่ง</p>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- TMS - Transport Management System -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="bg-gradient-to-r from-green-600 to-green-700 p-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-white bg-opacity-20 rounded-lg">
              <Icon icon="mdi:truck" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">TMS Transport Management System</h2>
            </div>
          </div>
        </div>
        
        <div class="p-4">
          <div class="text-center py-6">
            <Icon icon="mdi:truck-delivery" class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400 text-xs">
              ระบบจัดการการขนส่ง<br>
              กำลังพัฒนา
            </p>
          </div>
        </div>
      </div>

      <!-- WMS - Warehouse Management System -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-white bg-opacity-20 rounded-lg">
              <Icon icon="mdi:warehouse" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">WMS Warehouse Management System</h2>
            </div>
          </div>
        </div>
        
        <div class="p-4">
          <div class="text-center py-6">
            <Icon icon="mdi:package-variant" class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400 text-xs">
              ระบบจัดการคลังสินค้า<br>
              กำลังพัฒนา
            </p>
          </div>
        </div>
      </div>

      <!-- PMS - Planning Management System -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="bg-gradient-to-r from-orange-600 to-orange-700 p-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-white bg-opacity-20 rounded-lg">
              <Icon icon="icon-park-solid:plan" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">PMS Planning Management System</h2>
            </div>
          </div>
        </div>
        
        <div class="p-4">
          <div class="text-center py-6">
            <Icon icon="mdi:calendar-clock" class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400 text-xs">
              ระบบจัดการแผนงาน<br>
              กำลังพัฒนา
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/modules/auth'

const authStore = useAuthStore()

// Computed properties for user info
const userFullName = computed(() => authStore.userFullName)
const userFullNameThai = computed(() => authStore.userFullNameThai)
const userPosition = computed(() => authStore.userPosition)
const userDepartment = computed(() => authStore.userDepartment)

onMounted(() => {
  // Initialize dashboard
})
</script>