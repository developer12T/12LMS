<template>
    <div class="w-full px-4" style="max-width: calc(100vw - 100px);">
        <div class="space-y-6">

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 py-3">
                <div class="flex flex-row flex-wrap justify-between items-end gap-x-4 gap-y-2">
                    <div class="flex flex-row flex-wrap justify-end items-center gap-x-4 gap-y-2">
                        <button
                            class="flex items-center justify-center bg-white border border-[#00569D] text-[#00569D] hover:bg-[#00569D] hover:text-white rounded-full shadow w-8 h-8 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            @click="backtomainpage" title="ย้อนกลับ">
                            <Icon icon="mdi:arrow-left" class="w-4 h-4" />
                        </button>
                        <span
                            class="inline-flex items-center px-3 py-1 rounded text-sm font-semibold bg-gray-50 text-[#0369A1] shadow">
                            <Icon icon="mdi:package-variant" class="w-6 h-6 mr-2" />
                            {{ productCode }} {{ productName }}
                        </span>
                        <span class="flex flex-row gap-2 ml-2">
                            <span
                                class="bg-blue-50 rounded px-4 py-1 text-blue-900 text-xs md:text-sm flex items-center gap-1 shadow">
                                <span class="font-semibold">Total</span> {{ orderSummary.total }} CTN
                            </span>
                            <span
                                class="bg-green-50 rounded px-4 py-1 text-green-900 text-xs md:text-sm flex items-center gap-1 shadow">
                                <span class="font-semibold">STOCK</span> {{ orderSummary.stock }}
                            </span>
                            <span
                                class="bg-yellow-50 rounded px-4 py-1 text-yellow-900 text-xs md:text-sm flex items-center gap-1 shadow">
                                <span class="font-semibold">Diff</span> {{ orderSummary.diff }}
                            </span>
                        </span>
                    </div>
                    <div class="flex flex-row flex-wrap justify-end items-end gap-x-4 gap-y-2">
                        <div class="flex flex-col ">
                            <label class="block text-xs font-medium mb-1 flex items-center">
                                <Icon icon="mdi:calendar" class="w-4 h-4 text-[#00569D] mr-1" />
                                กำหนดส่ง
                            </label>
                            <div class="flex items-center gap-2 px-2">
                                <input type="date" v-model="dateStart"
                                    class="text-xs border rounded px-2 py-1 bg-white focus:border-[#00569D] focus:ring-1 focus:ring-[#00569D]" />
                                <span class="mx-1 text-gray-400">-</span>
                                <input type="date" v-model="dateEnd"
                                    class="text-xs border rounded px-2 py-1 bg-white focus:border-[#00569D] focus:ring-1 focus:ring-[#00569D]" />
                            </div>
                        </div>

                        <!-- ปุ่มค้นหา -->
                        <div class="flex-shrink-0 self-end">
                            <button type="submit"
                                class="flex items-center gap-1 bg-[#8CB4D5] hover:bg-[#6B9AC4] text-white text-xs font-medium rounded px-4 py-1.5 transition-colors shadow min-w-[80px] justify-center">
                                <Icon icon="mdi:magnify" class="w-4 h-4" />
                                ค้นหา
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col md:flex-row gap-4">
            <!-- Main Content -->
            <section class="flex-1 p-2">
                <div class="rounded-lg shadow border border-gray-200 overflow-x-auto overflow-y-auto" style="max-height: calc(100vh - 140px);">
                    <table class="min-w-full text-sm p-2" style="max-height: calc(100vh - 140px);">
                        <thead class="bg-gray-100 sticky top-0"> 
                            <tr>
                                <th class="px-3 py-2 text-center font-semibold">คลัง</th>
                                <th class="px-3 py-2 text-center font-semibold">เลขที่ใบสั่งซื้อ</th>
                                <th class="px-3 py-2 text-center font-semibold">วันที่เปิด SR</th>
                                <th class="px-3 py-2 text-center font-semibold">กำหนดส่ง</th>
                                <th class="px-3 py-2 text-center font-semibold">รหัสลูกค้า</th>
                                <th class="px-3 py-2 text-left font-semibold">ชื่อลูกค้า</th>
                                <th class="px-3 py-2 text-right font-semibold">ยอดตามบิล</th>
                                <th class="px-3 py-2 text-center font-semibold">หน่วยนับ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(order, idx) in filteredOrderDetails" :key="idx"
                                :class="'transition-colors ' + (idx % 2 === 1 ? 'bg-gray-50' : 'bg-white') + ' hover:bg-blue-50'">
                                <td class="px-3 py-1 text-center">{{ order.warehouse }}</td>
                                <td class="px-3 py-1 text-center">{{ order.orderNo }}</td>
                                <td class="px-3 py-1 text-center">{{ order.srDate }}</td>
                                <td class="px-3 py-1 text-center">{{ order.deliveryDate }}</td>
                                <td class="px-3 py-1 text-center">{{ order.customerCode }}</td>
                                <td class="px-3 py-1 text-left">{{ order.customerName }}</td>
                                <td class="px-3 py-1 text-right">{{ order.billQty }}</td>
                                <td class="px-3 py-1 text-center">{{ order.unit }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

const route = useRoute();
const productCode = route.params.productCode;
const productName = route.query.productName;

const dateStart = ref('');
const dateEnd = ref('');

// mock order details (เหมือนใน planView.vue)
const orderDetails = ref([
    { warehouse: '110', orderNo: '650722070', srDate: '2022-07-29', deliveryDate: '2022-08-01', customerCode: '15000409', customerName: 'ประเสริฐ เพิ่มสิริบัญญา(กิมเอ็งพานิช)', billQty: 5, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    { warehouse: '110', orderNo: '650723096', srDate: '2022-07-28', deliveryDate: '2022-08-02', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
    // ... เพิ่มข้อมูล mock ตามต้องการ ...
]);

const filteredOrderDetails = computed(() => {
    if (!dateStart.value || !dateEnd.value) return orderDetails.value;
    return orderDetails.value.filter(order => {
        return order.deliveryDate >= dateStart.value && order.deliveryDate <= dateEnd.value;
    });
});

const orderSummary = computed(() => {
    // mock summary
    return { total: 30, stock: 351, diff: 289 };
});

const router = useRouter();
function backtomainpage() {
  router.push('/tms/report/plan');
}
</script>