<template>
  <div class="flex-1 bg-gray-50 min-h-screen">
    
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Condition/Filter Section -->
      <div class="w-full md:w-1/4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit">
        <h2 class="text-base font-semibold mb-2">เงื่อนไข:</h2>
        <div class="mb-2">
          <label class="block text-xs font-medium mb-1">ศูนย์กระจายสินค้า:</label>
          <select v-model="filter.dc" class="w-full border border-gray-300 rounded px-2 py-1 text-xs mb-2">
            <option value="101">101 | คลังนครปฐม</option>
            <option value="102">102 | คลังอื่น</option>
          </select>
          <label class="block text-xs font-medium mb-1">สินค้าคงเหลือ ณ วันที่:</label>
          <input v-model="filter.date" type="date" class="w-full border border-gray-300 rounded px-2 py-1 text-xs mb-2" />
          <div class="flex items-center mb-2">
            <input v-model="filter.allDC" type="checkbox" id="all-dc" class="mr-2" />
            <label for="all-dc" class="text-xs">ทุกศูนย์กระจายสินค้า</label>
          </div>
          <input v-model="filter.search" type="text" class="w-full border border-gray-300 rounded px-2 py-1 text-xs mb-2" placeholder="ค้นหา" />
        </div>
        <div class="mb-2">
          <h3 class="text-xs font-medium mb-1">นำข้อมูลออก:</h3>
          <div class="flex items-center gap-2 mb-2">
            <input v-model="filter.fg" type="checkbox" id="fg" class="mr-1" />
            <label for="fg" class="text-xs">FG</label>
            <input v-model="filter.premium" type="checkbox" id="premium" class="ml-2 mr-1" />
            <label for="premium" class="text-xs">Premium</label>
          </div>
          <button @click="downloadData" class="w-full bg-[#00569D] hover:bg-[#004080] text-white text-xs font-medium rounded px-2 py-1 transition-colors">ดาวน์โหลด</button>
        </div>
        <div class="mt-4">
          <h3 class="text-xs font-medium mb-1">สรุป:</h3>
          <div class="text-xs bg-gray-50 border border-gray-200 rounded p-2">
            (ยอดรวมสินค้าคงเหลือ)<br />
            Finished Goods: 2722 | 0 | 0<br />
            Premium: 35974
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="w-full md:w-3/4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-x-auto">
        <h2 class="text-base font-semibold mb-2">Stock On Hand:</h2>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg max-h-[70vh]">
          <table class="w-full text-xs text-left text-gray-500 border-collapse border border-gray-300">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
              <tr>
                <th class="px-2 py-2 text-center">รหัสสินค้า</th>
                <th class="px-2 py-2 text-center">ชื่อสินค้า</th>
                <th class="px-2 py-2 text-center">จำนวนหีบ</th>
                <th class="px-2 py-2 text-center">จำนวนถุง</th>
                <th class="px-2 py-2 text-center">จำนวนซอง</th>
                <th class="px-2 py-2 text-center">หมายเหตุ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in filteredData" :key="idx" :class="idx % 2 === 1 ? 'bg-gray-100' : 'bg-white'">
                <td class="px-2 py-1 text-center">{{ item.productCode }}</td>
                <td class="px-2 py-1">{{ item.productName }}</td>
                <td class="px-2 py-1 text-center">{{ item.boxQty }}</td>
                <td class="px-2 py-1 text-center">{{ item.bagQty }}</td>
                <td class="px-2 py-1 text-center">{{ item.sachetQty }}</td>
                <td class="px-2 py-1">{{ item.remark }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';

const filter = ref({
  dc: '101',
  date: '2024-06-18',
  allDC: false,
  search: '',
  fg: true,
  premium: true,
});

const tableData = ref([
  { productCode: '10010101067', productName: 'ผงปรุงรสหมู ฟ้าไทย 12g x12x20', boxQty: 30, bagQty: '-', sachetQty: '-', remark: '' },
  { productCode: '10010101068', productName: 'ผงปรุงรสหมู ฟ้าไทย 12g x24x10 ชนิดเมฆ', boxQty: 44, bagQty: '-', sachetQty: '-', remark: '' },
  { productCode: '10010201053', productName: 'ผงปรุงรสไก่ ฟ้าไทย 12g x12x20', boxQty: 36, bagQty: '-', sachetQty: '-', remark: '' },
  { productCode: '10010401001', productName: 'ผงกะหรี่ป่นใส ฟ้าไทย 10g x12x20 (ตัวอย่าง ฟรี)', boxQty: 38, bagQty: '-', sachetQty: '-', remark: '' },
  { productCode: '10010401024', productName: 'ผงกะหรี่ป่นใส ฟ้าไทย 75g x10x8', boxQty: 5, bagQty: '-', sachetQty: '-', remark: '' },
  { productCode: '10010401025', productName: 'ผงกะหรี่ป่นใส ฟ้าไทย 165g x6x6', boxQty: 5, bagQty: '-', sachetQty: '-', remark: '' },
  { productCode: '10010601001', productName: 'ผงกะหรี่ป่นข้น ฟ้าไทย 10g x12x20 (ตัวอย่าง ฟรี)', boxQty: 37, bagQty: '-', sachetQty: '-', remark: '' },
  { productCode: '10010601011', productName: 'ผงกะหรี่ป่นข้น ฟ้าไทย 75g x10x8', boxQty: 5, bagQty: '-', sachetQty: '-', remark: '' },
  { productCode: '10010601012', productName: 'ผงกะหรี่ป่นข้น ฟ้าไทย 165g x6x6', boxQty: 5, bagQty: '-', sachetQty: '-', remark: '' },
  { productCode: '10011101004', productName: 'น้ำมะนาว ฟ้าไทย 1000ml x6x2 (Export)', boxQty: 2470, bagQty: '-', sachetQty: '-', remark: '' },
  { productCode: '10020201044', productName: 'ผงปรุงรสไก่ เต็มพิก 12g x12x20', boxQty: 27, bagQty: '-', sachetQty: '-', remark: '' },
  { productCode: '10060122001', productName: 'ผงชูรส รสสม (PK22) 5kg x4', boxQty: 20, bagQty: '-', sachetQty: '-', remark: '' },
  { productCode: '20010101001', productName: 'น้ำปลา ร้าดังสุด ฟ้าไทย 400ml x12x2', boxQty: 36, bagQty: '-', sachetQty: '-', remark: '' },
  { productCode: '21210101002', productName: 'กล่องพลาสติกอาหารพร้อมฝา 750cc 2ช่อง x25ชุดx20พ่อ', boxQty: 11, bagQty: '-', sachetQty: '-', remark: '' },
  { productCode: '600102255', productName: 'ถุงคลัชสปันบอนด์ ฟ้าไทย', boxQty: 1070, bagQty: '-', sachetQty: '-', remark: '' },
  { productCode: '600102514', productName: 'ตระกร้าล้างผัก', boxQty: 17000, bagQty: '-', sachetQty: '-', remark: '' },
  { productCode: '600102515', productName: 'กล่องพับทันได้', boxQty: 16400, bagQty: '-', sachetQty: '-', remark: '' },
  { productCode: '600102523', productName: 'ชุดกรวยเก็บกระเป๋า (แลกซอง 68)', boxQty: 4, bagQty: '-', sachetQty: '-', remark: '' },
]);

const filteredData = computed(() => {
  if (!filter.value.search) return tableData.value;
  const term = filter.value.search.toLowerCase();
  return tableData.value.filter(item =>
    item.productCode.toString().includes(term) ||
    item.productName.toLowerCase().includes(term)
  );
});

function downloadData() {
  // สามารถเพิ่ม logic ดาวน์โหลดข้อมูลจริงได้
  alert('ดาวน์โหลดข้อมูล!');
}
</script>

<style scoped>
/* Add any additional custom styles here */
</style> 