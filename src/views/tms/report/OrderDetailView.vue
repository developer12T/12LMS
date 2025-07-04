<template>
  <div class="max-w-5xl mx-auto p-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
      <div class="font-bold text-lg md:text-xl text-blue-700">
        รายการ: {{ productCode }} {{ productName }}
      </div>
      <div class="bg-blue-50 rounded px-4 py-1 text-blue-900 text-xs md:text-sm flex items-center gap-2 shadow-sm">
        <span class="font-semibold">Total</span> {{ orderSummary.total }} CTN
        <span class="font-semibold">STOCK</span> {{ orderSummary.stock }}
        <span class="font-semibold">Diff</span> {{ orderSummary.diff }}
      </div>
    </div>
    <div class="flex flex-col md:flex-row gap-4">
      <!-- Sidebar Filter -->
      <aside class="w-56 bg-gray-50 border-r border-gray-200 flex flex-col items-center justify-center p-6 gap-2">
        <div class="flex items-center gap-2 mb-2">
          <Icon icon="mdi:calendar" class="text-blue-600 text-xl" />
          <span class="font-semibold text-sm text-blue-700">กำหนดส่ง</span>
        </div>
        <VueDatePicker v-model="dateRange" range format="yyyyMMdd" :clearable="false" :enable-time-picker="false" class="mb-2 w-full" />
        <div class="text-xs text-gray-500 text-center">คลิกเลือกกรองช่วงวันกำหนดส่งได้</div>
      </aside>
      <!-- Main Content -->
      <section class="flex-1 p-2">
        <div class="rounded-lg shadow border border-gray-200 overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-100">
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
              <tr v-for="(order, idx) in filteredOrderDetails" :key="idx" :class="'transition-colors ' + (idx % 2 === 1 ? 'bg-gray-50' : 'bg-white') + ' hover:bg-blue-50'">
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
    <div class="flex justify-end mt-6">
      <router-link to="/tms/report/plan" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg shadow transition-all">กลับ</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import VueDatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';

const route = useRoute();
const productCode = route.params.productCode;
const productName = route.query.productName;

// mock order details (เหมือนใน planView.vue)
const orderDetails = ref([
  { warehouse: '110', orderNo: '650722070', srDate: '20220729', deliveryDate: '20220801', customerCode: '15000409', customerName: 'ประเสริฐ เพิ่มสิริบัญญา(กิมเอ็งพานิช)', billQty: 5, unit: 'CTN' },
  { warehouse: '110', orderNo: '650723096', srDate: '20220728', deliveryDate: '20220802', customerCode: '18140006', customerName: 'ร้านแจ๋ว', billQty: 1, unit: 'CTN' },
  // ... เพิ่มข้อมูล mock ตามต้องการ ...
]);

const dateRange = ref([null, null]);
const filteredOrderDetails = computed(() => {
  if (!dateRange.value || !dateRange.value[0] || !dateRange.value[1]) return orderDetails.value;
  const [start, end] = dateRange.value;
  return orderDetails.value.filter(order => {
    return order.deliveryDate >= start && order.deliveryDate <= end;
  });
});

const orderSummary = computed(() => {
  // mock summary
  return { total: 30, stock: 351, diff: 289 };
});
</script> 