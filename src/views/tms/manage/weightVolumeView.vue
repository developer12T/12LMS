<template>
  <div class="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen p-2">
    <!-- Table Section -->
    <div class="bg-white dark:bg-sky-900 rounded-lg shadow-sm border border-gray-200 dark:border-sky-800 p-4">
      <h2 class="text-base font-semibold mb-4 text-sky-800 dark:text-sky-200 flex items-center space-x-2">
        <Icon icon="mdi:truck" class="w-5 h-5 text-sky-600 dark:text-sky-400" />
        <span>ปริมาตรและน้ำหนักบรรทุก</span>
      </h2>
      
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200 dark:border-sky-700">
        <table class="w-full text-xs text-left text-gray-500 dark:text-gray-300">
          <thead class="text-xs text-gray-700 dark:text-gray-300 uppercase bg-sky-50 dark:bg-sky-800">
            <tr>
              <th class="px-3 py-2 text-center font-semibold">ขนาดรถบรรทุก</th>
              <th class="px-3 py-2 text-center font-semibold">น้ำหนักบรรทุก (kg)</th>
              <th class="px-3 py-2 text-center font-semibold">ปริมาตรบรรทุก (m³)</th>
              <th class="px-3 py-2 text-center font-semibold">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-sky-700">
            <tr v-for="(item, idx) in truckData" :key="item.size" 
                class="bg-white dark:bg-sky-900 hover:bg-sky-50 dark:hover:bg-sky-800 transition-colors">
              <td class="px-3 py-2 text-center font-medium text-sky-700 dark:text-sky-200">
                <span class="inline-block px-2 py-1 bg-sky-100 dark:bg-sky-700 text-sky-800 dark:text-sky-200 rounded-full text-xs font-semibold">
                  {{ item.size }}
                </span>
              </td>
              <td class="px-3 py-2 text-center">
                <input type="number" step="0.0001" v-model.number="item.weight" :readonly="!item.editing" 
                       class="w-24 text-center bg-gray-50 dark:bg-sky-800 border border-gray-300 dark:border-sky-600 rounded px-2 py-1 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400 dark:focus:border-sky-400 transition-all text-xs" 
                       :class="item.editing ? 'bg-white dark:bg-sky-700' : 'bg-gray-50 dark:bg-sky-800'" />
              </td>
              <td class="px-3 py-2 text-center">
                <input type="number" step="0.0001" v-model.number="item.volume" :readonly="!item.editing" 
                       class="w-24 text-center bg-gray-50 dark:bg-sky-800 border border-gray-300 dark:border-sky-600 rounded px-2 py-1 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400 dark:focus:border-sky-400 transition-all text-xs" 
                       :class="item.editing ? 'bg-white dark:bg-sky-700' : 'bg-gray-50 dark:bg-sky-800'" />
              </td>
              <td class="px-3 py-2 text-center">
                <button v-if="!item.editing" @click="editRow(idx)" 
                        class="inline-flex items-center px-2 py-1 text-xs font-medium text-sky-700 bg-sky-100 border border-sky-300 rounded hover:bg-sky-200 dark:bg-sky-700 dark:text-sky-200 dark:border-sky-600 dark:hover:bg-sky-600 transition-colors">
                  <Icon icon="mdi:pencil" class="w-3 h-3 mr-1" />
                  แก้ไข
                </button>
                <div v-else class="flex items-center justify-center space-x-1">
                  <button @click="saveRow(idx)" 
                          class="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-green-600 border border-green-600 rounded hover:bg-green-700 dark:bg-green-600 dark:border-green-600 dark:hover:bg-green-700 transition-colors">
                    <Icon icon="mdi:content-save" class="w-3 h-3 mr-1" />
                    บันทึก
                  </button>
                  <button @click="cancelEdit(idx)" 
                          class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors">
                    <Icon icon="mdi:close" class="w-3 h-3 mr-1" />
                    ยกเลิก
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Summary Section -->
      <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="bg-sky-50 dark:bg-sky-800 rounded-lg p-3 border border-sky-200 dark:border-sky-700">
          <div class="flex items-center">
            <Icon icon="mdi:truck" class="w-6 h-6 text-sky-600 dark:text-sky-400 mr-2" />
            <div>
              <p class="text-xs font-medium text-sky-700 dark:text-sky-200">จำนวนรถทั้งหมด</p>
              <p class="text-lg font-bold text-sky-800 dark:text-sky-100">{{ truckData.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-green-50 dark:bg-green-900 rounded-lg p-3 border border-green-200 dark:border-green-700">
          <div class="flex items-center">
            <Icon icon="mdi:weight" class="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
            <div>
              <p class="text-xs font-medium text-green-700 dark:text-green-200">น้ำหนักเฉลี่ย</p>
              <p class="text-lg font-bold text-green-800 dark:text-green-100">{{ averageWeight }} kg</p>
            </div>
          </div>
        </div>
        <div class="bg-blue-50 dark:bg-blue-900 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
          <div class="flex items-center">
            <Icon icon="mdi:cube-outline" class="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
            <div>
              <p class="text-xs font-medium text-blue-700 dark:text-blue-200">ปริมาตรเฉลี่ย</p>
              <p class="text-lg font-bold text-blue-800 dark:text-blue-100">{{ averageVolume }} m³</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';

const truckData = ref([
  { size: '2TON', weight: 2150.0000, volume: 2159.0000, editing: false, originalWeight: 2150.0000, originalVolume: 2159.0000 },
  { size: '4TON', weight: 4400.2500, volume: 4499.0000, editing: false, originalWeight: 4400.2500, originalVolume: 4499.0000 },
  { size: '6TON', weight: 6000.0000, volume: 6999.0000, editing: false, originalWeight: 6000.0000, originalVolume: 6999.0000 },
  { size: '9TON', weight: 9000.0000, volume: 9999.0000, editing: false, originalWeight: 9000.0000, originalVolume: 9999.0000 },
  { size: '10TON', weight: 12000.0000, volume: 12999.0000, editing: false, originalWeight: 12000.0000, originalVolume: 12999.0000 },
  { size: '12TON', weight: 12000.0000, volume: 12999.0000, editing: false, originalWeight: 12000.0000, originalVolume: 12999.0000 },
  { size: '16TON', weight: 16000.0000, volume: 16999.0000, editing: false, originalWeight: 16000.0000, originalVolume: 16999.0000 },
  { size: '22TON', weight: 22500.0000, volume: 22599.0000, editing: false, originalWeight: 22500.0000, originalVolume: 22599.0000 },
  { size: '32TON', weight: 32000.0000, volume: 32999.0000, editing: false, originalWeight: 32000.0000, originalVolume: 32999.0000 },
]);

// Computed properties for summary
const averageWeight = computed(() => {
  const total = truckData.value.reduce((sum, item) => sum + item.weight, 0);
  return (total / truckData.value.length).toFixed(0);
});

const averageVolume = computed(() => {
  const total = truckData.value.reduce((sum, item) => sum + item.volume, 0);
  return (total / truckData.value.length).toFixed(0);
});

function editRow(idx) {
  // Store original values for cancel
  truckData.value[idx].originalWeight = truckData.value[idx].weight;
  truckData.value[idx].originalVolume = truckData.value[idx].volume;
  truckData.value[idx].editing = true;
}

function saveRow(idx) {
  truckData.value[idx].editing = false;
  // สามารถเพิ่ม logic save จริงได้ที่นี่
  console.log('Saving:', truckData.value[idx]);
}

function cancelEdit(idx) {
  truckData.value[idx].weight = truckData.value[idx].originalWeight;
  truckData.value[idx].volume = truckData.value[idx].originalVolume;
  truckData.value[idx].editing = false;
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: #1e293b;
}

.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style> 