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
              <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">รายงาน</span>
            </div>
          </li>
          <li aria-current="page">
            <div class="flex items-center">
              <Icon icon="mdi:chevron-right" class="w-4 h-4 text-gray-400" />
              <span class="ml-1 text-sm font-medium text-[#00569D] md:ml-2">Daily Stock</span>
            </div>
          </li>
        </ol>
      </nav>
    </div>

    <div class="flex flex-col md:flex-row gap-6">
      <!-- Condition/Filter Section -->
      <div class="w-full md:w-1/4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit">
        <h2 class="text-base font-semibold mb-2">เงื่อนไข:</h2>
        <textarea class="w-full border border-gray-300 rounded px-2 py-1 text-xs mb-2 min-h-[120px]" placeholder=""></textarea>
        <div class="mb-2">
          <h3 class="text-xs font-medium mb-1">นำข้อมูลออก:</h3>
          <button @click="downloadData" class="w-full bg-[#00569D] hover:bg-[#004080] text-white text-xs font-medium rounded px-2 py-1 transition-colors">ดาวน์โหลด</button>
        </div>
        <div class="mt-4">
          <h3 class="text-xs font-medium mb-1">สรุป:</h3>
          <textarea class="w-full border border-gray-300 rounded px-2 py-1 text-xs min-h-[100px]" placeholder=""></textarea>
        </div>
      </div>

      <!-- Table Section -->
      <div class="w-full md:w-3/4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-x-auto">
        <h2 class="text-base font-semibold mb-2">ข้อมูลความเคลื่อนไหว:</h2>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg max-h-[70vh]">
          <table class="w-full text-xs text-left text-gray-500 border-collapse border border-gray-300 min-w-[1200px]">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
              <tr>
                <th class="px-2 py-2 text-center" rowspan="2">รหัสสินค้า</th>
                <th class="px-2 py-2 text-center" rowspan="2">ชื่อสินค้า</th>
                <th class="px-2 py-2 text-center bg-orange-200" colspan="6">NP</th>
                <th class="px-2 py-2 text-center bg-blue-200" colspan="6">MH</th>
                <th class="px-2 py-2 text-center bg-red-200" colspan="6">LP</th>
                <th class="px-2 py-2 text-center bg-blue-100" colspan="6">SR</th>
              </tr>
              <tr>
                <th class="px-2 py-1 text-center bg-orange-100">On Hand</th>
                <th class="px-2 py-1 text-center bg-orange-100">Allocated</th>
                <th class="px-2 py-1 text-center bg-orange-100">Allocatable</th>
                <th class="px-2 py-1 text-center bg-orange-100">In Transit</th>
                <th class="px-2 py-1 text-center bg-orange-100">CO</th>
                <th class="px-2 py-1 text-center bg-orange-100">สินค้ารอจัดส่ง</th>
                <th class="px-2 py-1 text-center bg-blue-100">On Hand</th>
                <th class="px-2 py-1 text-center bg-blue-100">Allocated</th>
                <th class="px-2 py-1 text-center bg-blue-100">Allocatable</th>
                <th class="px-2 py-1 text-center bg-blue-100">In Transit</th>
                <th class="px-2 py-1 text-center bg-blue-100">CO</th>
                <th class="px-2 py-1 text-center bg-blue-100">สินค้ารอจัดส่ง</th>
                <th class="px-2 py-1 text-center bg-red-100">On Hand</th>
                <th class="px-2 py-1 text-center bg-red-100">Allocated</th>
                <th class="px-2 py-1 text-center bg-red-100">Allocatable</th>
                <th class="px-2 py-1 text-center bg-red-100">In Transit</th>
                <th class="px-2 py-1 text-center bg-red-100">CO</th>
                <th class="px-2 py-1 text-center bg-red-100">สินค้ารอจัดส่ง</th>
                <th class="px-2 py-1 text-center bg-blue-50">On Hand</th>
                <th class="px-2 py-1 text-center bg-blue-50">Allocated</th>
                <th class="px-2 py-1 text-center bg-blue-50">Allocatable</th>
                <th class="px-2 py-1 text-center bg-blue-50">In Transit</th>
                <th class="px-2 py-1 text-center bg-blue-50">CO</th>
                <th class="px-2 py-1 text-center bg-blue-50">สินค้ารอจัดส่ง</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in tableData" :key="idx" :class="idx % 2 === 1 ? 'bg-gray-100' : 'bg-white'">
                <td class="px-2 py-1 text-center">{{ item.productCode }}</td>
                <td class="px-2 py-1">{{ item.productName }}</td>
                <!-- NP -->
                <td class="px-2 py-1 text-center bg-orange-50">{{ item.npOnHand }}</td>
                <td class="px-2 py-1 text-center bg-orange-50">{{ item.npAllocated }}</td>
                <td class="px-2 py-1 text-center bg-orange-50">{{ item.npAllocatable }}</td>
                <td class="px-2 py-1 text-center bg-orange-50">{{ item.npInTransit }}</td>
                <td class="px-2 py-1 text-center bg-orange-50">{{ item.npCO }}</td>
                <td class="px-2 py-1 text-center bg-orange-50">{{ item.npWaiting }}</td>
                <!-- MH -->
                <td class="px-2 py-1 text-center bg-blue-50">{{ item.mhOnHand }}</td>
                <td class="px-2 py-1 text-center bg-blue-50">{{ item.mhAllocated }}</td>
                <td class="px-2 py-1 text-center bg-blue-50">{{ item.mhAllocatable }}</td>
                <td class="px-2 py-1 text-center bg-blue-50">{{ item.mhInTransit }}</td>
                <td class="px-2 py-1 text-center bg-blue-50">{{ item.mhCO }}</td>
                <td class="px-2 py-1 text-center bg-blue-50">{{ item.mhWaiting }}</td>
                <!-- LP -->
                <td class="px-2 py-1 text-center bg-red-50">{{ item.lpOnHand }}</td>
                <td class="px-2 py-1 text-center bg-red-50">{{ item.lpAllocated }}</td>
                <td class="px-2 py-1 text-center bg-red-50">{{ item.lpAllocatable }}</td>
                <td class="px-2 py-1 text-center bg-red-50">{{ item.lpInTransit }}</td>
                <td class="px-2 py-1 text-center bg-red-50">{{ item.lpCO }}</td>
                <td class="px-2 py-1 text-center bg-red-50">{{ item.lpWaiting }}</td>
                <!-- SR -->
                <td class="px-2 py-1 text-center bg-blue-100">{{ item.srOnHand }}</td>
                <td class="px-2 py-1 text-center bg-blue-100">{{ item.srAllocated }}</td>
                <td class="px-2 py-1 text-center bg-blue-100">{{ item.srAllocatable }}</td>
                <td class="px-2 py-1 text-center bg-blue-100">{{ item.srInTransit }}</td>
                <td class="px-2 py-1 text-center bg-blue-100">{{ item.srCO }}</td>
                <td class="px-2 py-1 text-center bg-blue-100">{{ item.srWaiting }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

const tableData = ref([
  {
    productCode: '10010101001', productName: 'ผงปรุงรส รสหมู ตราฟ้าไทย 10 ก. 1*20*12',
    npOnHand: '-', npAllocated: '-', npAllocatable: '-', npInTransit: '-', npCO: '-', npWaiting: '-',
    mhOnHand: '-', mhAllocated: '-', mhAllocatable: '-', mhInTransit: '-', mhCO: '-', mhWaiting: '-',
    lpOnHand: '-', lpAllocated: '-', lpAllocatable: '-', lpInTransit: '-', lpCO: '-', lpWaiting: '-',
    srOnHand: '-', srAllocated: '-', srAllocatable: '-', srInTransit: '-', srCO: '-', srWaiting: '-',
  },
  {
    productCode: '10010101018', productName: 'ผงปรุงรส รสหมู ตราฟ้าไทย 1200 ก. 1*6',
    npOnHand: 178, npAllocated: '-', npAllocatable: 178, npInTransit: '-', npCO: '-', npWaiting: 20,
    mhOnHand: 48, mhAllocated: '-', mhAllocatable: 48, mhInTransit: '-', mhCO: '-', mhWaiting: '-',
    lpOnHand: 24, lpAllocated: '-', lpAllocatable: 24, lpInTransit: '-', lpCO: '-', lpWaiting: '-',
    srOnHand: 31, srAllocated: '-', srAllocatable: 31, srInTransit: '-', srCO: '-', srWaiting: '-',
  },
  {
    productCode: '10010101034', productName: 'ผงปรุงรส รสหมู ตราฟ้าไทย 75 ก. 1*8*10',
    npOnHand: 2557, npAllocated: 250, npAllocatable: 2307, npInTransit: 80, npCO: 428, npWaiting: 459,
    mhOnHand: 213, mhAllocated: 49, mhAllocatable: 164, mhInTransit: '-', mhCO: '-', mhWaiting: '-',
    lpOnHand: 1106, lpAllocated: 24, lpAllocatable: 1082, lpInTransit: '-', lpCO: '-', lpWaiting: '-',
    srOnHand: '-', srAllocated: '-', srAllocatable: '-', srInTransit: '-', srCO: '-', srWaiting: '-',
  },
  {
    productCode: '10010101036', productName: 'ผงปรุงรสหมู ฟ้าไทย 165 ก. 1*6*6 แลก165กรัม',
    npOnHand: 227, npAllocated: 84, npAllocatable: 143, npInTransit: '-', npCO: 138, npWaiting: 313,
    mhOnHand: 71, mhAllocated: 15, mhAllocatable: 56, mhInTransit: '-', mhCO: '-', mhWaiting: '-',
    lpOnHand: '-', lpAllocated: '-', lpAllocatable: '-', lpInTransit: '-', lpCO: '-', lpWaiting: '-',
    srOnHand: '-', srAllocated: '-', srAllocatable: '-', srInTransit: '-', srCO: '-', srWaiting: '-',
  },
]);

function downloadData() {
  // สามารถเพิ่ม logic ดาวน์โหลดข้อมูลจริงได้
  alert('ดาวน์โหลดข้อมูล!');
}
</script>

<style scoped>
/* Add any additional custom styles here */
</style> 