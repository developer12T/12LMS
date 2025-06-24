<template>
  <div class="flex-1 bg-gray-50 min-h-screen">
  

    <div class="flex flex-col md:flex-row gap-6">
      <!-- Condition/Filter Section -->
      <div class="w-full md:w-1/4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit">
        <h2 class="text-base font-semibold mb-2">เงื่อนไข:</h2>
        <div class="mb-2">
          <label class="block text-xs font-medium mb-1">ศูนย์กระจายสินค้า:</label>
          <select v-model="filter.dc" class="w-full border border-gray-300 rounded px-2 py-1 text-xs mb-2">
            <option value="101">101 | คลังนครปฐม</option>
            <option value="102">102 | คลังมหาสารคาม</option>
          </select>
          <label class="block text-xs font-medium mb-1">ปี:</label>
          <select v-model="filter.year" class="w-full border border-gray-300 rounded px-2 py-1 text-xs mb-2">
            <option value="2568">2568</option>
            <option value="2567">2567</option>
          </select>
          <div class="flex items-center mb-2">
            <input v-model="filter.allDC" type="checkbox" id="all-dc" class="mr-2" />
            <label for="all-dc" class="text-xs">ทุกศูนย์กระจายสินค้า</label>
          </div>
          <div class="flex items-center mb-2">
            <input v-model="filter.showMonth" type="checkbox" id="show-month" class="mr-2" />
            <label for="show-month" class="text-xs">แสดงเดือนในอนาคตเป็นตั๋วไปแผนผลิตระหว่างวันที่:</label>
          </div>
          <input v-model="filter.dateRange" type="text" class="w-full border border-gray-300 rounded px-2 py-1 text-xs mb-2" placeholder="1 มิ.ย. 2025 - 30 มิ.ย. 2025" />
          <input v-model="filter.search" type="text" class="w-full border border-gray-300 rounded px-2 py-1 text-xs mb-2" placeholder="ค้นหา" />
        </div>
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
                <th class="px-2 py-2 text-center">รหัสสินค้า</th>
                <th class="px-2 py-2 text-center">ชื่อสินค้า</th>
                <th class="px-2 py-2 text-center">วางแผนผลิต</th>
                <th class="px-2 py-2 text-center">จำนวนสินค้าที่ผลิตจริง</th>
                <th class="px-2 py-2 text-center">On Hand</th>
                <th class="px-2 py-2 text-center">จำนวนตั้งซื้อ</th>
                <th class="px-2 py-2 text-center">จำนวนผลต่าง</th>
                <th class="px-2 py-2 text-center">Safety Stock</th>
                <th class="px-2 py-2 text-center">Sale Forecast</th>
                <th class="px-2 py-2 text-center">Stock Cover Day</th>
                <th class="px-2 py-2 text-center">Safety Stock Cover Day</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in tableData" :key="idx" :class="idx % 2 === 1 ? 'bg-gray-100' : 'bg-white'">
                <td class="px-2 py-1 text-center">{{ item.productCode }}</td>
                <td class="px-2 py-1">{{ item.productName }}</td>
                <td class="px-2 py-1 text-center">{{ item.plan }}</td>
                <td class="px-2 py-1 text-center">{{ item.actual }}</td>
                <td class="px-2 py-1 text-center">{{ item.onHand }}</td>
                <td class="px-2 py-1 text-center">{{ item.poQty }}</td>
                <td class="px-2 py-1 text-center" :class="item.diff < 0 ? 'text-red-500' : ''">{{ item.diff }}</td>
                <td class="px-2 py-1 text-center">{{ item.safetyStock }}</td>
                <td class="px-2 py-1 text-center">{{ item.saleForecast }}</td>
                <td class="px-2 py-1 text-center">{{ item.stockCoverDay }}</td>
                <td class="px-2 py-1 text-center">{{ item.safetyStockCoverDay }}</td>
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

const filter = ref({
  dc: '102',
  year: '2568',
  allDC: false,
  showMonth: false,
  dateRange: '1 มิ.ย. 2025 - 30 มิ.ย. 2025',
  search: '',
});

const tableData = ref([
  { productCode: '10010101034', productName: 'ฟ้าไทยผงปรุงรสหมู 75g', plan: '-', actual: 33967, onHand: 164, poQty: 69, diff: 95, safetyStock: '-', saleForecast: '-', stockCoverDay: '-', safetyStockCoverDay: '-' },
  { productCode: '10010101035', productName: 'ฟ้าไทยผงปรุงรสหมู 165g', plan: '-', actual: 85396, onHand: 64, poQty: 118, diff: -54, safetyStock: '-', saleForecast: '-', stockCoverDay: '-', safetyStockCoverDay: '-' },
  { productCode: '10010101050', productName: 'ฟ้าไทยผงปรุงรสหมู 1500g', plan: '-', actual: 21276, onHand: 111, poQty: 7, diff: 104, safetyStock: '-', saleForecast: '-', stockCoverDay: '-', safetyStockCoverDay: '-' },
  { productCode: '10010101067', productName: 'ฟ้าไทยผงปรุงรสหมู 12g', plan: '-', actual: 515, onHand: '-', poQty: 300, diff: -300, safetyStock: '-', saleForecast: '-', stockCoverDay: '-', safetyStockCoverDay: '-' },
  { productCode: '10010101092', productName: 'ฟ้าไทยผงปรุงรสหมู 800g x10ซอง', plan: '-', actual: 75309, onHand: 862, poQty: 9, diff: 853, safetyStock: '-', saleForecast: '-', stockCoverDay: '-', safetyStockCoverDay: '-' },
  { productCode: '10010101094', productName: 'ฟ้าไทยผงปรุงรสหมู 1200g x10ซอง', plan: '-', actual: 25057, onHand: 276, poQty: 27, diff: 249, safetyStock: '-', saleForecast: '-', stockCoverDay: '-', safetyStockCoverDay: '-' },
  { productCode: '10010201018', productName: 'ฟ้าไทยผงปรุงรสไก่ 75g', plan: '-', actual: 4437, onHand: 53, poQty: 2, diff: 51, safetyStock: '-', saleForecast: '-', stockCoverDay: '-', safetyStockCoverDay: '-' },
  { productCode: '10010201019', productName: 'ฟ้าไทยผงปรุงรสไก่ 75g', plan: '-', actual: 2687, onHand: 98, poQty: 3, diff: 95, safetyStock: 80, saleForecast: '-', stockCoverDay: '-', safetyStockCoverDay: 1.23 },
  { productCode: '10010301018', productName: 'ฟ้าไทยผงปรุงรสเนื้อ 165g', plan: '-', actual: 9206, onHand: 150, poQty: 3, diff: 147, safetyStock: 72, saleForecast: '-', stockCoverDay: '-', safetyStockCoverDay: 2.08 },
]);

function downloadData() {
  // สามารถเพิ่ม logic ดาวน์โหลดข้อมูลจริงได้
  alert('ดาวน์โหลดข้อมูล!');
}
</script>

<style scoped>
/* Add any additional custom styles here */
</style> 