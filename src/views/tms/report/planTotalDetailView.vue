<template>
  <PageHeaderSubMenu :breadcrumbs="[
    { label: 'วางแผนรวม', icon: 'grommet-icons:plan', to: '/tms/report/plan-total' },
    { label: 'รายละเอียด' }
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
              <Icon icon="mdi:warehouse" class="w-6 h-6 mr-2" />
              {{ columnLabel }}
            </span>
          </div>
          <div class="flex flex-row flex-wrap justify-end items-end gap-x-4 gap-y-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon icon="mdi:magnify" class="w-4 h-4 text-gray-400" />
              </div>
              <input type="text" v-model="searchQuery" placeholder="ค้นหา..."
                class="w-64 pl-10 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400">
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
                <th class="px-3 py-2 text-center font-semibold">รหัสสินค้า</th>
                <th class="px-3 py-2 text-center font-semibold">รายการสินค้า</th>
                <th class="px-3 py-2 text-center font-semibold">Total CO</th>
                <th class="px-3 py-2 text-center font-semibold">เดือนก่อน</th>
                <th class="px-3 py-2 text-center font-semibold">เดือนปัจจุบัน</th>
                <th class="px-3 py-2 text-center font-semibold">หน่วยรถ</th>
                <th class="px-3 py-2 text-center font-semibold">Stock</th>
                <th class="px-3 py-2 text-center font-semibold bg-red-200">Balance {{ columnLabel }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in filteredRows" :key="idx" :class="'transition-colors ' + (idx % 2 === 1 ? 'bg-gray-50' : 'bg-white') + ' hover:bg-blue-50'">
                <td class="px-3 py-1 text-center">{{ row.productCode }}</td>
                <td class="px-3 py-1">{{ row.productName }}</td>
                <td class="px-3 py-1 text-center">{{ row.totalCO }}</td>
                <td class="px-3 py-1 text-center text-blue-600 underline cursor-pointer" @click.stop="handleColClick('lastMonth', row)">{{ row.lastMonth }}</td>
                <td class="px-3 py-1 text-center text-blue-600 underline cursor-pointer" @click.stop="handleColClick('thisMonth', row)">{{ row.thisMonth }}</td>
                <td class="px-3 py-1 text-center text-blue-600 underline cursor-pointer" @click.stop="handleCoListClick(row)">{{ row.unit }}</td>
                <td class="px-3 py-1 text-center">{{ row.stock }}</td>
                <td class="px-3 py-1 text-center text-blue-600 cursor-pointer" :class="row.balanceSarakham < 0 ? 'bg-red-100 text-red-600 font-bold' : 'bg-red-50'">{{ row.balanceSarakham }}</td>
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

const column = route.query.column || '';
const searchQuery = ref('');

const columnMap = {
  fplusNakhonPathom: 'F-plus นครปฐม',
  balance12T: 'Balance 12 T',
  nakhonPathom: 'นครปฐม',
  sarakham: 'สารคาม',
  lamphun: 'ลำพูน',
  surat: 'สุราษฎร์',
  bangna: 'บางนา',
  nakhonRatchasima: 'นครราชสีมา',
  nonthaburi: 'นนทบุรี',
  nakhonPathom2: 'นครปฐม2',
  lastMonth: 'เดือนก่อน',
  thisMonth: 'เดือนปัจจุบัน',
  balanceSarakham: 'Balance สารคาม',
};
const columnLabel = computed(() => columnMap[column] || column);

const detailRows = [
  { productCode: '10010201053', productName: 'ผงปรุงรสไก่ ฟ้าไทย 12g x12x20', totalCO: 2, lastMonth: 0, thisMonth: 0, unit: 2, stock: 0, balanceSarakham: -2 },
  { productCode: '10010201054', productName: 'ผงปรุงรสไก่ ฟ้าไทย 12g x24x10 ชนิดเผ็ด', totalCO: 1, lastMonth: 0, thisMonth: 0, unit: 1, stock: 0, balanceSarakham: -1 },
  { productCode: '10010601011', productName: 'ผงกะหรี่ญี่ปุ่นข้น ฟ้าไทย 75g x10x8', totalCO: 38, lastMonth: 30, thisMonth: 0, unit: 8, stock: 230, balanceSarakham: 192 },
  { productCode: '10020501025', productName: 'ผงปรุงรสไก่ เติมทิพ ฟ้าไทย 75g x10x8', totalCO: 5, lastMonth: 0, thisMonth: 0, unit: 5, stock: 3, balanceSarakham: 3 },
  { productCode: '10020501008', productName: 'ผงปรุงรสไก่ เติมทิพ ฟ้าไทย 75g x10x8', totalCO: 0, lastMonth: 1, thisMonth: 0, unit: 0, stock: 3, balanceSarakham: 2 },
  { productCode: '10010201018', productName: 'ผงปรุงรสไก่ ฟ้าไทย 75g x10x8 แถมช้อนส้อม', totalCO: 526, lastMonth: 521, thisMonth: 0, unit: 5, stock: 815, balanceSarakham: 289 },
  { productCode: '10010201019', productName: 'ผงปรุงรสหมู ฟ้าไทย 75g x10x8 แถมช้อนส้อม', totalCO: 12, lastMonth: 12, thisMonth: 0, unit: 0, stock: 116, balanceSarakham: 104 },
  { productCode: '10010601012', productName: 'ผงกะหรี่ญี่ปุ่นข้น ฟ้าไทย 165g x6x6', totalCO: 116, lastMonth: 0, thisMonth: 0, unit: 0, stock: 465, balanceSarakham: 349 },
  { productCode: '10010201019', productName: 'ผงปรุงรสไก่ ฟ้าไทย 165g x6x6 แถมช้อนส้อม', totalCO: 0, lastMonth: 0, thisMonth: 0, unit: 0, stock: 0, balanceSarakham: 0 },
  { productCode: '10010401071', productName: 'ฟ้าไทยผงปรุงหมู 185g MT', totalCO: 0, lastMonth: 0, thisMonth: 0, unit: 0, stock: 0, balanceSarakham: 0 },
  { productCode: '10010201053', productName: 'ผงปรุงรสเด็ดหอม ฟ้าไทย 165g x6x6 (Export)', totalCO: 0, lastMonth: 0, thisMonth: 0, unit: 0, stock: 0, balanceSarakham: 0 },
  { productCode: '10010401017', productName: 'ผงกะหรี่ญี่ปุ่นไลท์ ฟ้าไทย 425g x12', totalCO: 0, lastMonth: 0, thisMonth: 0, unit: 0, stock: 87, balanceSarakham: 82 },
];

const filteredRows = computed(() => {
  if (!searchQuery.value) return detailRows;
  const term = searchQuery.value.toLowerCase();
  return detailRows.filter(row =>
    row.productCode.toString().includes(term) ||
    row.productName.toLowerCase().includes(term)
  );
});

function goBack() {
  router.back();
}

function handleColClick(columnKey, row) {
  router.push({
    name: 'plan-total-co-list',
    query: { productCode: row.productCode, productName: row.productName, column: columnKey }
  });
}

function handleCoListClick(row) {
  router.push({
    name: 'plan-total-van',
    query: { productCode: row.productCode, productName: row.productName }
  });
}
</script>

<style scoped>
.bg-red-200 { background-color: #fecaca !important; }
.bg-red-100 { background-color: #fee2e2 !important; }
.bg-red-50 { background-color: #fef2f2 !important; }
</style> 