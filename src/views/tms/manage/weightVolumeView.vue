<template>
  <div class="flex-1 p-6 bg-gray-50 min-h-screen">
    <!-- Page Header -->
    <div class="mb-6">
      <nav class="flex mb-4" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <router-link to="/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-[#00569D]">
              <Icon icon="mdi:home" class="w-4 h-4 mr-2" />
              Dashboard
            </router-link>
          </li>
          <li>
            <div class="flex items-center">
              <Icon icon="mdi:chevron-right" class="w-4 h-4 text-gray-400" />
              <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">TMS</span>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <Icon icon="mdi:chevron-right" class="w-4 h-4 text-gray-400" />
              <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">จัดการ</span>
            </div>
          </li>
          <li aria-current="page">
            <div class="flex items-center">
              <Icon icon="mdi:chevron-right" class="w-4 h-4 text-gray-400" />
              <span class="ml-1 text-sm font-medium text-[#00569D] md:ml-2">กำหนดปริมาตรและน้ำหนักรถบรรทุก</span>
            </div>
          </li>
        </ol>
      </nav>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-base font-semibold mb-4">ปริมาตรและน้ำหนักบรรทุก:</h2>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-xs text-left text-gray-500 dark:text-gray-400 border-collapse border border-gray-300 dark:border-gray-600">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th class="px-3 py-2 text-center">ขนาดรถบรรทุก</th>
              <th class="px-3 py-2 text-center">น้ำหนักบรรทุก</th>
              <th class="px-3 py-2 text-center">ปริมาตรบรรทุก</th>
              <th class="px-3 py-2 text-center"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in truckData" :key="item.size" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td class="px-3 py-1 text-center font-medium">{{ item.size }}</td>
              <td class="px-3 py-1 text-center">
                <input type="number" step="0.0001" v-model.number="item.weight" :readonly="!item.editing" class="w-28 text-right bg-gray-50 border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
              </td>
              <td class="px-3 py-1 text-center">
                <input type="number" step="0.0001" v-model.number="item.volume" :readonly="!item.editing" class="w-28 text-right bg-gray-50 border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
              </td>
              <td class="px-3 py-1 text-center">
                <button v-if="!item.editing" @click="editRow(idx)" class="p-1 hover:bg-blue-50 rounded">
                  <Icon icon="mdi:pencil" class="w-4 h-4 text-blue-500" />
                </button>
                <button v-else @click="saveRow(idx)" class="p-1 hover:bg-green-50 rounded">
                  <Icon icon="mdi:content-save" class="w-4 h-4 text-green-600" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

const truckData = ref([
  { size: '2TON', weight: 2150.0000, volume: 2159.0000, editing: false },
  { size: '4TON', weight: 4400.2500, volume: 4499.0000, editing: false },
  { size: '6TON', weight: 6000.0000, volume: 6999.0000, editing: false },
  { size: '9TON', weight: 9000.0000, volume: 9999.0000, editing: false },
  { size: '10TON', weight: 12000.0000, volume: 12999.0000, editing: false },
  { size: '12TON', weight: 12000.0000, volume: 12999.0000, editing: false },
  { size: '16TON', weight: 16000.0000, volume: 16999.0000, editing: false },
  { size: '22TON', weight: 22500.0000, volume: 22599.0000, editing: false },
  { size: '32TON', weight: 32000.0000, volume: 32999.0000, editing: false },
]);

function editRow(idx) {
  truckData.value[idx].editing = true;
}

function saveRow(idx) {
  truckData.value[idx].editing = false;
  // สามารถเพิ่ม logic save จริงได้ที่นี่
}
</script>

<style scoped>
/* Add any additional custom styles here */
</style> 