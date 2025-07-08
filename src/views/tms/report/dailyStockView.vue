<template>
  <div class="flex-1 bg-gray-50 min-h-screen">
    <div class="space-y-2">
      <!-- Filter and Action Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex flex-wrap items-end gap-x-4 gap-y-2 justify-between">
          <!-- ซ้าย: ResultCount -->
          <div class="flex items-center">
            <ResultCount :label="'ผลลัพธ์:'" :current="debouncedSearchText ? filteredRowData.length : null"
              :total="rowData.length" icon="mdi:table" iconColor="#00569D" class="" />
              <div class="flex gap-2 ml-2">  
              <button v-for="wh in warehouses" :key="wh.who_no" @click="scrollToWarehouse(wh.who_no)"
                class="h-7 px-3 rounded-md shadow text-xs font-medium flex items-center hover:scale-105 transition-transform"
                :style="{ background: wh.color, color: '#222', minWidth: '48px' }">
                {{ wh.who_no }}<span v-if="wh.name">-{{ wh.name }}</span>
              </button>
            </div>
          </div>
          <!-- ขวา: Tabs, Export, Search -->
          <div class="flex flex-row gap-2 items-center">
            <!-- Warehouse Tabs -->
           
            <!-- Export Excel -->
            <button type="button" @click="downloadData" :disabled="!rowData.length"
              class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon icon="file-icons:microsoft-excel" width="16" height="16" class="mr-1.5" />
              Export Excel
            </button>
            <!-- ดึงข้อมูลใหม่ -->
            <button @click="fetchData" :disabled="storeLoading"
              class="text-white bg-red-700 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon v-if="storeLoading" icon="mdi:loading" class="animate-spin w-4 h-4" />
              <Icon v-else icon="mdi:database-sync" width="16" height="16" />
              {{ storeLoading ? 'กำลังดึงข้อมูล...' : 'ดึงข้อมูลใหม่' }}
            </button>
            <!-- รีเฟรชข้อมูล -->
            <button @click="fetchData" :disabled="storeLoading"
              class="text-white bg-[#00569D] hover:bg-[#00569D] focus:ring-4 focus:outline-none focus:ring-[#00569D] font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-[#00569D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon icon="mdi:refresh" width="16" height="16" />
              รีเฟรช
            </button>
            <!-- Search -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon icon="mdi:magnify" class="w-4 h-4 text-gray-400" />
              </div>
              <input type="text" v-model="searchText" @input="debouncedSearch($event.target.value)" placeholder="ค้นหา..."
                class="w-48 pl-10 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400">
            </div>
            
          </div>
        </div>
      </div>
      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-0 w-full">
        <!-- Loading State -->
        <div v-if="storeLoading" class="flex items-center justify-center p-8">
          <div class="flex flex-col items-center">
            <Icon icon="mdi:loading" class="animate-spin text-blue-600 mb-2" width="32" height="32" />
            <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
        <!-- Empty State -->
        <div v-else-if="!rowData || !rowData.length">
          <div class="text-center p-8">
            <Icon icon="mdi:database-off" class="text-gray-400 mb-2" width="48" height="48" />
            <p class="text-gray-600">ไม่พบข้อมูล</p>
            <button @click="fetchData" class="mt-2 text-blue-600 hover:text-blue-800">
              ลองดึงข้อมูลใหม่
            </button>
          </div>
        </div>
        <!-- Table Content -->
        <div v-if="!storeLoading && rowData && rowData.length">
          <div ref="tableContainer" class="virtual-table-container rounded-t-lg overflow-x-auto overflow-y-auto"
            style="height: calc(100vh - 180px); width: calc(100vw - 120px); will-change: scroll-position;" @scroll="handleScroll">
            <!-- Top spacer -->
            <div v-if="spacerHeight > 0" :style="{ height: spacerHeight + 'px' }"></div>
            <table class="min-w-max text-xs text-left text-gray-500 border border-gray-300 ">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th
                    class="px-2 py-2 text-center font-semibold sticky top-0 left-0 z-20 bg-gray-50 border border-gray-300"
                    style="min-width: 120px;">รหัสสินค้า</th>
                  <th
                    class="px-2 py-2 text-center font-semibold sticky top-0 left-[120px] z-20 bg-gray-50 border border-gray-300"
                    style="min-width: 200px;">ชื่อสินค้า</th>
                  <th class="px-2 py-2 text-center  bg-gray-50 font-semibold border border-gray-300">On Hand
                  </th>
                  <th class="px-2 py-2 text-center bg-gray-50 font-semibold border border-gray-300">
                    Allocated</th>
                  <th class="px-2 py-2 text-center sticky top-0 bg-gray-50 font-semibold border border-gray-300">
                    Allocatable</th>
                  <th class="px-2 py-2 text-center sticky top-0 bg-gray-50 font-semibold border border-gray-300">In
                    Transit</th>
                  <th class="px-2 py-2 text-center sticky top-0 bg-gray-50 font-semibold border border-gray-300">CO</th>
                  <th class="px-2 py-2 text-center sticky top-0 bg-gray-50 font-semibold border border-gray-300">
                    สินค้ารอจัดส่ง</th>
                  <!-- Warehouse Columns - Grouped by Warehouse -->
                  <template v-for="wh in warehouses" :key="wh.who_no">
                    <th :ref="el => setWarehouseRef(wh.who_no, el)"
                      class="px-2 py-2 text-center sticky top-0 font-semibold border border-gray-300"
                      :style="{ backgroundColor: wh.color, minWidth: '80px', color: 'black' }">{{ wh.who_no }} - On Hand
                    </th>
                    <th class="px-2 py-2 text-center sticky top-0 font-semibold border border-gray-300"
                      :style="{ backgroundColor: wh.color, minWidth: '80px', color: 'black' }">{{ wh.who_no }} -
                      Allocated</th>
                    <th class="px-2 py-2 text-center sticky top-0 font-semibold border border-gray-300"
                      :style="{ backgroundColor: wh.color, minWidth: '80px', color: 'black' }">{{ wh.who_no }} -
                      Allocatable</th>
                    <th class="px-2 py-2 text-center sticky top-0 font-semibold border border-gray-300"
                      :style="{ backgroundColor: wh.color, minWidth: '80px', color: 'black' }">{{ wh.who_no }} - In
                      Transit</th>
                    <th class="px-2 py-2 text-center sticky top-0 font-semibold border border-gray-300"
                      :style="{ backgroundColor: wh.color, minWidth: '80px', color: 'black' }">{{ wh.who_no }} - CO</th>
                    <th class="px-2 py-2 text-center sticky top-0 font-semibold border border-gray-300"
                      :style="{ backgroundColor: wh.color, minWidth: '80px', color: 'black' }">{{ wh.who_no }} -
                      สินค้ารอจัดส่ง</th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in filteredRowData" :key="row.item_no"
                  :class="idx % 2 === 1 ? 'bg-gray-50' : 'bg-white'">
                  <td class="px-2 py-1 text-center sticky left-0 z-10 bg-white border border-gray-300"
                    style="min-width: 120px;">{{
                    row.item_no }}</td>
                  <td class="px-2 py-1 sticky left-[120px] z-10 bg-white border border-gray-300"
                    style="min-width: 200px;">{{
                    row.item_name }}</td>
                  <td class="px-2 py-1 text-right border border-gray-300">{{ formattedRowData[idx].onhand_fmt }}</td>
                  <td class="px-2 py-1 text-right border border-gray-300">{{ formattedRowData[idx].allocated_fmt }}</td>
                  <td class="px-2 py-1 text-right border border-gray-300">{{ formattedRowData[idx].allocatable_fmt }}</td>
                  <td class="px-2 py-1 text-right border border-gray-300">{{ formattedRowData[idx].in_transit_fmt }}</td>
                  <td class="px-2 py-1 text-right border border-gray-300">{{ formattedRowData[idx].co_fmt }}</td>
                  <td class="px-2 py-1 text-right border border-gray-300">{{ formattedRowData[idx].waiting_fmt }}</td>
                  <!-- Warehouse Data - Grouped by Warehouse -->
                  <template v-for="wh in warehouses" :key="wh.who_no">
                    <td class="px-2 py-1 text-right border border-gray-300"
                      :style="{ backgroundColor: wh.color + '20' }">{{ formattedRowData[idx][`${wh.who_no}_onhand_fmt`] }}</td>
                    <td class="px-2 py-1 text-right border border-gray-300"
                      :style="{ backgroundColor: wh.color + '20' }">{{ formattedRowData[idx][`${wh.who_no}_allocated_fmt`] }}
                    </td>
                    <td class="px-2 py-1 text-right border border-gray-300"
                      :style="{ backgroundColor: wh.color + '20' }">{{ formattedRowData[idx][`${wh.who_no}_allocatable_fmt`] }}
                    </td>
                    <td class="px-2 py-1 text-right border border-gray-300"
                      :style="{ backgroundColor: wh.color + '20' }">{{ formattedRowData[idx][`${wh.who_no}_in_transit_fmt`] }}
                    </td>
                    <td class="px-2 py-1 text-right border border-gray-300"
                      :style="{ backgroundColor: wh.color + '20' }">{{ formattedRowData[idx][`${wh.who_no}_co_fmt`] }}</td>
                    <td class="px-2 py-1 text-right border border-gray-300"
                      :style="{ backgroundColor: wh.color + '20' }">{{ formattedRowData[idx][`${wh.who_no}_waiting_fmt`] }}</td>
                  </template>
                </tr>
              </tbody>
            </table>
            <!-- Bottom spacer -->
            <div v-if="bottomSpacerHeight > 0" :style="{ height: bottomSpacerHeight + 'px' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useReportTmsStore } from '@/stores/modules/reportTms';
import ResultCount from '@/components/ResultCount.vue';

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Store
const reportTmsStore = useReportTmsStore();

// ใช้ข้อมูลจาก store โดยตรง
const rowData = computed(() => reportTmsStore.getDailyStockData || []);
const storeLoading = computed(() => reportTmsStore.loading);
const storeError = computed(() => reportTmsStore.error);

// Pre-format data for better performance
const formattedRowData = computed(() => {
  return rowData.value.map(row => {
    const formatted = { ...row };
    
    // Format main columns
    formatted.onhand_fmt = formatNumber(row.onhand);
    formatted.allocated_fmt = formatNumber(row.allocated);
    formatted.allocatable_fmt = formatNumber(row.allocatable);
    formatted.in_transit_fmt = formatNumber(row.in_transit);
    formatted.co_fmt = formatNumber(row.co);
    formatted.waiting_fmt = formatNumber(row.waiting);
    
    // Format warehouse columns
    warehouses.forEach(wh => {
      formatted[`${wh.who_no}_onhand_fmt`] = formatNumber(row[`${wh.who_no}_onhand`]);
      formatted[`${wh.who_no}_allocated_fmt`] = formatNumber(row[`${wh.who_no}_allocated`]);
      formatted[`${wh.who_no}_allocatable_fmt`] = formatNumber(row[`${wh.who_no}_allocatable`]);
      formatted[`${wh.who_no}_in_transit_fmt`] = formatNumber(row[`${wh.who_no}_in_transit`]);
      formatted[`${wh.who_no}_co_fmt`] = formatNumber(row[`${wh.who_no}_co`]);
      formatted[`${wh.who_no}_waiting_fmt`] = formatNumber(row[`${wh.who_no}_waiting`]);
    });
    
    return formatted;
  });
});

// warehouses กำหนดเอง (หรือจะดึงจาก API ก็ได้)
const warehouses = [
  { who_no: 'NP', name: '101', color: '#ffa07a' },
  { who_no: 'MH', name: '102', color: '#87cefa' },
  { who_no: 'LP', name: '103', color: '#f08080' },
  { who_no: 'ST', name: '104', color: '#b0c4de' },
  { who_no: 'BN', name: '105', color: '#90ee90' },
  { who_no: 'NS', name: '106', color: '#4c8af8' },
  { who_no: 'KR', name: '109', color: '#fff163' },
  { who_no: 'NON', name: '', color: '#778899' },
  { who_no: 'NP2', name: '111', color: '#ffb6c1' },
];

function formatNumber(value) {
  if (value === null || value === undefined || value === '' || value === 0) {
    return '-';
  }
  return Number(value).toLocaleString();
}

function downloadData() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Daily Stock');

  // Header
  const headerRow = [
    'รหัสสินค้า', 'ชื่อสินค้า', 'On Hand', 'Allocated', 'Allocatable', 'In Transit', 'CO', 'สินค้ารอจัดส่ง'
  ];
  warehouses.forEach(wh => {
    headerRow.push(
      `${wh.who_no} - On Hand`,
      `${wh.who_no} - Allocated`,
      `${wh.who_no} - Allocatable`,
      `${wh.who_no} - In Transit`,
      `${wh.who_no} - CO`,
      `${wh.who_no} - สินค้ารอจัดส่ง`
    );
  });
  worksheet.addRow(headerRow);

  // Data
  rowData.value.forEach(item => {
    const row = [
      item.item_no,
      item.item_name,
      item.onhand || 0,
      item.allocated || 0,
      item.allocatable || 0,
      item.in_transit || 0,
      item.co || 0,
      item.waiting || 0
    ];
    warehouses.forEach(wh => {
      row.push(
        item[`${wh.who_no}_onhand`] || 0,
        item[`${wh.who_no}_allocated`] || 0,
        item[`${wh.who_no}_allocatable`] || 0,
        item[`${wh.who_no}_in_transit`] || 0,
        item[`${wh.who_no}_co`] || 0,
        item[`${wh.who_no}_waiting`] || 0
      );
    });
    worksheet.addRow(row);
  });

  // ใส่สี header
  worksheet.getRow(1).eachCell(cell => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF3F4F6' } // bg-gray-50
    };
    cell.font = { bold: true, color: { argb: 'FF374151' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
    };
  });

  // ใส่สี warehouse columns
  const startCol = 9;
  warehouses.forEach((wh, idx) => {
    for (let i = 0; i < 6; i++) {
      const col = startCol + idx * 6 + i;
      worksheet.getColumn(col).eachCell((cell, rowNumber) => {
        if (rowNumber > 1) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF' + wh.color.replace('#', '') }
          };
          cell.font = { color: { argb: 'FF000000' } };
        }
      });
    }
  });

  // สลับสีแถว (แถวคู่/คี่)
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      const isEven = (rowNumber - 2) % 2 === 1;
      row.eachCell((cell, colNumber) => {
        if (colNumber < startCol) {
          cell.fill = cell.fill || {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: isEven ? 'FFF9FAFB' : 'FFFFFFFF' }
          };
        }
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
        };
        cell.alignment = { vertical: 'middle', horizontal: colNumber < 2 ? 'left' : 'center' };
      });
    }
  });

  // Set column widths
  const colWidths = [
    15, 40, 12, 12, 12, 12, 10, 15
  ];
  warehouses.forEach(() => {
    colWidths.push(12, 12, 12, 12, 10, 15);
  });
  colWidths.forEach((w, i) => worksheet.getColumn(i + 1).width = w);

  // Export
  workbook.xlsx.writeBuffer().then(buffer => {
    saveAs(new Blob([buffer]), `daily_stock_${new Date().toISOString().slice(0, 10)}.xlsx`);
  });
}

async function fetchData() {
  await reportTmsStore.fetchDailyStockData();
}

const searchText = ref('');
const debouncedSearchText = ref('');

const debouncedSearch = debounce((value) => {
  debouncedSearchText.value = value;
}, 300);

const filteredRowData = computed(() => {
  if (!debouncedSearchText.value) return formattedRowData.value;
  const search = debouncedSearchText.value.toLowerCase();
  return formattedRowData.value.filter(
    row =>
      (row.item_no && row.item_no.toLowerCase().includes(search)) ||
      (row.item_name && row.item_name.toLowerCase().includes(search))
  );
});

const tableContainer = ref(null);
const warehouseRefs = ref({});
const activeWarehouse = ref(null); // จำ tab ล่าสุดที่เลือก

function setWarehouseRef(who_no, el) {
  if (el) warehouseRefs.value[who_no] = el;
}

function scrollToWarehouse(who_no) {
  const container = tableContainer.value;
  const th = warehouseRefs.value[who_no];
  if (container && th) {
    // ความกว้างของ 2 คอลัมน์แรก (sticky)
    const stickyWidth = 120 + 390; // min-width ของ 2 th แรก (px)
    const containerRect = container.getBoundingClientRect();
    const thRect = th.getBoundingClientRect();
    // เลื่อน scrollLeft ให้ th อยู่ถัดจาก sticky column (smooth)
    const targetScrollLeft = container.scrollLeft + thRect.left - containerRect.left - stickyWidth;
    container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
    activeWarehouse.value = who_no;
  }
}

function handleResize() {
  if (activeWarehouse.value) {
    // รอ layout เสร็จก่อน scroll
    nextTick(() => scrollToWarehouse(activeWarehouse.value));
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});


onMounted(async () => {
  await fetchData();
});
</script>

<style>
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