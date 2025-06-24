<template>
  <div class="flex-1 bg-gray-50 min-h-screen p-4">
    <!-- Page content goes here -->
    <div class="bg-white p-4 shadow-md rounded-lg">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-2">
          <span class="text-gray-600">Filter</span>
          <div class="flex items-center bg-gray-200 rounded-full px-2 py-1 text-sm">
            <span class="text-red-500 mr-1 cursor-pointer">✖</span>
            <span>Batch</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <label for="dc" class="text-sm font-medium text-gray-700 whitespace-nowrap"
            >Select DC:</label
          >
          <select
            id="dc"
            name="dc"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option>101 | คลังนครปฐม</option>
          </select>
          <button
            class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            Go
          </button>
          <button
            class="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <div class="mt-4 bg-white shadow-md rounded-lg overflow-x-auto">
      <table class="min-w-full">
        <thead class="bg-blue-100">
          <tr>
            <th class="p-3 text-sm font-semibold tracking-wide text-center">คลัง</th>
            <th class="p-3 text-sm font-semibold tracking-wide text-left">เลขที่เอกสาร</th>
            <th class="p-3 text-sm font-semibold tracking-wide text-left">เขตการขาย</th>
            <th class="p-3 text-sm font-semibold tracking-wide text-left">วันที่เบิก</th>
            <th class="p-3 text-sm font-semibold tracking-wide text-center">ระยะเวลาเบิก</th>
            <th class="p-3 text-sm font-semibold tracking-wide text-left">รหัสสินค้า</th>
            <th class="p-3 text-sm font-semibold tracking-wide text-left">ชื่อสินค้า</th>
            <th class="p-3 text-sm font-semibold tracking-wide text-right">เบิก</th>
            <th class="p-3 text-sm font-semibold tracking-wide text-right">ได้รับ</th>
            <th class="p-3 text-sm font-semibold tracking-wide text-right">ไม่ได้รับ</th>
            <th class="p-3 text-sm font-semibold tracking-wide text-right">มูลค่าที่ไม่ได้รับ</th>
            <th class="p-3 text-sm font-semibold tracking-wide text-left whitespace-nowrap">
              สาเหตุที่ไม่ได้รับ
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="i in 12" :key="i" class="bg-white hover:bg-gray-50">
            <td class="p-3 text-sm text-gray-700 text-center">101</td>
            <td class="p-3 text-sm text-gray-700">W670121805</td>
            <td class="p-3 text-sm text-gray-700">MB312</td>
            <td class="p-3 text-sm text-gray-700">15/01/2567</td>
            <td class="p-3 text-sm text-gray-700 text-center">2</td>
            <td class="p-3 text-sm text-gray-700">20010101001</td>
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              น้ำปลาร้าต้มสุก ฟ้าไทย 400ml x12x2
            </td>
            <td class="p-3 text-sm text-gray-700 text-right">10</td>
            <td class="p-3 text-sm text-gray-700 text-right">
                {{ i % 3 == 0 ? 4 : '-' }}
            </td>
            <td class="p-3 text-sm text-gray-700 text-right">
                {{ i % 3 == 0 ? 6 : 10 }}
            </td>
            <td class="p-3 text-sm text-gray-700 text-right">5,960</td>
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <select
                  class="w-40 text-sm border-gray-300 rounded-md focus:ring-0 focus:border-gray-400"
                >
                  <option>--เลือกสาเหตุ--</option>
                </select>
                <input
                  type="text"
                  placeholder="ระบุข้อความ"
                  class="w-40 text-sm border-gray-300 rounded-md focus:ring-0 focus:border-gray-400"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';


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