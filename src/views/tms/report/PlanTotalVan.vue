<template>
  <PageHeaderSubMenu :breadcrumbs="[
    { label: 'วางแผนรวม', icon: 'mdi:home', to: '/tms/report/plan-total' },
    { label: 'รายละเอียด', to: '/tms/report/plan-total-detail' },
    { label: columnLabel, to: '/tms/report/plan-total-co-list' },
    { label: 'หน่วยรถ' }
  ]" />
  <div class="w-full px-4" style="max-width: calc(100vw - 100px);">
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 py-3">
        <div class="flex flex-row flex-wrap justify-between items-end gap-x-4 gap-y-2">
          <div class="flex flex-row flex-wrap justify-end items-center gap-x-4 gap-y-2">
            <button
              class="flex items-center justify-center bg-white border border-[#00569D] text-[#00569D] hover:bg-[#00569D] hover:text-white rounded-full shadow w-8 h-8 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
              @click="goBack" title="ย้อนกลับ">
              <Icon icon="mdi:arrow-left" class="w-4 h-4" />
            </button>
            <span
              class="inline-flex items-center px-3 py-1 rounded text-sm font-semibold bg-gray-50 text-[#0369A1] shadow">
              <Icon icon="mdi:truck" class="w-6 h-6 mr-2" />
              หน่วยรถ
            </span>
            <span class="flex flex-row gap-2 ml-2">
              <span
                class="bg-blue-50 rounded px-4 py-1 text-blue-900 text-xs md:text-sm flex items-center gap-1 shadow">
                <span class="font-semibold">รหัสสินค้า</span> {{ productCode }}
              </span>
              <span
                class="bg-green-50 rounded px-4 py-1 text-green-900 text-xs md:text-sm flex items-center gap-1 shadow">
                <span class="font-semibold">ชื่อสินค้า</span> {{ productName }}
              </span>
            </span>
          </div>
          <div class="flex flex-row flex-wrap justify-end items-end gap-x-4 gap-y-2">
            <div class="flex flex-col ">
              <label class="block text-xs font-medium mb-1 flex items-center">
                <Icon icon="mdi:calendar" class="w-4 h-4 text-[#00569D] mr-1" />
                วันที่เบิก
              </label>
              <div class="flex items-center gap-2 px-2">
                <input type="date" v-model="dateStart"
                  class="text-xs border rounded px-2 py-1 bg-white focus:border-[#00569D] focus:ring-1 focus:ring-[#00569D]" />
                <span class="mx-1 text-gray-400">-</span>
                <input type="date" v-model="dateEnd"
                  class="text-xs border rounded px-2 py-1 bg-white focus:border-[#00569D] focus:ring-1 focus:ring-[#00569D]" />
              </div>
            </div>
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
      <section class="flex-1 p-2">
        <div class="rounded-lg shadow border border-gray-200 overflow-x-auto overflow-y-auto" style="max-height: calc(100vh - 140px);">
          <table class="min-w-full text-sm p-2" style="max-height: calc(100vh - 140px);">
            <thead class="bg-gray-100 sticky top-0">
              <tr>
                <th class="px-3 py-2 text-center font-semibold">ศูนย์กระจายสินค้า</th>
                <th class="px-3 py-2 text-center font-semibold">เลข Order</th>
                <th class="px-3 py-2 text-center font-semibold">เขต</th>
                <th class="px-3 py-2 text-center font-semibold">วันที่เบิก</th>
                <th class="px-3 py-2 text-center font-semibold">กำหนดส่ง</th>
                <th class="px-3 py-2 text-center font-semibold">รหัสสินค้า</th>
                <th class="px-3 py-2 text-center font-semibold">จำนวน/หีบ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in filteredVanDetails" :key="idx"
                :class="'transition-colors ' + (idx % 2 === 1 ? 'bg-gray-50' : 'bg-white') + ' hover:bg-blue-50'">
                <td class="px-3 py-1 text-center">{{ item.warehouse }}</td>
                <td class="px-3 py-1 text-center">{{ item.orderNo }}</td>
                <td class="px-3 py-1 text-center">{{ item.zone }}</td>
                <td class="px-3 py-1 text-center">{{ item.pickupDate }}</td>
                <td class="px-3 py-1 text-center">{{ item.deliveryDate }}</td>
                <td class="px-3 py-1 text-center">{{ item.productCode }}</td>
                <td class="px-3 py-1 text-center">{{ item.quantity }}</td>
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
import PageHeaderSubMenu from '@/components/PageHeaderSubMenu.vue';

const route = useRoute();
const router = useRouter();

const productCode = route.query.productCode || '';
const productName = route.query.productName || '';
const column = route.query.column || '';
const vanUnit = route.query.vanUnit || '1';

// แปลง column key เป็นชื่อภาษาไทย
const columnLabels = {
  'sarakham': 'สารคาม',
  'nakornpathom': 'นครปฐม',
  'balance12t': 'Balance 12T',
  'balance6t': 'Balance 6T',
  'balance3t': 'Balance 3T',
  'balance1t': 'Balance 1T',
  'balance500kg': 'Balance 500kg',
  'balance250kg': 'Balance 250kg',
  'balance100kg': 'Balance 100kg',
  'balance50kg': 'Balance 50kg',
  'balance25kg': 'Balance 25kg',
  'balance10kg': 'Balance 10kg',
  'balance5kg': 'Balance 5kg',
  'balance1kg': 'Balance 1kg'
};

const columnLabel = columnLabels[column] || column;

const dateStart = ref('');
const dateEnd = ref('');

// Mock data สำหรับ van details
const vanDetails = ref([
  { warehouse: '102', orderNo: 'W650741605', zone: 'N/E 221', pickupDate: '20220726', deliveryDate: '20220729', productCode: productCode, quantity: 5 },
  { warehouse: '102', orderNo: 'W650741606', zone: 'N/E 222', pickupDate: '20220726', deliveryDate: '20220729', productCode: productCode, quantity: 3 },
  { warehouse: '102', orderNo: 'W650741607', zone: 'N/E 223', pickupDate: '20220726', deliveryDate: '20220729', productCode: productCode, quantity: 2 },
  { warehouse: '102', orderNo: 'W650741608', zone: 'N/E 224', pickupDate: '20220726', deliveryDate: '20220729', productCode: productCode, quantity: 4 },
  { warehouse: '102', orderNo: 'W650741609', zone: 'N/E 225', pickupDate: '20220726', deliveryDate: '20220729', productCode: productCode, quantity: 1 },
]);

const filteredVanDetails = computed(() => {
  if (!dateStart.value || !dateEnd.value) return vanDetails.value;
  return vanDetails.value.filter(item => {
    return item.pickupDate >= dateStart.value && item.pickupDate <= dateEnd.value;
  });
});

function goBack() {
  router.back();
}
</script>

<style scoped>
.bg-blue-50 { background-color: #eff6ff !important; }
</style> 