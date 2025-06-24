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
              <button type="button" @click="downloadData" :disabled="!tableData.length || storeLoading"
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
        <div v-else-if="!tableData.length" class="flex items-center justify-center p-8">
          <div class="text-center">
            <Icon icon="mdi:database-off" class="text-gray-400 mb-2" width="48" height="48" />
            <p class="text-gray-600">ไม่พบข้อมูล</p>
            <button @click="fetchData" class="mt-2 text-blue-600 hover:text-blue-800">
              ลองดึงข้อมูลใหม่
            </button>
          </div>
        </div>

        <!-- Table Content -->
        <div v-else class="relative custom-scrollbar overflow-x-auto w-full" style="max-height: calc(100vh - 240px);">
          <table
            class="text-xs text-left text-gray-500 dark:text-gray-400 border-collapse border border-gray-300 dark:border-gray-600 w-full"
            style="font-size: 0.8rem;">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 whitespace-nowrap">
              <tr>
                <th class="sticky left-0 top-0 z-50 px-2 py-1 bg-gray-50 shadow-sm" rowspan="2">รหัสสินค้า</th>
                <th class="sticky left-12 top-0 z-50 px-2 py-1 bg-gray-50 shadow-sm" rowspan="2">ชื่อสินค้า</th>
                <th class="sticky top-0 z-10 px-2 py-2 text-center bg-gray-50 border" rowspan="2">On Hand</th>
                <th class="sticky top-0 z-10 px-2 py-2 text-center bg-gray-50 border"  rowspan="2">Allocated</th>
                <th class="sticky top-0 z-10 px-2 py-2 text-center bg-gray-50 border" rowspan="2">Allocatable</th>
                <th class="sticky top-0 z-10 px-2 py-2 text-center bg-gray-50 border" rowspan="2">In Transit</th>
                <th class="sticky top-0 z-10 px-2 py-2 text-center bg-gray-50 border" rowspan="2">CO</th>
                <th class="sticky top-0 z-10 px-2 py-2 text-center bg-gray-50 border" rowspan="2">สินค้ารอจัดส่ง</th> 
              </tr>
              <tr>
                <!-- Sub headers for each warehouse -->
                <template v-for="warehouse in warehouses" :key="`sub-${warehouse.who_no}`">
                  <th class="sticky top-[40px] z-10 px-2 py-1 text-black text-center bg-gray-50 border" 
                      :style="{ backgroundColor: warehouse.color, }">{{ warehouse.who_no }} - On Hand</th>
                  <th class="sticky top-[40px] z-10 px-2 py-1 text-black text-center bg-gray-50 border" 
                      :style="{ backgroundColor: warehouse.color, }">{{ warehouse.who_no }} - Allocated</th>
                  <th class="sticky top-[40px] z-10 px-2 py-1 text-black text-center bg-gray-50 border" 
                      :style="{ backgroundColor: warehouse.color, }">{{ warehouse.who_no }} - Allocatable</th>
                  <th class="sticky top-[40px] z-10 px-2 py-1 text-black text-center bg-gray-50 border" 
                      :style="{ backgroundColor: warehouse.color, }">{{ warehouse.who_no }} - In Transit</th>
                  <th class="sticky top-[40px] z-10 px-2 py-1 text-black text-center bg-gray-50 border" 
                      :style="{ backgroundColor: warehouse.color, }">{{ warehouse.who_no }} - CO</th>
                  <th class="sticky top-[40px] z-10 px-2 py-1 text-black text-center bg-gray-50 border" 
                      :style="{ backgroundColor: warehouse.color, }">{{ warehouse.who_no }} - สินค้ารอจัดส่ง</th>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in tableData" :key="idx" :class="idx % 2 === 1 ? 'bg-gray-100' : 'bg-white'">
                <td class="sticky left-0 z-40 bg-white border whitespace-nowrap px-2 py-1 border-gray-300 dark:border-gray-600">{{ item.item_no }}</td>
                <td class="sticky left-12 z-40 bg-white border whitespace-nowrap px-2 py-1 border-gray-300 dark:border-gray-600">{{ item.item_name }}</td>
                <td class="px-2 py-1 text-center border">{{ formatNumber(item.onhand) }}</td>
                <td class="px-2 py-1 text-center border">{{ formatNumber(item.allocated) }}</td>
                <td class="px-2 py-1 text-center border">{{ formatNumber(item.allocatable) }}</td>
                <td class="px-2 py-1 text-center border">{{ formatNumber(item.in_transit) }}</td>
                <td class="px-2 py-1 text-center border">{{ formatNumber(item.co) }}</td>
                <td class="px-2 py-1 text-center border">{{ formatNumber(item.waiting) }}</td>
                <!-- Dynamic warehouse data -->
                <template v-for="warehouse in warehouses" :key="`data-${warehouse.who_no}-${idx}`">
                  <td class="px-2 py-1 text-center text-black border" 
                      :style="{ backgroundColor: warehouse.color, opacity: 0.8 }">
                    {{ formatNumber(item[`${warehouse.who_no}_onhand`]) }}
                  </td>
                  <td class="px-2 py-1 text-center text-black border" 
                      :style="{ backgroundColor: warehouse.color, opacity: 0.8 }">
                    {{ formatNumber(item[`${warehouse.who_no}_allocated`]) }}
                  </td> 
                  <td class="px-2 py-1 text-center text-black border" 
                      :style="{ backgroundColor: warehouse.color, opacity: 0.8 }">
                    {{ formatNumber(item[`${warehouse.who_no}_allocatable`]) }}
                  </td>
                  <td class="px-2 py-1 text-center text-black border" 
                      :style="{ backgroundColor: warehouse.color, opacity: 0.8 }">
                    {{ formatNumber(item[`${warehouse.who_no}_in_transit`]) }}
                  </td>
                  <td class="px-2 py-1 text-center text-black border" 
                      :style="{ backgroundColor: warehouse.color, opacity: 0.8 }">
                    {{ formatNumber(item[`${warehouse.who_no}_co`]) }}
                  </td>
                  <td class="px-2 py-1 text-center text-black border" 
                      :style="{ backgroundColor: warehouse.color, opacity: 0.8 }">
                    {{ formatNumber(item[`${warehouse.who_no}_waiting`]) }}
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
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

// Store
const reportTmsStore = useReportTmsStore();

// Reactive data
const isLoading = ref(false);

// Warehouse configurations based on PHP code
const warehouses = ref([
  { who_no: 'NP', color: '#ffa07a' },   // Light Salmon
  { who_no: 'MH', color: '#87cefa' },   // Light Sky Blue
  { who_no: 'LP', color: '#f08080' },   // Light Coral
  { who_no: 'ST', color: '#b0c4de' },   // Light Steel Blue
  { who_no: 'BN', color: '#90ee90' },   // Light Green
  { who_no: 'NS', color: '#4c8af8' },   // Blue
  { who_no: 'KR', color: '#fff163' },   // Yellow
  { who_no: 'NON', color: '#778899' },  // Light Slate Gray
  { who_no: 'NP2', color: '#ffb6c1' },  // Light Pink
]);

// Computed properties for store data
const tableData = computed(() => reportTmsStore.getDailyStockData);
const storeLoading = computed(() => reportTmsStore.loading);
const storeError = computed(() => reportTmsStore.error);

// Functions
function formatNumber(value) {
  if (value === null || value === undefined || value === 0) return '-';
  return new Intl.NumberFormat('th-TH').format(value);
}

function downloadData() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Daily Stock');

  // Header
  const headerRow = [
    'รหัสสินค้า', 'ชื่อสินค้า', 'On Hand', 'Allocated', 'Allocatable', 'In Transit', 'CO', 'สินค้ารอจัดส่ง'
  ];
  warehouses.value.forEach(wh => {
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
  tableData.value.forEach(item => {
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
    warehouses.value.forEach(wh => {
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
  warehouses.value.forEach((wh, idx) => {
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
  warehouses.value.forEach(() => {
    colWidths.push(12, 12, 12, 12, 10, 15);
  });
  colWidths.forEach((w, i) => worksheet.getColumn(i + 1).width = w);

  // Export
  workbook.xlsx.writeBuffer().then(buffer => {
    saveAs(new Blob([buffer]), `daily_stock_${new Date().toISOString().slice(0,10)}.xlsx`);
  });
}

async function fetchData() {
  isLoading.value = true;
  try {
    const result = await reportTmsStore.fetchDailyStockData();
    if (!result.success) {
      console.error('Failed to fetch data:', result.message);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
}

function refreshPage() {
  window.location.reload();
}

// Load data on component mount
onMounted(async () => {
  console.log('Daily Stock component mounted');
  await fetchData();
});
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
  border: 2px solid #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

.border {
  border: 1px solid #d1d5db;
}

table {
  border-collapse: collapse;
}

th, td {
  border: 1px solid #d1d5db;
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .custom-scrollbar {
    scrollbar-color: #475569 #1e293b;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #1e293b;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #475569;
    border: 2px solid #1e293b;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }
}

/* Enhanced sticky columns */
.sticky {
  position: sticky;
}

.sticky.left-0 {
  left: 0;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

.sticky.left-12 {
  left: 48px; /* 12 * 4px = 48px */
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

/* Ensure sticky columns stay on top during scrolling */
.z-20 {
  z-index: 20;
}

.z-30 {
  z-index: 30;
}

/* Add subtle border to separate sticky columns */
.sticky.left-12 {
  border-right: 1px solid #e5e7eb;
}

/* Enhanced sticky positioning for both axes */
thead th.sticky {
  position: sticky;
  top: 0;
  z-index: 40;
}

tbody td.sticky {
  position: sticky;
  z-index: 30;
}

/* Specific positioning for first two columns */
thead th.sticky.left-0 {
  left: 0;
  z-index: 50;
}

thead th.sticky.left-12 {
  left: 48px;
  z-index: 50;
}

tbody td.sticky.left-0 {
  left: 0;
  z-index: 40;
}

tbody td.sticky.left-12 {
  left: 48px;
  z-index: 40;
}

/* Dark mode adjustments for sticky columns */
@media (prefers-color-scheme: dark) {
  .sticky.left-0,
  .sticky.left-12 {
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.3);
  }
  
  .sticky.left-12 {
    border-right: 1px solid #374151;
  }
}

th.sticky.top-row-2 { top: 40px !important; }
</style>