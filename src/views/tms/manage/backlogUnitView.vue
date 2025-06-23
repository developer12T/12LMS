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
              <span class="ml-1 text-sm font-medium text-[#00569D] md:ml-2">ออเดอร์ค้างส่ง(หน่วยรถ)</span>
            </div>
          </li>
        </ol>
      </nav>
    </div>

    <!-- Filter and Action Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex flex-col lg:flex-row gap-4 lg:justify-between lg:items-end">
        <!-- Action Buttons Section -->
        <div class="flex flex-col sm:flex-row gap-3 lg:order-1">
          <button type="button"
            class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-green-800 transition-colors">
            <Icon icon="file-icons:microsoft-excel" width="16" height="16" class="mr-1.5" />
            Export Excel
          </button>
          <button type="button"
            class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-red-800 transition-colors">
            <Icon icon="mdi:database-sync" width="16" height="16" class="mr-1.5" />
            ดึงข้อมูลใหม่
          </button>
        </div>

        <!-- Filter Section -->
        <div class="flex flex-col sm:flex-row gap-3 lg:order-2 lg:flex-1 lg:max-w-lg lg:ml-6">
          <div class="flex-1 min-w-0">
            <label for="dc-select" class="block mb-1 text-xs font-medium text-gray-900 dark:text-white">
              Select DC
            </label>
            <select id="dc-select"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors">
              <option selected>101 | คลังนครปฐม</option>
              <option value="102">102 | คลังอื่น</option>
            </select>
          </div>
          <div class="flex-shrink-0 sm:self-end">
            <button type="button"
              class="w-full sm:w-auto text-white bg-[#00569D] hover:bg-[#004080] focus:ring-4 focus:ring-[#00569D]/30 font-medium rounded-lg text-xs px-4 py-1.5 dark:bg-[#00569D] dark:hover:bg-[#004080] focus:outline-none dark:focus:ring-[#00569D]/30 transition-colors inline-flex items-center justify-center min-w-[100px]">
              <Icon icon="mdi:magnify" width="14" height="14" class="mr-1.5" />
              Go
            </button>
          </div>
          <div class="flex-shrink-0 sm:self-end">
            <button type="button"
              class="w-full sm:w-auto text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-4 py-1.5 transition-colors">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg" style="max-height: calc(100vh - 300px);">
        <table class="w-full text-xs text-left text-gray-500 dark:text-gray-400 border-collapse border border-gray-300 dark:border-gray-600">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
            <tr>
              <th class="px-2 py-2 text-center">คลัง</th>
              <th class="px-2 py-2 text-center">เลขที่เอกสาร</th>
              <th class="px-2 py-2 text-center">เขตการขาย</th>
              <th class="px-2 py-2 text-center">วันที่เบิก</th>
              <th class="px-2 py-2 text-center">ระยะเวลาเบิก</th>
              <th class="px-2 py-2 text-center">รหัสสินค้า</th>
              <th class="px-2 py-2 text-center">ชื่อสินค้า</th>
              <th class="px-2 py-2 text-center">เบิก</th>
              <th class="px-2 py-2 text-center">ได้รับ</th>
              <th class="px-2 py-2 text-center">ไม่ได้รับ</th>
              <th class="px-2 py-2 text-center">มูลค่าที่ไม่ได้รับ</th>
              <th class="px-2 py-2 text-center">สาเหตุที่ไม่ได้รับ</th>
              <th class="px-2 py-2 text-center">ระบุข้อความ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tableData" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td class="px-2 py-1 text-center">{{ item.warehouse }}</td>
              <td class="px-2 py-1 text-center">{{ item.docNumber }}</td>
              <td class="px-2 py-1 text-center">{{ item.salesZone }}</td>
              <td class="px-2 py-1 text-center">{{ item.pickDate }}</td>
              <td class="px-2 py-1 text-center">{{ item.pickDuration }}</td>
              <td class="px-2 py-1 text-center">{{ item.productCode }}</td>
              <td class="px-2 py-1">{{ item.productName }}</td>
              <td class="px-2 py-1 text-center">{{ item.pickQty }}</td>
              <td class="px-2 py-1 text-center">{{ item.receivedQty }}</td>
              <td class="px-2 py-1 text-center">{{ item.notReceivedQty }}</td>
              <td class="px-2 py-1 text-center">{{ item.notReceivedValue }}</td>
              <td class="px-2 py-1">
                <select v-model="item.notReceivedReason" class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5">
                  <option value="">--เลือกสาเหตุ--</option>
                  <option value="reason1">เหตุผล 1</option>
                  <option value="reason2">เหตุผล 2</option>
                </select>
              </td>
              <td class="px-2 py-1">
                <input v-model="item.notReceivedNote" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5" placeholder="ระบุข้อความ" />
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

const tableData = ref([
  { warehouse: '101', docNumber: 'W670121805', salesZone: 'MB312', pickDate: '15/01/2567', pickDuration: 2, productCode: '20010101001', productName: 'น้ำปลา ร้าดังสุด ฟ้าไทย 400ml x12x2', pickQty: 10, receivedQty: '-', notReceivedQty: 10, notReceivedValue: 5960, notReceivedReason: '', notReceivedNote: '' },
  { warehouse: '101', docNumber: 'W670121805', salesZone: 'MB312', pickDate: '15/01/2567', pickDuration: 2, productCode: '1001110002', productName: 'ผงรสหมูขาว ฟ้าไทย 70g x2x3', pickQty: 1, receivedQty: '-', notReceivedQty: 1, notReceivedValue: 738, notReceivedReason: '', notReceivedNote: '' },
  { warehouse: '101', docNumber: 'W670121805', salesZone: 'MB312', pickDate: '15/01/2567', pickDuration: 2, productCode: '10011010025', productName: 'ซอสหมูหยอง ฟ้าไทย 200g x12x3', pickQty: 2, receivedQty: '-', notReceivedQty: 2, notReceivedValue: 1188, notReceivedReason: '', notReceivedNote: '' },
  { warehouse: '101', docNumber: 'W670121705', salesZone: 'MB311', pickDate: '11/01/2567', pickDuration: 2, productCode: '10010601025', productName: 'ผงปรุงรสหมูเข้มข้น ฟ้าไทย 800g x6', pickQty: 2, receivedQty: '-', notReceivedQty: 2, notReceivedValue: 984, notReceivedReason: '', notReceivedNote: '' },
  { warehouse: '101', docNumber: 'W670121705', salesZone: 'MB311', pickDate: '11/01/2567', pickDuration: 2, productCode: '10010601079', productName: 'ผงปรุงรสหมู ฟ้าไทย 400g x12', pickQty: 2, receivedQty: '-', notReceivedQty: 2, notReceivedValue: 1080, notReceivedReason: '', notReceivedNote: '' },
  // ... เพิ่ม mock data ตามภาพ ...
]);

// Methods for interactivity (placeholders)
const loadData = () => {
  console.log('Loading data...');
  // Implement data loading logic here
};

const saveData = () => {
  console.log('Saving data...', tableData.value);
  // Implement save logic here
};
</script>

<style scoped>
/* Add any additional custom styles here */
</style> 