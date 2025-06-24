<template>
  <div class="flex-1 bg-gray-50 min-h-screen">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Filter/Condition Section -->
      <div class="w-full md:w-1/4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit">
        <h2 class="text-base font-semibold mb-2">เงื่อนไข:</h2>
        <div class="mb-2">
          <label class="block text-xs font-medium mb-1">ศูนย์กระจายสินค้า:</label>
          <select v-model="filter.dc" class="w-full border border-gray-300 rounded px-2 py-1 text-xs mb-2">
            <option value="101">101 | คลังนครปฐม</option>
            <option value="102">102 | คลังมหาสารคาม</option>
          </select>
          <label class="block text-xs font-medium mb-1">จากวันที่:</label>
          <input v-model="filter.fromDate" type="date" class="w-full border border-gray-300 rounded px-2 py-1 text-xs mb-2" />
          <label class="block text-xs font-medium mb-1">ถึงวันที่:</label>
          <input v-model="filter.toDate" type="date" class="w-full border border-gray-300 rounded px-2 py-1 text-xs mb-2" />
          <div class="flex items-center mb-2">
            <input v-model="filter.allDC" type="checkbox" id="all-dc" class="mr-2" />
            <label for="all-dc" class="text-xs">ทุกศูนย์กระจายสินค้า</label>
          </div>
          <input v-model="filter.search" type="text" class="w-full border border-gray-300 rounded px-2 py-1 text-xs mb-2" placeholder="ค้นหา" />
        </div>
        <div class="mb-2">
          <h3 class="text-xs font-medium mb-1">นำข้อมูลออก:</h3>
          <button @click="downloadData" class="w-full bg-[#00569D] hover:bg-[#004080] text-white text-xs font-medium rounded px-2 py-1 transition-colors">ดาวน์โหลด</button>
        </div>
        <div class="mt-4">
          <h3 class="text-xs font-medium mb-1">สรุป:</h3>
          <div class="text-xs">
            <div>(ยอดรวมไม่เกิน 2 วัน)</div>
            <div v-for="(v, k) in summary" :key="k">{{ k }}: {{ v }}%</div>
            <div>รวมทุกคลัง: 0.00%</div>
          </div>
        </div>
      </div>

      <!-- % On Time Table Section -->
      <div class="w-full md:w-3/4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-x-auto">
        <h2 class="text-base font-semibold mb-2">% On Time:</h2>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-xs text-center text-blue-700 border-collapse border border-blue-200 min-w-[900px]">
            <thead>
              <tr class="bg-cyan-300">
                <th class="px-2 py-2">วัน</th>
                <th class="px-2 py-2">คลังนครปฐม</th>
                <th class="px-2 py-2">คลังมหาสารคาม</th>
                <th class="px-2 py-2">คลังลำพูน</th>
                <th class="px-2 py-2">คลังศรีษะเกษ</th>
                <th class="px-2 py-2">คลังบางนา</th>
                <th class="px-2 py-2">คลังนครสวรรค์</th>
                <th class="px-2 py-2">คลังนครราชสีมา</th>
                <th class="px-2 py-2">คลังนนทบุรี</th>
                <th class="px-2 py-2">คลังนครปฐม2</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tableRows" :key="row.label" :class="row.label === 'สรุป' || row.label === 'on period' || row.label === 'co นัดส่งข้ามปี' ? 'bg-cyan-200 font-semibold' : 'bg-cyan-100'">
                <td class="px-2 py-1">{{ row.label }}</td>
                <td v-for="(v, idx) in row.data" :key="idx" class="px-2 py-1">{{ v }}%</td>
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

const filter = ref({
  dc: '101',
  allDC: false,
  fromDate: '2024-06-18',
  toDate: '2024-06-18',
  search: '',
});

const tableRows = ref([
  { label: '0', data: ['0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00'] },
  { label: '1', data: ['0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00'] },
  { label: '2', data: ['0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00'] },
  { label: '>2', data: ['0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00'] },
  { label: 'สรุป', data: ['0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00'] },
  { label: 'on period', data: ['0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00'] },
  { label: 'co นัดส่งข้ามปี', data: ['0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00'] },
]);

const summary = ref({
  'คลังนครปฐม': '0.00',
  'คลังมหาสารคาม': '0.00',
  'คลังลำพูน': '0.00',
  'คลังศรีษะเกษ': '0.00',
  'คลังบางนา': '0.00',
  'คลังนครสวรรค์': '0.00',
  'คลังนครราชสีมา': '0.00',
  'คลังนนทบุรี': '0.00',
  'คลังนครปฐม 2': '0.00',
});

function downloadData() {
  // เพิ่ม logic ดาวน์โหลดจริงได้
  alert('ดาวน์โหลดข้อมูล!');
}
</script>

<style scoped>
</style> 