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
                <th class="px-2 py-2 text-center">F-plus นครปฐม</th>
                <th class="px-2 py-2 text-center">Balance 12 T</th>
                <th class="px-2 py-2 text-center">นครปฐม</th>
                <th class="px-2 py-2 text-center">สารคาม</th>
                <th class="px-2 py-2 text-center">ลำพูน</th>
                <th class="px-2 py-2 text-center">สุราษฎร์</th>
                <th class="px-2 py-2 text-center">บางนา</th>
                <th class="px-2 py-2 text-center">นครราชสีมา</th>
                <th class="px-2 py-2 text-center">นนทบุรี</th>
                <th class="px-2 py-2 text-center">นครปฐม2</th>
                <th class="px-2 py-2 text-center">1-ส.ค.</th>
                <th class="px-2 py-2 text-center">2-ส.ค.</th>
                <th class="px-2 py-2 text-center">3-ส.ค.</th>
                <th class="px-2 py-2 text-center">4-ส.ค.</th>
                <th class="px-2 py-2 text-center">5-ส.ค.</th>
                <th class="px-2 py-2 text-center">6-ส.ค.</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in tableData" :key="idx" :class="idx % 2 === 1 ? 'bg-gray-100' : 'bg-white'" class="cursor-pointer hover:bg-blue-100 transition-colors duration-100" @click="openModal(item)">
                <td class="px-2 py-1 text-center">{{ item.productCode }}</td>
                <td class="px-2 py-1">{{ item.productName }}</td>
                <td class="px-2 py-1 text-center text-blue-600 underline cursor-pointer" @click.stop="handleCellClick(item, 'fplusNakhonPathom')">{{ item.fplusNakhonPathom }}</td>
                <td class="px-2 py-1 text-center text-blue-600 underline cursor-pointer" @click.stop="handleCellClick(item, 'balance12T')">{{ item.balance12T }}</td>
                <td class="px-2 py-1 text-center text-blue-600 underline cursor-pointer" @click.stop="handleCellClick(item, 'nakhonPathom')">{{ item.nakhonPathom }}</td>
                <td class="px-2 py-1 text-center text-blue-600 underline cursor-pointer" @click.stop="handleCellClick(item, 'sarakham')" :class="item.sarakham < 0 ? 'text-red-500' : ''">{{ item.sarakham }}</td>
                <td class="px-2 py-1 text-center text-blue-600 underline cursor-pointer" @click.stop="handleCellClick(item, 'lamphun')">{{ item.lamphun }}</td>
                <td class="px-2 py-1 text-center text-blue-600 underline cursor-pointer" @click.stop="handleCellClick(item, 'surat')">{{ item.surat }}</td>
                <td class="px-2 py-1 text-center text-blue-600 underline cursor-pointer" @click.stop="handleCellClick(item, 'bangna')">{{ item.bangna }}</td>
                <td class="px-2 py-1 text-center text-blue-600 underline cursor-pointer" @click.stop="handleCellClick(item, 'nakhonRatchasima')">{{ item.nakhonRatchasima }}</td>
                <td class="px-2 py-1 text-center text-blue-600 underline cursor-pointer" @click.stop="handleCellClick(item, 'nonthaburi')" :class="item.nonthaburi < 0 ? 'text-red-500' : ''">{{ item.nonthaburi }}</td>
                <td class="px-2 py-1 text-center text-blue-600 underline cursor-pointer" @click.stop="handleCellClick(item, 'nakhonPathom2')">{{ item.nakhonPathom2 }}</td>
                <td class="px-2 py-1 text-center">{{ item.aug1 }}</td>
                <td class="px-2 py-1 text-center">{{ item.aug2 }}</td>
                <td class="px-2 py-1 text-center">{{ item.aug3 }}</td>
                <td class="px-2 py-1 text-center">{{ item.aug4 }}</td>
                <td class="px-2 py-1 text-center">{{ item.aug5 }}</td>
                <td class="px-2 py-1 text-center">{{ item.aug6 }}</td>
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
import { useRouter } from 'vue-router';

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
    productCode: '10010201053',
    productName: 'ผงปรุงรสไก่ ฟ้าไทย 12g x12x20',
    fplusNakhonPathom: 0,
    balance12T: 81,
    nakhonPathom: 0,
    sarakham: -2,
    lamphun: 11,
    surat: 11,
    bangna: 0,
    nakhonRatchasima: 0,
    nonthaburi: 21,
    nakhonPathom2: 40,
    aug1: 0,
    aug2: 0,
    aug3: 0,
    aug4: 0,
    aug5: 0,
    aug6: 320,
  },
  {
    productCode: '10010201054',
    productName: 'ผงปรุงรสไก่ ฟ้าไทย 12g x24x10 ชนิดเผ็ด',
    fplusNakhonPathom: 0,
    balance12T: 77,
    nakhonPathom: 0,
    sarakham: -1,
    lamphun: 14,
    surat: 3,
    bangna: 3,
    nakhonRatchasima: 0,
    nonthaburi: 13,
    nakhonPathom2: 12,
    aug1: 600,
    aug2: 450,
    aug3: 600,
    aug4: 0,
    aug5: 0,
    aug6: 0,
  },
  {
    productCode: '10010201011',
    productName: 'ผงกะหรี่ญี่ปุ่นข้น ฟ้าไทย 75g x10x8',
    fplusNakhonPathom: 0,
    balance12T: 154,
    nakhonPathom: 276,
    sarakham: 192,
    lamphun: 117,
    surat: 117,
    bangna: 0,
    nakhonRatchasima: 226,
    nonthaburi: 190,
    nakhonPathom2: 193,
    aug1: 1200,
    aug2: 900,
    aug3: 0,
    aug4: 0,
    aug5: 0,
    aug6: 0,
  },
  {
    productCode: '10010201013',
    productName: 'ผงปรุงรสไก่ เติมทิพ ฟ้าไทย 75g x10x8',
    fplusNakhonPathom: 585,
    balance12T: 3674,
    nakhonPathom: 2,
    sarakham: 3,
    lamphun: 12,
    surat: 3048,
    bangna: -164,
    nakhonRatchasima: 13,
    nonthaburi: 41,
    nakhonPathom2: 356,
    aug1: 0,
    aug2: 0,
    aug3: 0,
    aug4: 0,
    aug5: 0,
    aug6: 1400,
  },
  {
    productCode: '10010201008',
    productName: 'ผงปรุงรสไก่ เติมทิพ ฟ้าไทย 75g x10x8',
    fplusNakhonPathom: 0,
    balance12T: 469,
    nakhonPathom: 61,
    sarakham: 4,
    lamphun: 3,
    surat: 284,
    bangna: 33,
    nakhonRatchasima: 33,
    nonthaburi: -26,
    nakhonPathom2: 46,
    aug1: 0,
    aug2: 0,
    aug3: 700,
    aug4: 0,
    aug5: 0,
    aug6: 0,
  },
  {
    productCode: '10010201018',
    productName: 'ผงปรุงรสไก่ ฟ้าไทย 75g x10x8 แถมช้อนส้อม',
    fplusNakhonPathom: 1,
    balance12T: 209,
    nakhonPathom: 0,
    sarakham: 2,
    lamphun: 10,
    surat: 32,
    bangna: 0,
    nakhonRatchasima: 56,
    nonthaburi: 74,
    nakhonPathom2: 31,
    aug1: 0,
    aug2: 0,
    aug3: 0,
    aug4: 0,
    aug5: 0,
    aug6: 0,
  },
  {
    productCode: '10010201017',
    productName: 'ผงปรุงรสไก่ ฟ้าไทย 165g x6x6 แถมช้อนส้อม',
    fplusNakhonPathom: 753,
    balance12T: 3681,
    nakhonPathom: 0,
    sarakham: -289,
    lamphun: 677,
    surat: 45,
    bangna: 441,
    nakhonRatchasima: 677,
    nonthaburi: -461,
    nakhonPathom2: 1091,
    aug1: 0,
    aug2: 0,
    aug3: 0,
    aug4: 0,
    aug5: 0,
    aug6: 0,
  },
  {
    productCode: '10010301019',
    productName: 'ผงปรุงรสไก่ เติมทิพ ฟ้าไทย 165g x6x6',
    fplusNakhonPathom: 1374,
    balance12T: 1236,
    nakhonPathom: 54,
    sarakham: 104,
    lamphun: 217,
    surat: 92,
    bangna: 135,
    nakhonRatchasima: 135,
    nonthaburi: 194,
    nakhonPathom2: 254,
    aug1: 0,
    aug2: 0,
    aug3: 0,
    aug4: 900,
    aug5: 900,
    aug6: 0,
  },
  {
    productCode: '10010601012',
    productName: 'ผงกะหรี่ญี่ปุ่นข้น ฟ้าไทย 165g x6x6',
    fplusNakhonPathom: 590,
    balance12T: 1596,
    nakhonPathom: 248,
    sarakham: 349,
    lamphun: 15,
    surat: 16,
    bangna: -40,
    nakhonRatchasima: 56,
    nonthaburi: 37,
    nakhonPathom2: 87,
    aug1: 0,
    aug2: 0,
    aug3: 0,
    aug4: 900,
    aug5: 900,
    aug6: 0,
  },
  {
    productCode: '10010201014',
    productName: 'ผงปรุงรสไก่ ฟ้าไทย 165g x6x6 แถมช้อนส้อม',
    fplusNakhonPathom: 0,
    balance12T: 172,
    nakhonPathom: 0,
    sarakham: 0,
    lamphun: 15,
    surat: 16,
    bangna: 0,
    nakhonRatchasima: 0,
    nonthaburi: 0,
    nakhonPathom2: 0,
    aug1: 0,
    aug2: 0,
    aug3: 0,
    aug4: 300,
    aug5: 300,
    aug6: 0,
  },
  {
    productCode: '10010401018',
    productName: 'ฟ้าไทยผงปรุงรสหมู 185g MT',
    fplusNakhonPathom: 0,
    balance12T: 840,
    nakhonPathom: 0,
    sarakham: 0,
    lamphun: 0,
    surat: 0,
    bangna: 0,
    nakhonRatchasima: 0,
    nonthaburi: 0,
    nakhonPathom2: 0,
    aug1: 0,
    aug2: 0,
    aug3: 155,
    aug4: 0,
    aug5: 0,
    aug6: 0,
  },
  {
    productCode: '10010201053',
    productName: 'ผงปรุงรสไก่ ฟ้าไทย 165g x6x6 (Export)',
    fplusNakhonPathom: 0,
    balance12T: 30,
    nakhonPathom: 0,
    sarakham: 0,
    lamphun: 0,
    surat: 0,
    bangna: 0,
    nakhonRatchasima: 0,
    nonthaburi: 0,
    nakhonPathom2: 0,
    aug1: 0,
    aug2: 0,
    aug3: 154,
    aug4: 0,
    aug5: 0,
    aug6: 0,
  },
  {
    productCode: '10010401017',
    productName: 'ผงกะหรี่ญี่ปุ่นข้น ฟ้าไทย 425g x12',
    fplusNakhonPathom: 300,
    balance12T: 309,
    nakhonPathom: 0,
    sarakham: 0,
    lamphun: 0,
    surat: 0,
    bangna: 0,
    nakhonRatchasima: 49,
    nonthaburi: 15,
    nakhonPathom2: 83,
    aug1: 0,
    aug2: 0,
    aug3: 0,
    aug4: 0,
    aug5: 0,
    aug6: 0,
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

const router = useRouter();

function handleCellClick(item, column) {
  router.push({
    name: 'plan-total-detail',
    query: { column }
  });
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