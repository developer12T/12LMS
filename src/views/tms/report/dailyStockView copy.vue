<template>
  <div class="flex-1 bg-gray-50 min-h-screen">
    <div class="space-y-6">
      <!-- Sticky Filter Controls -->
      <div class="bg-gray-100 dark:bg-gray-800">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex flex-col lg:flex-row gap-4 lg:justify-end lg:items-end">
            <!-- Filter Section -->
            <div class="flex flex-col sm:flex-row gap-3 lg:order-2 lg:flex-1 lg:max-w-lg lg:ml-6">
              <div class="flex-1 min-w-0">
                <!-- Action Section (Backlog style) -->
                <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                  <button type="button" @click="downloadData" :disabled="!tableData.length"
                    class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <Icon icon="file-icons:microsoft-excel" width="16" height="16" class="mr-1.5" />
                    Export Excel
                  </button>
                  <button type="button" @click="fetchData"
                    class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-blue-800 transition-colors">
                    <Icon icon="mdi:database-sync" width="16" height="16" class="mr-1.5" />
                    ดึงข้อมูลใหม่
                  </button>
                  <button type="button" @click="refreshPage"
                    class="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-gray-800 transition-colors">
                    <Icon icon="mdi:refresh" width="16" height="16" class="mr-1.5" />
                    รีเฟรชข้อมูล
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <h2 class="text-base font-semibold mb-2">ข้อมูลความเคลื่อนไหว:</h2>
        <div class="relative shadow-md sm:rounded-lg custom-scrollbar overflow-x-auto overflow-y-auto" style="max-height: calc(100vh - 240px);">
          <table class="min-w-[1400px] text-xs text-left text-gray-500 border-collapse border border-gray-300">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
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

const conditionText = ref('');
const summaryText = ref('');

function downloadData() {
  if (!conditionText.value || !summaryText.value) {
    alert('กรุณากรอกเงื่อนไขและสรุปให้ครบถ้วน');
    return;
  }
  // ตัวอย่าง: export เงื่อนไขและสรุปไปในไฟล์ (เช่น Excel หรือ CSV)
  // สามารถนำ conditionText.value และ summaryText.value ไปใส่ในไฟล์ export ได้
  alert('ดาวน์โหลดข้อมูล!\n\nเงื่อนไข: ' + conditionText.value + '\nสรุป: ' + summaryText.value);
}

function fetchData() {
  // Implementation of fetchData function
}

function refreshPage() {
  // Implementation of refreshPage function
}
</script>

<style scoped>
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #94a3b8 #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #94a3b8;
    border-radius: 4px;
    border: 2px solid #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #64748b;
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
    .custom-scrollbar {
        scrollbar-color: #475569 #1e293b;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
        background: #1e293b;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #475569;
        border: 2px solid #1e293b;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #64748b;
    }
}
</style>