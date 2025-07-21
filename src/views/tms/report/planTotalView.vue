<template>
  <div class="w-full px-4" style="max-width: calc(100vw - 100px);">
    <div class="space-y-6">
      <!-- Loading -->
      <div v-if="reportTmsStore.loadingPlanning" class="flex justify-center items-center py-8">
        <Icon icon="mdi:loading" class="animate-spin w-8 h-8 text-sky-600" />
        <span class="ml-2 text-sky-700">กำลังโหลดข้อมูล...</span>
      </div>

      <!-- Table Section -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-0 w-full">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between px-4 pt-2">
          <div class="flex items-center justify-center flex-row">
            <!-- Record Count -->
            <ResultCount
              :label="'ผลลัพธ์:'"
              :current="searchQuery ? filteredTableData.length : null"
              :total="reportTmsStore.planningData.length"
              icon="mdi:table"
              iconColor="#00569D"
              class=""
            />
          </div>
          <div class="flex items-center space-x-4">
            <div class=" flex flex-row gap-1 items-center">
              <button type="button" @click="exportToExcel" :disabled="!reportTmsStore.planningData.length"
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
            <div class="flex-shrink-0 self-end">
            <button type="submit" @click="reportTmsStore.fetchPlanningAll()" :disabled="reportTmsStore.loadingPlanning"
              class="flex items-center gap-1 bg-[#00569D] hover:bg-[#6B9AC4] disabled:bg-gray-400 text-white text-xs font-medium rounded px-4 py-1.5 transition-colors shadow min-w-[80px] justify-center">
              <Icon v-if="reportTmsStore.loadingPlanning" icon="mdi:loading" class="w-4 h-4 animate-spin" />
              <Icon v-else icon="mdi:refresh" class="w-4 h-4" />
              {{ reportTmsStore.loadingPlanning ? 'กำลังโหลด...' : 'รีเฟรชข้อมูล' }}
            </button>
          </div>
          </div>
        </div>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg max-h-[78vh] mt-2 px-2 pb-2">
          <table class="w-full text-xs text-left text-gray-500 border-collapse border border-gray-300">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
              <tr>
                <th class="px-2 py-2 text-center border-r border-gray-200">รหัสสินค้า</th>
                <th class="px-2 py-2 text-center border-r border-gray-200">ชื่อสินค้า</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">F-plus นครปฐม</th>
                <th class="px-2 py-2  text-[10px] text-center border-r border-gray-200">Balance 12 T</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">นครปฐม (101)</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">มหาสารคาม (102)</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">ลำพูน (103)</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">สุราษฎร์ (104)</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">บางนา (105)</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">นครสวรรค์ (106)</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">นครราชสีมา (109)</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">นนทบุรี (110)</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">นครปฐม2 (111)</th>
                <th v-for="dateColumn in dateColumns" :key="dateColumn" class="px-2 py-2 text-[10px] text-center border-r border-gray-200">{{ dateColumn }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in filteredTableData" :key="idx" :class="idx % 2 === 1 ? 'bg-gray-100' : 'bg-white'" class="cursor-pointer hover:bg-blue-100 transition-colors duration-100" @click="openModal(item)">
                <td class="px-2 py-1 text-center border-r border-gray-200">{{ item.item_code?.trim() }}</td>
                <td class="px-2 py-1 border-r border-gray-200">{{ item.item_name }}</td>
                                 <td :class="!item.blfplus ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'" class="px-2 py-1 text-center border-r border-gray-200" @click.stop="item.blfplus && handleCellClick(item, 'blfplus')">{{ item.blfplus || '-' }}</td>
                 <td :class="!item.bl12t ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'" class="px-2 py-1 text-end border-r border-gray-200" @click.stop="item.bl12t && handleCellClick(item, 'bl12t')">{{ item.bl12t || '-' }}</td>
                 <td :class="!item.wh_101 ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'" class="px-2 py-1 text-end border-r border-gray-200" @click.stop="item.wh_101 && handleCellClick(item, 'wh_101')">{{ item.wh_101 || '-' }}</td>
                 <td :class="!item.wh_102 ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'" class="px-2 py-1 text-end border-r border-gray-200" @click.stop="item.wh_102 && handleCellClick(item, 'wh_102')">{{ item.wh_102 || '-' }}</td>
                 <td :class="!item.wh_103 ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'" class="px-2 py-1 text-end border-r border-gray-200" @click.stop="item.wh_103 && handleCellClick(item, 'wh_103')">{{ item.wh_103 || '-' }}</td>
                 <td :class="!item.wh_104 ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'" class="px-2 py-1 text-end border-r border-gray-200" @click.stop="item.wh_104 && handleCellClick(item, 'wh_104')">{{ item.wh_104 || '-' }}</td>
                 <td :class="!item.wh_105 ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'" class="px-2 py-1 text-end border-r border-gray-200" @click.stop="item.wh_105 && handleCellClick(item, 'wh_105')">{{ item.wh_105 || '-' }}</td>
                 <td :class="!item.wh_106 ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'" class="px-2 py-1 text-end border-r border-gray-200" @click.stop="item.wh_106 && handleCellClick(item, 'wh_106')">{{ item.wh_106 || '-' }}</td>
                 <td :class="!item.wh_109 ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'" class="px-2 py-1 text-end border-r border-gray-200" @click.stop="item.wh_109 && handleCellClick(item, 'wh_109')">{{ item.wh_109 || '-' }}</td>
                 <td :class="!item.wh_110 ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'" class="px-2 py-1 text-end border-r border-gray-200" @click.stop="item.wh_110 && handleCellClick(item, 'wh_110')">{{ item.wh_110 || '-' }}</td>
                 <td :class="!item.wh_111 ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'" class="px-2 py-1 text-end border-r border-gray-200" @click.stop="item.wh_111 && handleCellClick(item, 'wh_111')">{{ item.wh_111 || '-' }}</td>
                 <td v-for="dateColumn in dateColumns" :key="dateColumn" class="px-2 py-1 text-end border-r border-gray-200" :class="getDateCellClass(item[dateColumn])">{{ item[dateColumn] || '-' }}</td>
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
            <div><span class="font-medium">รหัสสินค้า:</span> {{ selectedRow.item_code?.trim() }}</div>
            <div><span class="font-medium">ชื่อสินค้า:</span> {{ selectedRow.item_name }}</div>
            <div><span class="font-medium">F-plus นครปฐม:</span> {{ selectedRow.blfplus || '-' }}</div>
            <div><span class="font-medium">Balance 12 T:</span> {{ selectedRow.bl12t || '-' }}</div>
            <div><span class="font-medium">นครปฐม (101):</span> {{ selectedRow.wh_101 || '-' }}</div>
            <div><span class="font-medium">มหาสารคาม (102):</span> {{ selectedRow.wh_102 || '-' }}</div>
            <div><span class="font-medium">ลำพูน (103):</span> {{ selectedRow.wh_103 || '-' }}</div>
            <div><span class="font-medium">สุราษฎร์ (104):</span> {{ selectedRow.wh_104 || '-' }}</div>
            <div><span class="font-medium">บางนา (105):</span> {{ selectedRow.wh_105 || '-' }}</div>
            <div><span class="font-medium">นครสวรรค์ (106):</span> {{ selectedRow.wh_106 || '-' }}</div>
            <div><span class="font-medium">นครราชสีมา (109):</span> {{ selectedRow.wh_109 || '-' }}</div>
            <div><span class="font-medium">นนทบุรี (110):</span> {{ selectedRow.wh_110 || '-' }}</div>
            <div><span class="font-medium">นครปฐม2:</span> {{ selectedRow.wh_111 || '-' }}</div>
            <div class="border-t pt-2 mt-2">
              <div class="font-medium text-blue-600 mb-2">ข้อมูลวางแผนตามวันที่:</div>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div v-for="dateColumn in dateColumns" :key="dateColumn" :class="getDateCellClass(selectedRow[dateColumn])">
                  <span class="font-medium">{{ dateColumn }}:</span> {{ selectedRow[dateColumn] || '-' }}
                </div>
              </div>
            </div>
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
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import ResultCount from '@/components/ResultCount.vue';
import { useRouter } from 'vue-router';
import { useReportTmsStore } from '@/stores/modules/reportTms';

const filter = ref({
  dc: '12',
  year: '2568',
  allDC: false,
  showMonth: false,
  dateRange: '1 มิ.ย. 2025 - 30 มิ.ย. 2025',
  search: '',
});

const reportTmsStore = useReportTmsStore();
const searchQuery = ref('');

const filteredTableData = computed(() => {
  if (!searchQuery.value) return reportTmsStore.planningData;
  const term = searchQuery.value.toLowerCase();
  return reportTmsStore.planningData.filter(item =>
    (item.item_code?.trim() || '').toLowerCase().includes(term) ||
    (item.item_name || '').toLowerCase().includes(term)
  );
});

const dateColumns = computed(() => {
  if (reportTmsStore.planningData.length === 0) return [];
  
  // หาคอลัมน์วันที่จากข้อมูลแรก
  const firstItem = reportTmsStore.planningData[0];
  const dateKeys = Object.keys(firstItem).filter(key => 
    key.includes('-') && (key.includes('jan') || key.includes('feb') || key.includes('mar') || 
                         key.includes('apr') || key.includes('may') || key.includes('jun') || 
                         key.includes('jul') || key.includes('aug') || key.includes('sep') || 
                         key.includes('oct') || key.includes('nov') || key.includes('dec'))
  );
  
  return dateKeys.sort();
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

function getDateCellClass(value) {
  if (!value || value === '0' || value === '-') {
    return 'text-gray-400'
  }
  return 'text-green-600 font-medium'
}

function exportToExcel() {
  // สามารถเพิ่ม logic ดาวน์โหลดข้อมูลจริงได้
  alert('ดาวน์โหลดข้อมูล!');
}

onMounted(() => {
  reportTmsStore.fetchPlanningAll();
});
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