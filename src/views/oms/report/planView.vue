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
          <table class="w-full text-xs text-left text-gray-500 border-collapse border border-gray-300">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
              <tr>
                <th class="px-2 py-2 text-center">รหัสสินค้า</th>
                <th class="px-2 py-2 text-center">ชื่อสินค้า</th>
                <th class="px-2 py-2 text-center">On Hand</th>
                <th class="px-2 py-2 text-center">จำนวนสั่งซื้อ</th>
                <th class="px-2 py-2 text-center">จำนวนผลต่างจำนวนสั่งซื้อ</th>
                <th class="px-2 py-2 text-center">Safety Stock</th>
                <th class="px-2 py-2 text-center">Stock Cover Day</th>
                <th class="px-2 py-2 text-center">จำนวนผลต่าง Safety Stock</th>
                <th class="px-2 py-2 text-center">PO เปิดซื้อเติมสินค้า</th>
                <th class="px-2 py-2 text-center">จำนวนที่รับตาม PO</th>
                <th class="px-2 py-2 text-center">จำนวนผลต่าง PO เปิดซื้อ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in tableData" :key="idx" :class="idx % 2 === 1 ? 'bg-gray-100' : 'bg-white'">
                <td class="px-2 py-1 text-center">{{ item.productCode }}</td>
                <td class="px-2 py-1">{{ item.productName }}</td>
                <td class="px-2 py-1 text-center">{{ item.onHand }}</td>
                <td class="px-2 py-1 text-center">
                  <router-link :to="{ name: 'OrderDetail', params: { productCode: item.productCode }, query: { productName: item.productName } }" class="text-blue-700 underline font-bold">
                    {{ item.poQty }}
                  </router-link>
                </td>
                <td class="px-2 py-1 text-center" :class="item.diffOrder < 0 ? 'text-red-500' : ''">{{ item.diffOrder }}</td>
                <td class="px-2 py-1 text-center">{{ item.safetyStock }}</td>
                <td class="px-2 py-1 text-center">{{ item.stockCoverDay }}</td>
                <td class="px-2 py-1 text-center" :class="item.diffSafety < 0 ? 'text-red-500' : ''">{{ item.diffSafety }}</td>
                <td class="px-2 py-1 text-center">{{ item.poOpen }}</td>
                <td class="px-2 py-1 text-center">{{ item.poReceived }}</td>
                <td class="px-2 py-1 text-center" :class="item.diffPO < 0 ? 'text-red-500' : ''">{{ item.diffPO }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import ResultCount from '@/components/ResultCount.vue';
import VueDatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';

const filter = ref({
  dc: '102',
  year: '2568',
  allDC: false,
  showMonth: false,
  dateRange: '1 มิ.ย. 2025 - 30 มิ.ย. 2025',
  search: '',
});

const tableData = ref([
  {
    productCode: '10010101018', productName: 'ฟ้าไทยผงปรุงหมู 1200g', onHand: 309, poQty: 5, diffOrder: 304, safetyStock: 100, stockCoverDay: 3, diffSafety: 204, poOpen: 2000, poReceived: 300, diffPO: -1700
  },
  {
    productCode: '10010101024', productName: 'ฟ้าไทยผงปรุงหมู 850g', onHand: 351, poQty: 62, diffOrder: 289, safetyStock: 200, stockCoverDay: 3, diffSafety: 89, poOpen: 2000, poReceived: 500, diffPO: -1500
  },
  {
    productCode: '10010101029', productName: 'ฟ้าไทยผงปรุงหมู 165g+ชิล', onHand: 542, poQty: 81, diffOrder: 461, safetyStock: 300, stockCoverDay: 5, diffSafety: 61, poOpen: 1500, poReceived: 800, diffPO: -700
  },
  {
    productCode: '10010101030', productName: 'ฟ้าไทยผงปรุงหมู 425g', onHand: 92, poQty: 2, diffOrder: 90, safetyStock: 100, stockCoverDay: 15, diffSafety: -8, poOpen: 300, poReceived: 300, diffPO: 0
  },
  {
    productCode: '10010101050', productName: 'ฟ้าไทยผงปรุงหมู 500g', onHand: 697, poQty: 3, diffOrder: 694, safetyStock: 200, stockCoverDay: 20, diffSafety: 14, poOpen: 200, poReceived: 100, diffPO: -100
  },
  {
    productCode: '10010101073', productName: 'ฟ้าไทยผงปรุงหมู 850g+ข้าวสาร', onHand: 28, poQty: 50, diffOrder: -22, safetyStock: 50, stockCoverDay: 21, diffSafety: -72, poOpen: 100, poReceived: 100, diffPO: 0
  },
  {
    productCode: '10010101094', productName: 'ฟ้าไทยผงปรุงหมู 165g+ชิล', onHand: 38, poQty: 10, diffOrder: 28, safetyStock: 30, stockCoverDay: 6, diffSafety: -78, poOpen: 100, poReceived: 40, diffPO: -60
  },
  {
    productCode: '10010101095', productName: 'ฟ้าไทยผงปรุงหมู 850g', onHand: 232, poQty: 3, diffOrder: 229, safetyStock: 300, stockCoverDay: 12, diffSafety: -106, poOpen: 800, poReceived: 200, diffPO: -600
  },
  {
    productCode: '10010101099', productName: 'ฟ้าไทยผงปรุงหมู 165g', onHand: 197, poQty: 3, diffOrder: 194, safetyStock: 200, stockCoverDay: 15, diffSafety: -106, poOpen: 800, poReceived: 200, diffPO: -600
  },
  {
    productCode: '10010401020', productName: 'ฟ้าไทยผงปรุงซุปน้ำใส 850g', onHand: 394, poQty: 30, diffOrder: 364, safetyStock: 300, stockCoverDay: 7, diffSafety: -36, poOpen: 600, poReceived: 400, diffPO: -200
  },
  {
    productCode: '10010401021', productName: 'ฟ้าไทยผงปรุงซุปน้ำใส 165g', onHand: 394, poQty: 86, diffOrder: 308, safetyStock: 1000, stockCoverDay: 1, diffSafety: -249, poOpen: 400, poReceived: 300, diffPO: -100
  },
  {
    productCode: '10010401022', productName: 'ฟ้าไทยผงปรุงซุปน้ำใส 165g', onHand: 182, poQty: 7, diffOrder: 175, safetyStock: 300, stockCoverDay: 5, diffSafety: -125, poOpen: 500, poReceived: 180, diffPO: -320
  },
  {
    productCode: '10010401023', productName: 'ฟ้าไทยผงปรุงซุปน้ำใส 165g', onHand: '3,363', poQty: 83, diffOrder: '3,280', safetyStock: 2500, stockCoverDay: 16, diffSafety: 280, poOpen: 12000, poReceived: 4000, diffPO: -8000
  },
  {
    productCode: '10010401024', productName: 'ฟ้าไทยผงปรุงซุปน้ำใส 165g', onHand: '2,581', poQty: 45, diffOrder: '2,536', safetyStock: 8000, stockCoverDay: 45, diffSafety: 45, poOpen: 8000, poReceived: 2500, diffPO: -5500
  },
  {
    productCode: '10010401025', productName: 'ฟ้าไทยผงปรุงซุปน้ำใส 165g', onHand: 176, poQty: 2, diffOrder: 174, safetyStock: 500, stockCoverDay: 7, diffSafety: -67, poOpen: 500, poReceived: 200, diffPO: -300
  },
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

// Mock order details
const orderDetails = ref([
  { warehouse: '110', orderNo: '650722070', srDate: '20220729', deliveryDate: '20220801', customerCode: '15000409', customerName: 'ประเสริฐ เพิ่มสิริบัญญา(กิมเอ็งพานิช)', billQty: 5, unit: 'CTN' },
  { warehouse: '110', orderNo: '650723096', srDate: '20220728', deliveryDate: '20220802', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
  { warehouse: '110', orderNo: '650724129', srDate: '20220729', deliveryDate: '20220802', customerCode: '13230019', customerName: 'ร้านน้องเบียร์', billQty: 1, unit: 'CTN' },
  { warehouse: '110', orderNo: '650724130', srDate: '20220730', deliveryDate: '20220802', customerCode: '18000038', customerName: 'ร้านบุญส่ง', billQty: 4, unit: 'CTN' },
  { warehouse: '110', orderNo: '650724132', srDate: '20220730', deliveryDate: '20220802', customerCode: '12110019', customerName: 'เยียร์วัช', billQty: 4, unit: 'CTN' },
  { warehouse: '110', orderNo: '650724133', srDate: '20220730', deliveryDate: '20220802', customerCode: '12150027', customerName: 'ร้านกระต่าย', billQty: 2, unit: 'CTN' },
  { warehouse: '110', orderNo: '650724135', srDate: '20220730', deliveryDate: '20220802', customerCode: '12000027', customerName: 'บริษัท เอส เค บี โซลเซล จำกัด', billQty: 2, unit: 'CTN' },
  { warehouse: '110', orderNo: '650724136', srDate: '20220730', deliveryDate: '20220802', customerCode: '12120106', customerName: 'ร้านบุญคา ค้าข้าว', billQty: 1, unit: 'CTN' },
  { warehouse: '110', orderNo: '650724131', srDate: '20220730', deliveryDate: '20220802', customerCode: '11100069', customerName: 'พี่ใหม่', billQty: 5, unit: 'CTN' },
  { warehouse: '110', orderNo: '650746088', srDate: '20220730', deliveryDate: '20220803', customerCode: '18110006', customerName: 'คุณนันทชัย รัชฎาภรณ์(ร้านพี่นุ้ย)', billQty: 1, unit: 'CTN' },
  { warehouse: '110', orderNo: '650746091', srDate: '20220730', deliveryDate: '20220803', customerCode: '12140005', customerName: 'เปี๊ยบภาเหล็ก', billQty: 1, unit: 'CTN' },
  { warehouse: '110', orderNo: '650750215', srDate: '20220801', deliveryDate: '20220804', customerCode: '65000015', customerName: 'คุณพรทิพย์', billQty: 20, unit: 'CTN' },
  { warehouse: '110', orderNo: '650750216', srDate: '20220801', deliveryDate: '20220804', customerCode: '65000036', customerName: 'ร้านรัศมีการค้า', billQty: 15, unit: 'CTN' },
  { warehouse: '110', orderNo: '650720607', srDate: '20220730', deliveryDate: '20220804', customerCode: '14000094', customerName: 'บริษัท อีคอมเมิร์ซเฮ้าส์ จำกัด', billQty: 4, unit: 'CTN' },
  { warehouse: '110', orderNo: '650723056', srDate: '20220730', deliveryDate: '20220805', customerCode: '14000094', customerName: 'นางบุญฤทธิ์ สุภาใส (ป้าช้าง)', billQty: 5, unit: 'CTN' },
  { warehouse: '110', orderNo: '650723094', srDate: '20220730', deliveryDate: '20220805', customerCode: '17140003', customerName: 'คุณสมจิตต์ ศรแผง(อมรบรรจุภัณฑ์)', billQty: 5, unit: 'CTN' },
  { warehouse: '110', orderNo: '650723094', srDate: '20220730', deliveryDate: '20220805', customerCode: '17130006', customerName: 'ลุงเสริฐ', billQty: 7, unit: 'CTN' },
]);

const dateRange = ref([null, null]);

const filteredOrderDetails = computed(() => {
  if (!dateRange.value || !dateRange.value[0] || !dateRange.value[1]) return orderDetails.value;
  const [start, end] = dateRange.value;
  return orderDetails.value.filter(order => {
    return order.deliveryDate >= start && order.deliveryDate <= end;
  });
});

const orderSummary = computed(() => {
  // mock summary
  return {
    total: 30,
    stock: selectedRow.value.onHand || 0,
    diff: selectedRow.value.diffOrder || 0,
  };
});

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