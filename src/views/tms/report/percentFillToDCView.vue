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
          <label class="block text-xs font-medium mb-1">Select Week:</label>
          <select v-model="filter.week" class="border border-gray-300 rounded px-2 py-1 text-xs">
            <option value="all">All Week</option>
            <option value="1">Week 1</option>
            <option value="2">Week 2</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium mb-1">Select month:</label>
          <select v-model="filter.month" class="border border-gray-300 rounded px-2 py-1 text-xs">
            <option value="6">มิถุนายน</option>
            <option value="7">กรกฎาคม</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium mb-1">Select year:</label>
          <select v-model="filter.year" class="border border-gray-300 rounded px-2 py-1 text-xs">
            <option value="2568">2568</option>
            <option value="2567">2567</option>
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
        <table class="w-full text-xs text-left text-gray-500 border-collapse border border-gray-300">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
            <tr>
              <th class="px-2 py-2 text-center">รหัสสินค้า</th>
              <th class="px-2 py-2 text-center">ชื่อสินค้า</th>
              <th class="px-2 py-2 text-center">กลุ่มสินค้า</th>
              <th class="px-2 py-2 text-center">Forecast</th>
              <th class="px-2 py-2 text-center">ยอด CO</th>
              <th class="px-2 py-2 text-center">ยอดยกมา</th>
              <th class="px-2 py-2 text-center">ยอดเติมสินค้า</th>
              <th class="px-2 py-2 text-center">รวม On Hand</th>
              <th class="px-2 py-2 text-center">Forecast VS รวม On Hand</th>
              <th class="px-2 py-2 text-center">ยอด CO VS รวม On Hand</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in tableData" :key="idx" :class="idx % 2 === 1 ? 'bg-blue-50' : 'bg-white'">
              <td class="px-2 py-1 text-center">{{ item.productCode }}</td>
              <td class="px-2 py-1">{{ item.productName }}</td>
              <td class="px-2 py-1 text-center">{{ item.group }}</td>
              <td class="px-2 py-1 text-center">{{ item.forecast }}</td>
              <td class="px-2 py-1 text-center">{{ item.co }}</td>
              <td class="px-2 py-1 text-center">{{ item.carry }}</td>
              <td class="px-2 py-1 text-center">{{ item.fill }}</td>
              <td class="px-2 py-1 text-center">{{ item.onHand }}</td>
              <td class="px-2 py-1 text-center">
                <span :class="getPercentClass(item.forecastVsOnHand)">{{ item.forecastVsOnHand }}</span>
              </td>
              <td class="px-2 py-1 text-center">
                <span :class="getPercentClass(item.coVsOnHand)">{{ item.coVsOnHand }}</span>
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

const filter = ref({
  dc: '101',
  week: 'all',
  month: '6',
  year: '2568',
});

const tableData = ref([
  { productCode: '10010101018', productName: 'ผงปรุงรส รสหมู ตราฟ้าไทย 1200 ก. 1*6', group: 'A', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 0, forecastVsOnHand: 'NaN%', coVsOnHand: 'NaN%' },
  { productCode: '10010101024', productName: 'ผงปรุงรส รสหมู ตราฟ้าไทย 850 ก. 1*6', group: 'A', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 0, forecastVsOnHand: 'NaN%', coVsOnHand: 'NaN%' },
  { productCode: '10010401020', productName: 'ผงกะหรี่ป่นใส ตราฟ้าไทย 850 ก. 1*6', group: 'A', forecast: 0, co: 0, carry: 7222, fill: -1242, onHand: 5980, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10011001002', productName: 'น้ำมะนาว 45% ตราฟ้าไทย 1000 ml. 1*2*6', group: 'A', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 0, forecastVsOnHand: 'NaN%', coVsOnHand: 'NaN%' },
  { productCode: '10020201018', productName: 'ผงปรุงรส รสไก่ ตราเต็มพิก 850 ก. 1*6', group: 'A', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 0, forecastVsOnHand: 'NaN%', coVsOnHand: 'NaN%' },
  { productCode: '10020201025', productName: 'ผงปรุงรส รสไก่ ตราเต็มพิก 425 ก. 1*12', group: 'A', forecast: 0, co: 29, carry: 233, fill: -87, onHand: 146, forecastVsOnHand: 'Infinity%', coVsOnHand: '503.45%' },
  { productCode: '10020201030', productName: 'ผงปรุงรส รสหมู ตราฟ้าไทย 425 ก. 1*6', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 0, forecastVsOnHand: 'NaN%', coVsOnHand: 'NaN%' },
  { productCode: '10020201032', productName: 'ผงปรุงรส รสหมู ตราฟ้าไทย 165 ก. 1*6*6', group: 'B', forecast: 0, co: 0, carry: -276, fill: 0, onHand: -276, forecastVsOnHand: '-Infinity%', coVsOnHand: '-Infinity%' },
  { productCode: '10020201035', productName: 'ผงกะหรี่ป่นใส ตราฟ้าไทย 165 ก. 1*6', group: 'B', forecast: 0, co: 5, carry: 293, fill: 0, onHand: 293, forecastVsOnHand: 'Infinity%', coVsOnHand: '5860%' },
  { productCode: '10020201013', productName: 'ผงกะหรี่ป่นใส ตราฟ้าไทย 850 ก. 1*6', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 0, forecastVsOnHand: 'NaN%', coVsOnHand: 'NaN%' },
  { productCode: '10010101021', productName: 'น้ำส้มใส ตราฟ้าไทย 1000 ml. 1*2*3 ซอง', group: 'B', forecast: 0, co: 0, carry: 101, fill: 411, onHand: -103, forecastVsOnHand: 'Infinity%', coVsOnHand: '304.95%' },
  { productCode: '10010401012', productName: 'ผงปรุงรส รสไก่ ตราเต็มพิก 165 ก. 1*4', group: 'B', forecast: 0, co: 0, carry: 0, fill: 488, onHand: 488, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10020101008', productName: 'ผงปรุงรส รสหมู ตราทองคิวทอง 850 ก. 1*6', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 0, forecastVsOnHand: 'NaN%', coVsOnHand: 'NaN%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
]);

function applyFilter() {
  // สามารถเพิ่ม logic ดึงข้อมูลจริงได้
}

function exportExcel() {
  // สามารถเพิ่ม logic export excel ได้
  alert('Export to Excel!');
}

function getPercentClass(val) {
  if (val.includes('Infinity')) return 'text-green-600 font-semibold';
  if (val.includes('NaN') || val.includes('-Infinity')) return 'text-red-500 font-semibold';
  if (val.startsWith('-')) return 'text-red-500 font-semibold';
  return 'text-green-600 font-semibold';
}
</script>

<style scoped>
/* Add any additional custom styles here */
</style> 