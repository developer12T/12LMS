<template>
    <div class="flex-1 bg-gray-50 min-h-screen">
        <PageHeader>
            <template #actions>
                <div class="flex flex-col sm:flex-row gap-3 pl-5 items-end bg-white shadow-md rounded-lg p-2">
                    <div class=" flex flex-row gap-1 items-center">

                        <button type="button" @click="showConfirmReload = true"
                            :disabled="isLoadingTransport || isReloading"
                            class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <Icon v-if="isReloading" icon="mdi:loading" class="animate-spin w-4 h-4 mr-1.5" />
                            <Icon v-else icon="mdi:database-sync" width="16" height="16" class="mr-1.5" />
                            {{ isReloading ? 'กำลังประมวลผล...' : 'ดึงข้อมูลใหม่' }}
                        </button>
                        <button type="button" @click="showConfirmReload = true"
                            :disabled="isLoadingTransport || isReloading"
                            class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <Icon v-if="isReloading" icon="mdi:loading" class="animate-spin w-4 h-4 mr-1.5" />
                            <Icon v-else icon="mdi:database-sync" width="16" height="16" class="mr-1.5" />
                            {{ isReloading ? 'กำลังดึงข้อมูล...' : 'export excel' }}
                        </button>

                    </div>
                    <div class="flex-1 flex flex-row gap-1 min-w-0 items-center">
                        <label for="mh-select"
                            class="block mb-1 text-sm whitespace-nowrap font-sm text-gray-900 dark:text-white">
                            เลือก DC :
                        </label>
                        <select id="mh-select" v-model="selectedDC" @change="onDCChange" :disabled="isLoadingTransport"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <option value="" disabled>{{ isLoadingTransport ? 'กำลังโหลด...' : 'เลือก DC' }}</option>
                            <option v-for="transport in transportOptions" :key="transport.value"
                                :value="transport.value">
                                {{ transport.label }} : {{ transport.value }}
                            </option>
                        </select>
                        <p v-if="transportError" class="mt-1 text-xs text-red-600 dark:text-red-400">
                            {{ transportError }}
                        </p>
                    </div>
                    <div class="flex-shrink-0 sm:self-end flex flex-row gap-1">
                        <button type="button" @click="loadData" :disabled="isLoadingBacklog || !selectedDC"
                            class="w-full sm:w-auto text-white bg-[#00569D] hover:bg-[#004080] focus:ring-4 focus:ring-[#00569D]/30 font-medium rounded-lg text-xs px-4 py-1.5 dark:bg-[#00569D] dark:hover:bg-[#004080] focus:outline-none dark:focus:ring-[#00569D]/30 transition-colors inline-flex items-center justify-center min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed">
                            <Icon v-if="isLoadingBacklog" icon="mdi:loading" class="animate-spin w-4 h-4 mr-1.5" />
                            <Icon v-else icon="mdi:magnify" width="14" height="14" class="mr-1.5" />
                            {{ isLoadingBacklog ? 'กำลังโหลด...' : 'ดึงข้อมูล' }}
                        </button>
                    </div>
                </div>
            </template>
        </PageHeader>

        <!-- Table Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <!-- Loading State -->
            <div v-if="omsBacklogStore.isLoadingData" class="flex items-center justify-center p-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="omsBacklogStore.apiError" class="p-8 text-center text-red-500">
                {{ omsBacklogStore.apiError }}
            </div>

            <!-- Data Table with Custom Scrollbar -->
            <div class="relative shadow-md sm:rounded-lg custom-scrollbar p-2 overflow-x-auto overflow-y-hidden"
                style="max-height: calc(100vh - 120px);">
                <!-- Summary Info -->
                <div class="mb-2 p-2 bg-blue-50 text-xs">
                    <div class="grid grid-cols-3 gap-4">
                        <div class="text-center">
                            <p class="font-semibold text-blue-800">จังหวัด</p>
                            <p class="text-lg font-bold text-blue-600">{{ omsBacklogStore.filteredPlanningData.length }}
                            </p>
                        </div>
                        <div class="text-center">
                            <p class="font-semibold text-green-800">จำนวนร้านค้า</p>
                            <p class="text-lg font-bold text-green-600">{{ getTotalCustomers() }}</p>
                        </div>
                        <div class="text-center">
                            <p class="font-semibold text-purple-800">จำนวน PO</p>
                            <p class="text-lg font-bold text-purple-600">{{ getTotalPOs() }}</p>
                        </div>
                    </div>
                </div>

                <div class="virtual-table-container rounded-t-lg overflow-auto" style="height: calc(100vh - 180px);">
                    <table
                        class="w-full text-xs text-left text-gray-500 dark:text-gray-400 border-collapse border border-gray-300 dark:border-gray-600 mb-8">
                        <thead
                            class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">
                            <tr>
                                <th :colspan="omsBacklogStore.processedData.dateRange ? omsBacklogStore.processedData.dateRange.allDates.length + 2 : 4"
                                    class="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                                    <div class="flex items-center justify-between">

                                        <!-- Record Count -->
                                        <ResultCount :label="'ผลลัพธ์:'"
                                            :current="omsBacklogStore.filteredPlanningData.length"
                                            :total="omsBacklogStore.filteredPlanningData.length"
                                            icon="mdi:clipboard-text-outline" iconColor="#00569D" />
                                        <div class="flex items-center space-x-4">
                                            
                                            <!-- Province Filter -->
                                            <div class="relative" ref="provinceDropdownRef">
                                                <button @click="toggleProvinceDropdown"
                                                    :disabled="availableProvinces.length === 0"
                                                    class="text-white bg-[#F47A30] text-xs hover:bg-[#F47A30]/80 disabled:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-[#F47A30]/30 font-medium rounded-lg px-3 py-1.5 text-center inline-flex items-center transition-colors shadow-sm"
                                                    type="button">
                                                    <Icon icon="mdi:map-marker" class="w-4 h-4 mr-2" />
                                                    จังหวัด {{ selectedProvinces.length > 0 ?
                                                    `(${selectedProvinces.length})` :
                                                    '' }}{{ availableProvinces.length ===
                                                        0 ? ' (ไม่มีข้อมูล)' : '' }}
                                                    <svg class="w-2 h-2 ml-2 transition-transform"
                                                        :class="{ 'rotate-180': showProvinceDropdown }"
                                                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                        fill="none" viewBox="0 0 10 6">
                                                        <path stroke="currentColor" stroke-linecap="round"
                                                            stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                                                    </svg>
                                                </button>

                                                <!-- Province Dropdown menu -->
                                                <div v-show="showProvinceDropdown" @click.stop
                                                    class="absolute right-0 mt-2 w-80 md:w-96 lg:w-[500px] bg-white divide-y divide-gray-100 rounded-lg shadow-lg border border-gray-200 dark:bg-gray-800 dark:divide-gray-600 dark:border-gray-700 z-50">
                                                    <div class="p-3">
                                                        <h3
                                                            class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                                            เลือกจังหวัด</h3>
                                                        <div v-if="availableProvinces.length === 0"
                                                            class="text-sm text-gray-500 text-center py-4">
                                                            กรุณากดปุ่ม "ดึงข้อมูล" ก่อนเพื่อโหลดข้อมูลจังหวัด
                                                        </div>
                                                        <div v-else
                                                            class="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 text-sm text-gray-700 dark:text-gray-200">
                                                            <div v-for="province in availableProvinces" :key="province"
                                                                class="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                                @click.stop>
                                                                <input :id="`province-${province}`" type="checkbox"
                                                                    v-model="selectedProvinces" :value="province"
                                                                    class="w-4 h-4 text-[#00569D] bg-gray-100 border-gray-300 rounded focus:ring-[#00569D] dark:focus:ring-[#00569D] dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                                                <label :for="`province-${province}`"
                                                                    class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center truncate">
                                                                    {{ province }}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
                                                        <div v-if="selectedProvinces.length === 0"
                                                            class="text-xs text-gray-500 mb-2 text-center">
                                                            เลือกจังหวัดอย่างน้อย 1 รายการ
                                                        </div>
                                                        <div class="flex flex-row gap-2">
                                                            <button @click="applyProvinceFilter"
                                                            class="w-full bg-[#00569D] hover:bg-[#004080] disabled:bg-gray-400 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors">
                                                            ค้นหา
                                                        </button>

                                                       
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- Search Input -->
                                            <div class="relative">
                                                <div
                                                    class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <Icon icon="mdi:magnify" class="w-4 h-4 text-gray-400" />
                                                </div>
                                                <input type="text" v-model="omsBacklogStore.searchQuery"
                                                    placeholder="ค้นหา..."
                                                    class="w-64 pl-10 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400">
                                            </div>

                                        </div>
                                    </div>
                                </th>
                            </tr>
                            <tr>
                                <th scope="col"
                                    class="px-2 py-2 text-left w-48 border border-gray-300 dark:border-gray-600 bg-gray-50">
                                    จังหวัด
                                </th>
                                <!-- Date Columns -->
                                <th v-for="date in omsBacklogStore.processedData.dateRange?.allDates" :key="date"
                                    scope="col"
                                    class="px-2 py-2 text-center w-16 border border-gray-300 dark:border-gray-600 bg-gray-50">
                                    {{ omsBacklogStore.formatDate(date) }}
                                </th>
                                <th scope="col"
                                    class="px-2 py-2 text-center w-20 border border-gray-300 dark:border-gray-600 bg-gray-200">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="!omsBacklogStore.filteredPlanningData || omsBacklogStore.filteredPlanningData.length === 0"
                                class="bg-white dark:bg-gray-800">
                                <td :colspan="omsBacklogStore.processedData.dateRange ? omsBacklogStore.processedData.dateRange.allDates.length + 2 : 4"
                                    class="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    ไม่พบข้อมูลค้นหา
                                </td>
                            </tr>
                            <template v-else>
                                <!-- Parent rows (provinces) and Child rows (customers) -->
                                <template v-for="province in omsBacklogStore.filteredPlanningData" :key="province.id">
                                    <!-- Parent row (province) -->
                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 font-semibold bg-yellow-50 cursor-pointer"
                                        @click="omsBacklogStore.toggleRow(province.id)">
                                        <td
                                            class="px-2 py-1 text-left text-xs border border-gray-300 dark:border-gray-600">
                                            <div class="flex items-center">
                                                <span class="mr-1 cursor-pointer">
                                                    <Icon
                                                        :icon="omsBacklogStore.isRowCollapsed(province.id) ? 'mdi:chevron-right' : 'mdi:chevron-down'"
                                                        class="w-4 h-4 text-blue-600" />
                                                </span>
                                                {{ province.label }}
                                            </div>
                                        </td>
                                        <!-- Date Data for Province -->
                                        <td v-for="date in omsBacklogStore.processedData.dateRange?.allDates"
                                            :key="`province-${date}`"
                                            class="px-2 py-1 text-center text-xs border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-blue-50"
                                            @click="omsBacklogStore.getProvinceTotal(province, date) ? openDetailModal(province) : null">
                                            {{ omsBacklogStore.getProvinceTotal(province, date) || '-' }}
                                        </td>
                                        <td
                                            class="px-2 py-1 text-center text-xs font-semibold border border-gray-300 dark:border-gray-600 bg-gray-100">
                                            {{ province.total || '-' }}
                                        </td>
                                    </tr>

                                    <!-- Child rows (customers) for this province -->
                                    <template v-if="!omsBacklogStore.isRowCollapsed(province.id)">

                                        <tr v-for="child in province.children" :key="child.id"
                                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td
                                                class="px-2 py-1 text-left text-xs border border-gray-300 dark:border-gray-600">
                                                <div class="flex items-center">
                                                    <span class="ml-4">•</span>
                                                    {{ child.label }}
                                                </div>
                                            </td>
                                            <!-- Date Data for Customer -->
                                            <td v-for="date in omsBacklogStore.processedData.dateRange?.allDates"
                                                :key="`child-${date}`"
                                                class="px-2 py-1 text-center text-xs border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-blue-50"
                                                @click="child.dateData[date] && child.dateData[date] !== '-' ? openDetailModal(child) : null">
                                                {{ child.dateData[date] || '-' }}
                                            </td>
                                            <td
                                                class="px-2 py-1 text-center text-xs font-semibold border border-gray-300 dark:border-gray-600 bg-gray-100">
                                                {{ omsBacklogStore.getCustomerTotal(child) || '-' }}
                                            </td>
                                        </tr>
                                    </template>
                                </template>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- PO Detail Modal -->
        <div v-if="isPoDetailModalVisible"
            class="fixed inset-0  bg-black bg-opacity-60 z-40 flex items-center justify-center p-4 sm:p-16">
            <div
                class="bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out">
                <!-- Modal Header -->
                <div class="p-4 border-b flex justify-between items-center bg-slate-50 rounded-t-lg">
                    <div class="flex items-center space-x-3">
                        <Icon icon="mdi:file-document-outline" class="w-6 h-6 text-sky-600" />
                        <h3 class="text-lg font-semibold text-gray-800">รายละเอียดใบสั่งซื้อ</h3>
                    </div>
                    <button @click="closePoDetailModal" class="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <Icon icon="mdi:close" class="w-5 h-5" />
                    </button>
                </div>

                <!-- Modal Content -->
                <div class="p-6 space-y-4 overflow-y-auto">
                    <div v-if="selectedPo" class="text-sm bg-slate-100 p-4 rounded-lg">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1">
                            <p><span class="font-semibold text-slate-600">เลขที่ใบสั่งซื้อ:</span> {{ selectedPo.po_no
                                }}</p>
                            <p><span class="font-semibold text-slate-600">คลัง:</span> {{ selectedPo.wh_no }}</p>
                            <p><span class="font-semibold text-slate-600">แผนผลิตระหว่างวันที่:</span> 23 มิ.ย. 2025 -
                                29 มิ.ย.
                                2025</p>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div v-if="backlogStore.isDetailsLoading" class="text-center py-12">
                        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600 mx-auto"></div>
                        <p class="mt-3 text-sm text-gray-500">กำลังโหลดข้อมูล...</p>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="backlogStore.detailsError"
                        class="text-center py-12 text-red-600 bg-red-50 rounded-lg p-6">
                        <Icon icon="mdi:alert-circle-outline" class="w-12 h-12 mx-auto mb-3" />
                        <p class="font-semibold">เกิดข้อผิดพลาด</p>
                        <p class="text-sm">{{ backlogStore.detailsError }}</p>
                    </div>

                    <!-- No Data State -->
                    <div v-else-if="backlogStore.poDetails.length === 0" class="text-center py-12 text-gray-500">
                        <Icon icon="mdi:database-off-outline" class="w-12 h-12 mx-auto mb-3" />
                        <p class="font-semibold">ไม่พบข้อมูลรายละเอียด</p>
                        <p class="text-sm">ไม่มีรายการสินค้าสำหรับใบสั่งซื้อนี้</p>
                    </div>

                    <!-- Details Table -->
                    <div v-else class="overflow-x-auto">
                        <table class="min-w-full text-xs text-left text-gray-700">
                            <thead class="text-xs text-gray-600 uppercase bg-gray-200 sticky top-0 z-10">
                                <tr>
                                    <th class="p-3">ลำดับ</th>
                                    <th class="p-3">รหัสสินค้า</th>
                                    <th class="p-3">ชื่อสินค้า</th>
                                    <th class="p-3 text-right">ยอดตามบิล</th>
                                    <th class="p-3 text-right">ส่งบางส่วน</th>
                                    <th class="p-3 text-right">ยอดค้างส่ง</th>
                                    <th class="p-3 text-right">สถานะ</th>
                                    <th class="p-3 text-right">Stock (PCS)</th>
                                    <th class="p-3 text-right">Planning (PCS)</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <tr v-for="(detail, index) in backlogStore.poDetails" :key="detail.item_node"
                                    class="hover:bg-sky-50 transition-colors">
                                    <td class="p-3 text-center text-gray-500">{{ index + 1 }}</td>
                                    <td class="p-3 font-mono">{{ detail.item_node.trim() }}</td>
                                    <td class="p-3">{{ detail.item_namede }}</td>
                                    <td class="p-3 text-right font-medium">{{ detail.bill_qtyde }}</td>
                                    <td class="p-3 text-right">{{ detail.send_qtyde }}</td>
                                    <td class="p-3 text-right font-semibold text-red-600">{{ detail.out_qtyde }}</td>
                                    <td class="p-3 text-right">{{ detail.bill_status }}</td>
                                    <td class="p-3 text-right">{{ detail.stockde || '-' }}</td>
                                    <td class="p-3 text-right">{{ detail.planingde || '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Multi-Save Loading Modal -->
        <div v-if="isSavingMultiple"
            class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg shadow-2xl p-8 flex flex-col items-center space-y-4 w-full max-w-sm">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <h3 class="text-lg font-semibold text-gray-800">กำลังบันทึกข้อมูล...</h3>
                <div class="w-full">
                    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-linear"
                            :style="{ width: savePercentage + '%' }"></div>
                    </div>
                    <p class="text-center text-gray-600 mt-2">
                        บันทึกแล้ว {{ saveProgress }} จาก {{ totalToSave }} รายการ
                    </p>
                </div>
            </div>
        </div>

        <!-- Confirm Reload Modal -->
        <div v-if="showConfirmReload"
            class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
            <div class="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
                <h3 class="text-lg font-semibold">ยืนยันการ Gen Back Order</h3>
                <p>คุณต้องการสร้างข้อมูล Back Order ใหม่ใช่หรือไม่?</p>
                <p class="text-sm text-gray-600">การดำเนินการนี้อาจใช้เวลาสักครู่</p>
                <div class="flex space-x-4">
                    <button @click="confirmReload" class="bg-green-600 text-white px-4 py-2 rounded">ยืนยัน</button>
                    <button @click="showConfirmReload = false"
                        class="bg-gray-400 text-white px-4 py-2 rounded">ยกเลิก</button>
                </div>
            </div>
        </div>

        <!-- Progress Bar Loading -->
        <div v-if="isReloading" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
            <div class="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 w-full max-w-xs">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p class="text-center text-gray-600 mt-2">กำลังสร้างข้อมูล Back Order...</p>
            </div>
        </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-4">
        <div class="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">
                    รายละเอียดข้อมูล - {{ selectedDetailData?.label || '' }}
                </h3>
                <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
                    <Icon icon="mdi:close" class="w-6 h-6" />
                </button>
            </div>

            <!-- Modal Content -->
            <div class="p-4 overflow-auto max-h-[calc(90vh-120px)]">
                <div class="relative shadow-md sm:rounded-lg overflow-x-auto">
                    <table class="w-full text-xs text-left text-gray-500 border-collapse border border-gray-300">
                        <thead class="text-xs text-white uppercase bg-blue-600">
                            <tr>
                                <th class="px-2 py-2 text-center border border-gray-300">
                                    <div class="flex items-center justify-center">
                                        คลัง
                                        <Icon icon="mdi:chevron-down" class="w-4 h-4 ml-1" />
                                    </div>
                                </th>
                                <th class="px-2 py-2 text-center border border-gray-300">
                                    <div class="flex items-center justify-center">
                                        SR Date
                                        <Icon icon="mdi:chevron-down" class="w-4 h-4 ml-1" />
                                    </div>
                                </th>
                                <th class="px-2 py-2 text-center border border-gray-300">
                                    <div class="flex items-center justify-center">
                                        กำหนดส่ง2
                                        <Icon icon="mdi:chevron-down" class="w-4 h-4 ml-1" />
                                    </div>
                                </th>
                                <th class="px-2 py-2 text-center border border-gray-300">
                                    <div class="flex items-center justify-center">
                                        เลขที่ใบสั่งซื้อ
                                        <Icon icon="mdi:chevron-down" class="w-4 h-4 ml-1" />
                                    </div>
                                </th>
                                <th class="px-2 py-2 text-center border border-gray-300">
                                    <div class="flex items-center justify-center">
                                        รหัสลูกค้า
                                        <Icon icon="mdi:chevron-down" class="w-4 h-4 ml-1" />
                                    </div>
                                </th>
                                <th class="px-2 py-2 text-center border border-gray-300">
                                    <div class="flex items-center justify-center">
                                        ชื่อลูกค้า
                                        <Icon icon="mdi:chevron-down" class="w-4 h-4 ml-1" />
                                    </div>
                                </th>
                                <th class="px-2 py-2 text-center border border-gray-300">
                                    <div class="flex items-center justify-center">
                                        จังหวัด2
                                        <Icon icon="mdi:chevron-down" class="w-4 h-4 ml-1" />
                                    </div>
                                </th>
                                <th class="px-2 py-2 text-center border border-gray-300">
                                    <div class="flex items-center justify-center">
                                        จังหวัด
                                        <Icon icon="mdi:chevron-down" class="w-4 h-4 ml-1" />
                                    </div>
                                </th>
                                <th class="px-2 py-2 text-center border border-gray-300">
                                    <div class="flex items-center justify-center">
                                        เกิน
                                        <Icon icon="mdi:chevron-down" class="w-4 h-4 ml-1" />
                                    </div>
                                </th>
                                <th class="px-2 py-2 text-center border border-gray-300">
                                    <div class="flex items-center justify-center">
                                        FG
                                        <Icon icon="mdi:chevron-down" class="w-4 h-4 ml-1" />
                                    </div>
                                </th>
                                <th class="px-2 py-2 text-center border border-gray-300">
                                    <div class="flex items-center justify-center">
                                        PM
                                        <Icon icon="mdi:chevron-down" class="w-4 h-4 ml-1" />
                                    </div>
                                </th>
                                <th class="px-2 py-2 text-center border border-gray-300">
                                    <div class="flex items-center justify-center">
                                        สาเหตุสิ้นเดือน
                                        <Icon icon="mdi:chevron-down" class="w-4 h-4 ml-1" />
                                    </div>
                                </th>
                                <th class="px-2 py-2 text-center border border-gray-300">
                                    สาเหตุปัจจุบัน
                                </th>
                                <th class="px-2 py-2 text-center border border-gray-300">
                                    <div class="flex items-center justify-center">
                                        อื่นๆ (ระบุ)
                                        <Icon icon="mdi:chevron-down" class="w-4 h-4 ml-1" />
                                    </div>
                                </th>
                                <th class="px-2 py-2 text-center border border-gray-300">
                                    <div class="flex items-center justify-center">
                                        เลื่อนส่ง
                                        <Icon icon="mdi:chevron-down" class="w-4 h-4 ml-1" />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(detail, index) in detailData" :key="index"
                                :class="index % 2 === 0 ? 'bg-gray-100' : 'bg-white'" class="border-b border-gray-300">
                                <td class="px-2 py-1 text-center border border-gray-300">{{ detail.warehouse }}</td>
                                <td class="px-2 py-1 text-center border border-gray-300">{{ detail.srDate }}</td>
                                <td class="px-2 py-1 text-center border border-gray-300">{{ detail.deliveryDate }}</td>
                                <td class="px-2 py-1 text-center border border-gray-300">{{ detail.poNumber }}</td>
                                <td class="px-2 py-1 text-center border border-gray-300">{{ detail.customerCode }}</td>
                                <td class="px-2 py-1 text-left border border-gray-300">{{ detail.customerName }}</td>
                                <td class="px-2 py-1 text-center border border-gray-300">{{ detail.province2 }}</td>
                                <td class="px-2 py-1 text-left border border-gray-300">{{ detail.province }}</td>
                                <td class="px-2 py-1 text-center border border-gray-300">{{ detail.overdue }}</td>
                                <td class="px-2 py-1 text-center border border-gray-300">{{ detail.fg }}</td>
                                <td class="px-2 py-1 text-center border border-gray-300">{{ detail.pm }}</td>
                                <td class="px-2 py-1 text-left border border-gray-300">{{ detail.reasonEndMonth }}</td>
                                <td class="px-2 py-1 text-left border border-gray-300">{{ detail.currentReason }}</td>
                                <td class="px-2 py-1 text-left border border-gray-300">{{ detail.others }}</td>
                                <td class="px-2 py-1 text-center border border-gray-300">{{ detail.postponeDelivery ||
                                    '-'
                                }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import PageHeader from '@/components/PageHeader.vue';
import ResultCount from '@/components/ResultCount.vue';
import { useBacklogStore } from '@/stores/modules/backlog.js';
import { useOmsBacklogStore } from '@/stores/modules/oms/manage/backlog.js';


// Store
const backlogStore = useBacklogStore();
const omsBacklogStore = useOmsBacklogStore();

// Reactive data
const selectedDC = ref(localStorage.getItem('selectedDC') || '');

// Province filter state
const showProvinceDropdown = ref(false);
const selectedProvinces = ref(JSON.parse(localStorage.getItem('selectedProvinces') || '[]'));
const availableProvinces = ref([]);
const provinceDropdownRef = ref(null);

// Modal state
const showDetailModal = ref(false);
const selectedDetailData = ref(null);
const detailData = ref([]);
const isPoDetailModalVisible = ref(false);
const selectedPo = ref(null);

// State for confirm reload
const showConfirmReload = ref(false);
const isReloading = ref(false);

// State for saving multiple
const isSavingMultiple = ref(false);
const savePercentage = ref(0);
const saveProgress = ref(0);
const totalToSave = ref(0);

// Computed properties from stores
const isLoadingTransport = computed(() => omsBacklogStore.isLoadingWarehouse);
const transportError = computed(() => omsBacklogStore.warehouseError);
const transportOptions = computed(() => {
    return omsBacklogStore.warehouseData.map(warehouse => ({
        value: warehouse.who_no,
        label: warehouse.who_name
    }));
});

const isLoadingBacklog = computed(() => false);
const backlogError = computed(() => null);
const backlogData = computed(() => {
    return [];
});


// Watch for changes in selectedDC and selectedStatus
watch(selectedDC, (val) => {
    console.log('Selected DC changed:', val);
});


// Call API on component mount
onMounted(() => {
    // ดึงข้อมูล warehouse เมื่อ component mount
    omsBacklogStore.fetchWarehouseData();
    console.log('Component mounted - loading warehouse data');

    // Add click outside listener
    document.addEventListener('click', handleClickOutside);

    // Auto load data if DC is already selected
    if (selectedDC.value) {
        console.log('Auto loading data for saved DC:', selectedDC.value);
        loadData();
    }
});

// Function to confirm reload
const confirmReload = async () => {
    console.log('Confirm reload - placeholder');
};

// Function to load data with selected DC and Status
const loadData = async () => {
    if (selectedDC.value) {
        await omsBacklogStore.fetchData(selectedDC.value);
        // Update available provinces after data is loaded
        availableProvinces.value = omsBacklogStore.filteredPlanningData.map(province => province.label);

        // Apply saved province filter if exists
        if (selectedProvinces.value.length > 0) {
            omsBacklogStore.setProvinceFilter(selectedProvinces.value);
        }
    }
};

// Function to calculate total customers
const getTotalCustomers = () => {
    return omsBacklogStore.filteredPlanningData.reduce((total, province) => {
        return total + province.children.length;
    }, 0);
};

// Function to calculate total POs
const getTotalPOs = () => {
    return omsBacklogStore.filteredPlanningData.reduce((total, province) => {
        return total + province.total;
    }, 0);
};

// Province filter functions
const toggleProvinceDropdown = () => {
    showProvinceDropdown.value = !showProvinceDropdown.value;
};

const applyProvinceFilter = () => {
    showProvinceDropdown.value = false;
    // Save selected provinces to localStorage
    localStorage.setItem('selectedProvinces', JSON.stringify(selectedProvinces.value));

    // Filter data based on selected provinces
    if (selectedProvinces.value.length > 0) {
        // Filter the data in the store
        omsBacklogStore.setProvinceFilter(selectedProvinces.value);
    } else {
        // Clear filter if no provinces selected
        omsBacklogStore.clearProvinceFilter();
    }
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
    if (provinceDropdownRef.value && !provinceDropdownRef.value.contains(event.target)) {
        showProvinceDropdown.value = false;
    }
};

// Modal functions
const openDetailModal = (item) => {
    selectedDetailData.value = item;
    detailData.value = generateMockDetailData();
    showDetailModal.value = true;
};

const closeDetailModal = () => {
    showDetailModal.value = false;
    selectedDetailData.value = null;
};

const generateMockDetailData = () => {
    // Mockup detail data based on the item
    const mockDetailData = [
        {
            warehouse: '111',
            srDate: '26/2/2025',
            deliveryDate: '3/3/2025',
            poNumber: '680215082',
            customerCode: '11140008',
            customerName: 'แผงเจ้แมว',
            province2: 'บางใหญ่',
            province: 'ต.เสาธงหิน อ.บางใหญ่ จ.นนทบุรี 11140',
            overdue: -4,
            fg: 470,
            pm: 0,
            reasonEndMonth: 'สินค้าขาดสต๊อก',
            currentReason: 'ลูกค้าเลื่อนนัด',
            others: 'เนื่องจากพื้นที่จัดเก็บลูกค้าไม่เพียงพอ',
            postponeDelivery: ''
        },
        {
            warehouse: '111',
            srDate: '28/2/2025',
            deliveryDate: '3/3/2025',
            poNumber: '680215087',
            customerCode: '11140046',
            customerName: 'ร้านพร้อมโชค',
            province2: 'บางใหญ่',
            province: 'ต.เสาธงหิน อ.บางใหญ่',
            overdue: -4,
            fg: 218,
            pm: 0,
            reasonEndMonth: 'สินค้าขาดสต๊อก',
            currentReason: 'เกินเทียว',
            others: 'แบ่งส่งสินค้า',
            postponeDelivery: ''
        }
    ];

    return mockDetailData;
};


const onDCChange = () => {
    console.log(`Selected DC: ${selectedDC.value}`);
    // Save selected DC to localStorage
    if (selectedDC.value) {
        localStorage.setItem('selectedDC', selectedDC.value);
    } else {
        localStorage.removeItem('selectedDC');
    }
};

// Function to clear all data and filters
const clearAllData = () => {
    // Clear localStorage
    localStorage.removeItem('selectedDC');
    localStorage.removeItem('selectedProvinces');

    // Reset reactive data
    selectedDC.value = '';
    selectedProvinces.value = [];

    // Clear store filters
    omsBacklogStore.clearProvinceFilter();
    omsBacklogStore.setSearchQuery('');

    // Clear available provinces
    availableProvinces.value = [];

    console.log('All data cleared');
};

// Initialize data on component mount
onMounted(() => {
    // No longer needed as updatePlanningData and calculateMonthTotal are removed
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
