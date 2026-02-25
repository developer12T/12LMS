<template>
  <div class="flex-1 bg-gray-50 min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <h1 class="text-2xl font-bold mb-6 text-gray-800">กำหนดค่าขนส่ง</h1>
      <!-- Form for setting shipping costs -->
      <form @submit.prevent="saveSettings">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div>
            <h2 class="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">ค่าขนส่ง (รถบริษัท)</h2>
            <div class="space-y-4">
              <div>
                <label for="company-lt-100" class="block text-sm font-medium text-gray-600">ระยะทางน้อยกว่า 100 กม. (บาท/กม.)</label>
                <input type="number" id="company-lt-100" v-model.number="form.company.lt_100" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              <div>
                <label for="company-gte-100" class="block text-sm font-medium text-gray-600">ระยะทางมากกว่าหรือเท่ากับ 100 กม. (บาท/กม.)</label>
                <input type="number" id="company-gte-100" v-model.number="form.company.gte_100" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div>
            <h2 class="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">ค่าขนส่ง (รถร่วม)</h2>
            <div class="space-y-4">
              <div>
                <label for="shared-lt-100" class="block text-sm font-medium text-gray-600">ระยะทางน้อยกว่า 100 กม. (บาท/กม.)</label>
                <input type="number" id="shared-lt-100" v-model.number="form.shared.lt_100" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              <div>
                <label for="shared-gte-100" class="block text-sm font-medium text-gray-600">ระยะทางมากกว่าหรือเท่ากับ 100 กม. (บาท/กม.)</label>
                <input type="number" id="shared-gte-100" v-model.number="form.shared.gte_100" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
          <button type="button" @click="resetSettings" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
            Reset
          </button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const form = ref({
  company: {
    lt_100: 0,
    gte_100: 0
  },
  shared: {
    lt_100: 0,
    gte_100: 0
  }
});

const saveSettings = () => {
  console.log('Saving settings:', form.value);
  alert('Settings saved!');
};

const resetSettings = () => {
  form.value = {
    company: { lt_100: 0, gte_100: 0 },
    shared: { lt_100: 0, gte_100: 0 }
  };
};

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
