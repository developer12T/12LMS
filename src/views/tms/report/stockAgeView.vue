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
            <option value="102">102 | คลังมหาสารคาม</option>
          </select>
          <div class="flex items-center mb-2">
            <input v-model="filter.allDC" type="checkbox" id="all-dc" class="mr-2" />
            <label for="all-dc" class="text-xs">ทุกศูนย์กระจายสินค้า</label>
          </div>
          <div class="flex items-center mb-2">
            <input v-model="filter.ageLess" type="checkbox" id="age-less" class="mr-2" />
            <label for="age-less" class="text-xs">อายุสินค้าน้อยกว่า:</label>
            <input v-model="filter.ageValue" type="number" min="1" class="w-12 border border-gray-300 rounded px-1 py-0.5 text-xs ml-2" />
          </div>
          <input v-model="filter.search" type="text" class="w-full border border-gray-300 rounded px-2 py-1 text-xs mb-2" placeholder="ค้นหา" />
        </div>
        <div class="mb-2">
          <h3 class="text-xs font-medium mb-1">นำข้อมูลออก:</h3>
          <button @click="downloadData" class="w-full bg-[#00569D] hover:bg-[#004080] text-white text-xs font-medium rounded px-2 py-1 transition-colors">ดาวน์โหลด</button>
        </div>
        <div class="mt-4">
          <h3 class="text-xs font-medium mb-1">สรุป:</h3>
          <textarea class="w-full border border-gray-300 rounded px-2 py-1 text-xs min-h-[100px]" placeholder=""></textarea>
        </div>
      </div>

      <!-- Table Section -->
      <div class="w-full md:w-3/4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-x-auto">
        <h2 class="text-base font-semibold mb-2">ข้อมูลอายุสินค้าคงเหลือ:</h2>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg max-h-[70vh]">
          <table class="w-full text-xs text-left text-gray-500 border-collapse border border-gray-300 min-w-[1200px]">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
              <tr>
                <th class="px-2 py-2 text-center">รหัสสินค้า</th>
                <th class="px-2 py-2 text-center">ชื่อสินค้า</th>
                <th class="px-2 py-2 text-center">Lot No.</th>
                <th class="px-2 py-2 text-center">อายุสินค้าคงเหลือ</th>
                <th class="px-2 py-2 text-center">กลุ่ม</th>
                <th class="px-2 py-2 text-center">นครปฐม</th>
                <th class="px-2 py-2 text-center">มหาสารคาม</th>
                <th class="px-2 py-2 text-center">ลำพูน</th>
                <th class="px-2 py-2 text-center">ศรีษะเกษ</th>
                <th class="px-2 py-2 text-center">บางนา</th>
                <th class="px-2 py-2 text-center">นครสวรรค์</th>
                <th class="px-2 py-2 text-center">นครราชสีมา</th>
                <th class="px-2 py-2 text-center">นนทบุรี</th>
                <th class="px-2 py-2 text-center">นครปฐม2</th>
                <th class="px-2 py-2 text-center">รวม</th>
                <th class="px-2 py-2 text-center">หมายเหตุ</th>
                <th class="px-2 py-2 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in tableData" :key="idx" :class="idx % 2 === 1 ? 'bg-gray-100' : 'bg-white'">
                <td class="px-2 py-1 text-center">{{ item.productCode }}</td>
                <td class="px-2 py-1">{{ item.productName }}</td>
                <td class="px-2 py-1 text-center">{{ item.lotNo }}</td>
                <td class="px-2 py-1 text-center">{{ item.age }}</td>
                <td class="px-2 py-1 text-center">{{ item.group }}</td>
                <td class="px-2 py-1 text-center">{{ item.nakhonPathom }}</td>
                <td class="px-2 py-1 text-center">{{ item.mahasarakham }}</td>
                <td class="px-2 py-1 text-center">{{ item.lamphun }}</td>
                <td class="px-2 py-1 text-center">{{ item.sisaket }}</td>
                <td class="px-2 py-1 text-center">{{ item.bangna }}</td>
                <td class="px-2 py-1 text-center">{{ item.nakhonSawan }}</td>
                <td class="px-2 py-1 text-center">{{ item.nakhonRatchasima }}</td>
                <td class="px-2 py-1 text-center">{{ item.nonthaburi }}</td>
                <td class="px-2 py-1 text-center">{{ item.nakhonPathom2 }}</td>
                <td class="px-2 py-1 text-center">{{ item.total }}</td>
                <td class="px-2 py-1"><input v-model="item.remark" type="text" class="w-full border border-gray-300 rounded px-1 py-0.5 text-xs" /></td>
                <td class="px-2 py-1 text-center">
                  <button @click="editRow(idx)" class="p-1 hover:bg-blue-50 rounded">
                    <Icon icon="mdi:pencil" class="w-4 h-4 text-blue-500" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

const filter = ref({
  dc: '101',
  allDC: true,
  ageLess: false,
  ageValue: 1,
  search: '',
});

const tableData = ref([
  { productCode: '10010651002', productName: 'น้ำซุปไก่ต.เรือ ฟ้าไทย 120ml x3x8 แถมซุปขาว 200ml(3แถม1)', lotNo: '2504022110000000', age: 15, group: 0, nakhonPathom: 0, mahasarakham: 7, lamphun: 0, sisaket: 11, bangna: 20, nakhonSawan: 0, nakhonRatchasima: 0, nonthaburi: 0, nakhonPathom2: 12, total: 50, remark: '' },
  { productCode: '10010751002', productName: 'น้ำซุปต้มยำ ฟ้าไทย 120ml x3x8 แถมซุปขาว 200ml(3แถม1)', lotNo: '2504032110000000', age: 15, group: 0, nakhonPathom: 0, mahasarakham: 14, lamphun: 0, sisaket: 7, bangna: 10, nakhonSawan: 0, nakhonRatchasima: 0, nonthaburi: 0, nakhonPathom2: 0, total: 31, remark: '' },
  { productCode: '10011801001', productName: 'ผงปรุงรสลาบ ฟ้าไทยโยมิคิท เช่น 30g x12x3', lotNo: '2505071110000000', age: 16, group: 0, nakhonPathom: 0, mahasarakham: 0, lamphun: 4, sisaket: 0, bangna: 0, nakhonSawan: 27, nakhonRatchasima: 82, nonthaburi: 0, nakhonPathom2: 0, total: 113, remark: '' },
]);

function downloadData() {
  // สามารถเพิ่ม logic ดาวน์โหลดข้อมูลจริงได้
  alert('ดาวน์โหลดข้อมูล!');
}

function editRow(idx) {
  // สามารถเพิ่ม logic แก้ไขข้อมูลจริงได้
  alert('แก้ไขแถวที่ ' + (idx + 1));
}
</script>

<style scoped>
/* Add any additional custom styles here */
</style> 