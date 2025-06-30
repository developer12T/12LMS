<template>
  <div class="mx-auto w-full px-4" style="max-width: calc(100vw - 100px);">
    <!-- Filter and Action Section -->
    <div class="space-y-6">
      <!-- Sticky Filter Controls -->
      <div class="bg-gray-100 dark:bg-gray-800">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full">
          <!-- Error Message -->
          <div v-if="storeError" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <div class="flex items-center">
              <Icon icon="mdi:alert-circle" class="mr-2" />
              {{ storeError }}
              <button @click="reportTmsStore.clearError()" class="ml-auto text-red-500 hover:text-red-700">
                <Icon icon="mdi:close" />
              </button>
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-4 lg:justify-end lg:items-end">
            <!-- Action Section (Backlog style) -->
            <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
              <button type="button" @click="downloadData" :disabled="!rowData.length || storeLoading"
                class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Icon icon="file-icons:microsoft-excel" width="16" height="16" class="mr-1.5" />
                Export Excel
              </button>
              <button type="button" @click="fetchData" :disabled="storeLoading"
                class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Icon v-if="storeLoading" icon="mdi:loading" class="animate-spin mr-1.5" width="16" height="16" />
                <Icon v-else icon="mdi:database-sync" width="16" height="16" class="mr-1.5" />
                {{ storeLoading ? 'กำลังดึงข้อมูล...' : 'ดึงข้อมูลใหม่' }}
              </button>
              <button type="button" @click="refreshPage" :disabled="storeLoading"
                class="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Icon icon="mdi:refresh" width="16" height="16" class="mr-1.5" />
                รีเฟรชข้อมูล
              </button>
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
          <div class="text-center">
            <Icon icon="mdi:database-off" class="text-gray-400 mb-2" width="48" height="48" />
            <p class="text-gray-600">ไม่พบข้อมูล</p>
            <button @click="fetchData" class="mt-2 text-blue-600 hover:text-blue-800">
              ลองดึงข้อมูลใหม่
            </button>
          </div>
        </div>

        <!-- Table Content -->
        <div v-else class="mb-2 flex justify-between items-center mt-2 mr-2">
          <!-- Result count (left) -->
          <div class="flex items-center gap-3 ml-2 px-3 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <!-- Simple icon -->
            <Icon icon="streamline-ultimate:time-daily-1-bold" color="#374151" class="w-5 h-5 mr-2" />

            <!-- Clean text layout -->
            <div class="flex items-center gap-2 text-sm font-sarabun text-gray-700">
              <span class="font-medium">ผลลัพธ์:</span>

              <!-- Highlighted current count -->
              <span class="inline-flex items-center px-3 py-1 bg-gray-50 text-gray-600 rounded-md font-bold text-sm"
                v-if="searchText">
                {{ filteredRowData.length }}
              </span>

              <span class="text-gray-400" v-if="searchText">/</span>

              <!-- Total count -->
              <span
                class="inline-flex items-center px-3 py-1 bg-green-100 text-green-600 rounded-md font-medium text-sm">
                {{ rowData.length }}
              </span>

              <span>รายการ</span>
            </div>
          </div>
          <!-- Beautiful Search Input with Flowbite styling (right) -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
              <Icon icon="mdi:magnify" class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            </div>
            <input v-model="searchText" type="text" placeholder="ค้นหา รหัสสินค้า หรือ ชื่อสินค้า"
              class="block w-64 p-2 pl-8 text-xs text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 hover:bg-white hover:border-gray-400 focus:bg-white" />
            <div class="absolute inset-y-0 right-0 flex items-center pr-2">
              <button v-if="searchText" @click="searchText = ''" type="button"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
                <Icon icon="mdi:close-circle" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="!storeLoading && rowData && rowData.length"
          class="ag-theme-alpine m-2"
          style="width: calc(100% - 16px); height: calc(100vh - 300px);"
        >
          <ag-grid-vue :rowData="filteredRowData" :columnDefs="columnDefs" :defaultColDef="defaultColDef" theme="legacy"
            :pagination="false" :animateRows="false" :suppressHorizontalScroll="false" :localeText="{
              noRowsToShow: 'ไม่พบข้อมูลที่ค้นหา',
            }" style="width: 100%; height: calc(100vh - 300px);"  />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useReportTmsStore } from '@/stores/modules/reportTms';
import { AgGridVue } from 'ag-grid-vue3';
import { themeQuartz } from 'ag-grid-community';

// Store
const reportTmsStore = useReportTmsStore();

const myTheme = themeQuartz
  .withParams({
    browserColorScheme: "light",
    columnBorder: true,
    headerFontSize: 14
  });

// ใช้ข้อมูลจาก store โดยตรง
const rowData = computed(() => reportTmsStore.getDailyStockData || []);
const storeLoading = computed(() => reportTmsStore.loading);
const storeError = computed(() => reportTmsStore.error);

// warehouses กำหนดเอง (หรือจะดึงจาก API ก็ได้)
const warehouses = [
  { who_no: 'NP', color: '#ffa07a' },
  { who_no: 'MH', color: '#87cefa' },
  { who_no: 'LP', color: '#f08080' },
  { who_no: 'ST', color: '#b0c4de' },
  { who_no: 'BN', color: '#90ee90' },
  { who_no: 'NS', color: '#4c8af8' },
  { who_no: 'KR', color: '#fff163' },
  { who_no: 'NON', color: '#778899' },
  { who_no: 'NP2', color: '#ffb6c1' },
];

const columnDefs = [
  { headerName: 'รหัสสินค้า', field: 'item_no', pinned: 'left', autoWidth: true },
  { headerName: 'ชื่อสินค้า', field: 'item_name', pinned: 'left', cellStyle: { whiteSpace: 'nowrap', textOverflow: 'unset', overflow: 'visible' }, autoHeight: true, autoWidth: true },
  { headerName: 'On Hand', field: 'onhand', minWidth: 60, valueFormatter: p => formatNumber(p.value), cellClass: 'ag-right-aligned-cell' },
  { headerName: 'Allocated', field: 'allocated', minWidth: 60, valueFormatter: p => formatNumber(p.value), cellClass: 'ag-right-aligned-cell' },
  { headerName: 'Allocatable', field: 'allocatable', minWidth: 60, valueFormatter: p => formatNumber(p.value), cellClass: 'ag-right-aligned-cell' },
  { headerName: 'In Transit', field: 'in_transit', minWidth: 60, valueFormatter: p => formatNumber(p.value), cellClass: 'ag-right-aligned-cell' },
  { headerName: 'CO', field: 'co', minWidth: 60, valueFormatter: p => formatNumber(p.value), cellClass: 'ag-right-aligned-cell' },
  { headerName: 'สินค้ารอจัดส่ง', field: 'waiting', minWidth: 60, valueFormatter: p => formatNumber(p.value), cellClass: 'ag-right-aligned-cell' },
  ...warehouses.flatMap(wh => [
    { headerName: `${wh.who_no} - On Hand`, field: `${wh.who_no}_onhand`, minWidth: 60, valueFormatter: p => formatNumber(p.value), cellStyle: { background: wh.color, opacity: 0.8 }, cellClass: 'ag-right-aligned-cell' },
    { headerName: `${wh.who_no} - Allocated`, field: `${wh.who_no}_allocated`, minWidth: 60, valueFormatter: p => formatNumber(p.value), cellStyle: { background: wh.color, opacity: 0.8 }, cellClass: 'ag-right-aligned-cell' },
    { headerName: `${wh.who_no} - Allocatable`, field: `${wh.who_no}_allocatable`, minWidth: 60, valueFormatter: p => formatNumber(p.value), cellStyle: { background: wh.color, opacity: 0.8 }, cellClass: 'ag-right-aligned-cell' },
    { headerName: `${wh.who_no} - In Transit`, field: `${wh.who_no}_in_transit`, minWidth: 60, valueFormatter: p => formatNumber(p.value), cellStyle: { background: wh.color, opacity: 0.8 }, cellClass: 'ag-right-aligned-cell' },
    { headerName: `${wh.who_no} - CO`, field: `${wh.who_no}_co`, minWidth: 60, valueFormatter: p => formatNumber(p.value), cellStyle: { background: wh.color, opacity: 0.8 }, cellClass: 'ag-right-aligned-cell' },
    { headerName: `${wh.who_no} - สินค้ารอจัดส่ง`, field: `${wh.who_no}_waiting`, minWidth: 60, valueFormatter: p => formatNumber(p.value), cellStyle: { background: wh.color, opacity: 0.8 }, cellClass: 'ag-right-aligned-cell' }
  ])
];

const defaultColDef = {
  resizable: false,
  sortable: true,
  filter: false,
  minWidth: 20,
  flex: undefined
};

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

function refreshPage() {
  window.location.reload();
}

const searchText = ref('');

const filteredRowData = computed(() => {
  if (!searchText.value) return rowData.value;
  const search = searchText.value.toLowerCase();
  return rowData.value.filter(
    row =>
      (row.item_no && row.item_no.toLowerCase().includes(search)) ||
      (row.item_name && row.item_name.toLowerCase().includes(search))
  );
});

const gridApi = ref(null);

function onGridReady(params) {
  gridApi.value = params.api;
  // Auto size เฉพาะคอลัมน์ชื่อสินค้า
  params.columnApi.autoSizeColumn('item_no', false);
  params.columnApi.autoSizeColumn('item_name');
}

onMounted(async () => {
  await fetchData();
});
</script>

<style>
@import "ag-grid-community/styles/ag-grid.css";
@import "ag-grid-community/styles/ag-theme-alpine.css";

.ag-theme-alpine {
  font-size: 10px !important;
  --ag-borders: solid;
  --ag-border-color: #d1d5db;
  --ag-row-border-width: 1px;
  --ag-header-column-separator-display: block;
  --ag-header-column-separator-height: 100%;
  --ag-header-column-separator-width: 1px;
}

.ag-theme-alpine .ag-header-cell-label {
  font-size: 13px;
  white-space: nowrap;
  overflow: visible;
  text-overflow: unset;
}

.ag-theme-alpine .ag-body-cell {
  font-size: 10px !important;
}

.ag-theme-alpine .ag-cell,
.ag-theme-alpine .ag-header-cell,
.ag-theme-alpine .ag-header-group-cell {
  border-right: 1px solid #d1d5db !important;
  /* เส้นแนวตั้ง */
  border-bottom: 1px solid #d1d5db !important;
  /* เส้นแนวนอน */
  padding-left: 4px !important;
  padding-right: 4px !important;
}

.ag-theme-alpine .ag-row {
  border-bottom: 1px solid #d1d5db !important;
}

.ag-theme-alpine .ag-header-row {
  border-bottom: 1.5px solid #bdbdbd !important;
}
</style>