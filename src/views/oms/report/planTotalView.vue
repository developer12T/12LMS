<template>
  <div class="w-full px-4" style="max-width: calc(100vw - 100px);">
    <div class="space-y-6">
      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-0 w-full">
        <!-- Tab Navigation -->
        <div class="border-b flex flex-row justify-between border-gray-200">
          <div class="flex">
            <button @click="toggleActive('12T')"
              :class="activeButton === '12T' ? 'border-[#00569D] text-[#00569D] bg-[#00569D] bg-opacity-10' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="flex items-center gap-2 px-6 py-2 text-sm font-medium border-b-2 rounded-t-lg transition-colors">
              <img src="/logo-onetwo.png" alt="12Trading" class="w-5 h-5"> 12Trading
            </button>
            <button @click="toggleActive('Fplus')"
              :class="activeButton === 'Fplus' ? 'border-[#53C9EF] text-[#53C9EF] bg-[#53C9EF] bg-opacity-10' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="flex items-center gap-2 px-6 py-2 text-sm font-medium border-b-2 rounded-t-lg transition-colors">
              <img src="/logo-fplus.png" alt="Fplus" class="w-5 h-5"> Fplus
            </button>
          </div>
          <div class="flex">
            <div class="flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-t-lg transition-colors">
              <div class="flex-shrink-0 self-end">
                <button type="submit" @click="reportTmsStore.generatePlanningData()"
                  :disabled="reportTmsStore.loadingGeneratePlanning"
                  class="flex items-center gap-1 bg-red-700 hover:bg-red-400 disabled:bg-gray-400 text-white text-xs font-medium rounded-md px-4 py-1.5 transition-colors shadow min-w-[80px] justify-center">
                  <Icon v-if="reportTmsStore.loadingGeneratePlanning" icon="mdi:loading" class="w-4 h-4 animate-spin" />
                  <Icon v-else icon="mdi:download" class="w-4 h-4" />
                  {{ reportTmsStore.loadingGeneratePlanning ? 'กำลังดึงข้อมูล...' : 'ดึงข้อมูลใหม่' }}
                </button>
              </div>
              <div class="flex-shrink-0 self-end">
                <button type="submit" @click="refreshPage"
                  class="bg-[#00569D] hover:bg-[#004080] text-white text-xs font-medium py-1.5 px-3 rounded transition-colors duration-200 flex items-center gap-1">
                  <Icon v-if="reportTmsStore.loadingPlanning" icon="mdi:loading" class="w-3 h-3 animate-spin" />
                  <Icon v-else icon="mdi:refresh" class="w-3 h-3" />
                  {{ reportTmsStore.loadingPlanning ? 'กำลังรีเฟรชข้อมูลใหม่...' : 'รีเฟรช' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col md:flex-row md:items-center md:justify-between px-4 pt-2">
          <div class="flex items-center justify-center flex-row gap-4">
            <!-- Record Count -->
            <ResultCount :label="'ผลลัพธ์:'" :current="filteredTableDataByBrand.length"
              :total="reportTmsStore.planningData.length" icon="mdi:table" iconColor="#00569D" class="" />
            <!-- Filter Status -->
            <div v-if="selectedBrands.length > 0 || selectedProductGroups.length > 0"
              class="flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
              <span>
                กรอง: {{ selectedBrands.length > 0 ? `แบรนด์(${selectedBrands.length})` : '' }}
                {{ selectedBrands.length > 0 && selectedProductGroups.length > 0 ? ' + ' : '' }}
                {{ selectedProductGroups.length > 0 ? `กลุ่มสินค้า(${selectedProductGroups.length})` : '' }}
              </span>
              <button @click="clearAllFilters" class="text-red-500 hover:text-red-700 text-xs">
                <Icon icon="mdi:close" class="w-3 h-3" />
              </button>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <div class=" flex flex-row gap-1 items-center">
              <button type="button" @click="exportToExcel" :disabled="!filteredTableDataByBrand.length"
                class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Icon icon="file-icons:microsoft-excel" width="16" height="16" class="mr-1.5" />
                Export Excel
              </button>
            </div>
            <!-- Brand Filter -->
            <div class="relative" ref="brandDropdownRef">
              <button @click="toggleBrandDropdown" :disabled="availableBrands.length === 0"
                class="text-white bg-[#00569D] text-xs hover:bg-[#004080] disabled:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-[#00569D]/30 font-medium rounded-lg px-3 py-1.5 text-center inline-flex items-center transition-colors shadow-sm"
                type="button">
                <Icon icon="mdi:tag" class="w-4 h-4 mr-2" />
                แบรนด์ {{ selectedBrands.length > 0 ? `(${selectedBrands.length})` : '' }}{{ availableBrands.length ===
                  0 ? ' (ไม่มีข้อมูล)' : '' }}
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
                  <div v-if="availableBrands.length === 0" class="text-sm text-gray-500 text-center py-4">
                    กำลังโหลดข้อมูลแบรนด์...
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
                  availableProductGroups.length === 0 ? ' (ไม่มีข้อมูล)' : '' }}
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
                  <div v-if="availableProductGroups.length === 0" class="text-sm text-gray-500 text-center py-4">
                    กำลังโหลดข้อมูลกลุ่มสินค้า...
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
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg max-h-[73vh] mt-2 px-2 pb-2">
          <!-- Loading overlay for table -->
          <div v-if="reportTmsStore.loadingPlanning || reportTmsStore.loadingGeneratePlanning || warehouseStore.loading"
            class="absolute inset-0 bg-white flex items-center justify-center z-10">
            <div class="flex items-center gap-2">
              <Icon icon="mdi:loading" class="animate-spin w-6 h-6 text-sky-600" />
              <span class="text-sky-700 text-sm">กำลังโหลดข้อมูล...</span>
            </div>
          </div>

          <!-- Virtual Table Container -->
          <div ref="tableContainer" class="virtual-table-container overflow-x-auto overflow-y-auto"
            style="height: calc(73vh - 20px); will-change: scroll-position;" @scroll="handleScroll">
            <!-- Top spacer for virtual scrolling -->
            <div v-if="topPadding > 0" :style="{ height: topPadding + 'px' }"></div>
            
            <table class="w-full text-xs text-left text-gray-500 border-collapse border border-gray-300">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                <tr>
                  <th v-for="header in tableHeaders" :key="header.key"
                    class="px-2 py-2 text-center border-r border-gray-200">
                    {{ header.label }}
                  </th>
                  <th v-for="dateColumn in dateColumns" :key="dateColumn"
                    class="px-2 py-2 text-[10px] text-center border-r border-gray-200">
                    {{ dateColumn }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in virtualScrollData" :key="`${item.item_code}-${item.virtualIndex}`"
                  :class="item.virtualIndex % 2 === 1 ? 'bg-gray-100' : 'bg-white'"
                  class="cursor-pointer hover:bg-blue-100 transition-colors duration-100" @click="openModal(item)">
                  <td v-for="header in tableHeaders" :key="header.key"
                    class="px-2 py-1 text-start border-r border-gray-200"
                    :class="getCellClass(item[header.key], header.key)"
                    @click.stop="(header.key !== 'item_code' && header.key !== 'item_name') && item[header.key] && handleCellClick(item, header.key)">
                    {{ getCellValue(item[header.key], header.key) }}
                  </td>
                  <td v-for="dateColumn in dateColumns" :key="dateColumn"
                    class="px-2 py-1 text-end border-r border-gray-200" :class="getDateCellClass(item[dateColumn])">
                    {{ item[dateColumn] || '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
            
            <!-- Bottom spacer for virtual scrolling -->
            <div v-if="bottomPadding > 0" :style="{ height: bottomPadding + 'px' }"></div>
          </div>
        </div>
      </div>

      <!-- Modal Popup -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fade-in">
          <button @click="showModal = false"
            class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl">&times;</button>
          <h3 class="text-lg font-bold mb-4 text-[#00569D]">รายละเอียดสินค้า</h3>
          <div class="text-sm space-y-2">
            <div><span class="font-medium">รหัสสินค้า:</span> {{ selectedRow.item_code?.trim() }}</div>
            <div><span class="font-medium">ชื่อสินค้า:</span> {{ selectedRow.item_name }}</div>
            <div v-if="visibleColumns.blfplus"><span class="font-medium">F-plus {{ warehouseNames['NP'] || 'นครปฐม'
            }}:</span> {{ selectedRow.blfplus || '-' }}</div>
            <div v-if="visibleColumns.bl12t"><span class="font-medium">Balance 12 T:</span> {{ selectedRow.bl12t || '-'
            }}</div>
            <div v-if="visibleColumns.wh_101"><span class="font-medium">{{ warehouseNames['NP'] || 'นครปฐม' }}
                (101):</span> {{ selectedRow.wh_101 || '-' }}</div>
            <div v-if="visibleColumns.wh_102"><span class="font-medium">{{ warehouseNames['MH'] || 'มหาสารคาม' }}
                (102):</span> {{ selectedRow.wh_102 || '-' }}</div>
            <div v-if="visibleColumns.wh_103"><span class="font-medium">{{ warehouseNames['LP'] || 'ลำพูน' }}
                (103):</span> {{ selectedRow.wh_103 || '-' }}</div>
            <div v-if="visibleColumns.wh_104"><span class="font-medium">{{ warehouseNames['ST'] || 'สุราษฎร์' }}
                (104):</span> {{ selectedRow.wh_104 || '-' }}</div>
            <div v-if="visibleColumns.wh_105"><span class="font-medium">{{ warehouseNames['BN'] || 'บางนา' }}
                (105):</span> {{ selectedRow.wh_105 || '-' }}</div>
            <div v-if="visibleColumns.wh_105F"><span class="font-medium">{{ warehouseNames['BN'] || 'บางนา' }} F-plus
                (105):</span> {{ selectedRow.wh_105F || '-' }}</div>
            <div v-if="visibleColumns.wh_106"><span class="font-medium">{{ warehouseNames['NS'] || 'นครสวรรค์' }}
                (106):</span> {{ selectedRow.wh_106 || '-' }}</div>
            <div v-if="visibleColumns.wh_109"><span class="font-medium">{{ warehouseNames['KR'] || 'นครราชสีมา' }}
                (109):</span> {{ selectedRow.wh_109 || '-' }}</div>
            <div v-if="visibleColumns.wh_111"><span class="font-medium">{{ warehouseNames['NP2'] || 'นครปฐม2' }}
                (111):</span> {{ selectedRow.wh_111 || '-' }}</div>
            <div v-if="visibleColumns.wh_111F"><span class="font-medium">{{ warehouseNames['NP2'] || 'นครปฐม2' }} F-plus
                (111):</span> {{ selectedRow.wh_111F || '-' }}</div>
            <div class="border-t pt-2 mt-2">
              <div class="font-medium text-blue-600 mb-2">ข้อมูลวางแผนตามวันที่:</div>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div v-for="dateColumn in dateColumns" :key="dateColumn"
                  :class="getDateCellClass(selectedRow[dateColumn])">
                  <span class="font-medium">{{ dateColumn }}:</span> {{ selectedRow[dateColumn] || '-' }}
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6 text-right">
            <button @click="showModal = false"
              class="px-4 py-1.5 bg-[#00569D] text-white rounded hover:bg-[#004080]">ปิด</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { Icon } from '@iconify/vue';
import ResultCount from '@/components/ResultCount.vue';
import { useRouter } from 'vue-router';
import { useReportTmsStore } from '@/stores/modules/reportTms';
import { useWarehouseManageStore } from '@/stores/modules/warehouseManage';

const filter = ref({
  dc: '12',
  year: '2568',
  allDC: false,
  showMonth: false,
  dateRange: '1 มิ.ย. 2025 - 30 มิ.ย. 2025',
  search: '',
});

const reportTmsStore = useReportTmsStore();
const warehouseStore = useWarehouseManageStore();
const searchQuery = ref('');

// Filter states
const selectedBrands = ref([]); // Start with empty array, user will select brands
const selectedProductGroups = ref([]); // Start with empty array, user will select product groups
const showBrandDropdown = ref(false); // Brand dropdown visibility state
const showProductGroupDropdown = ref(false); // Product group dropdown visibility state
const brandDropdownRef = ref(null); // Reference to brand dropdown container
const productGroupDropdownRef = ref(null); // Reference to product group dropdown container
const showWarehouseDebug = ref(false); // Warehouse debug panel visibility state

// Computed property to get available brands
const availableBrands = computed(() => {
  return reportTmsStore.brandData || [];
});

// Computed property to get available product groups
const availableProductGroups = computed(() => {
  return reportTmsStore.groupData || [];
});

// Toggle button state with localStorage persistence
const activeButton = ref(localStorage.getItem('planTotalActiveButton') || '12T'); // Default to 12T, but check localStorage

// Computed properties for column visibility based on selected brand
const visibleColumns = computed(() => {
  if (activeButton.value === '12T') {
    // 12Trading: ไม่แสดง wh_111F, blfplus, wh_105F
    return {
      blfplus: false,
      wh_105F: false,
      wh_111F: false,
      // แสดงคอลัมน์อื่นๆ
      bl12t: true,
      wh_101: true,
      wh_102: true,
      wh_103: true,
      wh_104: true,
      wh_105: true,
      wh_106: true,
      wh_109: true,
      wh_111: true
    };
  } else if (activeButton.value === 'Fplus') {
    // Fplus: แสดงทั้งหมด
    return {
      blfplus: true,
      wh_105F: true,
      wh_111F: true,
      bl12t: true,
      wh_101: true,
      wh_102: true,
      wh_103: true,
      wh_104: true,
      wh_105: true,
      wh_106: true,
      wh_109: true,
      wh_111: true
    };
  }
  return {};
});

// Computed property for filtered table data based on brand
const filteredTableDataByBrand = computed(() => {
  let filteredData = filteredTableData.value;

  if (activeButton.value === '12T') {
    // สำหรับ 12Trading: กรองข้อมูลที่เกี่ยวข้องกับ Fplus ออก
    return filteredData.map(item => {
      const filteredItem = { ...item };
      // ลบคอลัมน์ที่เกี่ยวข้องกับ Fplus
      delete filteredItem.blfplus;
      delete filteredItem.wh_105F;
      delete filteredItem.wh_111F;
      return filteredItem;
    });
  }

  return filteredData;
});

// Computed property for table headers based on selected tab
const tableHeaders = computed(() => {
  const baseHeaders = [
    { key: 'item_code', label: 'รหัสสินค้า', visible: true },
    { key: 'item_name', label: 'ชื่อสินค้า', visible: true }
  ];

  if (activeButton.value === '12T') {
    // 12Trading: ไม่แสดง F-plus columns
    return [
      ...baseHeaders,
      { key: 'bl12t', label: 'Balance 12 T', visible: true },
      { key: 'wh_101', label: 'นครปฐม (101)', visible: true },
      { key: 'wh_102', label: 'มหาสารคาม (102)', visible: true },
      { key: 'wh_103', label: 'ลำพูน (103)', visible: true },
      { key: 'wh_104', label: 'สุราษฎร์ (104)', visible: true },
      { key: 'wh_105', label: 'บางนา (105)', visible: true },
      { key: 'wh_106', label: 'นครสวรรค์ (106)', visible: true },
      { key: 'wh_109', label: 'นครราชสีมา (109)', visible: true },
      { key: 'wh_111', label: 'นครปฐม2 (111)', visible: true }
    ];
  } else if (activeButton.value === 'Fplus') {
    // Fplus: แสดงทั้งหมด
    return [
      ...baseHeaders,
      { key: 'blfplus', label: 'Balance F-plus', visible: true },
      { key: 'bl12t', label: 'Balance 12 T', visible: true },
      { key: 'wh_101', label: 'นครปฐม (101)', visible: true },
      { key: 'wh_102', label: 'มหาสารคาม (102)', visible: true },
      { key: 'wh_103', label: 'ลำพูน (103)', visible: true },
      { key: 'wh_104', label: 'สุราษฎร์ (104)', visible: true },
      { key: 'wh_105', label: 'บางนา (105)', visible: true },
      { key: 'wh_105F', label: 'บางนา F-plus (105)', visible: true },
      { key: 'wh_106', label: 'นครสวรรค์ (106)', visible: true },
      { key: 'wh_109', label: 'นครราชสีมา (109)', visible: true },
      { key: 'wh_111', label: 'นครปฐม2 (111)', visible: true },
      { key: 'wh_111F', label: 'นครปฐม2 F-plus (111)', visible: true }
    ];
  }

  return baseHeaders;
});

const filteredTableData = computed(() => {
  let filteredData = reportTmsStore.planningData;

  // Filter by brand
  if (selectedBrands.value.length > 0) {
    filteredData = filteredData.filter(item => {
      // ใช้ brand_item จากข้อมูล
      const itemBrand = item.brand_item;
      if (!itemBrand) return false;

      // ตรวจสอบว่า brand_item ตรงกับที่เลือกไว้หรือไม่
      return selectedBrands.value.includes(itemBrand);
    });
  }

  // Filter by product group
  if (selectedProductGroups.value.length > 0) {
    filteredData = filteredData.filter(item => {
      // ใช้ group_item จากข้อมูล
      const itemGroup = item.group_item;
      if (!itemGroup) return false;

      // ตรวจสอบว่า group_item ตรงกับที่เลือกไว้หรือไม่
      return selectedProductGroups.value.includes(itemGroup);
    });
  }

  // Filter by search query
  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase();
    filteredData = filteredData.filter(item =>
      (item.item_code?.trim() || '').toLowerCase().includes(term) ||
      (item.item_name || '').toLowerCase().includes(term)
    );
  }

  return filteredData;
});

// Toggle function
function toggleActive(buttonType) {
  activeButton.value = buttonType;

  // Save to localStorage for persistence
  localStorage.setItem('planTotalActiveButton', buttonType);

  // Emit values based on button type
  if (buttonType === '12T') {
    // Emit value 380 for 12T
    console.log('12T selected - value: 380');
    // You can add your emit logic here or call a store method
  } else if (buttonType === 'Fplus') {
    // Emit value 410 for Fplus
    console.log('Fplus selected - value: 410');
    // You can add your emit logic here or call a store method
  }
}

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

// เพิ่ม computed property สำหรับ warehouse names
const warehouseNames = computed(() => {
  const warehouseMap = {};
  warehouseStore.warehouses.forEach(warehouse => {
    warehouseMap[warehouse.who_no] = warehouse.who_name;
  });

  // เพิ่ม fallback names สำหรับ warehouse ที่ไม่มีใน API
  // ตรงกับ warehouse codes ที่ได้จาก API: wh_101, wh_102, wh_103, wh_104, wh_105, wh_105F, wh_106, wh_109, wh_111, wh_111F
  const fallbackNames = {
    '101': 'นครปฐม',
    '102': 'มหาสารคาม',
    '103': 'ลำพูน',
    '104': 'สุราษฎร์',
    '105': 'บางนา',
    '105F': 'บางนา F-plus',
    '106': 'นครสวรรค์',
    '109': 'นครราชสีมา',
    '111': 'นครปฐม2',
    '111F': 'นครปฐม2 F-plus',
    // สำหรับ legacy codes
    'NP': 'นครปฐม',
    'MH': 'มหาสารคาม',
    'LP': 'ลำพูน',
    'ST': 'สุราษฎร์',
    'BN': 'บางนา',
    'NS': 'นครสวรรค์',
    'KR': 'นครราชสีมา',
    'NP2': 'นครปฐม2'
  };

  // รวมข้อมูลจาก API และ fallback
  Object.keys(fallbackNames).forEach(key => {
    if (!warehouseMap[key]) {
      warehouseMap[key] = fallbackNames[key];
    }
  });

  return warehouseMap;
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
    query: { column, activeButton: activeButton.value }
  });
}

function getDateCellClass(value) {
  if (!value || value === '0' || value === '-') {
    return 'text-gray-400'
  }
  return 'text-green-600 font-medium'
}

function getCellClass(value, key) {
  if (!value || value === '0' || value === '-') {
    return 'text-gray-500 cursor-default'
  }
  // item_code และ item_name ไม่ต้องคลิก
  if (key === 'item_code' || key === 'item_name') {
    return 'text-gray-700 cursor-default'
  }
  return 'text-blue-600 underline cursor-pointer'
}

function getCellValue(value, key) {
  if (!value || value === '0' || value === '-') {
    return '-'
  }
  return value
}

function exportToExcel() {
  // สามารถเพิ่ม logic ดาวน์โหลดข้อมูลจริงได้
  alert('ดาวน์โหลดข้อมูล!');
}

function applyBrandFilter(event) {
  event.stopPropagation(); // Prevent event bubbling
  console.log('Applied brand filter:', selectedBrands.value);
  console.log('Available brands:', availableBrands.value);
  console.log('Filtered data count:', filteredTableData.value.length);
  console.log('Total data count:', reportTmsStore.planningData.length);
  showBrandDropdown.value = false;
  showProductGroupDropdown.value = false; // ปิด product group dropdown ด้วย
  // You can add additional logic here if needed
}

function toggleBrandDropdown(event) {
  event.stopPropagation(); // Prevent event bubbling
  showBrandDropdown.value = !showBrandDropdown.value;

  // ปิด product group dropdown เมื่อเปิด brand dropdown
  if (showBrandDropdown.value) {
    showProductGroupDropdown.value = false;
  }

  console.log('Toggle brand dropdown:', showBrandDropdown.value); // Debug log
  console.log('Available brands:', availableBrands.value); // Debug log
  console.log('Selected brands:', selectedBrands.value); // Debug log
}

function applyProductGroupFilter(event) {
  event.stopPropagation(); // Prevent event bubbling
  console.log('Applied product group filter:', selectedProductGroups.value);
  console.log('Available product groups:', availableProductGroups.value);
  console.log('Filtered data count:', filteredTableData.value.length);
  console.log('Total data count:', reportTmsStore.planningData.length);
  showProductGroupDropdown.value = false;
  showBrandDropdown.value = false; // ปิด brand dropdown ด้วย
  // You can add additional logic here if needed
}

function toggleProductGroupDropdown(event) {
  event.stopPropagation(); // Prevent event bubbling
  showProductGroupDropdown.value = !showProductGroupDropdown.value;

  // ปิด brand dropdown เมื่อเปิด product group dropdown
  if (showProductGroupDropdown.value) {
    showBrandDropdown.value = false;
  }

  console.log('Toggle product group dropdown:', showProductGroupDropdown.value); // Debug log
  console.log('Available product groups:', availableProductGroups.value); // Debug log
  console.log('Selected product groups:', selectedProductGroups.value); // Debug log
}

function refreshPage() {
  window.location.reload();
}

function clearAllFilters() {
  selectedBrands.value = [];
  selectedProductGroups.value = [];
  searchQuery.value = '';
  showBrandDropdown.value = false;
  showProductGroupDropdown.value = false;
  console.log('Cleared all filters');
}

// Virtual scrolling properties
const tableContainer = ref(null);
const rowHeight = 40; // ความสูงแต่ละแถว (px)
const visibleRows = 20; // จำนวนแถวที่แสดงพร้อมกัน
const scrollTop = ref(0);
const containerHeight = ref(0);

// คำนวณแถวที่ควรแสดงจาก scroll position
const virtualScrollData = computed(() => {
  if (!filteredTableDataByBrand.value) return [];

  const startIndex = Math.floor(scrollTop.value / rowHeight);
  const endIndex = Math.min(startIndex + visibleRows, filteredTableDataByBrand.value.length);

  return filteredTableDataByBrand.value.slice(startIndex, endIndex).map((item, index) => ({
    ...item,
    virtualIndex: startIndex + index,
    originalIndex: startIndex + index
  }));
});

// คำนวณ padding-top เพื่อให้ scroll bar ถูกต้อง
const topPadding = computed(() => {
  return Math.floor(scrollTop.value / rowHeight) * rowHeight;
});

// คำนวณ padding-bottom เพื่อให้ความสูงรวมเท่าเดิม
const bottomPadding = computed(() => {
  if (!filteredTableDataByBrand.value) return 0;
  const totalHeight = filteredTableDataByBrand.value.length * rowHeight;
  const visibleHeight = visibleRows * rowHeight;
  const remainingHeight = totalHeight - visibleHeight - topPadding.value;
  return Math.max(0, remainingHeight);
});

// จัดการ scroll event
const handleScroll = (event) => {
  scrollTop.value = event.target.scrollTop;
};

// ตั้งค่าความสูง container
const setContainerHeight = () => {
  const container = document.querySelector('.virtual-table-container');
  if (container) {
    containerHeight.value = container.clientHeight;
  }
};

// Resize handler for virtual scroll
const resizeHandler = () => {
  nextTick(() => {
    setContainerHeight();
  });
};

onMounted(async () => {
  try {
    await Promise.all([
      reportTmsStore.fetchPlanningAll(),
      warehouseStore.fetchWarehouses() // เพิ่มการดึงข้อมูล warehouse names
    ]);

    // Debug: แสดงข้อมูล brandData ที่โหลดได้
    console.log('Brand data loaded:', reportTmsStore.brandData);
    console.log('Brand data length:', reportTmsStore.brandData.length);
    console.log('Available brands:', availableBrands.value);
    console.log('Selected brands:', selectedBrands.value);

    // Debug: แสดงข้อมูล groupData ที่โหลดได้
    console.log('Group data loaded:', reportTmsStore.groupData);
    console.log('Group data length:', reportTmsStore.groupData.length);
    console.log('Available product groups:', availableProductGroups.value);
    console.log('Selected product groups:', selectedProductGroups.value);

    // Debug: แสดงข้อมูลตัวอย่างจาก planningData
    if (reportTmsStore.planningData.length > 0) {
      console.log('Sample planning data item:', reportTmsStore.planningData[0]);
      console.log('Sample brand_item:', reportTmsStore.planningData[0].brand_item);
      console.log('Sample group_item:', reportTmsStore.planningData[0].group_item);

      // แสดงข้อมูล unique brands และ groups
      const uniqueBrands = [...new Set(reportTmsStore.planningData.map(item => item.brand_item).filter(Boolean))];
      const uniqueGroups = [...new Set(reportTmsStore.planningData.map(item => item.group_item).filter(Boolean))];
      console.log('Unique brands in data:', uniqueBrands);
      console.log('Unique groups in data:', uniqueGroups);
    }

    // Debug: แสดงข้อมูล warehouse ที่โหลดได้
    // console.log('Warehouse data loaded:', warehouseStore.warehouses);
    // console.log('Warehouse names mapping:', warehouseNames.value);

    // แสดงข้อมูล warehouse แต่ละตัว
    warehouseStore.warehouses.forEach(warehouse => {
      // console.log(`Warehouse ${warehouse.who_no}: ${warehouse.who_name}`);
    });

    // Set up virtual scroll container height
    nextTick(() => {
      setContainerHeight();
    });
  } catch (error) {
    console.error('Error loading data:', error);
  }

  // Close dropdowns when clicking outside
  document.addEventListener('click', (event) => {
    if (brandDropdownRef.value && !brandDropdownRef.value.contains(event.target)) {
      showBrandDropdown.value = false;
    }
    if (productGroupDropdownRef.value && !productGroupDropdownRef.value.contains(event.target)) {
      showProductGroupDropdown.value = false;
    }
  });

  // Add resize handler for virtual scroll
  window.addEventListener('resize', resizeHandler);
});

onUnmounted(() => {
  // Clean up resize event listener
  window.removeEventListener('resize', resizeHandler);
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.virtual-table-container {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.virtual-table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.virtual-table-container::-webkit-scrollbar-track {
  background: #f7fafc;
}

.virtual-table-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.virtual-table-container::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>