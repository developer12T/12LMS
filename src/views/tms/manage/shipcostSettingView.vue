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
              <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">จัดการ</span>
            </div>
          </li>
          <li aria-current="page">
            <div class="flex items-center">
              <Icon icon="mdi:chevron-right" class="w-4 h-4 text-gray-400" />
              <span class="ml-1 text-sm font-medium text-[#00569D] md:ml-2">กำหนดค่าขนส่ง</span>
            </div>
          </li>
        </ol>
      </nav>
    </div>

    <div class="flex flex-col md:flex-row gap-6">
      <!-- Search/Condition Section -->
      <div class="w-full md:w-1/4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit">
        <h2 class="text-base font-semibold mb-2">เงื่อนไข:</h2>
        <div class="mb-2">
          <label class="block text-xs font-medium mb-1">คำค้น:</label>
          <input v-model="searchTerm" type="text" class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500" placeholder="ค้นหา..." />
        </div>
        <button @click="search" class="w-full bg-[#00569D] hover:bg-[#004080] text-white text-xs font-medium rounded px-2 py-1 mb-2 transition-colors">ค้นหา</button>
        <button @click="addCustomer" class="w-full text-blue-600 hover:underline text-xs font-medium py-1">+ Add a new customer</button>
      </div>

      <!-- Table Section -->
      <div class="w-full md:w-3/4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-x-auto">
        <h2 class="text-base font-semibold mb-2">ค่าขนส่ง:</h2>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg max-h-[70vh]">
          <table class="w-full text-xs text-left text-gray-500 border-collapse border border-gray-300">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
              <tr>
                <th class="px-2 py-2 text-center">รหัสลูกค้า</th>
                <th class="px-2 py-2 text-center">ช่องทางที่</th>
                <th class="px-2 py-2 text-center">รหัสไปรษณีย์</th>
                <th class="px-2 py-2 text-center">อำเภอ</th>
                <th class="px-2 py-2 text-center">รูปแบบ</th>
                <th class="px-2 py-2 text-center">ค่าขนส่ง</th>
                <th class="px-2 py-2 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in filteredData" :key="idx" :class="idx % 2 === 1 ? 'bg-blue-50' : 'bg-white'">
                <td class="px-2 py-1 text-center">{{ item.customerCode }}</td>
                <td class="px-2 py-1 text-center">{{ item.channel }}</td>
                <td class="px-2 py-1 text-center">{{ item.zipCode }}</td>
                <td class="px-2 py-1 text-center">{{ item.district }}</td>
                <td class="px-2 py-1 text-center">{{ item.type }}</td>
                <td class="px-2 py-1 text-center">{{ item.cost }}</td>
                <td class="px-2 py-1 text-center">
                  <button @click="manageItem(item)" class="bg-gray-200 hover:bg-gray-300 text-xs rounded px-2 py-1 border border-gray-300">จัดการ</button>
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
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';

const searchTerm = ref('');
const data = ref([
  { customerCode: '10000002', channel: 1, zipCode: '10100', district: 'ป้อมปราบศัตรูพ่าย', type: 'หีบ', cost: 0 },
  { customerCode: '10000002', channel: 1, zipCode: '10100', district: 'ป้อมปราบศัตรูพ่าย', type: 'เหมา', cost: 1350 },
  { customerCode: '10000003', channel: 1, zipCode: '10100', district: 'ป้อมปราบศัตรูพ่าย', type: 'หีบ', cost: 0 },
  { customerCode: '10000004', channel: 1, zipCode: '10100', district: 'ป้อมปราบศัตรูพ่าย', type: 'เหมา', cost: 1350 },
  { customerCode: '10000005', channel: 1, zipCode: '10100', district: 'ป้อมปราบศัตรูพ่าย', type: 'หีบ', cost: 0 },
  { customerCode: '10000005', channel: 1, zipCode: '10100', district: 'ป้อมปราบศัตรูพ่าย', type: 'เหมา', cost: 1350 },
  { customerCode: '10100001', channel: 1, zipCode: '10100', district: 'ป้อมปราบศัตรูพ่าย', type: 'หีบ', cost: 0 },
  { customerCode: '10100001', channel: 1, zipCode: '10100', district: 'ป้อมปราบศัตรูพ่าย', type: 'เหมา', cost: 1350 },
  { customerCode: '10100006', channel: 1, zipCode: '10100', district: 'ป้อมปราบศัตรูพ่าย', type: 'หีบ', cost: 0 },
  { customerCode: '10100006', channel: 1, zipCode: '10100', district: 'ป้อมปราบศัตรูพ่าย', type: 'เหมา', cost: 1350 },
  { customerCode: '10100008', channel: 1, zipCode: '10100', district: 'ป้อมปราบศัตรูพ่าย', type: 'หีบ', cost: 0 },
  { customerCode: '10100008', channel: 1, zipCode: '10100', district: 'ป้อมปราบศัตรูพ่าย', type: 'เหมา', cost: 1350 },
  { customerCode: '10100009', channel: 1, zipCode: '10100', district: 'ป้อมปราบศัตรูพ่าย', type: 'หีบ', cost: 0 },
  { customerCode: '10100009', channel: 1, zipCode: '10100', district: 'ป้อมปราบศัตรูพ่าย', type: 'เหมา', cost: 1350 },
  { customerCode: '10100011', channel: 1, zipCode: '10100', district: 'ป้อมปราบศัตรูพ่าย', type: 'หีบ', cost: 0 },
  { customerCode: '10100011', channel: 1, zipCode: '10100', district: 'ป้อมปราบศัตรูพ่าย', type: 'เหมา', cost: 1350 },
  { customerCode: '10100013', channel: 1, zipCode: '10100', district: 'ป้อมปราบศัตรูพ่าย', type: 'หีบ', cost: 0 },
]);

const filteredData = computed(() => {
  if (!searchTerm.value) return data.value;
  const term = searchTerm.value.toLowerCase();
  return data.value.filter(item =>
    item.customerCode.toString().includes(term) ||
    item.zipCode.toString().includes(term) ||
    item.district.toLowerCase().includes(term) ||
    item.type.toLowerCase().includes(term)
  );
});

function search() {
  // สามารถเพิ่ม logic ดึงข้อมูลจริงได้
}

function addCustomer() {
  // สามารถเพิ่ม logic เพิ่มลูกค้าใหม่ได้
  alert('Add new customer!');
}

function manageItem(item) {
  // สามารถเพิ่ม logic จัดการข้อมูลแต่ละแถวได้
  alert('Manage: ' + item.customerCode);
}
</script>

<style scoped>
/* Add any additional custom styles here */
</style>
