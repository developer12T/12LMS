<template>
  <div class="w-full px-4" style="max-width: calc(100vw - 100px);">
    <div class="space-y-6">
      <!-- Filter Section (แนวนอน ปรับดีไซน์ ปุ่มชิดขวา) -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 py-3">
        <div class="flex flex-row flex-wrap justify-end items-end gap-x-4 gap-y-2">
          <!-- ศูนย์กระจายสินค้า -->
          <div class="flex flex-col">
            <label class="block text-xs font-medium mb-1 flex items-center">
              <Icon icon="mdi:warehouse" class="w-4 h-4 text-[#00569D] mr-1" />
              ศูนย์กระจายสินค้า
            </label>
            <div class="relative">
              <select v-model="filter.dc"
                class="border border-gray-300 rounded px-2 py-1 text-xs w-full min-w-0 bg-white focus:border-[#00569D] focus:ring-1 focus:ring-[#00569D] appearance-none cursor-pointer">
                <option value="110">110 | คลังนนทบุรี</option>
                <option value="101">101 | คลังนครปฐม</option>
                <option value="102">102 | คลังมหาสารคาม</option>
              </select>
              <!-- <Icon icon="mdi:chevron-down"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" /> -->
            </div>
          </div>

          <!-- ปี -->
          <div class="flex flex-col">
            <label class="block text-xs font-medium mb-1 flex items-center">
              <Icon icon="mdi:calendar" class="w-4 h-4 text-[#00569D] mr-1" />
              ปี
            </label>
            <div class="relative">
              <select v-model="filter.year"
                class="border border-gray-300 rounded px-2 py-1 text-xs w-full min-w-0 bg-white focus:border-[#00569D] focus:ring-1 focus:ring-[#00569D] appearance-none cursor-pointer">
                <option value="2569">2569</option>
                <option value="2568">2568</option>
                <option value="2567">2567</option>
              </select>
              <!-- <Icon icon="mdi:chevron-down"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" /> -->
            </div>
          </div>

          <!-- ช่วงวันที่ -->
          <div class="flex flex-col">
            <label class="block text-xs font-medium mb-1 flex items-center">
              <Icon icon="mdi:calendar-range" class="w-4 h-4 text-[#00569D] mr-1" />
              ช่วงวันที่
            </label>
            <div class="flex items-center border border-gray-300 rounded px-2 py-1 text-xs bg-gray-50 w-full min-w-0">
              <Icon icon="mdi:calendar-clock" class="w-4 h-4 mr-1 text-[#00569D]" />
              <span class="truncate">1 มิ.ย. 2025 - 30 มิ.ย. 2025</span>
            </div>
          </div>

          <!-- ตัวกรอง -->
          <div class="flex flex-col ">
            <label class="block text-xs font-medium mb-1 flex items-center">
              <Icon icon="mdi:filter" class="w-4 h-4 text-[#00569D] mr-1" />
              ตัวกรอง
            </label>
            <div class="flex items-center border border-gray-300 rounded px-2 py-1 bg-gray-50">
              <input v-model="filter.showMonth" type="checkbox" id="show-month"
                class="w-4 h-4 text-[#00569D] bg-white border-gray-300 rounded focus:ring-[#00569D] focus:ring-2 cursor-pointer" />
              <label for="show-month"
                class="ml-2 text-xs text-gray-700 font-medium cursor-pointer select-none">แสดงเดือนปัจจุบันเป็นต้นไป</label>
            </div>
          </div>

          <!-- ปุ่มค้นหา -->
          <div class="flex-shrink-0 self-end">
            <button type="submit"
              class="flex items-center gap-1 bg-[#8CB4D5] hover:bg-[#6B9AC4] text-white text-xs font-medium rounded px-4 py-1.5 transition-colors shadow min-w-[80px] justify-center">
              <Icon icon="mdi:magnify" class="w-4 h-4" />
              ดึงข้อมูล
            </button>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-0 w-full">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between px-4 pt-2">
          <div class="flex items-center justify-center flex-row">
            <!-- Record Count -->
            <ResultCount
              :label="'ผลลัพธ์:'"
              :current="searchQuery ? filteredTableData.length : null"
              :total="tableData.length"
              icon="mdi:table"
              iconColor="#00569D"
              class=""
            />
          </div>
          <div class="flex items-center space-x-4">
            <div class=" flex flex-row gap-1 items-center">
              <button type="button" @click="exportToExcel" :disabled="!tableData.length"
                class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Icon icon="file-icons:microsoft-excel" width="16" height="16" class="mr-1.5" />
                Export Excel
              </button>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon icon="mdi:magnify" class="w-4 h-4 text-gray-400" />
              </div>
              <input type="text" v-model="searchQuery" placeholder="ค้นหา..."
                class="w-64 pl-10 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400">
            </div>
          </div>
        </div>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg max-h-[70vh] p-4 py-2">
          <table class="w-full text-xs text-left text-gray-500 border-collapse border border-gray-300 min-w-[1200px]">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
              <tr>
                <th class="px-2 py-2 text-center">รหัสสินค้า</th>
                <th class="px-2 py-2 text-center">ชื่อสินค้า</th>
                <th class="px-2 py-2 text-center">วางแผนผลิต</th>
                <th class="px-2 py-2 text-center">จำนวนสินค้าที่ผลิตจริง</th>
                <th class="px-2 py-2 text-center">On Hand</th>
                <th class="px-2 py-2 text-center">จำนวนสั่งซื้อ</th>
                <th class="px-2 py-2 text-center">จำนวนผลต่าง</th>
                <th class="px-2 py-2 text-center">Safety Stock</th>
                <th class="px-2 py-2 text-center">Sale Forecast</th>
                <th class="px-2 py-2 text-center">Stock Cover Day</th>
                <th class="px-2 py-2 text-center">Safety Stock Cover Day</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in tableData" :key="idx" :class="idx % 2 === 1 ? 'bg-gray-100' : 'bg-white'" class="cursor-pointer hover:bg-blue-100 transition-colors duration-100" @click="openModal(item)">
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

      <!-- Modal Popup -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fade-in">
          <button @click="showModal = false" class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl">&times;</button>
          <h3 class="text-lg font-bold mb-4 text-[#00569D]">รายละเอียดสินค้า</h3>
          <div class="text-sm space-y-2">
            <div><span class="font-medium">รหัสสินค้า:</span> {{ selectedRow.productCode }}</div>
            <div><span class="font-medium">ชื่อสินค้า:</span> {{ selectedRow.productName }}</div>
            <div><span class="font-medium">วางแผนผลิต:</span> {{ selectedRow.plan }}</div>
            <div><span class="font-medium">จำนวนสินค้าที่ผลิตจริง:</span> {{ selectedRow.actual }}</div>
            <div><span class="font-medium">On Hand:</span> {{ selectedRow.onHand }}</div>
            <div><span class="font-medium">จำนวนสั่งซื้อ:</span> {{ selectedRow.poQty }}</div>
            <div><span class="font-medium">จำนวนผลต่าง:</span> {{ selectedRow.diff }}</div>
            <div><span class="font-medium">Safety Stock:</span> {{ selectedRow.safetyStock }}</div>
            <div><span class="font-medium">Sale Forecast:</span> {{ selectedRow.saleForecast }}</div>
            <div><span class="font-medium">Stock Cover Day:</span> {{ selectedRow.stockCoverDay }}</div>
            <div><span class="font-medium">Safety Stock Cover Day:</span> {{ selectedRow.safetyStockCoverDay }}</div>
          </div>
          <div class="mt-6 text-right">
            <button @click="showModal = false" class="px-4 py-1.5 bg-[#00569D] text-white rounded hover:bg-[#004080]">ปิด</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import ResultCount from '@/components/ResultCount.vue';

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

const searchQuery = ref('');
const filteredTableData = computed(() => {
  if (!searchQuery.value) return tableData.value;
  const term = searchQuery.value.toLowerCase();
  return tableData.value.filter(item =>
    item.productCode.toString().includes(term) ||
    item.productName.toLowerCase().includes(term)
  );
});

// Modal state
const showModal = ref(false)
const selectedRow = ref({})
function openModal(row) {
  selectedRow.value = row
  showModal.value = true
}

function downloadData() {
  // สามารถเพิ่ม logic ดาวน์โหลดข้อมูลจริงได้
  alert('ดาวน์โหลดข้อมูล!');
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-in;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
</style>