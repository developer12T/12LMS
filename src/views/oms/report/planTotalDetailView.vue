<template>
  <PageHeaderSubMenu :breadcrumbs="[
    { label: 'วางแผนรวม', icon: 'grommet-icons:plan', to: '/oms/report/plan-total' },
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
              {{ activeButton }} : {{ columnLabel }}
            </span>
          </div>
          <div class="flex flex-row flex-wrap justify-end items-end gap-x-4 gap-y-2">
                  <!-- Brand Filter -->
                  <div class="relative" ref="brandDropdownRef">
              <button @click="toggleBrandDropdown" :disabled="availableBrands.length === 0"
                class="text-white bg-[#00569D] text-xs hover:bg-[#004080] disabled:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-[#00569D]/30 font-medium rounded-lg px-3 py-1.5 text-center inline-flex items-center transition-colors shadow-sm"
                type="button">
                <Icon icon="mdi:tag" class="w-4 h-4 mr-2" />
                แบรนด์ {{ selectedBrands.length > 0 ? `(${selectedBrands.length})` : '' }}{{ reportTmsStore.loadingPlanningDetail ? ' (กำลังโหลด...)' : availableBrands.length === 0 ? ' (ไม่มีข้อมูล)' : '' }}
                <svg class="w-2 h-2 ml-2 transition-transform" :class="{ 'rotate-180': showBrandDropdown }"
                  aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 4 4 4-4" />
                </svg>
              </button>

              <!-- Brand Dropdown menu -->
              <div v-show="showBrandDropdown" @click.stop
                class="absolute right-0 mt-2 w-80 md:w-96 lg:w-[500px] bg-white divide-y divide-gray-100 rounded-lg shadow-lg border border-gray-200 dark:bg-gray-800 dark:divide-gray-600 dark:border-gray-700 z-50">
                <div class="p-3">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">เลือกแบรนด์</h3>
                  <div v-if="reportTmsStore.loadingPlanningDetail" class="text-sm text-gray-500 text-center py-4">
                    กำลังโหลดข้อมูลแบรนด์...
                  </div>
                  <div v-else-if="availableBrands.length === 0" class="text-sm text-gray-500 text-center py-4">
                    ไม่พบข้อมูลแบรนด์
                  </div>
                  <div v-else
                    class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <div v-for="brand in availableBrands" :key="brand"
                      class="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      @click.stop>
                      <input :id="`brand-${brand}`" type="checkbox" v-model="selectedBrands" :value="brand"
                        class="w-4 h-4 text-[#00569D] bg-gray-100 border-gray-300 rounded focus:ring-[#00569D] dark:focus:ring-[#00569D] dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                      <label :for="`brand-${brand}`"
                        class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center truncate">
                        {{ brand }}
                      </label>
                    </div>
                  </div>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
                  <div v-if="selectedBrands.length === 0" class="text-xs text-gray-500 mb-2 text-center">
                    เลือกแบรนด์อย่างน้อย 1 รายการ
                  </div>
                  <button @click="applyBrandFilter"
                    class="w-full bg-[#00569D] hover:bg-[#004080] disabled:bg-gray-400 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors">
                    ปิด
                  </button>
                </div>
              </div>
            </div>

            <!-- Product Group Filter -->
            <div class="relative" ref="productGroupDropdownRef">
              <button @click="toggleProductGroupDropdown" :disabled="availableProductGroups.length === 0"
                class="text-white bg-[#E48009] text-xs hover:bg-[#ed8d21] disabled:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-[#ed8d21]/30 font-medium rounded-lg px-3 py-1.5 text-center inline-flex items-center transition-colors shadow-sm"
                type="button">
                <Icon icon="mdi:package-variant" class="w-4 h-4 mr-2" />
                กลุ่มสินค้า {{ selectedProductGroups.length > 0 ? `(${selectedProductGroups.length})` : '' }}{{
                  reportTmsStore.loadingPlanningDetail ? ' (กำลังโหลด...)' : availableProductGroups.length === 0 ? ' (ไม่มีข้อมูล)' : '' }}
                <svg class="w-2 h-2 ml-2 transition-transform" :class="{ 'rotate-180': showProductGroupDropdown }"
                  aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 4 4 4-4" />
                </svg>
              </button>

              <!-- Product Group Dropdown menu -->
              <div v-show="showProductGroupDropdown" @click.stop
                class="absolute right-0 mt-2 w-80 md:w-96 lg:w-[500px] bg-white divide-y divide-gray-100 rounded-lg shadow-lg border border-gray-200 dark:bg-gray-800 dark:divide-gray-600 dark:border-gray-700 z-50">
                <div class="p-3">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">เลือกกลุ่มสินค้า</h3>
                  <div v-if="reportTmsStore.loadingPlanningDetail" class="text-sm text-gray-500 text-center py-4">
                    กำลังโหลดข้อมูลกลุ่มสินค้า...
                  </div>
                  <div v-else-if="availableProductGroups.length === 0" class="text-sm text-gray-500 text-center py-4">
                    ไม่พบข้อมูลกลุ่มสินค้า
                  </div>
                  <div v-else
                    class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <div v-for="group in availableProductGroups" :key="group"
                      class="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      @click.stop>
                      <input :id="`product-group-${group}`" type="checkbox" v-model="selectedProductGroups"
                        :value="group"
                        class="w-4 h-4 text-[#00569D] bg-gray-100 border-gray-300 rounded focus:ring-[#00569D] dark:focus:ring-[#00569D] dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                      <label :for="`product-group-${group}`"
                        class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center truncate">
                        {{ group }}
                      </label>
                    </div>
                  </div>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
                  <div v-if="selectedProductGroups.length === 0" class="text-xs text-gray-500 mb-2 text-center">
                    เลือกกลุ่มสินค้าอย่างน้อย 1 รายการ
                  </div>
                  <button @click="applyProductGroupFilter"
                    class="w-full bg-[#00569D] hover:bg-[#004080] disabled:bg-gray-400 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors">
                    ปิด
                  </button>
                </div>
              </div>
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
      </div>
    </div>
    <div class="flex flex-col md:flex-row gap-4">
      <section class="flex-1 p-2">
        <div class="rounded-lg shadow border border-gray-200 overflow-x-auto overflow-y-auto" style="max-height: calc(100vh - 150px);">
          <table class="min-w-full text-sm p-2" style="max-height: calc(100vh - 160px);">
            <thead class="bg-gray-100 sticky top-0">
              <tr>
                <th class="px-3 py-2 text-center font-semibold">รหัสสินค้า</th>
                <th class="px-3 py-2 text-center font-semibold">รายการสินค้า</th>
                <th class="px-3 py-2 text-center font-semibold">ยอดสั่งซื้อ</th>
                <th class="px-3 py-2 text-center font-semibold">เดือนก่อน</th>
                <th class="px-3 py-2 text-center font-semibold">เครดิต</th>
                <th class="px-3 py-2 text-center font-semibold">หน่วยรถ</th>
                <th class="px-3 py-2 text-center font-semibold">Stock</th>
                <th class="px-3 py-2 text-center font-semibold bg-red-200">ยอดส่วนต่าง</th>
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
                <td class="px-3 py-1 text-center text-blue-600 cursor-pointer" :class="(row.balance || 0) < 0 ? 'bg-red-100 text-red-600 font-bold' : 'bg-red-50'">{{ row.balance || 0 }}</td>
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

const activeButton = route.query.activeButton || '';
let company = ref('');
if (activeButton === 'Fplus') {
   company = '380';
} else if (activeButton === '12T') {
   company = '410';
} else{
   company = '';
}

const column = route.query.column || '';
const searchQuery = ref('');
const warehouseId = route.query.column ? route.query.column.split('_')[1] : '105'; // Extract warehouse ID from column or default to 105

// Filter variables
const selectedBrands = ref([]);
const selectedProductGroups = ref([]);
const showBrandDropdown = ref(false);
const showProductGroupDropdown = ref(false);
const brandDropdownRef = ref(null);
const productGroupDropdownRef = ref(null);

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
  console.log('Transform input:', apiData);
  
  if (!Array.isArray(apiData)) {
    console.log('Input is not array, type:', typeof apiData);
    return [];
  }
  
  return apiData
    .filter(item => item && typeof item === 'object') // Filter out null/undefined items
    .map(item => {
      console.log('Processing item:', item);
      const transformed = {
        productCode: item.item_no?.trim() || '',
        productName: item.item_name || '',
        totalCO: item.tco || 0,
        lastMonth: item.oco || 0,
        thisMonth: item.pco || 0,
        unit: item.cco !== null && item.cco !== undefined ? item.cco : 0,
        stock: item.stock || 0,
        balance: item.balance || 0,
        brand: item.brand_item || '',
        group: item.group_item || ''
      };
      console.log('Transformed item:', transformed);
      return transformed;
    });
};

// Available brands and groups from API response
const availableBrands = computed(() => {
  console.log('Computing availableBrands from store...');
  console.log('brandItemsFoDeatil from store:', reportTmsStore.brandItemsFoDeatil);
  return reportTmsStore.brandItemsFoDeatil || [];
});

const availableProductGroups = computed(() => {
  console.log('Computing availableProductGroups from store...');
  console.log('groupItemsForDeatil from store:', reportTmsStore.groupItemsForDeatil);
  return reportTmsStore.groupItemsForDeatil || [];
});

const detailRows = computed(() => {
  console.log('Raw planningDetailData:', reportTmsStore.planningDetailData);
  console.log('PlanningDetailData type:', typeof reportTmsStore.planningDetailData);
  console.log('PlanningDetailData is array:', Array.isArray(reportTmsStore.planningDetailData));
  console.log('PlanningDetailData length:', reportTmsStore.planningDetailData?.length);
  
  // Extract data from the new API response structure
  let dataToTransform = [];
  if (reportTmsStore.planningDetailData && reportTmsStore.planningDetailData.data) {
    // New API structure: { data: { data: [...], brandItems: [...], groupItems: [...] } }
    if (reportTmsStore.planningDetailData.data.data) {
      dataToTransform = reportTmsStore.planningDetailData.data.data;
    } else if (Array.isArray(reportTmsStore.planningDetailData.data)) {
      // Fallback for old structure
      dataToTransform = reportTmsStore.planningDetailData.data;
    }
  } else if (Array.isArray(reportTmsStore.planningDetailData)) {
    // Direct array structure
    dataToTransform = reportTmsStore.planningDetailData;
  }
  
  const transformed = transformApiData(dataToTransform || []);
  console.log('Transformed data:', transformed);
  console.log('Transformed data length:', transformed.length);
  console.log('Original API data:', reportTmsStore.planningDetailData);
  console.log('Loading state:', reportTmsStore.loadingPlanningDetail);
  console.log('Error state:', reportTmsStore.errorPlanningDetail);
  return transformed;
});

const filteredRows = computed(() => {
  let result = detailRows.value;
  
  // Apply brand filter
  if (selectedBrands.value.length > 0) {
    result = result.filter(row => 
      row && row.brand && selectedBrands.value.includes(row.brand)
    );
  }
  
  // Apply product group filter
  if (selectedProductGroups.value.length > 0) {
    result = result.filter(row => 
      row && row.group && selectedProductGroups.value.includes(row.group)
    );
  }
  
  // Apply search filter
  if (searchQuery.value) {
    result = result.filter(row =>
      row && row.productCode && row.productCode.toString().toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      row && row.productName && row.productName.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  console.log('Filtered rows:', result);
  console.log('Search query:', searchQuery.value);
  console.log('Selected brands:', selectedBrands.value);
  console.log('Selected groups:', selectedProductGroups.value);
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

// Filter functions
function toggleBrandDropdown() {
  showBrandDropdown.value = !showBrandDropdown.value;
  if (showBrandDropdown.value) {
    showProductGroupDropdown.value = false;
  }
}

function toggleProductGroupDropdown() {
  showProductGroupDropdown.value = !showProductGroupDropdown.value;
  if (showProductGroupDropdown.value) {
    showBrandDropdown.value = false;
  }
}

function applyBrandFilter() {
  showBrandDropdown.value = false;
}

function applyProductGroupFilter() {
  showProductGroupDropdown.value = false;
}

// Fetch data when component mounts
onMounted(async () => {
  console.log('Warehouse ID being used:', warehouseId);
  console.log('Column from route:', route.query.column);
  console.log('Company:', company);
  
  await reportTmsStore.fetchPlanningDetail(warehouseId, company);
  
  // Log the data after fetching
  console.log('After fetch - planningDetailData:', reportTmsStore.planningDetailData);
  console.log('After fetch - brandItemsFoDeatil:', reportTmsStore.brandItemsFoDeatil);
  console.log('After fetch - groupItemsForDeatil:', reportTmsStore.groupItemsForDeatil);
  console.log('Available brands:', availableBrands.value);
  console.log('Available groups:', availableProductGroups.value);
  
  // Add event listener for closing dropdowns when clicking outside
  document.addEventListener('click', (event) => {
    if (brandDropdownRef.value && !brandDropdownRef.value.contains(event.target)) {
      showBrandDropdown.value = false;
    }
    if (productGroupDropdownRef.value && !productGroupDropdownRef.value.contains(event.target)) {
      showProductGroupDropdown.value = false;
    }
  });
});

// Refresh data function
async function refreshData() {
  await reportTmsStore.fetchPlanningDetail(warehouseId, company);
}
</script>

<style scoped>
.bg-red-200 { background-color: #fecaca !important; }
.bg-red-100 { background-color: #fee2e2 !important; }
.bg-red-50 { background-color: #fef2f2 !important; }
</style> 