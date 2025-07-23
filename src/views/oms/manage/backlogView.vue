<template>
    <div class="flex-1 bg-gray-50 min-h-screen">
        <PageHeader>
            <template #actions>
                <div class="flex flex-col sm:flex-row gap-3 pl-5 items-end bg-white shadow-md rounded-lg p-2">
                    <div class=" flex flex-row gap-1 items-center">
                        <button type="button" @click="exportToExcel" :disabled="!filteredBacklogData.length"
                        class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <Icon icon="file-icons:microsoft-excel" width="16" height="16" class="mr-1.5" />
                        Export Excel
                    </button>
                    <button type="button" @click="showConfirmReload = true" :disabled="isLoadingTransport || isReloading"
                        class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <Icon v-if="isReloading" icon="mdi:loading" class="animate-spin w-4 h-4 mr-1.5" />
                        <Icon v-else icon="mdi:database-sync" width="16" height="16" class="mr-1.5" />
                        {{ isReloading ? 'กำลังประมวลผล...' : 'ดึงข้อมูลใหม่' }}
                    </button>
                    </div>
                    <div class="flex-1 flex flex-row gap-1 min-w-0 items-center">
                        <label for="mh-select" class="block mb-1 text-sm whitespace-nowrap font-sm text-gray-900 dark:text-white">
                            เลือก DC : 
                        </label>
                        <select id="mh-select" v-model="selectedDC" @change="onDCChange" :disabled="isLoadingTransport"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <option value="" disabled>{{ isLoadingTransport ? 'กำลังโหลด...' : 'เลือก DC' }}</option>
                            <option v-for="transport in transportOptions" :key="transport.value" :value="transport.value">
                                {{ transport.label }} : {{ transport.value }}
                            </option>
                        </select>
                        <p v-if="transportError" class="mt-1 text-xs text-red-600 dark:text-red-400">
                            {{ transportError }}
                        </p>
                    </div>
                    <div class="flex-1 flex flex-row gap-1 min-w-0 items-center">
                        <label for="status-select" class="block mb-1 text-sm whitespace-nowrap font-sm text-gray-900 dark:text-white">
                            สถานะ :
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
                    <div class="flex-shrink-0 sm:self-end">
                        <button type="button" @click="loadData" :disabled="isLoadingBacklog || !selectedDC || !selectedStatus"
                            class="w-full sm:w-auto text-white bg-[#00569D] hover:bg-[#004080] focus:ring-4 focus:ring-[#00569D]/30 font-medium rounded-lg text-xs px-4 py-1.5 dark:bg-[#00569D] dark:hover:bg-[#004080] focus:outline-none dark:focus:ring-[#00569D]/30 transition-colors inline-flex items-center justify-center min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed">
                            <Icon v-if="isLoadingBacklog" icon="mdi:loading" class="animate-spin w-4 h-4 mr-1.5" />
                            <Icon v-else icon="mdi:magnify" width="14" height="14" class="mr-1.5" />
                            {{ isLoadingBacklog ? 'กำลังโหลด...' : 'ดึงข้อมูล' }}
                        </button>
                    </div>
                </div>
            </template>
        </PageHeader>
        <div class="overflow-x-auto bg-white rounded-lg shadow mb-2 p-2">
            <table class="min-w-max text-xs text-center border border-gray-200 bg-white">
                <thead>
                    <tr class="hover:bg-blue-50 transition">
                        <th class="px-3 py-2 border border-gray-200 text-left font-medium bg-gray-50">จำนวนวันที่เกิน</th>
                        <td v-for="(d, colIdx) in backlogSummaryPivot.days" :key="'d'+d"
                            class="px-3 py-2 border border-gray-200"
                            :class="{ 'bg-blue-50': hoverCol === colIdx }"
                            @mouseover="hoverCol = colIdx"
                            @mouseleave="hoverCol = null"
                        >{{ d }}</td>
                    </tr>
                </thead>
                <tbody>
                    <tr class="hover:bg-blue-50 transition">
                        <th class="px-3 py-2 border border-gray-200 text-left font-medium bg-gray-50">จำนวนบิล</th>
                        <td v-for="(n, colIdx) in backlogSummaryPivot.billCounts" :key="'b'+n"
                            class="px-3 py-2 border border-gray-200"
                            :class="{ 'bg-blue-50': hoverCol === colIdx }"
                            @mouseover="hoverCol = colIdx"
                            @mouseleave="hoverCol = null"
                        >{{ n }}</td>
                    </tr>
                    <tr class="hover:bg-blue-50 transition">
                        <th class="px-3 py-2 border border-gray-200 text-left font-medium bg-gray-50">ยอดรวมค้างส่ง FG</th>
                        <td v-for="(n, colIdx) in backlogSummaryPivot.fgTotals" :key="'fg'+n"
                            class="px-3 py-2 border border-gray-200"
                            :class="{ 'bg-blue-50': hoverCol === colIdx }"
                            @mouseover="hoverCol = colIdx"
                            @mouseleave="hoverCol = null"
                        >{{ n }}</td>
                    </tr>
                    <tr class="hover:bg-blue-50 transition">
                        <th class="px-3 py-2 border border-gray-200 text-left font-medium bg-gray-50">ยอดรวมค้างส่ง PM</th>
                        <td v-for="(n, colIdx) in backlogSummaryPivot.pmTotals" :key="'pm'+n"
                            class="px-3 py-2 border border-gray-200"
                            :class="{ 'bg-blue-50': hoverCol === colIdx }"
                            @mouseover="hoverCol = colIdx"
                            @mouseleave="hoverCol = null"
                        >{{ n }}</td>
                    </tr>
                </tbody>
            </table>
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
            <div v-else-if="!backlogStore.hasData && hasLoadedData" class="p-8 text-center">
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
            <div v-else-if="backlogStore.hasData" class="relative shadow-md sm:rounded-lg custom-scrollbar p-2 overflow-x-auto overflow-y-hidden" style="max-height: calc(100vh - 270px);">
                <div class="virtual-table-container rounded-t-lg  overflow-auto" 
                     style="height: calc(100vh - 270px);" 
                     @scroll="handleScroll">
                    <table
                        class="w-full text-xs text-left text-gray-500  dark:text-gray-400 border-collapse border border-gray-300 dark:border-gray-600">
                        <thead
                            class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">
                            <tr>
                                <th colspan="16" class="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                                    <div class="flex items-center justify-between">
                                      
                                         <!-- Record Count -->
                                         <ResultCount
                                            :label="'ผลลัพธ์:'"
                                            :current="searchQuery ? filteredBacklogData.length : null"
                                            :total="backlogData.length"
                                            icon="mdi:clipboard-text-outline"
                                            iconColor="#00569D"
                                         />
                                        <div class="flex items-center space-x-4">
                                            <!-- Multi-Save Controls -->
                                            <div v-if="editingRowIndexes.size > 1" class="flex items-center space-x-2 animate-fade-in">
                                                <button @click="saveAllChanges" class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center">
                                                    <Icon icon="mdi:content-save-all-outline" class="w-4 h-4 mr-1.5"/>
                                                    บันทึกทั้งหมด ({{ editingRowIndexes.size }})
                                                </button>
                                                <button @click="cancelAllEditing" class="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center">
                                                    <Icon icon="mdi:cancel" class="w-4 h-4 mr-1.5"/>
                                                    ยกเลิกทั้งหมด
                                                </button>
                                            </div>
                                            <!-- Search Input -->
                                            <div class="relative">
                                                <div
                                                    class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <Icon icon="mdi:magnify" class="w-4 h-4 text-gray-400" />
                                                </div>
                                                <input type="text" v-model="searchQuery" placeholder="ค้นหา..."
                                                    class="w-64 pl-10 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400">
                                            </div>
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
                            <!-- Top padding for virtual scrolling -->
                            <tr v-if="topPadding > 0">
                                <td :colspan="16" :style="{ height: topPadding + 'px', padding: 0 }"></td>
                            </tr>
                            
                            <tr v-if="virtualScrollData.length === 0" class="bg-white dark:bg-gray-800">
                                <td colspan="16" class="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    ไม่พบข้อมูลค้นหา
                                </td>
                            </tr>
                            <tr v-else v-for="(item, index) in virtualScrollData" :key="item.po_no" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td class="px-1 py-0.5 font-medium text-gray-900 dark:text-white text-center text-xs border border-gray-300 dark:border-gray-600">
                                    {{ item.originalIndex + 1 }}
                                </td>
                                <td class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                    {{ item.wh_no }}
                                </td>
                                <td class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                    {{ formatThaiDate(item.date_create) }}
                                </td>
                                <td class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                    {{ formatThaiDate(item.date_send) }}
                                </td>
                                <td class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                    <a href="#" @click.prevent="openPoDetail(item)"
                                        class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        {{ item.po_no }}
                                    </a>
                                </td>
                                <td class="px-1 py-0.5 text-center text-xs whitespace-nowrap border border-gray-300 dark:border-gray-600">
                                    {{ item.cus_code }}
                                </td>
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
                                    class="px-1 py-0.5 text-center text-purple-600 font-semibold border border-gray-300 dark:border-gray-600">
                                    {{ item.pm }}
                                </td>
                                <td class="border border-gray-300 dark:border-gray-600 p-0 align-middle">
                                    <select v-if="editingRowIndexes.has(item.originalIndex)" v-model="item.reason_id" class="bg-white border-none text-gray-900 text-xs rounded-lg focus:ring-1 focus:ring-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:text-white">
                                        <option value="" disabled>กรุณาเลือกสาเหตุ</option>
                                        <option v-for="reason in reasonOptions" :key="reason.value" :value="reason.value">{{ reason.label }}</option>
                                    </select>
                                    <template v-else>
                                        <span v-if="item.reason_name" class="px-1 py-0.5 text-xs">{{ item.reason_name }}</span>
                                        <div v-else class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-[5px] w-full text-xs text-gray-500 dark:text-gray-400 cursor-default mx-0.5">
                                            <span class="pl-2 py-[3px]">เลือกสาเหตุ</span>
                                            <Icon icon="mdi:chevron-down" class="w-4 h-4 mr-1" />
                                        </div>
                                    </template>
                                </td>
                                <td class="border border-gray-300 dark:border-gray-600 p-0 align-middle">
                                    <input v-if="editingRowIndexes.has(item.originalIndex)" type="text" v-model="item.otherbl" class="bg-white border-none text-gray-900 text-xs rounded-lg focus:ring-1 focus:ring-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:text-white">
                                    <span v-else class="px-1 py-0.5 text-xs truncate max-w-28" :title="item.otherbl">{{ item.otherbl || '-' }}</span>
                                </td>
                                <td class="border border-gray-300 dark:border-gray-600 p-0 align-middle">
                                    <DatePicker v-if="editingRowIndexes.has(item.originalIndex)" 
                                               v-model:value="item.po_detail" 
                                               type="date" 
                                               format="DD/MM/YYYY" 
                                               value-format="YYYY-MM-DD" 
                                               placeholder="เลือกวันที่" 
                                               :editable="false" 
                                               :clearable="false">
                                        <template #default="{ open }">
                                            <button @click="open" class="p-1.5 bg-blue-500 text-white hover:bg-blue-600 rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                                                    <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12 10.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM8.25 10.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 10.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM14.25 10.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                                                    <path fill-rule="evenodd" d="M5.25 2.25A.75.75 0 0 1 6 3v.75h12V3a.75.75 0 0 1 1.5 0v.75h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6.75a3 3 0 0 1 3-3H4.5a.75.75 0 0 1 .75-.75Zm-1.5 4.5a1.5 1.5 0 0 1 1.5-1.5h13.5a1.5 1.5 0 0 1 1.5 1.5v11.25a1.5 1.5 0 0 1-1.5-1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V6.75Z" clip-rule="evenodd" />
                                                  </svg>
                                            </button>
                                        </template>
                                    </DatePicker>
                                    <div v-else class="text-xs text-center px-1 py-0.5">
                                        {{ item.po_detail && !item.po_detail.startsWith('1900-01-01') ? formatThaiDate(item.po_detail) : '-' }}
                                    </div>
                                </td>
                                <td class="px-1 py-0.5 text-center border border-gray-300 dark:border-gray-600 align-middle">
                                    <div v-if="editingRowIndexes.has(item.originalIndex)">
                                        <!-- Show individual controls only if ONE item is being edited -->
                                        <div v-if="editingRowIndexes.size === 1" class="flex items-center justify-center space-x-1">
                                            <button @click="saveChanges(item, item.originalIndex)" title="บันทึก" class="focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-300 font-medium rounded p-1">
                                                <Icon icon="mdi:check-bold" class="w-4 h-4" />
                                            </button>
                                            <button @click="cancelEditing(item.originalIndex)" title="ยกเลิก" class="focus:outline-none text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-300 font-medium rounded p-1">
                                                <Icon icon="mdi:close-thick" class="w-4 h-4" />
                                            </button>
                                        </div>
                                         <!-- In multi-edit mode, show only a per-row cancel button -->
                                        <div v-else class="flex items-center justify-center">
                                            <button @click="cancelEditing(item.originalIndex)" title="ยกเลิกการแก้ไขรายการนี้" class="focus:outline-none text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-300 font-medium rounded p-1">
                                                <Icon icon="mdi:close-thick" class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <button v-else type="button" @click="startEditing(item, item.originalIndex)" title="แก้ไข" class="focus:outline-none text-white bg-amber-500 hover:bg-amber-600 focus:ring-2 focus:ring-amber-300 font-medium rounded text-xs p-1">
                                        <Icon icon="mdi:pencil" class="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                            
                            <!-- Bottom padding for virtual scrolling -->
                            <tr v-if="bottomPadding > 0">
                                <td :colspan="16" :style="{ height: bottomPadding + 'px', padding: 0 }"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- PO Detail Modal -->
        <div v-if="isPoDetailModalVisible"
            class="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center p-4 sm:p-16">
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
        <div v-if="isSavingMultiple" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg shadow-2xl p-8 flex flex-col items-center space-y-4 w-full max-w-sm">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <h3 class="text-lg font-semibold text-gray-800">กำลังบันทึกข้อมูล...</h3>
                <div class="w-full">
                    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-linear" :style="{ width: savePercentage + '%' }"></div>
                    </div>
                    <p class="text-center text-gray-600 mt-2">
                        บันทึกแล้ว {{ saveProgress }} จาก {{ totalToSave }} รายการ
                    </p>
                </div>
            </div>
        </div>

        <!-- Confirm Reload Modal -->
        <div v-if="showConfirmReload" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
            <div class="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
                <h3 class="text-lg font-semibold">ยืนยันการ Gen Back Order</h3>
                <p>คุณต้องการสร้างข้อมูล Back Order ใหม่ใช่หรือไม่?</p>
                <p class="text-sm text-gray-600">การดำเนินการนี้อาจใช้เวลาสักครู่</p>
                <div class="flex space-x-4">
                    <button @click="confirmReload" class="bg-green-600 text-white px-4 py-2 rounded">ยืนยัน</button>
                    <button @click="showConfirmReload = false" class="bg-gray-400 text-white px-4 py-2 rounded">ยกเลิก</button>
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
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { Icon } from '@iconify/vue';
import { useTransportStore, useBacklogStore, useAuthStore } from '@/stores';
import { showError, showWarning, showSuccess } from '@/utils/toast';
import * as XLSX from 'xlsx';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import PageHeader from '@/components/PageHeader.vue';
import ResultCount from '@/components/ResultCount.vue';

// Stores
const transportStore = useTransportStore();
const backlogStore = useBacklogStore();
const authStore = useAuthStore();

// Reactive data
const selectedDC = ref('');
const selectedStatus = ref('');
const hasLoadedData = ref(false);
const searchQuery = ref('');
const isPoDetailModalVisible = ref(false);
const selectedPo = ref(null);
const editingRowIndexes = ref(new Set());
let originalRowData = new Map();

// State for multi-save loading
const isSavingMultiple = ref(false);
const saveProgress = ref(0);
const totalToSave = ref(0);

const savePercentage = computed(() => {
    return totalToSave.value > 0 ? (saveProgress.value / totalToSave.value) * 100 : 0;
});

// State for confirm reload
const showConfirmReload = ref(false);
const isReloading = ref(false);

// Computed properties from stores
const isLoadingTransport = computed(() => transportStore.loading);
const transportError = computed(() => transportStore.error);
const transportOptions = computed(() => transportStore.getTransportOptions);

const isLoadingBacklog = computed(() => backlogStore.loading);
const backlogError = computed(() => backlogStore.error);
const backlogData = computed(() => backlogStore.backlogList);
const reasonOptions = computed(() => backlogStore.reasonOptions);

const backlogSummaryPivot = computed(() => {
    if (!backlogData.value) return { days: [], billCounts: [], fgTotals: [], pmTotals: [] };
    // สร้าง map สำหรับแต่ละวัน
    const map = {};
    backlogData.value.forEach(item => {
        const day = item.overdue;
        if (!map[day]) {
            map[day] = { bill: 0, fg: 0, pm: 0 };
        }
        map[day].bill += 1;
        map[day].fg += Number(item.fg) || 0;
        map[day].pm += Number(item.pm) || 0;
    });
    // เรียงวันที่จากน้อยไปมาก
    const days = Object.keys(map).map(Number).sort((a, b) => a - b);
    return {
        days,
        billCounts: days.map(d => map[d].bill),
        fgTotals: days.map(d => map[d].fg),
        pmTotals: days.map(d => map[d].pm)
    };
});

// Edit Mode Functions
const startEditing = (item, index) => {
    originalRowData.set(index, JSON.parse(JSON.stringify(item)));
    editingRowIndexes.value.add(index);
};

const cancelEditing = (index) => {
    if (originalRowData.has(index)) {
        const original = originalRowData.get(index);
        const itemInList = filteredBacklogData.value.find((item, i) => i === index);
        if (itemInList) {
            Object.assign(itemInList, original);
        }
        originalRowData.delete(index);
    }
    editingRowIndexes.value.delete(index);
};

const saveChanges = async (item, index) => {
    console.log("Saving changes for item:", item);
    const result = await backlogStore.saveBacklogItem(item);
    if (result.success) {
        showSuccess('สำเร็จ', 'บันทึกข้อมูลเรียบร้อยแล้ว');
        editingRowIndexes.value.delete(index);
        originalRowData.delete(index);
    } else {
        showError('ผิดพลาด', `เกิดข้อผิดพลาดในการบันทึก: ${result.error}`);
    }
};

const saveAllChanges = async () => {
    const itemsToSave = Array.from(editingRowIndexes.value)
        .map(index => filteredBacklogData.value[index])
        .filter(item => item);

    if (itemsToSave.length === 0) {
        showWarning('ไม่มีรายการให้บันทึก', 'ไม่มีการเปลี่ยนแปลงข้อมูล');
        return;
    }

    isSavingMultiple.value = true;
    totalToSave.value = itemsToSave.length;
    saveProgress.value = 0;

    const progressCallback = (completedCount) => {
        saveProgress.value = completedCount;
    };

    const result = await backlogStore.saveMultipleBacklogItems(itemsToSave, progressCallback);
    
    isSavingMultiple.value = false;

    if (result.success) {
        showSuccess('สำเร็จ', `บันทึกข้อมูล ${result.savedCount} รายการเรียบร้อยแล้ว`);
        if (result.failedCount > 0) {
            showWarning('ผิดพลาดบางรายการ', `ไม่สามารถบันทึกข้อมูลได้ ${result.failedCount} รายการ`);
        }
        editingRowIndexes.value.clear();
        originalRowData.clear();
    } else {
        showError('ผิดพลาด', `เกิดข้อผิดพลาดในการบันทึก: ${result.error}`);
    }
};

const cancelAllEditing = () => {
    for (const index of editingRowIndexes.value) {
        if (originalRowData.has(index)) {
            const original = originalRowData.get(index);
            const itemInList = filteredBacklogData.value.find((item, i) => i === index);
            if (itemInList) {
                Object.assign(itemInList, original);
            }
            originalRowData.delete(index);
        }
    }
    editingRowIndexes.value.clear();
};

// Load transport data on component mount
onMounted(() => {
    loadTransportData();
    backlogStore.fetchReasons();

    // Restore from localStorage
    selectedDC.value = localStorage.getItem('backlog_selectedDC') || '';
    selectedStatus.value = localStorage.getItem('backlog_selectedStatus') || '';

    // ถ้ามีค่า DC และ Status ที่เลือกไว้ ให้ดึงข้อมูลทันที
    if (selectedDC.value && selectedStatus.value) {
        loadData();
    }

    // ตั้งค่าความสูง container สำหรับ virtual scrolling
    nextTick(() => {
        setContainerHeight();
    });
});

// Function to load transport data
const loadTransportData = async () => {
    await transportStore.fetchTransportList();
    if (transportStore.error) {
        showError('Error', 'ไม่สามารถโหลดข้อมูล DC ได้');
    }
};

// Function to load backlog data
const loadData = async () => {
    if (!selectedDC.value || !selectedStatus.value) {
        showWarning('คำเตือน', 'กรุณาเลือก DC และสถานะก่อนดึงข้อมูล');
        return;
    }
    hasLoadedData.value = true;
    
    // Reset scroll position before loading new data
    scrollTop.value = 0;
    
    await backlogStore.fetchBacklogData(selectedDC.value, selectedStatus.value);
    if (backlogStore.error) {
        showError('Error', `เกิดข้อผิดพลาด: ${backlogStore.error}`);
    }
    
    // Reset scroll position after data is loaded
    nextTick(() => {
        const container = document.querySelector('.virtual-table-container');
        if (container) {
            container.scrollTop = 0;
        }
    });
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

// Helper function to format date for Thai display
const formatThaiDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear() + 543;

    return `${day}/${month}/${year}`;
};

// Helper function to format date for HTML date input (YYYY-MM-DD)
const formatDateForInput = (dateString) => {
    if (!dateString || dateString.startsWith('1900-01-01')) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
};

// Helper function to convert HTML date input value to proper format
const convertDateInputValue = (dateString) => {
    if (!dateString) return '';
    // HTML date input returns YYYY-MM-DD, convert to proper format if needed
    return dateString;
};

// Function to format date for Excel
const formatExcelDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
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
    // Prepare summary row
    const summaryRow = [
        `คลัง ${selectedDC.value} : ${getSelectedDCName()}`,
        `สถานะ: ${getStatusText(selectedStatus.value)}`,
        '', '', '', '', '', '', '', '', '', '', '', '', ''
    ];

    console.log(summaryRow);
    // Prepare header row
    const headerRow = [
        'ลำดับ', 'วันที่เปิด SR', 'กำหนดส่ง', 'เลขที่ใบสั่งซื้อ', 'รหัสลูกค้า', 'ชื่อลูกค้า',
        'สถานที่จัดส่ง', 'จังหวัด', 'เกิน', 'ค้าง FG', 'ค้าง PM', 'สาเหตุ', 'อื่นๆ (ระบุ)', 'เลื่อนส่ง'
    ];

    // Prepare data rows
    const dataRows = filteredBacklogData.value.map((item, index) => [
        index + 1,
        // item.wh_no,
        formatExcelDate(item.date_create),
        formatExcelDate(item.date_send),
        item.po_no,
        item.cus_code,
        item.cus_name,
        item.addressbl,
        item.provincebl,
        item.overdue,
        item.fg,
        item.pm,
        item.reason_name,
        item.otherbl,
        formatExcelDateDMY(item.po_detail)
    ]);
    // Combine all rows
    const aoa = [summaryRow, headerRow, ...dataRows];
    // Create worksheet and merge summary cells if needed
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    // Set column widths
    const colWidths = [
        { wch: 8 },  // ลำดับ
        { wch: 12 }, // วันที่เปิด SR
        { wch: 12 }, // กำหนดส่ง
        { wch: 15 }, // เลขที่ใบสั่งซื้อ
        { wch: 12 }, // รหัสลูกค้า
        { wch: 30 }, // ชื่อลูกค้า
        { wch: 40 }, // สถานที่จัดส่ง
        { wch: 15 }, // จังหวัด
        { wch: 8 },  // เกิน
        { wch: 8 },  // ค้าง FG
        { wch: 8 },  // ค้าง PM
        { wch: 15 }, // สาเหตุ
        { wch: 15 }, // อื่นๆ (ระบุ)
        { wch: 12 }  // เลื่อนส่ง
    ];
    ws['!cols'] = colWidths;
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ออเดอร์ค้างส่ง');
    // Generate filename with current date
    const now = new Date();
    const filename = `bl_${selectedDC.value}_${getStatusText(selectedStatus.value)}_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}.xlsx`;
    // Save file
    XLSX.writeFile(wb, filename);
};

// Modal Functions
const openPoDetail = (item) => {
    selectedPo.value = item;
    isPoDetailModalVisible.value = true;
    backlogStore.fetchPoDetails(item.po_no, item.wh_no);
};

const closePoDetailModal = () => {
    isPoDetailModalVisible.value = false;
    selectedPo.value = null;
};

// Function to confirm reload
const confirmReload = async () => {
    showConfirmReload.value = false;
    isReloading.value = true;
    
    try {
        // Reset scroll position before reloading
        scrollTop.value = 0;
        
        // Call gen-back-order API
        const params = {
            warehouse: selectedDC.value || '',
            start_date: '', // You can add date filters if needed
            end_date: ''
        };
        
        const result = await transportStore.getGenBackOrderData(params);
        
        if (result.success) {
            showSuccess('สำเร็จ', 'ดึงข้อมูลใหม่เรียบร้อยแล้ว');
            // Optionally reload the current backlog data
            if (selectedDC.value && selectedStatus.value) {
                await loadData();
            }
        } else {
            showError('ผิดพลาด', result.message || 'ไม่สามารถดึงข้อมูลใหม่ได้');
        }
    } catch (err) {
        showError('ผิดพลาด', 'เกิดข้อผิดพลาดในการดึงข้อมูลใหม่');
        console.error('Error in confirmReload:', err);
    } finally {
        isReloading.value = false;
    }
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
        const searchTerm = searchQuery.value.toLowerCase();
        return (
            (item.cus_name && item.cus_name.toLowerCase().includes(searchTerm)) ||
            (item.po_no && item.po_no.toLowerCase().includes(searchTerm)) ||
            (item.addressbl && item.addressbl.toLowerCase().includes(searchTerm)) ||
            (item.provincebl && item.provincebl.toLowerCase().includes(searchTerm))
        );
    });
});

// Watch for changes in selectedDC and selectedStatus
watch(selectedDC, (val) => {
    localStorage.setItem('backlog_selectedDC', val || '');
});

watch(selectedStatus, (val) => {
    localStorage.setItem('backlog_selectedStatus', val || '');
});

// Watch for changes in backlogData to reset scroll position
watch(backlogData, () => {
    // Reset scroll position when data changes
    scrollTop.value = 0;
    nextTick(() => {
        const container = document.querySelector('.virtual-table-container');
        if (container) {
            container.scrollTop = 0;
        }
    });
});

const hoverCol = ref(null);

// Virtual scrolling properties
const rowHeight = 40; // ความสูงแต่ละแถว (px)
const visibleRows = 20; // จำนวนแถวที่แสดงพร้อมกัน
const scrollTop = ref(0);
const containerHeight = ref(0);

// คำนวณแถวที่ควรแสดงจาก scroll position
const virtualScrollData = computed(() => {
    if (!filteredBacklogData.value) return [];
    
    const startIndex = Math.floor(scrollTop.value / rowHeight);
    const endIndex = Math.min(startIndex + visibleRows, filteredBacklogData.value.length);
    
    return filteredBacklogData.value.slice(startIndex, endIndex).map((item, index) => ({
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
    if (!filteredBacklogData.value) return 0;
    const totalHeight = filteredBacklogData.value.length * rowHeight;
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
