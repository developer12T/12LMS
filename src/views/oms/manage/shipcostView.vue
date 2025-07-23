<template>
    <div class="flex-1 bg-gray-50 min-h-screen">

        <!-- Filter and Action Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 py-4 mb-2">
            <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <!-- Filter Section -->
                <div class="flex flex-col sm:flex-row gap-3 flex-1">
                    <div class="flex-1 min-w-0">
                        <label for="mh-select" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Icon icon="mdi:warehouse" class="w-4 h-4 text-[#00569D]" />
                            ศูนย์กระจายสินค้า
                        </label>
                        <select id="mh-select" v-model="selectedWarehouse" @change="onWarehouseChange"
                            :disabled="isLoadingWarehouses"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <option value="" disabled>{{ isLoadingWarehouses ? 'กำลังโหลด...' : 'เลือกศูนย์กระจายสินค้า'
                                }}</option>
                            <option v-for="warehouse in warehousesOptions" :key="warehouse.value"
                                :value="warehouse.value">
                                {{ warehouse.display }}
                            </option>
                        </select>
                        <p v-if="warehousesError" class="mt-1 text-xs text-red-600 dark:text-red-400">
                            {{ warehousesError }}
                        </p>
                    </div>
                    <div class="flex-1 min-w-0">
                        <label for="status-select" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Icon icon="eos-icons:route" class="w-4 h-4 text-[#00569D]" />
                            เส้นทางขนส่ง
                        </label>
                        <select id="status-select" v-model="selectedRoute" @change="onRouteChange"
                            :disabled="isLoadingRoutes || !selectedWarehouse"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <option value="" disabled>{{ !selectedWarehouse ? 'กรุณาเลือกศูนย์กระจายสินค้าก่อน' :
                                (isLoadingRoutes ? 'กำลังโหลด...' : 'เลือกเส้นทางขนส่ง') }}</option>
                            <option v-for="route in routesOptions" :key="route.value" :value="route.value">
                                {{ route.display || route.label }}
                            </option>
                        </select>
                        <p v-if="routesError" class="mt-1 text-xs text-red-600 dark:text-red-400">
                            {{ routesError }}
                        </p>
                    </div>
                    <div class="flex-1 min-w-0">
                        <label for="start-date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Icon icon="mdi:calendar-start" class="w-4 h-4 text-[#00569D]" />
                            จากวันที่
                        </label>
                        <input id="start-date" type="date" v-model="startDate" @change="saveValues"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <label for="end-date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Icon icon="mdi:calendar-end" class="w-4 h-4 text-[#00569D]" />
                            ถึงวันที่
                        </label>
                        <input id="end-date" type="date" v-model="endDate" @change="saveValues"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors" />
                    </div>
                </div>
                <!-- Action Buttons -->
                <div class="flex flex-row gap-3 flex-shrink-0">
                    <button type="button" @click="loadData"
                        :disabled="isLoading || !selectedWarehouse || !selectedRoute"
                        class="text-white bg-[#00569D] hover:bg-[#004080] focus:ring-4 focus:ring-[#00569D]/30 font-medium rounded-lg text-sm px-6 py-1.5  dark:bg-[#00569D] dark:hover:bg-[#004080] focus:outline-none dark:focus:ring-[#00569D]/30 transition-colors inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                        <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin w-4 h-4 mr-2" />
                        <Icon v-else icon="mdi:magnify" width="16" height="16" class="mr-2" />
                        {{ isLoading ? 'กำลังโหลด...' : 'ดึงข้อมูล' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Table Section -->
        <div class="bg-white rounded-lg shadow-sm ">
            <div v-if="!hasLoadedData" class="p-8 text-center">
                <div class="text-gray-500">
                    <Icon icon="mdi:clipboard-text-outline" class="w-12 h-12 mx-auto mb-4" />
                    <p class="text-lg font-medium mb-2">กรุณาเลือกเงื่อนไขและกดปุ่ม "ดึงข้อมูล"</p>
                    <p class="text-sm">เลือกศูนย์กระจายสินค้า, เส้นทางขนส่ง, วันที่ แล้วกดปุ่ม "ดึงข้อมูล"
                        เพื่อแสดงข้อมูล</p>
                    <div class="mt-4 flex flex-col items-center space-y-2 text-xs">
                        <div class="flex items-center space-x-2">
                            <Icon :icon="selectedWarehouse ? 'mdi:check-circle' : 'mdi:circle-outline'"
                                :class="selectedWarehouse ? 'text-green-500' : 'text-gray-400'" class="w-4 h-4" />
                            <span :class="selectedWarehouse ? 'text-gray-700' : 'text-gray-400'">
                                ศูนย์กระจายสินค้า: {{ selectedWarehouse ? getSelectedWarehouseName() : 'ยังไม่เลือก' }}
                            </span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <Icon :icon="selectedRoute ? 'mdi:check-circle' : 'mdi:circle-outline'"
                                :class="selectedRoute ? 'text-green-500' : 'text-gray-400'" class="w-4 h-4" />
                            <span :class="selectedRoute ? 'text-gray-700' : 'text-gray-400'">
                                เส้นทางขนส่ง: {{ selectedRoute ? getSelectedRouteName() : 'ยังไม่เลือก' }}
                            </span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <Icon :icon="startDate ? 'mdi:check-circle' : 'mdi:circle-outline'"
                                :class="startDate ? 'text-green-500' : 'text-gray-400'" class="w-4 h-4" />
                            <span :class="startDate ? 'text-gray-700' : 'text-gray-400'">
                                จากวันที่: {{ startDate ? startDate : 'ยังไม่เลือก' }}
                            </span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <Icon :icon="endDate ? 'mdi:check-circle' : 'mdi:circle-outline'"
                                :class="endDate ? 'text-green-500' : 'text-gray-400'" class="w-4 h-4" />
                            <span :class="endDate ? 'text-gray-700' : 'text-gray-400'">
                                ถึงวันที่: {{ endDate ? endDate : 'ยังไม่เลือก' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div v-if="isLoadingCostTable" class="flex items-center justify-center p-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
                <div v-else>
                    <!-- Search and Record Count -->
                    <div class="p-2 pb-0">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                                <ResultCount :label="'ผลลัพธ์:'"
                                    :current="searchQuery ? filteredCostTableData.length : null"
                                    :total="costTableData.length" icon="tdesign:map-setting-filled"
                                    iconColor="#00569D" />
                            </div>

                            <div class="flex items-center gap-2">
                                <button type="button" @click="exportToExcel"
                                    :disabled="isLoading || !selectedWarehouse || !selectedRoute"
                                    class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-[#00569D]/30 font-medium rounded-lg text-xs px-4 py-2 min-w-[140px] dark:bg-[#00569D] dark:hover:bg-[#004080] focus:outline-none dark:focus:ring-[#00569D]/30 transition-colors inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                                    <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin w-4 h-4 mr-2" />
                                    <Icon v-else icon="file-icons:microsoft-excel" width="16" height="16"
                                        class="mr-2" />
                                    {{ isLoading ? 'กำลังโหลด...' : 'Export Excel' }}
                                </button>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Icon icon="mdi:magnify" class="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input type="text" v-model="searchQuery" placeholder="ค้นหา..."
                                        class="w-64 pl-10 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Virtual Scroll Table -->
                <div v-if="hasLoadedData && !isLoadingCostTable"
                    class="relative shadow-md sm:rounded-lg custom-scrollbar overflow-x-auto overflow-y-hidden"
                    style="max-height: calc(100vh - 250px);">
                    <div class="virtual-table-container overflow-auto p-2" style="height: calc(100vh - 250px);"
                        @scroll="handleScroll">
                        <table class="min-w-full text-xs text-center border  border-gray-200 bg-white">
                            <thead class="sticky top-0 z-10 bg-gray-100">
                                <tr>
                                    <th class="px-2 py-2 border">วันที่</th>
                                    <th class="px-2 py-2 border">คลัง</th>
                                    <th class="px-2 py-2 border">เส้นทางขนส่ง</th>
                                    <th class="px-2 py-2 border">Shipment</th>
                                    <th class="px-2 py-2 border">FG</th>
                                    <th class="px-2 py-2 border">Premium</th>
                                    <th class="px-2 py-2 border">ค่าขนส่ง</th>
                                    <th class="px-2 py-2 border">ค่าพาเลท</th>
                                    <th class="px-2 py-2 border">ราคาต่อทึบ</th>
                                    <th class="px-2 py-2 border">จำนวนบิล</th>
                                    <th class="px-2 py-2 border">ชื่อขนส่ง</th>
                                    <th class="px-2 py-2 border">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Top padding for virtual scrolling -->
                                <tr v-if="topPadding > 0">
                                    <td :colspan="12" :style="{ height: topPadding + 'px', padding: 0 }"></td>
                                </tr>

                                <tr v-if="virtualScrollData.length === 0" class="bg-white">
                                    <td colspan="12" class="py-6 text-gray-400">ไม่พบข้อมูล</td>
                                </tr>
                                <tr v-else v-for="(row, rowIndex) in virtualScrollData" :key="row.OQCONN"
                                    :class="{ 'bg-gray-50': rowIndex % 2 === 1 }">
                                    <td class="border px-2 py-1">{{ row.OQDSDT }}</td>
                                    <td class="border px-2 py-1">{{ row.OQWHLO }}</td>
                                    <td class="border px-2 py-1">{{ row.OQROUT }}</td>
                                    <td class="border px-2 py-1 text-center">
                                        <span class="inline-flex items-center gap-1">
                                            <span
                                                :class="[row.COST === 0 ? 'bg-red-500' : 'bg-green-500', 'w-2 h-2 rounded-full inline-block']"></span>
                                            <span
                                                :class="[row.COST === 0 ? 'text-red-600 font-bold' : 'text-blue-900 font-bold']">
                                                {{ row.OQCONN }}
                                            </span>
                                        </span>
                                    </td>
                                    <td class="border px-2 py-1">{{ row.URPLQA }}</td>
                                    <td class="border px-2 py-1">{{ row.URPRQA }}</td>
                                    <td class="border px-2 py-1">{{ formatNumber(row.COST) }}</td>
                                    <td class="border px-2 py-1">{{ formatNumber(row.pallet_cost) }}</td>
                                    <td class="border px-2 py-1">{{ formatNumber(row.BPERCTN) }}</td>
                                    <td class="border px-2 py-1">{{ row.cBill }}</td>
                                    <td class="border px-2 py-1">{{ row.Drive_name }}</td>
                                    <td class="border px-2 py-1 flex justify-center">
                                        <button @click="editShipment(row)"
                                            class="text-slate-500 text-center hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-all bg-yellow-300 duration-200 group flex items-center gap-1"
                                            title="ตั้งค่า/แก้ไข">
                                            <Icon icon="mdi:cog"
                                                class="w-5 h-5 group-hover:rotate-90 transition-transform text-black hover:text-blue-700" />
                                        </button>
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
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useTransportStore } from '@/stores';
import { showError } from '@/utils/toast';
import ExcelJS from 'exceljs';
import ResultCount from '@/components/ResultCount.vue';

// Router
const router = useRouter();

// Stores
const transportStore = useTransportStore();

// Reactive data
const selectedWarehouse = ref('');
const selectedRoute = ref('');
const startDate = ref('');
const endDate = ref('');
const isLoading = ref(false);
const hasLoadedData = ref(false);

// State for cost table
const costTableData = ref([]);
const isLoadingCostTable = ref(false);
const costTableError = ref(null);

// Search functionality
const searchQuery = ref('');

// Virtual scrolling properties
const rowHeight = 40; // ความสูงแต่ละแถว (px)
const visibleRows = 20; // จำนวนแถวที่แสดงพร้อมกัน
const scrollTop = ref(0);
const containerHeight = ref(0);

// Load saved values from localStorage
const loadSavedValues = () => {
    const savedWarehouse = localStorage.getItem('shipcost_warehouse');
    const savedRoute = localStorage.getItem('shipcost_route');
    const savedStartDate = localStorage.getItem('shipcost_startDate');
    const savedEndDate = localStorage.getItem('shipcost_endDate');

    if (savedWarehouse) selectedWarehouse.value = savedWarehouse;
    if (savedRoute) selectedRoute.value = savedRoute;
    if (savedStartDate) startDate.value = savedStartDate;
    if (savedEndDate) endDate.value = savedEndDate;
};

// Save values to localStorage
const saveValues = () => {
    localStorage.setItem('shipcost_warehouse', selectedWarehouse.value);
    localStorage.setItem('shipcost_route', selectedRoute.value);
    localStorage.setItem('shipcost_startDate', startDate.value);
    localStorage.setItem('shipcost_endDate', endDate.value);
};

// Computed properties
const warehousesOptions = computed(() => transportStore.getWarehousesOptions);
const routesOptions = computed(() => transportStore.getRoutesOptions);
const isLoadingWarehouses = computed(() => transportStore.loading);
const isLoadingRoutes = computed(() => transportStore.loading);
const warehousesError = computed(() => transportStore.error);
const routesError = computed(() => transportStore.error);

// Computed property for filtered cost table data
const filteredCostTableData = computed(() => {
    if (!costTableData.value || !searchQuery.value) {
        return costTableData.value;
    }
    return costTableData.value.filter(row => {
        const searchTerm = searchQuery.value.toLowerCase();
        return (
            (row.OQCONN && row.OQCONN.toLowerCase().includes(searchTerm)) ||
            (row.OQDSDT && row.OQDSDT.toLowerCase().includes(searchTerm)) ||
            (row.OQWHLO && row.OQWHLO.toLowerCase().includes(searchTerm)) ||
            (row.OQROUT && row.OQROUT.toLowerCase().includes(searchTerm)) ||
            (row.Drive_name && row.Drive_name.toLowerCase().includes(searchTerm))
        );
    });
});

// คำนวณแถวที่ควรแสดงจาก scroll position
const virtualScrollData = computed(() => {
    if (!filteredCostTableData.value) return [];

    const startIndex = Math.floor(scrollTop.value / rowHeight);
    const endIndex = Math.min(startIndex + visibleRows, filteredCostTableData.value.length);

    return filteredCostTableData.value.slice(startIndex, endIndex).map((row, index) => ({
        ...row,
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
    if (!filteredCostTableData.value) return 0;
    const totalHeight = filteredCostTableData.value.length * rowHeight;
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

// Load warehouses data on component mount
onMounted(async () => {
    await loadWarehousesData();
    loadSavedValues();

    // If there's a saved warehouse, load its routes
    if (selectedWarehouse.value) {
        await loadRoutesData(selectedWarehouse.value);
    }

    // ตั้งค่าความสูง container สำหรับ virtual scrolling
    nextTick(() => {
        setContainerHeight();
    });
});

// Function to load warehouses data
const loadWarehousesData = async () => {
    isLoading.value = true;
    try {
        const result = await transportStore.fetchWarehousesList();
        if (result.success) {
            console.log('Warehouses loaded successfully:', result.data);
        }
    } catch (err) {
        console.error('Error loading warehouses:', err);
    } finally {
        isLoading.value = false;
    }
};

// Function to handle warehouse selection change
const onWarehouseChange = async () => {
    console.log(`Selected Warehouse: ${selectedWarehouse.value}`);
    const selectedWarehouseData = transportStore.getWarehouseById(selectedWarehouse.value);
    if (selectedWarehouseData) {
        console.log('Selected warehouse data:', selectedWarehouseData);

        // Reset route selection when warehouse changes
        selectedRoute.value = '';

        // Load routes for the selected warehouse
        if (selectedWarehouse.value) {
            await loadRoutesData(selectedWarehouse.value);
        }
    }
    saveValues();
};

// Function to load routes data
const loadRoutesData = async (warehouseId) => {
    isLoading.value = true;
    try {
        const result = await transportStore.fetchRoutesList(warehouseId);
        if (result.success) {
            console.log('Routes loaded successfully:', result.data);
        }
    } catch (err) {
        console.error('Error loading routes:', err);
    } finally {
        isLoading.value = false;
    }
};

// Function to handle route selection change
const onRouteChange = () => {
    console.log(`Selected Route: ${selectedRoute.value}`);
    const selectedRouteData = transportStore.getRouteById(selectedRoute.value);
    if (selectedRouteData) {
        console.log('Selected route data:', selectedRouteData);
    }
    saveValues();
};

// Function to fetch cost table data
const fetchCostTableData = async () => {
    if (!selectedWarehouse.value || !selectedRoute.value || !startDate.value || !endDate.value) return;
    isLoadingCostTable.value = true;
    costTableError.value = null;
    try {
        const params = new URLSearchParams({
            who_no: selectedWarehouse.value,
            begin_no: startDate.value.replace(/-/g, ''),
            end_no: endDate.value.replace(/-/g, ''),
            route_no: selectedRoute.value
        });
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/transport/cost-table?${params}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        if (data.status && data.status.code === 200) {
            costTableData.value = data.data || [];
        } else {
            throw new Error(data.status?.message || 'ไม่สามารถดึงข้อมูลตารางต้นทุนได้');
        }
    } catch (err) {
        costTableError.value = err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลตารางต้นทุน';
        costTableData.value = [];
    } finally {
        isLoadingCostTable.value = false;
    }
};

// Function to load data
const loadData = async () => {
    if (!selectedWarehouse.value) {
        showError('กรุณาเลือกศูนย์กระจายสินค้า');
        return;
    }
    if (!selectedRoute.value) {
        showError('กรุณาเลือกเส้นทางขนส่ง');
        return;
    }
    if (!startDate.value || !endDate.value) {
        showError('กรุณาเลือกวันที่');
        return;
    }
    console.log('Loading data for warehouse:', selectedWarehouse.value, 'and route:', selectedRoute.value);
    hasLoadedData.value = true;
    await fetchCostTableData();
    saveValues();
};

// Helper function to get selected warehouse name
const getSelectedWarehouseName = () => {
    const selectedWarehouseData = transportStore.getWarehouseById(selectedWarehouse.value);
    return selectedWarehouseData ? selectedWarehouseData.who_name : 'เลือกศูนย์กระจายสินค้า';
};

// Helper function to get selected route name
const getSelectedRouteName = () => {
    const selectedRouteData = transportStore.getRouteById(selectedRoute.value);
    return selectedRouteData ? (selectedRouteData.route_name || selectedRouteData.name) : 'เลือกเส้นทางขนส่ง';
};

// Placeholder data for demonstration
const tableData = ref([
    { no: 1, warehouse: 102, srOpenDate: '2025-05-21', dueDate: '2025-05-26', orderNumber: '680527057', customerCode: '40170012', customerName: 'บิ๊กบี', deliveryLocation: '571ม.11 ต.หนองโก อ.กระนวน จ.ขอนแก่น 40170', province: 'จ.หนองโก อ.กระนวน', overdue: -22, pendingFG: 12, pendingPM: 5 },
    { no: 2, warehouse: 102, srOpenDate: '2025-06-11', dueDate: '2025-06-17', orderNumber: '680626014', customerCode: '47230002', customerName: 'พรีสิสิทธิ์ เจริญทรัพย์', deliveryLocation: '399 หมู่ 8 ต.ท่าแร่ อ.เมืองสกลนคร จ.สกลนคร 47230', province: 'ต.ท่าแร่ อ.เมืองสกลนคร', overdue: 1, pendingFG: 5, pendingPM: 0 },
    { no: 3, warehouse: 102, srOpenDate: '2025-06-11', dueDate: '2025-06-17', orderNumber: '680626015', customerCode: '47230003', customerName: 'ตัสไก่สด สาขาทำแร่', deliveryLocation: '265 หมู่ที่ 8 ต.ท่าแร่ อ.เมืองสกลนคร จ.สกลนคร 47230', province: 'ต.ท่าแร่ อ.เมืองสกลนคร', overdue: 1, pendingFG: 11, pendingPM: 0 },
    { no: 4, warehouse: 102, srOpenDate: '2025-06-12', dueDate: '2025-06-17', orderNumber: '680626019', customerCode: '47210002', customerName: 'บริษัท น้องใหม่สุมาลัย จำกัด', deliveryLocation: '333 หมู่ที่8 ต.กุสุมาลย์ อ.กุสุมาลย์ จ.สกลนคร 47210', province: 'ต.กุสุมาลย์ อ.กุสุมาลย์', overdue: 1, pendingFG: 14, pendingPM: 0 },
    { no: 5, warehouse: 102, srOpenDate: '2025-06-13', dueDate: '2025-06-17', orderNumber: '680626022', customerCode: '47000084', customerName: 'บริษัท วสันต์ เทรดดิ้ง จำกัด', deliveryLocation: '552 หมู่ที่ 4 ต.ดงมะไฟ อ.เมืองสกลนคร จ.สกลนคร 47000', province: 'ต.ดงมะไฟ อ.เมืองสกลนคร', overdue: 1, pendingFG: 105, pendingPM: 0 },
    { no: 6, warehouse: 102, srOpenDate: '2025-06-13', dueDate: '2025-06-18', orderNumber: '680625020', customerCode: '39180016', customerName: 'ชัชวาลย์', deliveryLocation: 'ตลาดโพธิ์ผง ซ.ศรีบุญเรือง จ.หนองบัวลำภู 39180', province: 'อ.ศรีบุญเรือง จ.หนองบัวลำภู', overdue: 2, pendingFG: 5, pendingPM: 0 },
    { no: 7, warehouse: 102, srOpenDate: '2025-06-16', dueDate: '2025-06-19', orderNumber: '680625025', customerCode: '43180005', customerName: 'ห้างหุ้นส่วนจำกัด บิ๊กคอมพลาซ่า', deliveryLocation: '219 หมู่7 ซอย7 ต.พรเจริญ อ.พรเจริญ จ.บึงกาฬ', province: 'จ.พรเจริญ อ.พรเจริญ', overdue: 2, pendingFG: 10, pendingPM: 0 },
    { no: 8, warehouse: 102, srOpenDate: '2025-06-16', dueDate: '2025-06-19', orderNumber: '680625026', customerCode: '38180002', customerName: 'ณฐวุฒิ สาระรัตน์', deliveryLocation: '198 น.7 ต.พรเจริญ อ.พรเจริญ จ.บึงกาฬ', province: 'จ.พรเจริญ อ.บึงกาฬ', overdue: 2, pendingFG: 6, pendingPM: 0 },
    { no: 9, warehouse: 102, srOpenDate: '2025-06-16', dueDate: '2025-06-19', orderNumber: '680625027', customerCode: '43140017', customerName: 'บริษัท บิ๊กเบอรี่ ซุปเปอร์สโตร์ จำกัด', deliveryLocation: '339 หมู่9 ต.บึงกาฬ อ.เมืองบึงกาฬ จ.บึงกาฬ 38000', province: 'อ.เมืองบึงกาฬ จ.บึงกาฬ', overdue: 2, pendingFG: 59, pendingPM: 2 },
    { no: 10, warehouse: 102, srOpenDate: '2025-06-13', dueDate: '2025-06-18', orderNumber: '680627029', customerCode: '46140004', customerName: 'คุณเวนิวสา ไชยกำเนิด', deliveryLocation: '52 ม.5 ต.นิคม อ.สหัสขันธ์ จ.กาฬสินธุ์ 46140', province: 'จ.นิคม อ.สหัสขันธ์', overdue: 2, pendingFG: 13, pendingPM: 0 },
    { no: 11, warehouse: 102, srOpenDate: '2025-06-13', dueDate: '2025-06-18', orderNumber: '680627030', customerCode: '46000035', customerName: 'ห้างหุ้นส่วนจำกัด เคียงแสง เทรดดิ้ง', deliveryLocation: '910 ถ.1155 ต.เมืองกาฬสินธุ์ อ.เมืองกาฬสินธุ์ จ.กาฬสินธุ์ 46000', province: 'อ.เมืองกาฬสินธุ์ จ.กาฬสินธุ์', overdue: 2, pendingFG: 11, pendingPM: 0 },
    { no: 12, warehouse: 102, srOpenDate: '2025-06-14', dueDate: '2025-06-18', orderNumber: '680627031', customerCode: '46110015', customerName: 'ห้างหุ้นส่วนจำกัด มงคล มาร์เก็ตติ้ง', deliveryLocation: '240 หมู่ 13 ต.บัวขาว อ.กุฉินารายณ์ จ.กาฬสินธุ์', province: 'ต.บัวขาว อ.กุฉินารายณ์', overdue: 2, pendingFG: 25, pendingPM: 0 },
    { no: 13, warehouse: 102, srOpenDate: '2025-06-16', dueDate: '2025-06-20', orderNumber: '680627037', customerCode: '40170012', customerName: 'บิ๊กบี', deliveryLocation: '571ม.11 ต.หนองโก อ.กระนวน จ.ขอนแก่น 40170', province: 'จ.หนองโก อ.กระนวน', overdue: 3, pendingFG: 12, pendingPM: 0 },
]);

// Methods for interactivity (placeholders)
const selectReason = (item, reason) => {
    console.log(`Selected reason for item ${item.no}: ${reason}`);
    // Implement logic to update the reason
};

const openCalendar = (item) => {
    console.log(`Opening calendar for item ${item.no}`);
    // Implement calendar opening logic
};

const editItem = (item) => {
    console.log(`Editing item ${item.no}`);
    // Implement edit item logic
};

function formatNumber(val) {
    if (val === null || val === undefined) return '0.00';
    return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Export to Excel function
const exportToExcel = async () => {
    if (!costTableData.value || costTableData.value.length === 0) {
        showError('ไม่มีข้อมูลสำหรับส่งออก');
        return;
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ต้นทุนขนส่ง');

    // Summary rows
    worksheet.addRow([`จากวันที่`, startDate.value.replace(/-/g, ''), `ถึงวันที่`, endDate.value.replace(/-/g, '')]);
    worksheet.addRow([`เส้นทางขนส่ง:`, selectedRoute.value]);
    worksheet.addRow([`ศูนย์กระจายสินค้า : ${selectedWarehouse.value} - ${getSelectedWarehouseName()}`]);
    worksheet.addRow([]); // empty row

    // Header row
    const headerRow = [
        'ลำดับ', 'วันที่', 'คลัง', 'เส้นทาง', 'Shipment', 'FG', 'Premium', 'ค่าขนส่ง', 'ราคาต่อ Palet', 'ราคาต่อทึบ', 'จำนวนบิล', 'ชื่อขนส่ง'
    ];
    const header = worksheet.addRow(headerRow);

    // Style header
    header.eachCell(cell => {
        cell.font = { bold: true };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFB7DEE8' }
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Data rows
    costTableData.value.forEach((row, idx) => {
        const dataRow = [
            idx + 1,
            row.OQDSDT,
            row.OQWHLO,
            row.OQROUT,
            row.OQCONN,
            row.URPLQA,
            row.URPRQA,
            row.COST,
            row.pallet_cost,
            row.BPERCTN,
            row.cBill,
            row.Drive_name
        ];
        const excelRow = worksheet.addRow(dataRow);
        excelRow.eachCell(cell => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
    });

    // Set column widths
    worksheet.columns = [
        { width: 7 }, // ลำดับ
        { width: 12 }, // วันที่
        { width: 8 }, // คลัง
        { width: 12 }, // เส้นทาง
        { width: 14 }, // Shipment
        { width: 8 }, // FG
        { width: 10 }, // Premium
        { width: 12 }, // ค่าขนส่ง
        { width: 12 }, // ราคาต่อ Palet
        { width: 12 }, // ราคาต่อทึบ
        { width: 10 }, // จำนวนบิล
        { width: 24 }  // ชื่อขนส่ง
    ];

    // Download
    const buf = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cost_table_${selectedWarehouse.value}_${selectedRoute.value}_${startDate.value.replace(/-/g, '')}_${endDate.value.replace(/-/g, '')}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
};

// Function to edit shipment
const editShipment = (row) => {
    console.log(row);
    const params = {
        shipment_no: row.OQCONN,
        who_no: selectedWarehouse.value,
        begin_no: startDate.value.replace(/-/g, ''),
        end_no: endDate.value.replace(/-/g, ''),
        route_no: selectedRoute.value,
        cal_id1: row.cal_id1 || '',
        cal_id2: row.cal_id2 || '',
        cal_id3: row.cal_id3 || '',
        type_no: row.type_no || '',
        helpper: row.helpper || ''
    };

    router.push({
        name: 'shipcost-edit',
        query: params
    });
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
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #64748b;
}
</style>