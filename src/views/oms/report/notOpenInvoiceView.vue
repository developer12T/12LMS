<template>
  <div class="flex-1 bg-gray-50 min-h-screen">

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 flex flex-col md:flex-row md:items-end gap-4">
      <div class="flex flex-col md:flex-row gap-2 flex-wrap flex-1">
        <div>
          <label class="block text-xs font-medium mb-1">Select month:</label>
          <select v-model="filter.month" class="border border-gray-300 rounded px-2 py-1 text-xs">
            <option value="6">มิถุนายน</option>
            <option value="7">กรกฎาคม</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium mb-1">Select year:</label>
          <select v-model="filter.year" class="border border-gray-300 rounded px-2 py-1 text-xs">
            <option value="2568">2568</option>
            <option value="2567">2567</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium mb-1">Select view:</label>
          <select v-model="filter.view" class="border border-gray-300 rounded px-2 py-1 text-xs">
            <option value="accounting">Accounting</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div class="flex gap-2 mt-2 md:mt-0">
        <button @click="applyFilter" class="bg-[#00569D] hover:bg-[#004080] text-white text-xs font-medium rounded px-4 py-1.5 transition-colors">Go</button>
        <button @click="exportExcel" class="text-xs text-blue-600 hover:underline">Export data to Excel</button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg" style="max-height: calc(100vh - 300px);">
        <table class="w-full text-xs text-left text-gray-500 border-collapse border border-gray-300 min-w-[1200px]">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
            <tr>
              <th class="px-2 py-2 text-center">วันที่เปิด SR</th>
              <th class="px-2 py-2 text-center">กำหนดส่ง</th>
              <th class="px-2 py-2 text-center">CO</th>
              <th class="px-2 py-2 text-center">รหัสลูกค้า</th>
              <th class="px-2 py-2 text-center">ชื่อลูกค้า</th>
              <th class="px-2 py-2 text-center">รหัส Sale</th>
              <th class="px-2 py-2 text-center">ชื่อ Sale</th>
              <th class="px-2 py-2 text-center">คลัง</th>
              <th class="px-2 py-2 text-center">รายการ</th>
              <th class="px-2 py-2 text-center">รหัสสินค้า</th>
              <th class="px-2 py-2 text-center">รายการสินค้า</th>
              <th class="px-2 py-2 text-center">จำนวน</th>
              <th class="px-2 py-2 text-center">ราคาสินค้า</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in tableData" :key="idx" :class="idx % 2 === 1 ? 'bg-blue-50' : 'bg-white'">
              <td class="px-2 py-1 text-center">{{ item.srDate }}</td>
              <td class="px-2 py-1 text-center">{{ item.dueDate }}</td>
              <td class="px-2 py-1 text-center">{{ item.co }}</td>
              <td class="px-2 py-1 text-center">{{ item.customerCode }}</td>
              <td class="px-2 py-1">{{ item.customerName }}</td>
              <td class="px-2 py-1 text-center">{{ item.saleCode }}</td>
              <td class="px-2 py-1">{{ item.saleName }}</td>
              <td class="px-2 py-1 text-center">{{ item.warehouse }}</td>
              <td class="px-2 py-1 text-center">{{ item.itemNo }}</td>
              <td class="px-2 py-1 text-center">{{ item.productCode }}</td>
              <td class="px-2 py-1">{{ item.productName }}</td>
              <td class="px-2 py-1 text-center">{{ item.qty }}</td>
              <td class="px-2 py-1 text-right">{{ item.price }}</td>
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

const filter = ref({
  month: '6',
  year: '2568',
  view: 'accounting',
});

const tableData = ref([
  { srDate: '20250605', dueDate: '20250630', co: '680624001', customerCode: '30000112', customerName: 'บริษัท สุวิทย์สมศรี จำกัด', saleCode: '10077', saleName: 'สันติสุข แก้ววรสาร 085-4844751', warehouse: '109', itemNo: 1, productCode: '10010101034', productName: 'ฟ้าไทยผงปรุงรสหมู 75g', qty: 20, price: '14,360' },
  { srDate: '20250605', dueDate: '20250630', co: '680624001', customerCode: '30000112', customerName: 'บริษัท สุวิทย์สมศรี จำกัด', saleCode: '10077', saleName: 'สันติสุข แก้ววรสาร 085-4844751', warehouse: '109', itemNo: 4, productCode: '10010101038', productName: 'ฟ้าไทยผงปรุงรสหมู 800g x10ซอง', qty: 5, price: '3,860' },
  { srDate: '20250605', dueDate: '20250630', co: '680624001', customerCode: '30000112', customerName: 'บริษัท สุวิทย์สมศรี จำกัด', saleCode: '10077', saleName: 'สันติสุข แก้ววรสาร 085-4844751', warehouse: '109', itemNo: 5, productCode: '10010401024', productName: 'ฟ้าไทยผงปรุงรสหมู 165g', qty: 10, price: '7,180' },
  { srDate: '20250605', dueDate: '20250630', co: '680624001', customerCode: '30000112', customerName: 'บริษัท สุวิทย์สมศรี จำกัด', saleCode: '10077', saleName: 'สันติสุข แก้ววรสาร 085-4844751', warehouse: '109', itemNo: 8, productCode: '10010902010', productName: 'ฟ้าไทยน้ำตาลก.ไก่ 350g x6', qty: 25, price: '9,010' },
  { srDate: '20250605', dueDate: '20250630', co: '680624001', customerCode: '30000112', customerName: 'บริษัท สุวิทย์สมศรี จำกัด', saleCode: '10077', saleName: 'สันติสุข แก้ววรสาร 085-4844751', warehouse: '109', itemNo: 9, productCode: '10010902010', productName: 'ฟ้าไทยน้ำตาลก.ไก่ 350g x6', qty: 10, price: '-' },
  { srDate: '20250605', dueDate: '20250630', co: '680624001', customerCode: '30000112', customerName: 'บริษัท สุวิทย์สมศรี จำกัด', saleCode: '10077', saleName: 'สันติสุข แก้ววรสาร 085-4844751', warehouse: '109', itemNo: 12, productCode: '10010902010', productName: 'ฟ้าไทยน้ำตาลก.ไก่ 350g x6', qty: 5, price: '-' },
  { srDate: '20250605', dueDate: '20250630', co: '680624001', customerCode: '30000112', customerName: 'บริษัท สุวิทย์สมศรี จำกัด', saleCode: '10077', saleName: 'สันติสุข แก้ววรสาร 085-4844751', warehouse: '109', itemNo: 13, productCode: '10010902010', productName: 'ฟ้าไทยน้ำตาลก.ไก่ 350g x6', qty: 10, price: '-' },
  { srDate: '20250606', dueDate: '20250705', co: '680624003', customerCode: '30000122', customerName: 'บริษัท จอม เดช สลัด จำกัด', saleCode: '10077', saleName: 'สันติสุข แก้ววรสาร 085-4844751', warehouse: '109', itemNo: 1, productCode: '10030106010', productName: 'ฟ้าไทยพอคปรุงรสหมู 800g x10ซอง', qty: 200, price: '125,800' },
  { srDate: '20250606', dueDate: '20250705', co: '680624003', customerCode: '30000122', customerName: 'บริษัท จอม เดช สลัด จำกัด', saleCode: '10077', saleName: 'สันติสุข แก้ววรสาร 085-4844751', warehouse: '109', itemNo: 2, productCode: '10011101002', productName: 'ฟ้าไทยน้ำมะนาวขวด 1000ml', qty: 1000, price: '249,000' },
  { srDate: '20250606', dueDate: '20250705', co: '680624003', customerCode: '30000122', customerName: 'บริษัท จอม เดช สลัด จำกัด', saleCode: '10077', saleName: 'สันติสุข แก้ววรสาร 085-4844751', warehouse: '109', itemNo: 3, productCode: '10011101002', productName: 'ฟ้าไทยน้ำมะนาวขวด 1000ml', qty: 25, price: '-' },
]);

function applyFilter() {
  // สามารถเพิ่ม logic ดึงข้อมูลจริงได้
}

function exportExcel() {
  // สามารถเพิ่ม logic export excel ได้
  alert('Export to Excel!');
}
</script>

<style scoped>
/* Add any additional custom styles here */
</style> 