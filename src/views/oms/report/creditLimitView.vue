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
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4 overflow-x-auto">
                <table class="min-w-full text-xs text-gray-700 border-collapse border border-gray-300">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center" rowspan="2">เขต</th>
                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center" rowspan="2">คลัง</th>
                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center" rowspan="2">รหัส</th>
                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center" rowspan="2">ชื่อร้าน
                            </th>

                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center" rowspan="1"
                                colspan="2">รายการค้างชำระ</th>
                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center" rowspan="1"
                                colspan="2">co ค้างส่ง</th>
                            <!-- <th class="px-3 py-2 border border-gray-300 font-semibold text-center">รายละเอียด</th> -->
                        </tr>
                        <tr class="bg-gray-100">

                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center">จำนวนบิล</th>
                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center">จำนวนเงิน</th>

                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center">จำนวนบิล</th>
                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center">จำนวนเงิน</th>
                            <!-- <th class="px-3 py-2 border border-gray-300 font-semibold text-center">รายละเอียด</th> -->
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in tableData" :key="row.cuscode"
                            class="hover:bg-gray-50 transition-colors cursor-pointer" @click="openBillDetail(row)">
                            <td class="px-3 py-2 border border-gray-300 text-center">{{ row.area }}</td>
                            <td class="px-3 py-2 border border-gray-300 text-center">{{ row.area }}</td>
                            <td class="px-3 py-2 border border-gray-300 text-center">{{ row.cuscode }}</td>
                            <td class="px-3 py-2 border border-gray-300">{{ row.cusname }}</td>

                            <td class="px-3 py-2 border border-gray-300 text-right">{{ row.amount }}</td>
                            <td class="px-3 py-2 border border-gray-300 text-center">{{ row.amount }}</td>

                            <td class="px-3 py-2 border border-gray-300 text-right">{{ row.amount }}</td>
                            <td class="px-3 py-2 border border-gray-300 text-center">{{ row.amount }}</td>

                        </tr>
                    </tbody>
                </table>
                <!-- Modal -->
                <div v-if="showModal"
                    class="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 backdrop-blur-sm"
                    @click.self="showModal = false">
                    <div
                        class="bg-white rounded-xl shadow-2xl max-w-6xl w-full h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
                        <!-- Header -->
                        <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-6">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center space-x-3">

                                    <div>
                                        <span class="text-md font-bold">รายละเอียด {{ selectedRow.cusname }}</span>
                                    </div>
                                </div>
                                <button @click="showModal = false"
                                    class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="p-6 max-h-[90vh] overflow-auto space-y-6">
                            <!-- ตารางรายการค้างชำระ -->
                            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div class="bg-gradient-to-r from-[#00569D] to-[#004080] text-white py-2 px-4 font-semibold rounded-t-lg -mt-4 -mx-4 mb-4">
                                    <div class="flex items-center gap-2">
                                        <Icon icon="mdi:file-document-outline" class="w-4 h-4" />
                                        รายการค้างชำระ
                                    </div>
                                </div>
                                <div class="overflow-x-auto">
                                    <table class="min-w-full text-xs text-gray-700 border-collapse border border-gray-300">
                                        <thead>
                                            <tr class="bg-gray-100">
                                                <th class="px-3 py-2 border border-gray-300 font-semibold text-center">เลขที่ inv.</th>
                                                <th class="px-3 py-2 border border-gray-300 font-semibold text-center">จำนวน</th>
                                                <th class="px-3 py-2 border border-gray-300 font-semibold text-center">ครบกำหนด</th>
                                                <th class="px-3 py-2 border border-gray-300 font-semibold text-center">เกินกำหนด</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(bill, index) in selectedRow.outstandingPayments" 
                                                :key="bill.invoiceNo"
                                                class="hover:bg-gray-50 transition-colors cursor-pointer">
                                                <td class="px-3 py-2 border border-gray-300 text-center">
                                                    <div class="font-medium text-gray-900">{{ bill.invoiceNo }}</div>
                                                </td>
                                                <td class="px-3 py-2 border border-gray-300 text-center">
                                                    <div class="text-gray-700 font-medium">{{ bill.amount }}</div>
                                                </td>
                                                <td class="px-3 py-2 border border-gray-300 text-center">
                                                    <div class="text-gray-700">{{ bill.dueDate }}</div>
                                                </td>
                                                <td class="px-3 py-2 border border-gray-300 text-center">
                                                    <span class="inline-block px-2 py-1 rounded text-xs font-medium"
                                                          :class="bill.overdue.includes('-') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'">
                                                        {{ bill.overdue }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- ตารางรายการค้างส่ง -->
                            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div class="bg-gradient-to-r from-[#00569D] to-[#004080] text-white py-2 px-4 font-semibold rounded-t-lg -mt-4 -mx-4 mb-4">
                                    <div class="flex items-center gap-2">
                                        <Icon icon="mdi:truck-delivery-outline" class="w-4 h-4" />
                                        รายการค้างส่ง
                                    </div>
                                </div>
                                <div class="overflow-x-auto">
                                    <table class="min-w-full text-xs text-gray-700 border-collapse border border-gray-300">
                                        <thead>
                                            <tr class="bg-gray-100">
                                                <th class="px-3 py-2 border border-gray-300 font-semibold text-center">เลขที่ CO</th>
                                                <th class="px-3 py-2 border border-gray-300 font-semibold text-center">จำนวน</th>
                                                <th class="px-3 py-2 border border-gray-300 font-semibold text-center">ครบกำหนด</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(co, index) in selectedRow.outstandingItems" 
                                                :key="co.coNo"
                                                class="hover:bg-gray-50 transition-colors cursor-pointer">
                                                <td class="px-3 py-2 border border-gray-300 text-center">
                                                    <span class="inline-block px-2 py-1 rounded text-xs font-medium bg-teal-100 text-teal-800">
                                                        {{ co.coNo }}
                                                    </span>
                                                </td>
                                                <td class="px-3 py-2 border border-gray-300 text-center">
                                                    <div class="text-gray-700 font-medium">{{ co.amount }}</div>
                                                </td>
                                                <td class="px-3 py-2 border border-gray-300 text-center">
                                                    <div class="text-gray-700">{{ co.dueDate }}</div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Empty State -->
                            <div v-if="(!selectedRow.outstandingPayments || selectedRow.outstandingPayments.length === 0) && 
                                       (!selectedRow.outstandingItems || selectedRow.outstandingItems.length === 0)" 
                                 class="text-center py-12">
                                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                </div>
                                <p class="text-gray-500 text-sm">ไม่มีข้อมูล</p>
                            </div>
                        </div>
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
const isLoading = computed(() => reportTmsStore.loadingCreditLimit);
const error = computed(() => reportTmsStore.errorCreditLimit);
const creditLimitData = computed(() => reportTmsStore.creditLimitData);

const hasCreditLimitData = computed(() => creditLimitData.value.length > 0);

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
    selectedDC.value = localStorage.getItem('creditlimit_selectedDC') || '';
    reportTmsStore.fetchNoBillWhList();
});

// Function to load transport data
const loadTransportData = async () => {
    isLoadingTransport.value = true;
    transportError.value = null;
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/report/oms/nobill/option-wh`);
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

// Function to load credit limit data
const loadData = async () => {
    if (!selectedDC.value) {
        showWarning('คำเตือน', 'กรุณาเลือก DC ก่อนดึงข้อมูล');
        return;
    }
    hasLoadedData.value = true;
    
    const result = await reportTmsStore.fetchCreditLimitData(selectedDC.value);
    if (result.success) {
        console.log('Credit limit data loaded:', result.data);
    } else {
        showError('Error', `เกิดข้อผิดพลาด: ${result.message}`);
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
    if (!filteredCreditLimitData.value || filteredCreditLimitData.value.length === 0) {
        showWarning('คำเตือน', 'ไม่มีข้อมูลสำหรับส่งออก');
        return;
    }

    // Prepare summary row
    const summaryRow = [
        `คลัง ${selectedDC.value} : ${getSelectedDCName()}`,
        '', '', '', '', '', '', '', '', '', '', ''
    ];

    // Prepare header row
    const headerRow = [
        'ลำดับ', 'เขต', 'คลัง', 'รหัส', 'ชื่อร้าน', 'รายการค้างชำระ (จำนวนบิล)', 'รายการค้างชำระ (จำนวนเงิน)', 
        'co ค้างส่ง (จำนวนบิล)', 'co ค้างส่ง (จำนวนเงิน)'
    ];

    // Prepare data rows
    const dataRows = filteredCreditLimitData.value.map((item, index) => [
        index + 1,
        item.area || '',
        item.warehouse || '',
        item.cuscode || '',
        item.cusname || '',
        item.outstanding_payments_bills || '',
        item.outstanding_payments_amount || '',
        item.outstanding_items_bills || '',
        item.outstanding_items_amount || ''
    ]);

    // Combine all rows
    const aoa = [summaryRow, headerRow, ...dataRows];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // Set column widths
    const colWidths = [
        { wch: 8 },   // ลำดับ
        { wch: 12 },  // เขต
        { wch: 12 },  // คลัง
        { wch: 12 },  // รหัส
        { wch: 30 },  // ชื่อร้าน
        { wch: 25 },  // รายการค้างชำระ (จำนวนบิล)
        { wch: 25 },  // รายการค้างชำระ (จำนวนเงิน)
        { wch: 25 },  // co ค้างส่ง (จำนวนบิล)
        { wch: 25 }   // co ค้างส่ง (จำนวนเงิน)
    ];
    ws['!cols'] = colWidths;

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'รายงาน Credit Limit');

    // Generate filename with current date
    const now = new Date();
    const filename = `creditlimit_${selectedDC.value}_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);

    showSuccess('สำเร็จ', 'ส่งออกไฟล์ Excel เรียบร้อยแล้ว');
};

// Helper function to get selected DC name
const getSelectedDCName = () => {
    const selectedTransport = (transportOptions.value.data || []).find(t => t.who_no === selectedDC.value);
    return selectedTransport ? selectedTransport.who_name : 'เลือก DC';
};

// Computed property for filtered credit limit data
const filteredCreditLimitData = computed(() => {
    if (!creditLimitData.value || !searchQuery.value) {
        return creditLimitData.value;
    }
    const searchTerm = searchQuery.value.toLowerCase();
    return creditLimitData.value.filter(item => {
        return (
            (item.area && item.area.toLowerCase().includes(searchTerm)) ||
            (item.warehouse && item.warehouse.toLowerCase().includes(searchTerm)) ||
            (item.cuscode && item.cuscode.toLowerCase().includes(searchTerm)) ||
            (item.cusname && item.cusname.toLowerCase().includes(searchTerm)) ||
            (item.outstanding_payments && item.outstanding_payments.toString().toLowerCase().includes(searchTerm)) ||
            (item.outstanding_items && item.outstanding_items.toString().toLowerCase().includes(searchTerm))
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
    if (!filteredCreditLimitData.value) return [];

    const startIndex = Math.floor(scrollTop.value / rowHeight);
    const endIndex = Math.min(startIndex + visibleRows, filteredCreditLimitData.value.length);

    return filteredCreditLimitData.value.slice(startIndex, endIndex).map((item, index) => ({
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
    if (!filteredCreditLimitData.value) return 0;
    const totalHeight = filteredCreditLimitData.value.length * rowHeight;
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

watch([selectedDC], ([dc]) => {
    localStorage.setItem('creditlimit_selectedDC', dc || '');
});

const tableData = [
    {
        area: 'BE101',
        cuscode: '6501141',
        cusname: 'ร้านประไพร',
        invoice: '40',
        amount: '50',
        bill: 'BILL001',
        outstandingPayments: [
            { invoiceNo: '2568121014025', amount: '37,350.00 บาท', dueDate: '18 กรกฎาคม 2568', overdue: '-11 วัน' },
            { invoiceNo: '2568121014953', amount: '11,952.00 บาท', dueDate: '31 กรกฎาคม 2568', overdue: '2 วัน' },
            { invoiceNo: '0250002575', amount: '73,740.00 บาท', dueDate: '30 กรกฎาคม 2568', overdue: '1 วัน' }
        ],
        outstandingItems: [
            { coNo: '680718034', amount: '24,900.00 บาท', dueDate: '5 สิงหาคม 2568' }
        ]
    },
    {
        area: 'BE102',
        cuscode: '6501142',
        cusname: 'ร้านสมใจ',
        invoice: '20',
        amount: '30',
        bill: 'BILL002',
        outstandingPayments: [
            { invoiceNo: '2568121014025', amount: '37,350.00 บาท', dueDate: '18 กรกฎาคม 2568', overdue: '-11 วัน' },
            { invoiceNo: '2568121014953', amount: '11,952.00 บาท', dueDate: '31 กรกฎาคม 2568', overdue: '2 วัน' }
        ],
        outstandingItems: [
            { coNo: '680718034', amount: '24,900.00 บาท', dueDate: '5 สิงหาคม 2568' },
            { coNo: '680718035', amount: '15,600.00 บาท', dueDate: '10 สิงหาคม 2568' }
        ]
    }
];

const showModal = ref(false);
const selectedRow = ref({});
function openBillDetail(row) {
    selectedRow.value = row;
    showModal.value = true;
}
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
