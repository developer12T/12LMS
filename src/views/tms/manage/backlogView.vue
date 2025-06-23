<template>
    <div class="flex-1 p-6 bg-gray-50 min-h-screen">
        <!-- Page Header -->
        <div class="mb-6">
            <nav class="flex mb-4" aria-label="Breadcrumb">
                <ol class="inline-flex items-center space-x-1 md:space-x-3">
                    <li class="inline-flex items-center">
                        <router-link to="/dashboard"
                            class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-[#00569D]">
                            <Icon icon="mdi:home" class="w-4 h-4 mr-2" />
                            Dashboard
                        </router-link>
                    </li>
                    <li>
                        <div class="flex items-center">
                            <Icon icon="mdi:chevron-right" class="w-4 h-4 text-gray-400" />
                            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">TMS</span>
                        </div>
                    </li>
                    <li>
                        <div class="flex items-center">
                            <Icon icon="mdi:chevron-right" class="w-4 h-4 text-gray-400" />
                            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">Management</span>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div class="flex items-center">
                            <Icon icon="mdi:chevron-right" class="w-4 h-4 text-gray-400" />
                            <span class="ml-1 text-sm font-medium text-[#00569D] md:ml-2">
                                ออร์เดอร์ค้างส่ง
                            </span>
                        </div>
                    </li>
                </ol>
            </nav>
        </div>

        <!-- Filter and Action Section -->
        <div class="space-y-6">
            <!-- Sticky Filter Controls -->
            <div class=" bg-gray-100 dark:bg-gray-800">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex flex-col lg:flex-row gap-4 lg:justify-between lg:items-end">
                        <!-- Action Buttons Section -->
                        <div class="flex flex-col sm:flex-row gap-3 lg:order-1">
                            <button type="button"
                                @click="exportToExcel"
                                :disabled="!filteredBacklogData.length"
                                class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                <Icon icon="file-icons:microsoft-excel" width="16" height="16" class="mr-1.5" />
                                Export Excel
                            </button>
                            <button type="button" @click="loadTransportData" :disabled="isLoadingTransport"
                                class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                <Icon icon="mdi:database-sync" width="16" height="16" class="mr-1.5" />
                                {{ isLoadingTransport ? 'กำลังโหลด...' : 'ดึงข้อมูลใหม่' }}
                            </button>
                        </div>

                        <!-- Filter Section -->
                        <div class="flex flex-col sm:flex-row gap-3 lg:order-2 lg:flex-1 lg:max-w-lg lg:ml-6">
                            <div class="flex-1 min-w-0">
                                <label for="mh-select"
                                    class="block mb-1 text-xs font-medium text-gray-900 dark:text-white">
                                    เลือก DC
                                </label>
                                <select id="mh-select" v-model="selectedDC" @change="onDCChange"
                                    :disabled="isLoadingTransport"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <option value="" disabled>{{ isLoadingTransport ? 'กำลังโหลด...' : 'เลือก DC' }}
                                    </option>
                                    <option v-for="transport in transportOptions" :key="transport.value"
                                        :value="transport.value">
                                        {{ transport.label }}
                                    </option>
                                </select>
                                <p v-if="transportError" class="mt-1 text-xs text-red-600 dark:text-red-400">
                                    {{ transportError }}
                                </p>
                            </div>

                            <div class="flex-1 min-w-0">
                                <label for="status-select"
                                    class="block mb-1 text-xs font-medium text-gray-900 dark:text-white">
                                    สถานะ
                                </label>
                                <select id="status-select" v-model="selectedStatus" @change="onStatusChange"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors">
                                    <option value="">เลือก สถานะ</option>
                                    <option value="1">เกินกำหนดส่ง</option>
                                    <option value="2">ครบกำหนดส่ง</option>
                                    <option value="3">ยังไม่ถึงกำหนดส่ง</option>
                                    <option value="ALL">ทุกสถานะ</option>
                                </select>
                            </div>

                            <!-- Search Button -->
                            <div class="flex-shrink-0 sm:self-end">
                                <button type="button" @click="loadData" :disabled="isLoadingBacklog"
                                    class="w-full sm:w-auto text-white bg-[#00569D] hover:bg-[#004080] focus:ring-4 focus:ring-[#00569D]/30 font-medium rounded-lg text-xs px-4 py-1.5 dark:bg-[#00569D] dark:hover:bg-[#004080] focus:outline-none dark:focus:ring-[#00569D]/30 transition-colors inline-flex items-center justify-center min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed">
                                    <Icon v-if="isLoadingBacklog" icon="mdi:loading"
                                        class="animate-spin w-4 h-4 mr-1.5" />
                                    <Icon v-else icon="mdi:magnify" width="14" height="14" class="mr-1.5" />
                                    {{ isLoadingBacklog ? 'กำลังโหลด...' : 'ดึงข้อมูล' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Table Section -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <!-- Loading State -->
                <div v-if="isLoadingBacklog" class="flex items-center justify-center p-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>

                <!-- Error State -->
                <div v-else-if="backlogError" class="p-8 text-center text-red-500">
                    {{ backlogError }}
                </div>

                <!-- No Data State -->
                <div v-else-if="!hasBacklogData && !isLoadingBacklog && !backlogError && hasLoadedData"
                    class="p-8 text-center">
                    <div class="text-gray-500">
                        <Icon icon="mdi:database-off" class="w-12 h-12 mx-auto mb-4" />
                        <p class="text-lg font-medium mb-2">ไม่มีข้อมูล</p>
                        <p class="text-sm">ไม่พบข้อมูลที่ตรงกับเงื่อนไขที่เลือก</p>
                        <div class="mt-4 text-xs text-gray-400">
                            <p>DC: {{ getSelectedDCName() }} | สถานะ: {{ getStatusText(selectedStatus) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Not Selected State -->
                <div v-else-if="!selectedDC || !selectedStatus" class="p-8 text-center">
                    <div class="text-gray-500">
                        <Icon icon="mdi:clipboard-text-outline" class="w-12 h-12 mx-auto mb-4" />
                        <p class="text-lg font-medium mb-2">กรุณาเลือกเงื่อนไข</p>
                        <p class="text-sm">เลือก DC และสถานะ แล้วกดปุ่ม "ดึงข้อมูล"</p>
                        <div class="mt-4 flex flex-col items-center space-y-2 text-xs">
                            <div class="flex items-center space-x-2">
                                <Icon :icon="selectedDC ? 'mdi:check-circle' : 'mdi:circle-outline'"
                                    :class="selectedDC ? 'text-green-500' : 'text-gray-400'" class="w-4 h-4" />
                                <span :class="selectedDC ? 'text-gray-700' : 'text-gray-400'">
                                    DC: {{ selectedDC ? getSelectedDCName() : 'ยังไม่เลือก' }}
                                </span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <Icon :icon="selectedStatus ? 'mdi:check-circle' : 'mdi:circle-outline'"
                                    :class="selectedStatus ? 'text-green-500' : 'text-gray-400'" class="w-4 h-4" />
                                <span :class="selectedStatus ? 'text-gray-700' : 'text-gray-400'">
                                    สถานะ: {{ selectedStatus ? getStatusText(selectedStatus) : 'ยังไม่เลือก' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Never Loaded State -->
                <div v-else-if="!hasLoadedData && selectedDC && selectedStatus" class="p-8 text-center">
                    <div class="text-gray-500">
                        <Icon icon="mdi:database-search" class="w-12 h-12 mx-auto mb-4" />
                        <p class="text-lg font-medium mb-2">พร้อมดึงข้อมูล</p>
                        <p class="text-sm">กดปุ่ม "ดึงข้อมูล" เพื่อดูรายการออร์เดอร์ค้างส่ง</p>
                        <div class="mt-4 text-xs text-gray-400">
                            <p>DC: {{ getSelectedDCName() }} | สถานะ: {{ getStatusText(selectedStatus) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Data Table with Custom Scrollbar -->
                <div v-else class="relative overflow-x-auto shadow-md sm:rounded-lg custom-scrollbar" 
                    style="max-height: calc(100vh - 240px);">
                   
                    <table
                        class="w-full text-xs text-left text-gray-500 dark:text-gray-400 border-collapse border border-gray-300 dark:border-gray-600">
                        <thead
                            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                            <tr>
                                <th colspan="16" class="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            รายการออร์เดอร์ค้างส่ง
                                        </h3>
                                        <div class="flex items-center space-x-4">
                                            <!-- Search Input -->
                                            <div class="relative">
                                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <Icon icon="mdi:magnify" class="w-4 h-4 text-gray-400" />
                                                </div>
                                                <input type="text"
                                                    v-model="searchQuery"
                                                    placeholder="ค้นหา..."
                                                    class="w-64 pl-10 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400">
                                            </div>
                                            <!-- Record Count -->
                                            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                {{ searchQuery ? `${filteredBacklogData.length}/${backlogData.length}` : backlogData.length }} รายการ
                                            </span>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                            <tr>
                                <th scope="col"
                                    class="px-1 py-1 text-center w-6 border border-gray-300 dark:border-gray-600">No
                                </th>
                                <th scope="col"
                                    class="px-1 py-1 text-center w-8 border border-gray-300 dark:border-gray-600">คลัง
                                </th>
                                <th scope="col"
                                    class="px-1 py-1 text-center w-20 border border-gray-300 dark:border-gray-600">
                                    วันที่เปิด SR</th>
                                <th scope="col"
                                    class="px-1 py-1 text-center w-20 border border-gray-300 dark:border-gray-600">
                                    กำหนดส่ง</th>
                                <th scope="col"
                                    class="px-1 py-1 text-center w-20 border border-gray-300 dark:border-gray-600">
                                    เลขที่ใบสั่งซื้อ</th>
                                <th scope="col"
                                    class="px-1 py-1 text-center w-16 border border-gray-300 dark:border-gray-600">
                                    รหัสลูกค้า</th>
                                <th scope="col" class="px-1 py-1 w-2 border border-gray-300 dark:border-gray-600">
                                    ชื่อลูกค้า</th>
                                <th scope="col" class="px-1 py-1 w-40 border border-gray-300 dark:border-gray-600">
                                    สถานที่จัดส่ง</th>
                                <th scope="col" class="px-1 py-1 w-28 border border-gray-300 dark:border-gray-600">
                                    จังหวัด</th>
                                <th scope="col"
                                    class="px-1 py-1 text-center w-12 border border-gray-300 dark:border-gray-600">เกิน
                                </th>
                                <th scope="col"
                                    class="px-1 py-1 text-center w-12 border border-gray-300 dark:border-gray-600">ค้าง
                                    FG</th>
                                <th scope="col"
                                    class="px-1 py-1 text-center w-12 border border-gray-300 dark:border-gray-600">ค้าง
                                    PM</th>
                                <th scope="col" class="px-1 py-1 w-24 border border-gray-300 dark:border-gray-600">
                                    สาเหตุ</th>
                                <th scope="col" class="px-1 py-1 w-20 border border-gray-300 dark:border-gray-600">อื่นๆ
                                    (ระบุ)</th>
                                <th scope="col"
                                    class="px-1 py-1 text-center w-16 border border-gray-300 dark:border-gray-600">
                                    เลื่อนส่ง</th>
                                <th scope="col"
                                    class="px-1 py-1 text-center w-16 border border-gray-300 dark:border-gray-600">แก้ไข
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="filteredBacklogData.length === 0" class="bg-white dark:bg-gray-800">
                                <td colspan="12" class="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    ไม่พบข้อมูลค้นหา
                                </td>
                            </tr>
                            <tr v-else v-for="(item, index) in filteredBacklogData" :key="index"
                                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td
                                    class="px-1 py-0.5 font-medium text-gray-900 dark:text-white text-center text-xs border border-gray-300 dark:border-gray-600">
                                    {{ index + 1 }}
                                </td>
                                <td
                                    class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                    {{ item.wh_no }}</td>
                                <td
                                    class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                    {{ formatDate(item.date_create) }}</td>
                                <td
                                    class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                    {{ formatDate(item.date_send) }}</td>
                                <td
                                    class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                    <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        {{ item.po_no }}
                                    </a>
                                </td>
                                <td
                                    class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                    {{ item.cus_code }}</td>
                                <td class="px-1 py-0.5 text-xs whitespace-nowrap max-w-28 truncate border border-gray-300 dark:border-gray-600"
                                    :title="item.cus_name">
                                    {{ item.cus_name }}
                                </td>
                                <td class="px-1 py-0.5 text-xs w-40 border border-gray-300 dark:border-gray-600">
                                    <div class="max-w-40 line-clamp-2 text-ellipsis overflow-hidden"
                                        :title="item.addressbl">
                                        {{ item.addressbl }}
                                    </div>
                                </td>
                                <td class="px-1 py-0.5 text-xs whitespace-nowrap max-w-28 truncate border border-gray-300 dark:border-gray-600"
                                    :title="item.provincebl">
                                    {{ item.provincebl }}
                                </td>
                                <td
                                    class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                    <span
                                        :class="item.overdue < 0 ? 'text-red-600 font-semibold' : 'text-yellow-600 font-semibold'">
                                        {{ item.overdue }}
                                    </span>
                                </td>
                                <td
                                    class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                    <span class="text-orange-600 font-semibold">{{ item.fg }}</span>
                                </td>
                                <td
                                    class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                    <span class="text-purple-600 font-semibold">{{ item.pm }}</span>
                                </td>
                                <td class="px-1 py-0.5 text-xs border border-gray-300 dark:border-gray-600">
                                    <select
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option selected>เลือกสาเหตุ</option>
                                        <option value="reason1">เหตุผล 1</option>
                                        <option value="reason2">เหตุผล 2</option>
                                    </select>
                                </td>
                                <td class="px-1 py-0.5 text-xs border border-gray-300 dark:border-gray-600">
                                    <input type="text"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="ระบุ...">
                                </td>
                                <td class="px-1 py-0.5 text-center border border-gray-300 dark:border-gray-600">
                                    <button type="button" @click="openCalendar(item)"
                                        class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 font-medium rounded text-xs p-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                        <Icon icon="mdi:calendar-month-outline" class="w-3 h-3" />
                                    </button>
                                </td>
                                <td class="px-1 py-0.5 text-center border border-gray-300 dark:border-gray-600">
                                    <button type="button" @click="editItem(item)"
                                        class="focus:outline-none text-white bg-orange-500 hover:bg-orange-600 focus:ring-2 focus:ring-orange-300 font-medium rounded text-xs px-1.5 py-0.5 dark:focus:ring-orange-900">
                                        แก้ไข
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useTransportStore } from '@/stores/modules/transport';
import { useBacklogStore } from '@/stores/modules/backlog';
import { showError, showWarning } from '@/utils/toast';
import * as XLSX from 'xlsx';

// Stores
const transportStore = useTransportStore();
const backlogStore = useBacklogStore();

// Reactive data
const selectedDC = ref('');
const selectedStatus = ref('');
const searchQuery = ref('');
const hasLoadedData = ref(false); // Track if data has been loaded at least once

// Computed properties
const transportOptions = computed(() => transportStore.getTransportOptions);
const isLoadingTransport = computed(() => transportStore.loading);
const transportError = computed(() => transportStore.error);

const backlogData = computed(() => backlogStore.getBacklogList);
const isLoadingBacklog = computed(() => backlogStore.loading);
const backlogError = computed(() => backlogStore.error);
const hasBacklogData = computed(() => backlogStore.hasData);

// Lifecycle
onMounted(async () => {
    await loadTransportData();

    // Load saved selections from localStorage
    const savedDC = localStorage.getItem('selectedDC');
    const savedStatus = localStorage.getItem('selectedStatus');
    if (savedDC) selectedDC.value = savedDC;
    if (savedStatus) selectedStatus.value = savedStatus;

    // If both values exist, automatically load data
    if (savedDC && savedStatus) {
        loadData();
    }
});

// Watch for changes and save to localStorage
watch(selectedDC, (newValue) => {
    if (newValue) {
        localStorage.setItem('selectedDC', newValue);
    }
});

watch(selectedStatus, (newValue) => {
    if (newValue) {
        localStorage.setItem('selectedStatus', newValue);
    }
});

// Clear selections
const clearSelections = () => {
    localStorage.removeItem('selectedDC');
    localStorage.removeItem('selectedStatus');
    selectedDC.value = '';
    selectedStatus.value = '';
    backlogData.value = [];
    filteredBacklogData.value = [];
    hasLoadedData.value = false;
};

// Methods
const loadTransportData = async () => {
    try {
        const result = await transportStore.fetchTransportList();
        if (result.success && transportOptions.value.length > 0) {
            // Set default selection to first transport (MH)
            const mhTransport = transportOptions.value.find(option => option.label === 'MH');
            if (mhTransport) {
                selectedDC.value = mhTransport.value;
            } else {
                selectedDC.value = transportOptions.value[0].value;
            }
        }
    } catch (error) {
        console.error('Error loading transport data:', error);
        showError('เกิดข้อผิดพลาดในการโหลดข้อมูล DC');
    }
};

const loadData = async () => {
    if (!selectedDC.value || !selectedStatus.value) {
        showWarning('กรุณาเลือก DC และสถานะก่อนดึงข้อมูล');
        return;
    }

    try {
        const result = await backlogStore.fetchBacklogData(selectedDC.value, selectedStatus.value);
        hasLoadedData.value = true; // Mark that data has been loaded
        if (result.success) {
            console.log('Backlog data loaded successfully:', result.data);
        } else {
            console.error('Failed to load backlog data:', result.message);
            showError(result.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
        }
    } catch (error) {
        console.error('Error loading backlog data:', error);
        showError('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
};

const selectReason = (item, reason) => {
    console.log(`Selected reason for item ${item.po_no}: ${reason}`);
    // Implement logic to update the reason
};

const openCalendar = (item) => {
    console.log(`Opening calendar for item ${item.po_no}`);
    // Implement calendar opening logic
};

const editItem = (item) => {
    console.log(`Editing item ${item.po_no}`);
    // Implement edit item logic
};

const onDCChange = () => {
    console.log(`Selected DC: ${selectedDC.value}`);
    const selectedTransport = transportStore.getTransportById(selectedDC.value);
    if (selectedTransport) {
        transportStore.setSelectedTransport(selectedTransport);
        console.log('Selected transport:', selectedTransport);
    }
};

const onStatusChange = () => {
    console.log(`Selected status: ${selectedStatus.value}`);
};

// Helper function to get status text
const getStatusText = (status) => {
    const statusMap = {
        '1': 'เกินกำหนดส่ง',
        '2': 'ครบกำหนดส่ง',
        '3': 'ยังไม่ถึงกำหนดส่ง',
        'ALL': 'ทุกสถานะ'
    };
    return statusMap[status] || '';
};

// Helper function to format date
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH');
};

// Helper function to get selected DC name
const getSelectedDCName = () => {
    const selectedTransport = transportStore.getTransportById(selectedDC.value);
    return selectedTransport ? selectedTransport.who_name : 'เลือก DC';
};

// Computed property for filtered backlog data
const filteredBacklogData = computed(() => {
    if (!backlogData.value || !searchQuery.value) {
        return backlogData.value;
    }
    return backlogData.value.filter(item => {
        return (
            item.cus_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            item.po_no.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            item.addressbl.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            item.provincebl.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    });
});

// Function to format date for Excel
const formatExcelDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

// Export to Excel function
const exportToExcel = () => {
    // Create worksheet data
    const wsData = filteredBacklogData.value.map((item, index) => ({
        'ลำดับ': index + 1,
        'คลัง': item.wh_no,
        'วันที่เปิด SR': formatExcelDate(item.date_create),
        'กำหนดส่ง': formatExcelDate(item.date_send),
        'เลขที่ใบสั่งซื้อ': item.po_no,
        'รหัสลูกค้า': item.cus_code,
        'ชื่อลูกค้า': item.cus_name,
        'สถานที่จัดส่ง': item.addressbl,
        'จังหวัด': item.provincebl,
        'เกิน': item.overdue,
        'ค้าง FG': item.fg,
        'ค้าง PM': item.pm
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(wsData);

    // Set column widths
    const colWidths = [
        { wch: 8 },  // ลำดับ
        { wch: 8 },  // คลัง
        { wch: 12 }, // วันที่เปิด SR
        { wch: 12 }, // กำหนดส่ง
        { wch: 15 }, // เลขที่ใบสั่งซื้อ
        { wch: 12 }, // รหัสลูกค้า
        { wch: 30 }, // ชื่อลูกค้า
        { wch: 40 }, // สถานที่จัดส่ง
        { wch: 15 }, // จังหวัด
        { wch: 8 },  // เกิน
        { wch: 8 },  // ค้าง FG
        { wch: 8 }   // ค้าง PM
    ];
    ws['!cols'] = colWidths;

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Backlog');

    // Generate filename with current date
    const now = new Date();
    const filename = `backlog_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
};
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
</style>