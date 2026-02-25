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
                            <!-- Summary Section -->
                            <div v-if="creditLimitData.length > 0" class="rounded-xl">
                                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">

                                    <!-- ✅ Total Stores -->
                                    <div
                                        class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-1.5 flex flex-col items-center">
                                        <div
                                            class="bg-blue-100 flex flex-row items-center gap-1 p-1.5 rounded-full mb-2">
                                            <Icon icon="mdi:store" class="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div
                                            class="text-sm font-bold text-gray-800 flex flex-row items-center gap-1 justify-center">
                                            {{ creditLimitData.length }} <div class=" text-gray-500">ร้านค้า</div>
                                        </div>

                                    </div>

                                    <!-- ✅ Total Unpaid Bills -->
                                    <div
                                        class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-1.5 flex flex-col items-center">
                                        <div
                                            class="bg-orange-100 flex flex-row items-center gap-1 p-1.5 rounded-full mb-2">
                                            <Icon icon="mdi:file-document-outline" class="w-4 h-4 text-orange-600" />
                                        </div>
                                        <div
                                            class="text-sm font-bold text-gray-800 flex flex-row items-center gap-1 justify-center">
                                            {{ totalUnpaidBills }} <div class=" text-gray-500">บิลค้างชำระ</div>
                                        </div>

                                    </div>

                                    <!-- ✅ Total CO Bills -->
                                    <div
                                        class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-1.5 flex flex-col items-center">
                                        <div
                                            class="bg-teal-100 flex flex-row items-center gap-1 p-1.5 rounded-full mb-2">
                                            <Icon icon="mdi:truck-delivery-outline" class="w-4 h-4 text-teal-600" />
                                        </div>
                                        <div
                                            class="text-sm font-bold text-gray-800 flex flex-row items-center gap-1 justify-center">
                                            {{ totalCOBills }} <div class=" text-gray-500">CO ค้างส่ง</div>
                                        </div>

                                    </div>

                                    <!-- ✅ Total Unpaid Amount -->
                                    <div
                                        class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-1.5 flex flex-col items-center">
                                        <div
                                            class="bg-red-100 flex flex-row items-center gap-1 p-1.5 rounded-full mb-2">
                                            <Icon icon="mdi:currency-thb" class="w-4 h-4 text-red-600" />
                                        </div>
                                        <div
                                            class="text-sm font-bold text-gray-800 flex flex-row items-center gap-1 justify-center">
                                            {{
                                                formatCurrency(totalUnpaidAmount) }} <div class=" text-gray-500">
                                                เงินค้างชำระ</div>
                                        </div>

                                    </div>

                                    <!-- ✅ Total CO Amount -->
                                    <div
                                        class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-1.5 flex flex-col items-center">
                                        <div
                                            class="bg-purple-100 flex flex-row items-center gap-1 p-1.5 rounded-full mb-2">
                                            <Icon icon="mdi:currency-thb" class="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div
                                            class="text-sm font-bold text-gray-800 flex flex-row items-center gap-1 justify-center">
                                            {{ formatCurrency(totalCOAmount) }} <div class=" text-gray-500">เงิน CO
                                                ค้างส่ง</div>
                                        </div>

                                    </div>

                                </div>
                            </div>
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
                                    <option value="all">ทั้งหมด : ทุก dc</option>
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
                <div v-else-if="!creditLimitData.length && hasLoadedData" class="p-8 text-center">
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
                <div v-else-if="!selectedDC" class="p-8 text-center">
                    <div class="text-gray-500">
                        <Icon icon="mdi:clipboard-text-outline" class="w-12 h-12 mx-auto mb-4" />
                        <p class="text-lg font-medium mb-2">กรุณาเลือกเงื่อนไข</p>
                        <p class="text-sm">เลือก DC แล้วกดปุ่ม "ดึงข้อมูล"</p>
                        <div class="mt-4 flex flex-col items-center space-y-2 text-xs">
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
                <div v-else-if="!hasLoadedData && selectedDC" class="p-8 text-center">
                    <div class="text-gray-500">
                        <Icon icon="mdi:database-search" class="w-12 h-12 mx-auto mb-4" />
                        <p class="text-lg font-medium mb-2">พร้อมดึงข้อมูล</p>
                        <p class="text-sm">กดปุ่ม "ดึงข้อมูล" เพื่อดูรายการ Credit Limit</p>
                        <div class="mt-4 text-xs text-gray-400 flex flex-col items-center space-y-1">
                            <div>
                                <span class="font-medium text-gray-600">DC:</span>
                                <span>{{ getSelectedDCName() }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Data Table with Custom Scrollbar -->
                <div v-else-if="creditLimitData.length > 0"
                    class="relative shadow-md sm:rounded-lg custom-scrollbar p-2 overflow-x-auto overflow-y-hidden"
                    style="max-height: calc(100vh - 220px);">

                    <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 pt-2">
                        <div class="flex items-center justify-center flex-row">
                            <!-- Record Count -->
                            <ResultCount :label="'ผลลัพธ์:'"
                                :current="searchQuery ? filteredCreditLimitData.length : null"
                                :total="creditLimitData.length" icon="mdi:clipboard-list-outline" iconColor="#00569D"
                                class="" />
                        </div>
                        <div class="flex items-center space-x-4">

                            <div class=" flex flex-row gap-1 items-center">
                                <button type="button" @click="exportToExcel"
                                    :disabled="!(filteredCreditLimitData?.length)"
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
                    <div class="custom-scrollbar rounded-t-lg overflow-auto mt-2" style="height: calc(100vh - 280px);">
                        <table
                            class="w-full text-xs text-left text-gray-500 dark:text-gray-400 border-collapse border border-gray-300 dark:border-gray-600">
                            <thead
                                class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">
                                <tr>
                                    <th scope="col" colspan="1" rowspan="2"
                                        class="px-1 py-1 text-center w-6 border border-gray-300 dark:border-gray-600">No
                                    </th>
                                    <th scope="col" colspan="1" rowspan="2"
                                        class="px-1 py-1 text-center w-8 border border-gray-300 dark:border-gray-600">
                                        เขต
                                    </th>
                                    <th scope="col" colspan="1" rowspan="2"
                                        class="px-1 py-1 text-center w-8 border border-gray-300 dark:border-gray-600">
                                        คลัง</th>
                                    <th scope="col" colspan="1" rowspan="2"
                                        class="px-1 py-1 text-center w-16 border border-gray-300 dark:border-gray-600">
                                        รหัสลูกค้า</th>
                                    <th scope="col" colspan="1" rowspan="2"
                                        class="px-1 py-1 w-2 border border-gray-300 dark:border-gray-600">
                                        ชื่อร้าน</th>
                                    <th scope="col" colspan="3" rowspan="1"
                                        class="px-1 py-1 text-center w-20 border border-gray-300 dark:border-gray-600">
                                        รายการค้างชำระ (จำนวนบิล)</th>
                                    <th scope="col" colspan="3" rowspan="1"
                                        class="px-1 py-1 text-center w-20 border border-gray-300 dark:border-gray-600">
                                        co ค้างส่ง</th>
                                </tr>
                                <tr>
                                    <th scope="col"
                                        class="px-1 py-1 text-center w-20 border border-gray-300 dark:border-gray-600">
                                        จำนวนบิล</th>
                                    <th scope="col"
                                        class="px-1 py-1 text-center w-20 border border-gray-300 dark:border-gray-600">
                                        จำนวนเงิน</th>
                                    <th scope="col"
                                        class="px-1 py-1 text-center w-20 border border-gray-300 dark:border-gray-600">
                                        เกินกำหนด</th>
                                    <th scope="col"
                                        class="px-1 py-1 text-center w-20 border border-gray-300 dark:border-gray-600">
                                        จำนวนบิล</th>
                                    <th scope="col"
                                        class="px-1 py-1 text-center w-20 border border-gray-300 dark:border-gray-600">
                                        จำนวนเงิน</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, index) in filteredCreditLimitData" :key="row.dap_customer"
                                    class="hover:bg-gray-50 transition-colors cursor-pointer"
                                    @click="openBillDetail(row)">
                                    <td class="px-1 py-1 border border-gray-300 text-center">{{ index + 1 }}</td>
                                    <td class="px-1 py-1 border border-gray-300 text-center">{{ row.dap_area }}</td>
                                    <td class="px-1 py-1 border border-gray-300 text-center">{{ row.warehouse }}</td>
                                    <td class="px-1 py-1 border border-gray-300 text-center">{{ row.dap_customer }}</td>
                                    <td class="px-1 py-1 border border-gray-300">{{ row.dap_name }}</td>
                                    <td class="px-1 py-1 border border-gray-300 text-center">{{ row.count_inv }}</td>
                                    <td class="px-1 py-1 border border-gray-300 text-right">{{
                                        formatCurrency(row.sum_inv) }}
                                    </td>
                                    <td class="px-1 py-1 border border-gray-300 text-center"
                                        :class="row.inv_days_from_today < 0 || row.inv_days_from_today > 0 ? 'text-red-500 bg-red-100' : ''">{{
                                            row.inv_days_from_today < 0 ? splitNumber(row.inv_days_from_today) + ' วัน' :
                                            (row.inv_days_from_today  ||  '-' ) }}</td>
                                    <td class="px-1 py-1 border border-gray-300 text-center">{{ row.count_co }}</td>
                                    <td class="px-1 py-1 border border-gray-300 text-right">{{
                                        formatCurrency(row.sum_co) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Modal -->
            <div v-if="showModal"
                class="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 top-0  backdrop-blur-sm"
                @click.self="showModal = false">
                <div
                    class="bg-white rounded-xl shadow-2xl max-w-6xl w-full h-[90vh] overflow-hidden transform transition-all  duration-300 scale-100">
                    <!-- Header -->
                    <div class="bg-gradient-to-r from-[#00569D] to-[#004080] text-white py-2 px-6">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-3">

                                <div>
                                    <span class="text-md font-medium">รายละเอียด {{ selectedRow.dap_customer }} : {{
                                        selectedRow.dap_name || selectedRow.dap_customer || 'ไม่ระบุ' }}</span>
                                </div>
                            </div>
                            <button @click="showModal = false"
                                class="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-6 overflow-y-hidden space-y-6">
                        <!-- ตารางรายการค้างชำระ -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-y-hidden">
                            <div
                                class="bg-gradient-to-r from-[#6495ed] to-[#6495ed] text-white text-sm py-2 px-4 font-normal rounded-t-lg -mt-4 -mx-4 mb-4">
                                <div class="flex items-center gap-2">
                                    <Icon icon="mdi:file-document-outline" class="w-4 h-4" />
                                    รายการค้างชำระ ({{ selectedRow.list_inv?.length || 0 }} รายการ)
                                </div>
                            </div>
                            <div class="overflow-x-auto overflow-y-auto" style="max-height: calc(100vh - 500px);">
                                <table class="min-w-full text-xs text-gray-700 border-collapse border border-gray-300"
                                    style="max-height: calc(100vh - 500px);">
                                    <thead>
                                        <tr class="bg-gray-100 sticky top-0">
                                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center">
                                                เลขที่ inv.</th>
                                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center">
                                                วันที่ Invoice</th>
                                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center">
                                                ครบกำหนด</th>
                                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center">
                                                จำนวนเงิน</th>
                                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center">
                                                เกินกำหนด</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="!selectedRow.list_inv" class="text-center py-12">
                                            <td colspan="4" class="text-center py-12">
                                                <p class="text-gray-500 text-sm">ไม่มีข้อมูลรายการค้างชำระ</p>
                                            </td>
                                        </tr>
                                        <tr v-else v-for="(bill, index) in selectedRow.list_inv"
                                            :key="bill.dio_inv_order"
                                            class="hover:bg-gray-50 transition-colors cursor-pointer">
                                            <td class="px-3 py-2 border border-gray-300 text-center">
                                                <div class="font-medium text-gray-900">{{ bill.dio_inv_order?.trim()
                                                }}</div>
                                            </td>
                                            <td class="px-3 py-2 border border-gray-300 text-center">
                                                <div class="text-gray-700">{{
                                                    formatDateFromYYYYMMDD(bill.dio_inv_date) }}</div>
                                            </td>
                                            <td class="px-3 py-2 border border-gray-300 text-center">
                                                <div class="text-gray-700">{{
                                                    formatDateFromYYYYMMDD(bill.dio_due_date) }}</div>
                                            </td>
                                            <td class="px-3 py-2 border border-gray-300 text-right">
                                                <div class="text-gray-700 font-medium">{{ bill.dio_amount }}</div>
                                            </td>
                                            <td class="px-3 py-2 border border-gray-300 text-center"
                                                :class="bill.days_from_today < 0 ? 'text-red-500 bg-red-100' : ''">
                                                <div >{{
                                                    bill.days_from_today < 0 ? splitNumber(bill.days_from_today) + ' วัน'
                                                        : '-' }}</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- ตารางรายการค้างส่ง -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 ">
                            <div
                                class="bg-gradient-to-r from-[#138496] to-[#138496] text-white py-2 px-4 text-sm font-normal rounded-t-lg -mt-4 -mx-4 mb-4">
                                <div class="flex items-center gap-2">
                                    <Icon icon="mdi:truck-delivery-outline" class="w-4 h-4" />
                                    รายการค้างส่ง ({{ selectedRow.list_co?.length || 0 }} รายการ)
                                </div>
                            </div>
                            <div class="overflow-x-auto overflow-y-auto" style="max-height: calc(100vh - 500px);">
                                <table class="min-w-full text-xs text-gray-700 border-collapse border border-gray-300">
                                    <thead>
                                        <tr class="bg-gray-100 sticky top-0">
                                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center">
                                                เลขที่ CO</th>
                                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center">
                                                วันที่ CO</th>
                                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center">
                                                ครบกำหนด</th>
                                            <th class="px-3 py-2 border border-gray-300 font-semibold text-center">
                                                จำนวนเงิน</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="!selectedRow.list_co" class="text-center py-12">
                                            <td colspan="4" class="text-center py-12">
                                                <p class="text-gray-500 text-sm">ไม่มีข้อมูลรายการค้างส่ง</p>
                                            </td>
                                        </tr>
                                        <tr v-else v-for="(co, index) in selectedRow.list_co" :key="co.dco_co_order"
                                            class="hover:bg-gray-50 transition-colors cursor-pointer">
                                            <td class="px-3 py-2 border border-gray-300 text-center">
                                                {{ co.dco_co_order?.trim() }}
                                            </td>
                                            <td class="px-3 py-2 border border-gray-300 text-center">
                                                <div class="text-gray-700">{{ formatDateFromYYYYMMDD(co.dco_co_date)
                                                }}</div>
                                            </td>
                                            <td class="px-3 py-2 border border-gray-300 text-center">
                                                <div class="text-gray-700">{{
                                                    formatDateFromYYYYMMDD(co.dco_send_date) }}</div>
                                            </td>
                                            <td class="px-3 py-2 border border-gray-300 text-right">
                                                <div class="text-gray-700 font-medium">{{ co.dco_amount }}</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div v-if="(!selectedRow.list_inv || selectedRow.list_inv.length === 0) &&
                            (!selectedRow.list_co || selectedRow.list_co.length === 0)" class="text-center py-12">
                            <div
                                class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p class="text-gray-500 text-sm">ไม่มีข้อมูลรายการค้างชำระและค้างส่ง</p>
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
import { useReportTmsStore } from '@/stores/modules/reportTms';
import { showError, showWarning, showSuccess } from '@/utils/toast';
import * as XLSX from 'xlsx';
import ResultCount from '@/components/ResultCount.vue';


// Stores
const reportTmsStore = useReportTmsStore();

// Reactive data
const selectedDC = ref('');
const hasLoadedData = ref(false);
const searchQuery = ref('');

// State สำหรับ DC loading
const isLoadingTransport = computed(() => reportTmsStore.loadingNoBillWhList);
const transportError = computed(() => reportTmsStore.errorNoBillWhList);

// Computed properties from stores
const isLoading = computed(() => reportTmsStore.loadingCreditLimit);
const error = computed(() => reportTmsStore.errorCreditLimit);
const creditLimitData = computed(() => reportTmsStore.creditLimitData);

// Summary computed properties
const totalUnpaidBills = computed(() => {
    return creditLimitData.value.reduce((total, item) => total + (item.count_inv || 0), 0);
});

const totalUnpaidAmount = computed(() => {
    return creditLimitData.value.reduce((total, item) => total + (item.sum_inv || 0), 0);
});

const totalCOBills = computed(() => {
    return creditLimitData.value.reduce((total, item) => total + (item.count_co || 0), 0);
});

const totalCOAmount = computed(() => {
    return creditLimitData.value.reduce((total, item) => total + (item.sum_co || 0), 0);
});

// Load data on component mount
onMounted(() => {
    selectedDC.value = localStorage.getItem('creditlimit_selectedDC') || '';
    reportTmsStore.fetchNoBillWhList();
});





// Function to format currency
function formatCurrency(amount) {
    if (!amount) return '0.00';
    return Number(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Function to format date from YYYYMMDD to DD/MM/YYYY
function formatDateFromYYYYMMDD(dateStr) {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    return `${dateStr.slice(6, 8)}/${dateStr.slice(4, 6)}/${dateStr.slice(0, 4)}`;
}

// Function to split number and remove minus sign
function splitNumber(num) {
    if (!num) return '0';
    return Math.abs(num).toString();
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
    const selectedTransport = (reportTmsStore.nobillWhList.data || []).find(t => t.who_no === selectedDC.value);
    if (selectedTransport) {
        console.log('Selected transport:', selectedTransport);
    }
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
        item.dap_area || '',
        item.warehouse || '',
        item.dap_customer || '',
        item.dap_name || '',
        item.count_inv || '',
        formatCurrency(item.sum_inv) || '',
        item.count_co || '',
        formatCurrency(item.sum_co) || ''
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
    const selectedTransport = (reportTmsStore.nobillWhList.data || []).find(t => t.who_no === selectedDC.value);
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
            (item.dap_area && item.dap_area.toLowerCase().includes(searchTerm)) ||
            (item.warehouse && item.warehouse.toString().toLowerCase().includes(searchTerm)) ||
            (item.dap_customer && item.dap_customer.toLowerCase().includes(searchTerm)) ||
            (item.dap_name && item.dap_name.toLowerCase().includes(searchTerm)) ||
            (item.sum_inv && item.sum_inv.toString().toLowerCase().includes(searchTerm)) ||
            (item.sum_co && item.sum_co.toString().toLowerCase().includes(searchTerm))
        );
    });
});



watch([selectedDC], ([dc]) => {
    localStorage.setItem('creditlimit_selectedDC', dc || '');
});





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
</style>
