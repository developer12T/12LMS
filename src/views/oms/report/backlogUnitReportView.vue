<template>
  <div class="flex-1 bg-gray-50 min-h-screen">
    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 flex flex-col md:flex-row md:items-end gap-4">
      <div class="flex flex-col md:flex-row gap-2 flex-wrap flex-1">
        <div>
          <label class="block text-xs font-medium mb-1">Select DC:</label>
          <select v-model="filter.dc" class="border border-gray-300 rounded px-2 py-1 text-xs">
            <option value="101">101 | คลังนครปฐม</option>
            <option value="102">102 | คลังอื่น</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium mb-1">เดือน:</label>
          <select v-model="filter.month" class="border border-gray-300 rounded px-2 py-1 text-xs">
            <option value="6">มิถุนายน</option>
            <option value="7">กรกฎาคม</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium mb-1">Select cause:</label>
          <select v-model="filter.cause" class="border border-gray-300 rounded px-2 py-1 text-xs">
            <option value="">--เลือก--</option>
            <option value="cause1">สินค้าขาดสต๊อก</option>
            <option value="cause2">อื่นๆ</option>
          </select>
        </div>
      </div>
      <div class="flex gap-2 mt-2 md:mt-0">
        <button @click="applyFilter" class="bg-[#00569D] hover:bg-[#004080] text-white text-xs font-medium rounded px-4 py-1.5 transition-colors">Go</button>
        <button @click="exportExcel" class="text-xs text-blue-600 hover:underline">Export data to Excel</button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg" style="max-height: calc(100vh - 300px);">
        <table class="w-full text-xs text-left text-gray-500 border-collapse border border-gray-300 min-w-[1200px]">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
            <tr>
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
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in tableData" :key="idx" :class="idx % 2 === 1 ? 'bg-blue-50' : 'bg-white'">
              <td class="px-2 py-1 text-center">{{ item.docNo }}</td>
              <td class="px-2 py-1 text-center">{{ item.salesZone }}</td>
              <td class="px-2 py-1 text-center">{{ item.pickDate }}</td>
              <td class="px-2 py-1 text-center">{{ item.pickDuration }}</td>
              <td class="px-2 py-1 text-center">{{ item.productCode }}</td>
              <td class="px-2 py-1">{{ item.productName }}</td>
              <td class="px-2 py-1 text-center">{{ item.pickQty }}</td>
              <td class="px-2 py-1 text-center">{{ item.receivedQty }}</td>
              <td class="px-2 py-1 text-center">{{ item.notReceivedQty }}</td>
              <td class="px-2 py-1 text-right">{{ item.notReceivedValue }}</td>
              <td class="px-2 py-1">{{ item.notReceivedReason }}</td>
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

const filter = ref({
  dc: '101',
  month: '6',
  cause: '',
});

const tableData = ref([
  { docNo: 'W640621511', salesZone: 'B215', pickDate: '22/06/2564', pickDuration: 2, productCode: '10030106002', productName: 'ผงปรุงรสหมู พ่อครัวทอง 5kg x4', pickQty: 15, receivedQty: 9, notReceivedQty: 6, notReceivedValue: '8,136', notReceivedReason: 'สินค้าขาดสต๊อก :' },
  { docNo: 'W640621107', salesZone: 'B211', pickDate: '14/06/2564', pickDuration: 2, productCode: '1050010002', productName: 'กล่องพลาสติกอาหารพร้อมฝา 1 ช่อง 1000cc 1*20พ่อ*25ชุด', pickQty: 2, receivedQty: '-', notReceivedQty: 2, notReceivedValue: '3,200', notReceivedReason: 'สินค้าขาดสต๊อก :' },
  { docNo: 'W640621207', salesZone: 'B212', pickDate: '14/06/2564', pickDuration: 2, productCode: '1050010002', productName: 'กล่องพลาสติกอาหารพร้อมฝา 1 ช่อง 1000cc 1*20พ่อ*25ชุด', pickQty: 1, receivedQty: '-', notReceivedQty: 1, notReceivedValue: '1,600', notReceivedReason: 'สินค้าขาดสต๊อก :' },
  { docNo: 'W640625206', salesZone: 'C/E224', pickDate: '12/06/2564', pickDuration: 2, productCode: '10010201019', productName: 'ผงปรุงรสไก่ ฟ้าไทย 350g x6', pickQty: 8, receivedQty: 6, notReceivedQty: 2, notReceivedValue: '908', notReceivedReason: 'อื่นๆ : ขาดสต๊อกจนวันที่เปิดบิล' },
  { docNo: 'W640621307', salesZone: 'B213', pickDate: '12/06/2564', pickDuration: 2, productCode: '10052001012', productName: 'ผงชูรส ตราคนเก่ง 1kg x2 แถมขาวกรรเชียง', pickQty: 3, receivedQty: 2, notReceivedQty: 1, notReceivedValue: '1,120', notReceivedReason: 'อื่นๆ : ขาดสต๊อกจนวันที่เปิดบิล' },
]);

function applyFilter() {
  // สามารถเพิ่ม logic ดึงข้อมูลจริงได้
}

function exportExcel() {
  // สามารถเพิ่ม logic export excel ได้
  alert('Export to Excel!');
}
</script>

<style scoped>
/* Add any additional custom styles here */
</style> 