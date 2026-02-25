<template>
  <div class="flex-1 bg-gray-50 min-h-screen">
    <!-- Filter Section -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex flex-col md:flex-row md:items-end gap-4">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="font-semibold text-sm text-gray-700">Filter</span>
        <span class="text-xs text-red-600 font-semibold flex items-center"><Icon icon="mdi:close-circle" class="w-4 h-4 mr-1" />Batch</span>
        <label class="text-xs ml-4">Select from date:</label>
        <input type="date" v-model="filter.fromDate" class="border border-gray-300 rounded px-2 py-1 text-xs" />
        <label class="text-xs ml-2">Select to date:</label>
        <input type="date" v-model="filter.toDate" class="border border-gray-300 rounded px-2 py-1 text-xs" />
        <label class="text-xs ml-2">Select affiliated bus:</label>
        <select v-model="filter.bus" class="border border-gray-300 rounded px-2 py-1 text-xs">
          <option value="LG00005">LG00005 | รถหน่วยรถต่างจังหวัด</option>
          <option value="LG00006">LG00006 | รถหน่วยรถกรุงเทพ</option>
        </select>
        <label class="flex items-center ml-2 text-xs">
          <input type="checkbox" v-model="filter.rounding" class="mr-1" />Rounding
        </label>
        <label class="ml-2 text-xs">Running no.:</label>
        <div class="flex items-center">
          <input v-model="filter.runningNo" class="border border-gray-300 rounded px-2 py-1 text-xs w-20" />
          <button @click="editRunningNo" class="ml-1 p-1 hover:bg-blue-100 rounded"><Icon icon="mdi:pencil" class="w-4 h-4 text-blue-500" /></button>
        </div>
        <button @click="goFilter" class="ml-2 bg-[#00569D] hover:bg-[#004080] text-white text-xs font-medium rounded px-3 py-1 transition-colors">Go</button>
        <button @click="saveData" class="ml-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded px-3 py-1 transition-colors">Save</button>
        <a href="#" @click.prevent="exportExcel" class="ml-4 text-xs text-blue-600 hover:underline flex items-center"><Icon icon="mdi:file-excel" class="w-4 h-4 mr-1" />Export data to Excel</a>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-x-auto">
      <table class="w-full text-xs text-left text-gray-700 border-collapse border border-gray-300">
        <thead class="bg-blue-100 text-gray-700">
          <tr>
            <th class="px-2 py-2 text-center">ลำดับ</th>
            <th class="px-2 py-2 text-center">วันที่</th>
            <th class="px-2 py-2 text-center">เลขที่ใบม่ำออก</th>
            <th class="px-2 py-2 text-center">ค่าขนส่ง</th>
            <th class="px-2 py-2 text-center">ค่าพาเลท</th>
            <th class="px-2 py-2 text-center">จำนวนเงิน</th>
            <th class="px-2 py-2 text-center">หมายเหตุ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in tableData" :key="idx" :class="idx % 2 === 1 ? 'bg-blue-50' : 'bg-white'">
            <td class="px-2 py-1 text-center">{{ idx + 1 }}</td>
            <td class="px-2 py-1 text-center">{{ item.date }}</td>
            <td class="px-2 py-1 text-center">{{ item.docNo }}</td>
            <td class="px-2 py-1 text-right">{{ item.shipCost.toFixed(2) }}</td>
            <td class="px-2 py-1 text-right">{{ item.palletCost.toFixed(2) }}</td>
            <td class="px-2 py-1 text-right">{{ item.total.toFixed(2) }}</td>
            <td class="px-2 py-1">{{ item.remark }}</td>
          </tr>
        </tbody>
      </table>
      <!-- Summary -->
      <div class="bg-blue-50 border-t border-blue-200 mt-2 p-2 text-xs">
        <span class="font-semibold">Summary</span>
        <div class="flex flex-wrap gap-4 mt-1">
          <span>Shipment : {{ tableData.length }}</span>
          <span>ค่าขนส่ง : {{ sumShipCost.toFixed(2) }}</span>
          <span>ค่าพาเลท : {{ sumPalletCost.toFixed(2) }}</span>
          <span>รวม : {{ sumTotal.toFixed(2) }}</span>
          <span class="text-red-600">ไม่ระบุค่าขนส่ง : {{ notSetShipCost }}</span>
          <span>Warehouse : นครปฐม</span>
          <span>Document no. : 00/0005/{{ filter.runningNo }} | 09/0005/{{ filter.runningNo }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';

const filter = ref({
  fromDate: '2024-06-18',
  toDate: '2024-06-18',
  bus: 'LG00005',
  rounding: false,
  runningNo: '878',
});

const tableData = ref([
  { date: '20250618', docNo: '2508626', shipCost: 0, palletCost: 0, total: 0, remark: '2ลช9400/บัญชา' },
  { date: '20250618', docNo: '2508630', shipCost: 0, palletCost: 0, total: 0, remark: 'NE231/90-2615' },
  { date: '20250618', docNo: '2508649', shipCost: 0, palletCost: 0, total: 0, remark: '2ลช6431/ชาญณรงค์' },
]);

const sumShipCost = computed(() => tableData.value.reduce((sum, item) => sum + item.shipCost, 0));
const sumPalletCost = computed(() => tableData.value.reduce((sum, item) => sum + item.palletCost, 0));
const sumTotal = computed(() => tableData.value.reduce((sum, item) => sum + item.total, 0));
const notSetShipCost = computed(() => tableData.value.filter(item => item.shipCost === 0).length);

function goFilter() {
  // เพิ่ม logic filter จริงได้
  alert('Go filter!');
}
function saveData() {
  // เพิ่ม logic save จริงได้
  alert('Save data!');
}
function exportExcel() {
  // เพิ่ม logic export จริงได้
  alert('Export to Excel!');
}
function editRunningNo() {
  // เพิ่ม logic edit running no. จริงได้
  alert('Edit running no.!');
}
</script>

<style scoped>
</style> 