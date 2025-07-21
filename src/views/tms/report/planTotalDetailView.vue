<template>
  <PageHeaderSubMenu :breadcrumbs="[
    { label: 'วางแผนรวม', icon: 'grommet-icons:plan', to: '/tms/report/plan-total' },
    { label: 'รายละเอียด' }
  ]" />
  <div class="w-full px-4" style="max-width: calc(100vw - 100px);">
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 py-3">
        <div class="flex flex-row flex-wrap justify-between items-end gap-x-4 gap-y-2">
          <div class="flex flex-row flex-wrap justify-end items-center gap-x-4 gap-y-2">
            <button
              class="flex items-center justify-center bg-white border border-[#00569D] text-[#00569D] hover:bg-[#00569D] hover:text-white rounded-full shadow w-8 h-8 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
              @click="goBack" title="ย้อนกลับ">
              <Icon icon="mdi:arrow-left" class="w-4 h-4" />
            </button>
            <span
              class="inline-flex items-center px-3 py-1 rounded text-sm font-semibold bg-gray-50 text-[#0369A1] shadow">
              <Icon icon="mdi:warehouse" class="w-6 h-6 mr-2" />
              {{ columnLabel }}
            </span>
          </div>
          <div class="flex flex-row flex-wrap justify-end items-end gap-x-4 gap-y-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon icon="mdi:magnify" class="w-4 h-4 text-gray-400" />
              </div>
              <input type="text" v-model="searchQuery" placeholder="ค้นหา..."
                class="w-64 pl-10 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row gap-4">
      <section class="flex-1 p-2">
        <div class="rounded-lg shadow border border-gray-200 overflow-x-auto overflow-y-auto" style="max-height: calc(100vh - 140px);">
          <table class="min-w-full text-sm p-2" style="max-height: calc(100vh - 140px);">
            <thead class="bg-gray-100 sticky top-0">
              <tr>
                <th class="px-3 py-2 text-center font-semibold">รหัสสินค้า</th>
                <th class="px-3 py-2 text-center font-semibold">รายการสินค้า</th>
                <th class="px-3 py-2 text-center font-semibold">Total CO</th>
                <th class="px-3 py-2 text-center font-semibold">เดือนก่อน</th>
                <th class="px-3 py-2 text-center font-semibold">เดือนปัจจุบัน</th>
                <th class="px-3 py-2 text-center font-semibold">หน่วยรถ</th>
                <th class="px-3 py-2 text-center font-semibold">Stock</th>
                <th class="px-3 py-2 text-center font-semibold bg-red-200">Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredRows.length === 0" class="bg-white">
                <td colspan="8" class="px-3 py-8 text-center text-gray-500">
                  ไม่พบข้อมูล
                </td>
              </tr>
              <tr v-for="(row, idx) in filteredRows" :key="idx" :class="'transition-colors ' + (idx % 2 === 1 ? 'bg-gray-50' : 'bg-white') + ' hover:bg-blue-50'">
                <td class="px-3 py-1 text-center">{{ row.productCode || '' }}</td>
                <td class="px-3 py-1">{{ row.productName || '' }}</td>
                <td class="px-3 py-1 text-center">{{ row.totalCO || 0 }}</td>
                <td class="px-3 py-1 text-center text-blue-600 underline cursor-pointer" @click.stop="handleColClick('lastMonth', row)">{{ row.lastMonth || 0 }}</td>
                <td class="px-3 py-1 text-center text-blue-600 underline cursor-pointer" @click.stop="handleColClick('thisMonth', row)">{{ row.thisMonth || 0 }}</td>
                <td class="px-3 py-1 text-center text-blue-600 underline cursor-pointer" @click.stop="handleCoListClick(row)">{{ row.unit || 0 }}</td>
                <td class="px-3 py-1 text-center">{{ row.stock || 0 }}</td>
                <td class="px-3 py-1 text-center text-blue-600 cursor-pointer" :class="(row.balanceSarakham || 0) < 0 ? 'bg-red-100 text-red-600 font-bold' : 'bg-red-50'">{{ row.balanceSarakham || 0 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import PageHeaderSubMenu from '@/components/PageHeaderSubMenu.vue';
import { useReportTmsStore } from '@/stores/modules/reportTms';

const route = useRoute();
const router = useRouter();
const reportTmsStore = useReportTmsStore();

const column = route.query.column || '';
const searchQuery = ref('');
const warehouseId = route.query.column ? route.query.column.split('_')[1] : '105'; // Extract warehouse ID from column or default to 105

const columnMap = {
  fplusNakhonPathom: 'F-plus นครปฐม',
  balance12T: 'Balance 12 T',
  nakhonPathom: 'นครปฐม',
  sarakham: 'สารคาม',
  lamphun: 'ลำพูน',
  surat: 'สุราษฎร์',
  bangna: 'บางนา',
  nakhonRatchasima: 'นครราชสีมา',
  nonthaburi: 'นนทบุรี',
  nakhonPathom2: 'นครปฐม2',
  lastMonth: 'เดือนก่อน',
  thisMonth: 'เดือนปัจจุบัน',
  balanceSarakham: 'Balance สารคาม',
};
const columnLabel = computed(() => columnMap[column] || column);

// Transform API data to match our component structure
const transformApiData = (apiData) => {
  if (!Array.isArray(apiData)) return [];
  
  return apiData
    .filter(item => item && typeof item === 'object') // Filter out null/undefined items
    .map(item => ({
      productCode: item.item_no?.trim() || '',
      productName: item.item_name || '',
      totalCO: item.tco || 0,
      lastMonth: item.oco || 0,
      thisMonth: item.pco || 0,
      unit: item.cco !== null && item.cco !== undefined ? item.cco : 0,
      stock: item.stock || 0,
      balanceSarakham: item.balance || 0
    }));
};

const detailRows = computed(() => {
  const transformed = transformApiData(reportTmsStore.planningDetailData || []);
  console.log('Transformed data:', transformed);
  console.log('Original API data:', reportTmsStore.planningDetailData);
  console.log('Loading state:', reportTmsStore.loadingPlanningDetail);
  console.log('Error state:', reportTmsStore.errorPlanningDetail);
  return transformed;
});

const filteredRows = computed(() => {
  const result = !searchQuery.value ? detailRows.value : detailRows.value.filter(row =>
    row && row.productCode && row.productCode.toString().includes(searchQuery.value.toLowerCase()) ||
    row && row.productName && row.productName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  console.log('Filtered rows:', result);
  console.log('Search query:', searchQuery.value);
  return result;
});

function goBack() {
  router.back();
}

function handleColClick(columnKey, row) {
  router.push({
    name: 'plan-total-co-list',
    query: { productCode: row.productCode, productName: row.productName, column: columnKey }
  });
}

function handleCoListClick(row) {
  router.push({
    name: 'plan-total-van',
    query: { productCode: row.productCode, productName: row.productName }
  });
}

// Fetch data when component mounts
onMounted(async () => {
  console.log('Warehouse ID being used:', warehouseId);
  console.log('Column from route:', route.query.column);
  await reportTmsStore.fetchPlanningDetail(warehouseId);
});

// Refresh data function
async function refreshData() {
  await reportTmsStore.fetchPlanningDetail(warehouseId);
}
</script>

<style scoped>
.bg-red-200 { background-color: #fecaca !important; }
.bg-red-100 { background-color: #fee2e2 !important; }
.bg-red-50 { background-color: #fef2f2 !important; }
</style> 