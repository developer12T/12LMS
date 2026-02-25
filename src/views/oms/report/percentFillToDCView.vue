<template>
  <div class="flex-1 bg-gray-50 min-h-screen">
    <!-- Filter Section -->
    <div class=" bg-gray-100 dark:bg-gray-800 mb-2">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex flex-wrap items-end gap-x-4 gap-y-2 justify-between">
          <!-- ปุ่ม Export Excel ด้านซ้าย -->
          <div class="flex flex-col justify-start">
          </div>
          <!-- Filter Form -->
          <div class="flex flex-wrap items-end gap-x-4 gap-y-2 justify-center">
            <div>
              <label class="block text-xs font-medium mb-1 flex items-center gap-2">
                <Icon icon="mdi:warehouse" class="w-4 h-4 text-[#00569D]" />
                ศูนย์กระจายสินค้า
              </label>
              <select v-model="filter.dc" class="border border-gray-300 rounded px-2 py-1 text-xs">
                <option value="101">101 | คลังนครปฐม</option>
                <option value="102">102 | คลังอื่น</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium mb-1 flex items-center gap-2">
                <Icon icon="mdi:calendar" class="w-4 h-4 text-[#00569D]" />
                ปี
              </label>
              <select v-model="filter.year" class="border border-gray-300 rounded px-2 py-1 text-xs">
                <option value="2568">2568</option>
                <option value="2567">2567</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium mb-1 flex items-center gap-2">
                <Icon icon="mdi:calendar-month" class="w-4 h-4 text-[#00569D]" />
                เดือน
              </label>
              <select v-model="filter.month" class="border border-gray-300 rounded px-2 py-1 text-xs">
                <option value="1">มกราคม</option>
                <option value="2">กุมภาพันธ์</option>
                <option value="3">มีนาคม</option>
                <option value="4">เมษายน</option>
                <option value="5">พฤษภาคม</option>
                <option value="6">มิถุนายน</option>
                <option value="7">กรกฎาคม</option>
                <option value="8">สิงหาคม</option>
                <option value="9">กันยายน</option>
                <option value="10">ตุลาคม</option>
                <option value="11">พฤศจิกายน</option>
                <option value="12">ธันวาคม</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium mb-1 flex items-center gap-2">
                <Icon icon="mdi:filter" class="w-4 h-4 text-[#00569D]" />
                ตัวกรอง
              </label>
              <select v-model="filter.week" class="border border-gray-300 rounded px-2 py-1 text-xs">
                <option value="all">All Week</option>
                <option value="1">Week 1</option>
                <option value="2">Week 2</option>
                <option value="2">Week 3</option>
                <option value="2">Week 4</option>
              </select>
            </div>
            <div class="flex flex-col">
              <label class="mb-1 text-xs font-medium text-transparent select-none">ค้นหา</label>
              <button type="button" @click="loadData"
                class="h-8 px-3 text-white bg-[#00569D] hover:bg-[#004080] font-medium rounded-lg text-xs flex items-center justify-center focus:ring-2 focus:ring-[#00569D]">
                <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin w-4 h-4 mr-1.5 text-white" />
                <Icon v-else icon="mdi:magnify" width="14" height="14" class="mr-1.5 text-white" />
                {{ isLoading ? 'กำลังโหลด...' : 'ดึงข้อมูล' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 pt-2 mb-2">
        <div class="flex items-center justify-center flex-row">
          <!-- Record Count -->
          <ResultCount :label="'ผลลัพธ์:'" :current="tableData.length" :total="tableData.length"
            icon="mdi:clipboard-list-outline" iconColor="#00569D" class="" />
        </div>
        <div class="flex items-center space-x-4">

          <div class=" flex flex-row gap-1 items-center">
            <button type="button" @click="exportToExcel" :disabled="!(tableData?.length)"
              class="h-7 px-5 text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-xs flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon icon="file-icons:microsoft-excel" width="12" height="12" class="mr-2" />
              Export Excel
            </button>
          </div>
          <!-- Search Input -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icon icon="mdi:magnify" class="w-4 h-4 text-gray-400" />
            </div>
            <input type="text" v-model="searchQuery" placeholder="ค้นหา..."
              class="w-64 pl-10 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400">
          </div>
        </div>
      </div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg p-2 pt-0" style="max-height: calc(100vh - 240px);">
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
import ResultCount from '@/components/ResultCount.vue';

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
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
  { productCode: '10052001002', productName: 'ผงชูรส ตราภากษะ 1 kg 1*12', group: 'B', forecast: 0, co: 0, carry: 0, fill: 0, onHand: 757, forecastVsOnHand: 'Infinity%', coVsOnHand: 'Infinity%' },
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