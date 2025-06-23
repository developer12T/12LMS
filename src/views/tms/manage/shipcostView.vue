<template>
    <div class="flex-1 p-6 bg-gray-50 min-h-screen">
        <!-- Page Header -->
        <div class="mb-6">
            <nav class="flex mb-4" aria-label="Breadcrumb">
                <ol class="inline-flex items-center space-x-1 md:space-x-3">
                    <li class="inline-flex items-center">
                        <router-link to="/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-[#00569D]">
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
                            <span class="ml-1 text-sm font-medium text-[#00569D] md:ml-2">การจัดการค่าขนส่ง</span>
                        </div>
                    </li>
                </ol>
            </nav>           
        </div>

        <!-- Filter and Action Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <!-- Filter Section -->
                <div class="flex flex-col sm:flex-row gap-3 flex-1">
                    <div class="flex-1 min-w-0">
                        <label for="mh-select" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            ศูนย์กระจายสินค้า
                        </label>
                        <select id="mh-select"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors">
                            <option selected>101-ศุนย์กระจายสินค้านครปฐม</option>
                            <option value="US">...</option>
                        </select>
                    </div>

                    <div class="flex-1 min-w-0">
                        <label for="status-select" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            จากวันที่
                        </label>
                        <select id="status-select"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors">
                            <option selected>ทุกสถานะ</option>
                            <option value="US">...</option>
                        </select>
                    </div>
                    <div class="flex-1 min-w-0">
                        <label for="status-select" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            ถึงวันที่
                        </label>
                        <select id="status-select"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors">
                            <option selected>ทุกสถานะ</option>
                            <option value="US">...</option>
                        </select>
                    </div>
                    <div class="flex-1 min-w-0">
                        <label for="status-select" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            เส้นทางขนส่ง
                        </label>
                        <select id="status-select"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors">
                            <option selected>ทุกสถานะ</option>
                            <option value="US">...</option>
                        </select>
                    </div>
                </div>
                <!-- Action Buttons -->
                <div class="flex flex-row gap-3 flex-shrink-0">
                    <button type="button"
                        class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-6 py-2 min-w-[140px] text-center inline-flex items-center justify-center dark:focus:ring-green-800 transition-colors">
                        <Icon icon="file-icons:microsoft-excel" width="20" height="20" class="mr-2" />
                        Export Excel
                    </button>
                    <button type="button"
                        class="text-white bg-[#00569D] hover:bg-[#004080] focus:ring-4 focus:ring-[#00569D]/30 font-medium rounded-lg text-sm px-6 py-2 min-w-[140px] dark:bg-[#00569D] dark:hover:bg-[#004080] focus:outline-none dark:focus:ring-[#00569D]/30 transition-colors inline-flex items-center justify-center">
                        <Icon icon="mdi:magnify" width="16" height="16" class="mr-2" />
                        ดึงข้อมูล
                    </button>
                </div>
            </div>
        </div>

        <!-- Table Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg" style="max-height: calc(100vh - 300px);">
                <table class="w-full text-xs text-left text-gray-500 dark:text-gray-400 table-auto">
                    <thead
                        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                        <tr>
                            <th scope="col" class="px-2 py-2 text-center w-12">No</th>
                            <th scope="col" class="px-2 py-2 text-center w-16">คลัง</th>
                            <th scope="col" class="px-2 py-2 text-center w-24">วันที่เปิด SR</th>
                            <th scope="col" class="px-2 py-2 text-center w-24">กำหนดส่ง</th>
                            <th scope="col" class="px-2 py-2 text-center w-28">เลขที่ใบสั่งซื้อ</th>
                            <th scope="col" class="px-2 py-2 text-center w-24">รหัสลูกค้า</th>
                            <th scope="col" class="px-2 py-2 w-32">ชื่อลูกค้า</th>
                            <th scope="col" class="px-2 py-2 w-48">สถานที่จัดส่ง</th>
                            <th scope="col" class="px-2 py-2 w-32">จังหวัด</th>
                            <th scope="col" class="px-2 py-2 text-center w-16">เกิน</th>
                            <th scope="col" class="px-2 py-2 text-center w-16">ค้าง FG</th>
                            <th scope="col" class="px-2 py-2 text-center w-16">ค้าง PM</th>
                            <th scope="col" class="px-2 py-2 w-32">สาเหตุ</th>
                            <th scope="col" class="px-2 py-2 w-28">อื่นๆ (ระบุ)</th>
                            <th scope="col" class="px-2 py-2 text-center w-20">เลื่อนส่ง</th>
                            <th scope="col" class="px-2 py-2 text-center w-20">แก้ไข</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in tableData" :key="index"
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td class="px-2 py-1 font-medium text-gray-900 dark:text-white text-center text-xs">
                                {{ item.no }}
                            </td>
                            <td class="px-2 py-1 text-center text-xs whitespace-nowrap">{{ item.warehouse }}</td>
                            <td class="px-2 py-1 text-center text-xs whitespace-nowrap">{{ item.srOpenDate }}</td>
                            <td class="px-2 py-1 text-center text-xs whitespace-nowrap">{{ item.dueDate }}</td>
                            <td class="px-2 py-1 text-center text-xs whitespace-nowrap">
                                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                    {{ item.orderNumber }}
                                </a>
                            </td>
                            <td class="px-2 py-1 text-center text-xs whitespace-nowrap">{{ item.customerCode }}</td>
                            <td class="px-2 py-1 text-xs whitespace-nowrap max-w-32 truncate"
                                :title="item.customerName">
                                {{ item.customerName }}
                            </td>
                            <td class="px-2 py-1 text-xs w-48">
                                <div class="max-w-48 line-clamp-2 text-ellipsis overflow-hidden"
                                    :title="item.deliveryLocation">
                                    {{ item.deliveryLocation }}
                                </div>
                            </td>
                            <td class="px-2 py-1 text-xs whitespace-nowrap max-w-32 truncate" :title="item.province">
                                {{ item.province }}
                            </td>
                            <td class="px-2 py-1 text-center text-xs whitespace-nowrap">
                                <span
                                    :class="item.overdue < 0 ? 'text-red-600 font-semibold' : 'text-yellow-600 font-semibold'">
                                    {{ item.overdue }}
                                </span>
                            </td>
                            <td class="px-2 py-1 text-center text-xs whitespace-nowrap">
                                <span class="text-orange-600 font-semibold">{{ item.pendingFG }}</span>
                            </td>
                            <td class="px-2 py-1 text-center text-xs whitespace-nowrap">
                                <span class="text-purple-600 font-semibold">{{ item.pendingPM }}</span>
                            </td>
                            <td class="px-2 py-1 text-xs">
                                <select
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option selected>เลือกสาเหตุ</option>
                                    <option value="reason1">เหตุผล 1</option>
                                    <option value="reason2">เหตุผล 2</option>
                                </select>
                            </td>
                            <td class="px-2 py-1 text-xs">
                                <input type="text"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="ระบุ...">
                            </td>
                            <td class="px-2 py-1 text-center">
                                <button type="button"
                                    class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 font-medium rounded text-xs p-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                    <Icon icon="mdi:calendar-month-outline" class="w-3 h-3" />
                                </button>
                            </td>
                            <td class="px-2 py-1 text-center">
                                <button type="button"
                                    class="focus:outline-none text-white bg-orange-500 hover:bg-orange-600 focus:ring-2 focus:ring-orange-300 font-medium rounded text-xs px-2 py-1 dark:focus:ring-orange-900">
                                    แก้ไข
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

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
const loadData = () => {
    console.log('Loading data...');
    // Implement data loading logic here
};

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
</script>

<style scoped>

</style>