<template>
    <div class="flex-1 bg-gray-50 min-h-screen">
        <!-- Filter and Action Section -->
        <div class="space-y-2">
            <!-- Sticky Filter Controls -->
            <div class=" bg-gray-100 dark:bg-gray-800">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div class="flex flex-wrap items-end gap-x-4 gap-y-2 justify-between">
                        <!-- ปุ่ม Export Excel ด้านซ้าย -->
                        <div class="flex flex-col justify-start">
                        </div>
                        <!-- Filter Form -->
                        <div class="flex flex-wrap items-end gap-x-4 gap-y-2 justify-center">
                            <div class="flex flex-col">
                                <label
                                    class="mb-1 text-xs font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                    <Icon icon="mdi:calendar-start" class="w-4 h-4 text-[#00569D]" />
                                    วันที่เริ่มต้น
                                </label>
                                <input type="date" v-model="startDate"
                                    class="h-8 w-36 px-2 border border-gray-300 text-xs rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div class="flex flex-col">
                                <label
                                    class="mb-1 text-xs font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                    <Icon icon="mdi:calendar-end" class="w-4 h-4 text-[#00569D]" />
                                    วันที่สิ้นสุด
                                </label>
                                <input type="date" v-model="endDate"
                                    class="h-8 w-36 px-2 border border-gray-300 text-xs rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div class="flex flex-col">
                                <label
                                    class="mb-1 text-xs font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                    <Icon icon="mdi:warehouse" class="w-4 h-4 text-[#00569D]" />
                                    เลือก DC
                                </label>
                                <select v-model="selectedDC" @change="onDCChange" :disabled="isLoadingTransport"
                                    class="h-8 w-36 px-2 border border-gray-300 text-xs rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <option value="" disabled>{{ isLoadingTransport ? 'กำลังโหลด...' : 'เลือก DC' }}
                                    </option>
                                    <option v-for="dc in reportTmsStore.nobillWhList.data || []" :key="dc.who_no"
                                        :value="dc.who_no">
                                        {{ dc.who_name }} : {{ dc.who_no }}
                                    </option>
                                </select>
                                <p v-if="transportError" class="mt-1 text-xs text-red-600 dark:text-red-400">
                                    {{ transportError }}
                                </p>
                            </div>
                            <div class="flex flex-col">
                                <label class="mb-1 text-xs font-medium text-transparent select-none">ค้นหา</label>
                                <button type="button" @click="loadData"
                                    class="h-8 px-3 text-white bg-[#00569D] hover:bg-[#004080] font-medium rounded-lg text-xs flex items-center justify-center focus:ring-2 focus:ring-[#00569D]">
                                    <Icon v-if="isLoading" icon="mdi:loading"
                                        class="animate-spin w-4 h-4 mr-1.5 text-white" />
                                    <Icon v-else icon="mdi:magnify" width="14" height="14" class="mr-1.5 text-white" />
                                    {{ isLoading ? 'กำลังโหลด...' : 'ดึงข้อมูล' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Table Section -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <!-- Loading State -->
                <div v-if="isLoading" class="flex items-center justify-center p-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="p-8 text-center text-red-500">
                    {{ error }}
                </div>

                <!-- No Data State -->
                <div v-else-if="!reportTmsStore.nobillList && hasLoadedData" class="p-8 text-center">
                    <div class="text-gray-500">
                        <Icon icon="mdi:database-off" class="w-12 h-12 mx-auto mb-4" />
                        <p class="text-lg font-medium mb-2">ไม่มีข้อมูล</p>
                        <p class="text-sm">ไม่พบข้อมูลที่ตรงกับเงื่อนไขที่เลือก</p>
                        <div class="mt-4 text-xs text-gray-400">
                            <p>DC: {{ getSelectedDCName() }}</p>
                        </div>
                    </div>
                </div>

                <!-- Not Selected State -->
                <div v-else-if="!selectedDC || !startDate || !endDate" class="p-8 text-center">
                    <div class="text-gray-500">
                        <Icon icon="mdi:clipboard-text-outline" class="w-12 h-12 mx-auto mb-4" />
                        <p class="text-lg font-medium mb-2">กรุณาเลือกเงื่อนไข</p>
                        <p class="text-sm">เลือกวันที่เริ่มต้น, วันที่สิ้นสุด และ DC แล้วกดปุ่ม "ดึงข้อมูล"</p>
                        <div class="mt-4 flex flex-col items-center space-y-2 text-xs">
                            <div class="flex items-center space-x-2">
                                <Icon :icon="startDate ? 'mdi:check-circle' : 'mdi:circle-outline'"
                                    :class="startDate ? 'text-green-500' : 'text-gray-400'" class="w-4 h-4" />
                                <span :class="startDate ? 'text-gray-700' : 'text-gray-400'">
                                    วันที่เริ่มต้น: {{ startDate ? startDate : 'ยังไม่เลือก' }}
                                </span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <Icon :icon="endDate ? 'mdi:check-circle' : 'mdi:circle-outline'"
                                    :class="endDate ? 'text-green-500' : 'text-gray-400'" class="w-4 h-4" />
                                <span :class="endDate ? 'text-gray-700' : 'text-gray-400'">
                                    วันที่สิ้นสุด: {{ endDate ? endDate : 'ยังไม่เลือก' }}
                                </span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <Icon :icon="selectedDC ? 'mdi:check-circle' : 'mdi:circle-outline'"
                                    :class="selectedDC ? 'text-green-500' : 'text-gray-400'" class="w-4 h-4" />
                                <span :class="selectedDC ? 'text-gray-700' : 'text-gray-400'">
                                    DC: {{ selectedDC ? getSelectedDCName() : 'ยังไม่เลือก' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Never Loaded State -->
                <div v-else-if="!hasLoadedData && selectedDC && startDate && endDate" class="p-8 text-center">
                    <div class="text-gray-500">
                        <Icon icon="mdi:database-search" class="w-12 h-12 mx-auto mb-4" />
                        <p class="text-lg font-medium mb-2">พร้อมดึงข้อมูล</p>
                        <p class="text-sm">กดปุ่ม "ดึงข้อมูล" เพื่อดูรายการออร์เดอร์ค้างส่งที่ไม่ได้วางบิล</p>
                        <div class="mt-4 text-xs text-gray-400 flex flex-col items-center space-y-1">
                            <div>
                                <span class="font-medium text-gray-600">วันที่เริ่มต้น:</span>
                                <span>{{ startDate }}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-600">วันที่สิ้นสุด:</span>
                                <span>{{ endDate }}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-600">DC:</span>
                                <span>{{ getSelectedDCName() }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Data Table with Custom Scrollbar -->
                <div v-else-if="reportTmsStore.nobillList"
                    class="relative shadow-md sm:rounded-lg custom-scrollbar p-2 overflow-x-auto overflow-y-hidden"
                    style="max-height: calc(100vh - 220px);">

                    <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 pt-2">
                        <div class="flex items-center justify-center flex-row">
                            <!-- Record Count -->
                            <ResultCount :label="'ผลลัพธ์:'" :current="searchQuery ? filteredNoBillData.length : null"
                                :total="nobillData.length" icon="mdi:clipboard-list-outline" iconColor="#00569D"
                                class="" />
                        </div>
                        <div class="flex items-center space-x-4">

                            <div class=" flex flex-row gap-1 items-center">
                                <button type="button" @click="exportToExcel" :disabled="!(filteredNoBillData?.length)"
                                    class="h-7 px-5 text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-xs flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                                    <Icon icon="file-icons:microsoft-excel" width="12" height="12" class="mr-2" />
                                    Export Excel
                                </button>
                            </div>
                            <!-- Search Input -->
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Icon icon="mdi:magnify" class="w-4 h-4 text-gray-400" />
                                </div>
                                <input type="text" v-model="searchQuery" placeholder="ค้นหา..."
                                    class="w-64 pl-10 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400">
                            </div>

                        </div>
                    </div>
                    <div class="virtual-table-container rounded-t-lg overflow-auto mt-2"
                        style="height: calc(100vh - 280px);" @scroll="handleScroll">
                        <table
                            class="w-full text-xs text-left text-gray-500 dark:text-gray-400 border-collapse border border-gray-300 dark:border-gray-600">
                            <thead
                                class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">
                                <tr>
                                    <th scope="col"
                                        class="px-1 py-1 text-center w-6 border border-gray-300 dark:border-gray-600">No
                                    </th>
                                    <th scope="col"
                                        class="px-1 py-1 text-center w-8 border border-gray-300 dark:border-gray-600">
                                        คลัง
                                    </th>
                                    <th scope="col"
                                        class="px-1 py-1 text-center w-16 border border-gray-300 dark:border-gray-600">
                                        รหัสลูกค้า</th>
                                    <th scope="col" class="px-1 py-1 w-2 border border-gray-300 dark:border-gray-600">
                                        ลูกค้า</th>
                                    <th scope="col"
                                        class="px-1 py-1 text-center w-20 border border-gray-300 dark:border-gray-600">
                                        วันที่ Invoice</th>
                                    <th scope="col"
                                        class="px-1 py-1 text-center w-20 border border-gray-300 dark:border-gray-600">
                                        เลขที่ Invoice</th>
                                    <th scope="col"
                                        class="px-1 py-1 text-center w-16 border border-gray-300 dark:border-gray-600">
                                        ยอดเงิน</th>
                                    <th scope="col"
                                        class="px-1 py-1 text-center w-20 border border-gray-300 dark:border-gray-600">
                                        Co Date</th>
                                    <th scope="col"
                                        class="px-1 py-1 text-center w-20 border border-gray-300 dark:border-gray-600">
                                        เลขที่ Co</th>
                                    <th scope="col"
                                        class="px-1 py-1 text-center w-12 border border-gray-300 dark:border-gray-600">
                                        รหัส</th>
                                    <th scope="col" class="px-1 py-1 w-2 border border-gray-300 dark:border-gray-600">
                                        พนักงาน</th>
                                    <th scope="col"
                                        class="px-1 py-1 text-center w-16 border border-gray-300 dark:border-gray-600">
                                        จำนวนวันค้างส่ง</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Top padding for virtual scrolling -->
                                <tr v-if="topPadding > 0">
                                    <td :colspan="12" :style="{ height: topPadding + 'px', padding: 0 }"></td>
                                </tr>

                                <tr v-if="virtualScrollData.length === 0" class="bg-white dark:bg-gray-800">
                                    <td colspan="12"
                                        class="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        ไม่พบข้อมูลที่ค้นหา
                                    </td>
                                </tr>
                                <tr v-else v-for="(item, index) in virtualScrollData" :key="item.inv_no"
                                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td
                                        class="px-1 py-0.5 font-medium text-gray-900 dark:text-white text-center text-xs border border-gray-300 dark:border-gray-600">
                                        {{ item.originalIndex + 1 }}
                                    </td>
                                    <td
                                        class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                        {{ item.who_no?.trim() }}
                                    </td>
                                    <td
                                        class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                        {{ item.cus_code?.trim() }}
                                    </td>
                                    <td class="px-1 py-0.5 text-xs whitespace-nowrap max-w-28 truncate border border-gray-300 dark:border-gray-600"
                                        :title="item.cus_name">
                                        {{ item.cus_name }}
                                    </td>
                                    <td
                                        class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                        {{ formatDateYYYYMMDD(item.inv_date) }}
                                    </td>
                                    <td
                                        class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                        {{ item.inv_no?.trim() }}
                                    </td>
                                    <td
                                        class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                        <span class="text-green-600 font-semibold">{{
                                            Number(item.amount).toLocaleString() }}</span>
                                    </td>
                                    <td
                                        class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                        {{ formatDateYYYYMMDD(item.co_date) }}
                                    </td>
                                    <td
                                        class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                        {{ item.co_no?.trim() }}
                                    </td>
                                    <td
                                        class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                        {{ item.sale_code?.trim() }}
                                    </td>
                                    <td class="px-1 py-0.5 text-xs whitespace-nowrap max-w-28 truncate border border-gray-300 dark:border-gray-600"
                                        :title="item.sale_name">
                                        {{ item.sale_name }}
                                    </td>
                                    <td
                                        class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                        <span class="text-red-600 font-semibold">{{ item.unsend_date }}</span>
                                    </td>
                                </tr>

                                <!-- Bottom padding for virtual scrolling -->
                                <tr v-if="bottomPadding > 0">
                                    <td :colspan="12" :style="{ height: bottomPadding + 'px', padding: 0 }"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '@/stores';
import { useReportTmsStore } from '@/stores/modules/reportTms';
import { showError, showWarning, showSuccess } from '@/utils/toast';
import * as XLSX from 'xlsx';
import axios from 'axios';
import ResultCount from '@/components/ResultCount.vue';


// Stores
const authStore = useAuthStore();
const reportTmsStore = useReportTmsStore();

// Reactive data
const selectedDC = ref('');
const startDate = ref('');
const endDate = ref('');
const hasLoadedData = ref(false);
const searchQuery = ref('');

// State สำหรับ DC (transportOptions)
const transportOptions = computed(() => reportTmsStore.nobillWhList.data || []);
const isLoadingTransport = ref(false);
const transportError = ref(null);

// Computed properties from stores
const isLoading = computed(() => reportTmsStore.loading);
const error = computed(() => reportTmsStore.error);
const nobillData = computed(() => reportTmsStore.nobillList);

const hasNoBillData = computed(() => nobillData.value.length > 0);

// Load transport data on component mount
onMounted(() => {
    loadTransportData();
    if (window?.Datepicker) {
        document.querySelectorAll('[datepicker]').forEach(el => {
            if (!el._flowbiteDatepicker) {
                new window.Datepicker(el);
            }
        });
    }
    selectedDC.value = localStorage.getItem('notbill_selectedDC') || '';
    startDate.value = localStorage.getItem('notbill_startDate') || '';
    endDate.value = localStorage.getItem('notbill_endDate') || '';
    reportTmsStore.fetchNoBillWhList();
});

// Function to load transport data
const loadTransportData = async () => {
    isLoadingTransport.value = true;
    transportError.value = null;
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/report-tms/nobill-wh`);
        // สมมติ response.data เป็น array ของ DC
        transportOptions.value = response.data || [];
    } catch (err) {
        transportError.value = 'ไม่สามารถโหลดข้อมูล DC ได้';
    } finally {
        isLoadingTransport.value = false;
    }
};

// Function to format date to YYYYMMDD
function formatDateYYYYMMDD(dateStr) {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    return `${dateStr.slice(6, 8)}/${dateStr.slice(4, 6)}/${dateStr.slice(0, 4)}`;
}

// Function to load backlog data
const loadData = async () => {
    if (!selectedDC.value || !startDate.value || !endDate.value) {
        showWarning('คำเตือน', 'กรุณาเลือก DC และวันที่ก่อนดึงข้อมูล');
        return;
    }
    hasLoadedData.value = true;
    // format date to YYYYMMDD
    const dateStart = startDate.value.replace(/-/g, '');
    const dateEnd = endDate.value.replace(/-/g, '');
    await reportTmsStore.fetchNoBillReport(selectedDC.value, dateStart, dateEnd);
    console.log(reportTmsStore.nobillList);
    if (reportTmsStore.error) {
        showError('Error', `เกิดข้อผิดพลาด: ${reportTmsStore.error}`);
    }
};


const onDCChange = () => {
    console.log(`Selected DC: ${selectedDC.value}`);
    const selectedTransport = (transportOptions.value.data || []).find(t => t.who_no === selectedDC.value);
    if (selectedTransport) {
        console.log('Selected transport:', selectedTransport);
    }
};

// Function to format date for Excel
const formatExcelDate = (str) => {
    if (!str) return '';
    // กรณี YYYYMMDD
    if (/^\\d{8}$/.test(str)) {
        return `${str.slice(6, 8)}/${str.slice(4, 6)}/${str.slice(0, 4)}`;
    }
    // กรณี YYYY-MM-DD
    if (/^\\d{4}-\\d{2}-\\d{2}$/.test(str)) {
        const [y, m, d] = str.split('-');
        return `${d}/${m}/${y}`;
    }
    // กรณี Date object
    if (str instanceof Date && !isNaN(str)) {
        return `${str.getDate().toString().padStart(2, '0')}/${(str.getMonth() + 1).toString().padStart(2, '0')}/${str.getFullYear()}`;
    }
    return str;
};

// Function to format date as DD-MM-YYYY for Excel (for po_detail)
const formatExcelDateDMY = (dateStr) => {
    if (!dateStr) return '';
    let dateObj = dateStr;
    if (typeof dateStr === 'string' && dateStr.includes('T')) {
        dateObj = new Date(dateStr);
    } else if (dateStr instanceof Date) {
        dateObj = dateStr;
    } else {
        return '';
    }
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    if (day === '01' && month === '01' && year === 1900) return '';
    return `${day}-${month}-${year}`;
};

// Export to Excel function
const exportToExcel = () => {
    if (!filteredNoBillData.value || filteredNoBillData.value.length === 0) {
        showWarning('คำเตือน', 'ไม่มีข้อมูลสำหรับส่งออก');
        return;
    }

    // Prepare summary row
    const summaryRow = [
        `คลัง ${selectedDC.value} : ${getSelectedDCName()}`,
        `วันที่เริ่มต้น: ${startDate.value}`,
        `วันที่สิ้นสุด: ${endDate.value}`,
        '', '', '', '', '', '', '', '', '', '', '', '', ''
    ];

    // Prepare header row
    const headerRow = [
        'ลำดับ', 'คลังสินค้า', 'รหัสลูกค้า', 'ลูกค้า', 'วันที่ Invoice', 'เลขที่ Invoice',
        'ยอดเงิน', 'Co Date', 'เลขที่ Co', 'รหัส', 'พนักงาน', 'จำนวนวันค้างส่ง'
    ];

    // Prepare data rows
    const dataRows = filteredNoBillData.value.map((item, index) => [
        index + 1,
        item.who_no || '',
        item.cus_code || '',
        item.cus_name || '',
        formatExcelDate(item.inv_date),
        item.inv_no || '',
        item.amount ? Number(item.amount).toLocaleString() : '',
        formatExcelDate(item.co_date),
        item.co_no || '',
        item.sale_code || '',
        item.sale_name || '',
        item.unsend_date || ''
    ]);

    // Combine all rows
    const aoa = [summaryRow, headerRow, ...dataRows];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // Set column widths
    const colWidths = [
        { wch: 8 },   // ลำดับ
        { wch: 12 },  // คลังสินค้า
        { wch: 12 },  // รหัสลูกค้า
        { wch: 30 },  // ลูกค้า
        { wch: 15 },  // วันที่ Invoice
        { wch: 20 },  // เลขที่ Invoice
        { wch: 15 },  // ยอดเงิน
        { wch: 15 },  // Co Date
        { wch: 15 },  // เลขที่ Co
        { wch: 10 },  // รหัส
        { wch: 25 },  // พนักงาน
        { wch: 15 }   // จำนวนวันค้างส่ง
    ];
    ws['!cols'] = colWidths;

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'รายงานออเดอร์ค้างส่ง');

    // Generate filename with current date
    const now = new Date();
    const filename = `notbill_${selectedDC.value}_${startDate.value}_${endDate.value}_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);

    showSuccess('สำเร็จ', 'ส่งออกไฟล์ Excel เรียบร้อยแล้ว');
};

// Helper function to get selected DC name
const getSelectedDCName = () => {
    const selectedTransport = (transportOptions.value.data || []).find(t => t.who_no === selectedDC.value);
    return selectedTransport ? selectedTransport.who_name : 'เลือก DC';
};

// Computed property for filtered backlog data
const filteredNoBillData = computed(() => {
    if (!nobillData.value || !searchQuery.value) {
        return nobillData.value;
    }
    const searchTerm = searchQuery.value.toLowerCase();
    return nobillData.value.filter(item => {
        return (
            (item.who_no && item.who_no.toString().toLowerCase().includes(searchTerm)) ||
            (item.cus_code && item.cus_code.toLowerCase().includes(searchTerm)) ||
            (item.cus_name && item.cus_name.toLowerCase().includes(searchTerm)) ||
            (item.inv_date && item.inv_date.toLowerCase().includes(searchTerm)) ||
            (item.inv_no && item.inv_no.toLowerCase().includes(searchTerm)) ||
            (item.amount && item.amount.toString().toLowerCase().includes(searchTerm)) ||
            (item.co_date && item.co_date.toLowerCase().includes(searchTerm)) ||
            (item.co_no && item.co_no.toLowerCase().includes(searchTerm)) ||
            (item.sale_code && item.sale_code.toLowerCase().includes(searchTerm)) ||
            (item.sale_name && item.sale_name.toLowerCase().includes(searchTerm)) ||
            (item.unsend_date && item.unsend_date.toString().toLowerCase().includes(searchTerm))
        );
    });
});

// Virtual scrolling properties
const rowHeight = 40; // ความสูงแต่ละแถว (px)
const visibleRows = 20; // จำนวนแถวที่แสดงพร้อมกัน
const scrollTop = ref(0);
const containerHeight = ref(0);

// คำนวณแถวที่ควรแสดงจาก scroll position
const virtualScrollData = computed(() => {
    if (!filteredNoBillData.value) return [];

    const startIndex = Math.floor(scrollTop.value / rowHeight);
    const endIndex = Math.min(startIndex + visibleRows, filteredNoBillData.value.length);

    return filteredNoBillData.value.slice(startIndex, endIndex).map((item, index) => ({
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
    if (!filteredNoBillData.value) return 0;
    const totalHeight = filteredNoBillData.value.length * rowHeight;
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

watch([selectedDC, startDate, endDate], ([dc, start, end]) => {
    localStorage.setItem('notbill_selectedDC', dc || '');
    localStorage.setItem('notbill_startDate', start || '');
    localStorage.setItem('notbill_endDate', end || '');
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

.edit-row td {
    border-bottom: 2px solid #fbbf24;
    /* amber-400 */
}

.edit-row:hover {
    background-color: transparent !important;
}

.edit-row-content {
    border-bottom: 2px solid #fbbf24;
    /* amber-400 */
}

/* Slide and Fade Transition */
.slide-fade-enter-active {
    transition: all 0.8s ease-in-out;
}

.slide-fade-leave-active {
    transition: all 0.8s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-20px);
    opacity: 0;
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Virtual scrolling styles */
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
    border-radius: 4px;
}

.virtual-table-container::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 4px;
}

.virtual-table-container::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
}

/* Ensure table rows have consistent height */
.virtual-table-container tbody tr {
    height: 40px;
}

/* Smooth scrolling */
.virtual-table-container {
    scroll-behavior: smooth;
}
</style>
