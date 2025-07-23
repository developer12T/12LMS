<template>
  <PageHeaderSubMenu :breadcrumbs="[
    { label: 'วางแผนรวม', icon: 'mdi:home', to: '/tms/report/plan-total' },
    { label: 'รายละเอียด', to: '/tms/report/plan-total-detail' },
    { label: breadcrumbLabel }
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
                <th class="px-3 py-2 text-center font-semibold">คลัง</th>
                <th class="px-3 py-2 text-center font-semibold">เลขที่ใบสั่งซื้อ</th>
                <th class="px-3 py-2 text-center font-semibold">วันที่เปิด SR</th>
                <th class="px-3 py-2 text-center font-semibold">กำหนดส่ง</th>
                <th class="px-3 py-2 text-center font-semibold">รหัสลูกค้า</th>
                <th class="px-3 py-2 text-left font-semibold">ชื่อลูกค้า</th>
                <th class="px-3 py-2 text-right font-semibold">ยอดตามบิล</th>
                <th class="px-3 py-2 text-center font-semibold">หน่วยรถ</th>
                <th class="px-3 py-2 text-center font-semibold">หน่วยนับ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(order, idx) in filteredOrderDetails" :key="idx"
                :class="'transition-colors ' + (idx % 2 === 1 ? 'bg-gray-50' : 'bg-white') + ' hover:bg-blue-50'">
                <td class="px-3 py-1 text-center">{{ order.warehouse }}</td>
                <td class="px-3 py-1 text-center text-blue-600 underline cursor-pointer" @click.stop="handleCellClick(order, 'orderNo')">{{ order.orderNo }}</td>
                <td class="px-3 py-1 text-center">{{ order.srDate }}</td>
                <td class="px-3 py-1 text-center">{{ order.deliveryDate }}</td>
                <td class="px-3 py-1 text-center">{{ order.customerCode }}</td>
                <td class="px-3 py-1 text-left">{{ order.customerName }}</td>
                <td class="px-3 py-1 text-right text-blue-600 underline cursor-pointer" @click.stop="handleCellClick(order, 'billQty')">{{ order.billQty }}</td>
                <td class="px-3 py-1 text-center text-blue-600 underline cursor-pointer" @click.stop="handleVanClick(order)">{{ order.vanUnit }}</td>
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
import PageHeaderSubMenu from '@/components/PageHeaderSubMenu.vue';

const route = useRoute();
const router = useRouter();

const productCode = route.query.productCode || '';
const productName = route.query.productName || '';
const column = route.query.column || '';

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

// สร้าง computed property สำหรับ breadcrumb label
const breadcrumbLabel = computed(() => {
  return columnLabel === "lastMonth" ? "ออร์เดอร์เดือนก่อนหน้า" : "ออร์เดอร์เดือนปัจจุบัน";
});

const dateStart = ref('');
const dateEnd = ref('');

const orderSummary = computed(() => {
  // mock summary
  return { total: 521, stock: 815, diff: 289 };
});

const searchQuery = ref('');

const orderDetails = ref([
  { warehouse: '102', orderNo: '20220706', srDate: '20220803', deliveryDate: '650751006', customerCode: '46150012', customerName: 'คุณวัชรกร ศรีลาคะ (จรวด)', billQty: 2, unit: 'CTN', vanUnit: 1 },
  { warehouse: '102', orderNo: '20220708', srDate: '20220803', deliveryDate: '650751009', customerCode: '46000015', customerName: 'นายทัพพัฒน์ มิตรสัมพันธ์', billQty: 1, unit: 'CTN', vanUnit: 1 },
  { warehouse: '102', orderNo: '20220710', srDate: '20220803', deliveryDate: '650751014', customerCode: '44130010', customerName: 'เจ้าหญิง ตลาดบรรบือ', billQty: 20, unit: 'CTN', vanUnit: 1 },
  { warehouse: '102', orderNo: '20220721', srDate: '20220803', deliveryDate: '650751036', customerCode: '44000011', customerName: 'บริษัท ฟาร์มมาร์ท โมเดิร์นเทรด จำกัด', billQty: 8, unit: 'CTN', vanUnit: 1 },
  { warehouse: '102', orderNo: '20220725', srDate: '20220803', deliveryDate: '650751042', customerCode: '44000011', customerName: 'แผงเจริญนา (A10)', billQty: 2, unit: 'CTN', vanUnit: 1 },
  { warehouse: '102', orderNo: '20220726', srDate: '20220803', deliveryDate: '650751045', customerCode: '46000037', customerName: 'พ่อค-แม่ไฝ', billQty: 5, unit: 'CTN', vanUnit: 1 },
  { warehouse: '102', orderNo: '20220728', srDate: '20220803', deliveryDate: '650751048', customerCode: '46000015', customerName: 'บริษัท กาพสินธุ์ พลาซ่า จำกัด', billQty: 1, unit: 'CTN', vanUnit: 1 },
  { warehouse: '102', orderNo: '20220718', srDate: '20220803', deliveryDate: '650752063', customerCode: '49000024', customerName: 'นายทัพพัฒน์ มิตรสัมพันธ์', billQty: 11, unit: 'CTN', vanUnit: 1 },
  { warehouse: '102', orderNo: '20220708', srDate: '20220803', deliveryDate: '650751069', customerCode: '49000024', customerName: 'ห้างหุ้นส่วนจำกัด มุกดาหารขนานชื่น', billQty: 3, unit: 'CTN', vanUnit: 1 },
  { warehouse: '102', orderNo: '20220726', srDate: '20220803', deliveryDate: '650750478', customerCode: '41010016', customerName: 'หจก. โรงงานลูกชิ้นแสงจันทร์', billQty: 9, unit: 'CTN', vanUnit: 1 },
  { warehouse: '102', orderNo: '20220726', srDate: '20220803', deliveryDate: '650750478', customerCode: '41010016', customerName: 'คุณธนพร คุ้มยะราช', billQty: 5, unit: 'CTN', vanUnit: 1 },
]);

const filteredOrderDetails = computed(() => {
  if (!searchQuery.value) return orderDetails.value;
  const term = searchQuery.value.toLowerCase();
  return orderDetails.value.filter(order =>
    order.orderNo.toString().includes(term) ||
    order.customerName.toLowerCase().includes(term)
  );
});

function goBack() {
  router.back();
}

function handleCellClick(order, column) {
  // ส่งข้อมูลไป route ใหม่ (ตัวอย่าง)
  router.push({
    name: 'product-order-detail',
    query: { column, value: order[column] }
  });
}

function handleVanClick(order) {
  router.push({
    name: 'plan-total-van',
    query: { productCode: productCode, productName: productName, column: column, vanUnit: order.vanUnit }
  });
}
</script>

<style scoped>
.bg-blue-50 { background-color: #eff6ff !important; }
</style> 