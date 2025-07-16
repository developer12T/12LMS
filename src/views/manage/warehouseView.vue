<template>
  <div class="flex-1 bg-gray-50 min-h-screen">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mt-4 p-4">
      <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h1 class="text-xl font-bold text-gray-800 w-full sm:w-auto mb-2 sm:mb-0">จัดการศูนย์กระจายสินค้า</h1>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button @click="openAddModal" class="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded px-4 py-1.5 transition-colors shadow min-w-[120px] justify-center">
            <Icon icon="mdi:plus" class="w-4 h-4 mr-1" />
            เพิ่มศูนย์กระจายสินค้า
          </button>
          <div class="relative w-full sm:w-60">
            <Icon icon="mdi:magnify" class="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input v-model="search" type="text" placeholder="ค้นหา..." class="w-full pl-10 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
        </div>
      </div>
      <div v-if="warehouseStore.loading" class="flex justify-center items-center py-8">
        <Icon icon="mdi:loading" class="animate-spin w-8 h-8 text-sky-600" />
        <span class="ml-2 text-sky-700">กำลังโหลดข้อมูล...</span>
      </div>
      <div v-else class="overflow-x-auto rounded-lg overflow-y-auto custom-scrollbar" style="max-height: 70vh;">
        <table class="min-w-full text-xs text-left text-gray-700 border border-gray-200 bg-white">
          <thead class="bg-gray-100 sticky top-0">
            <tr>
              <th class="p-3">รหัสศูนย์</th>
              <th class="p-3">ชื่อศูนย์</th>
              <th class="p-3">ตัวย่อ</th>
              <th class="p-3">สถานะ</th>
              <th class="p-3 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredWarehouses.length === 0">
              <td colspan="4" class="text-center text-gray-400 py-6">ไม่พบข้อมูลศูนย์กระจายสินค้า</td>
            </tr>
            <tr v-else v-for="item in filteredWarehouses" :key="item.who_no" class="hover:bg-sky-50 transition cursor-pointer">
              <td class="p-3">{{ item.who_no }}</td>
              <td class="p-3">{{ item.who_name }}</td>
              <td class="p-3">{{ item.who_abb }}</td>
              <!-- <td class="p-3">
                <span :class="statusClass(item.active_status)">
                  {{ statusText(item.active_status) }}
                </span>
              </td> -->
              <td>
                <label class="relative inline-flex items-center cursor-pointer ml-2">
                  <input type="checkbox" 
                         :checked="item.active_status === '1'" 
                         @change="toggleStatus(item)" 
                         class="sr-only peer">
                  <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
              </td>
              <td class="p-3 text-center">
                <button @click.stop="openEditModal(item)" class="text-yellow-500 bg-yellow-100 px-4 py-1 rounded-md hover:text-yellow-600 mr-2" title="แก้ไข">
                  <Icon icon="mdi:pencil" class="w-5 h-5" />
                </button>
                <button @click.stop="openDeleteModal(item)" class="text-red-500 bg-red-100 px-4 py-1 rounded-md hover:text-red-600" title="ลบ" :disabled="item.active_status === '1'">
                  <Icon icon="mdi:delete" class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal เพิ่ม/แก้ไข -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <h3 class="text-lg font-semibold mb-4">{{ isEdit ? 'แก้ไขศูนย์กระจายสินค้า' : 'เพิ่มศูนย์กระจายสินค้า' }}</h3>
        <form @submit.prevent="saveWarehouse">
          <div class="mb-3">
            <label class="block text-xs font-medium mb-1">รหัสศูนย์</label>
            <input v-model="form.who_no" :disabled="isEdit" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500" required />
          </div>
          <div class="mb-3">
            <label class="block text-xs font-medium mb-1">ชื่อศูนย์</label>
            <input v-model="form.who_name" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500" required />
          </div>
          <div class="mb-3">
            <label class="block text-xs font-medium mb-1">สถานะ</label>
            <select v-model="form.active_status" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500">
              <option value="1">ใช้งาน</option>
              <option value="0">ไม่ใช้งาน</option>
              <option value="3">ทั้งหมด</option>
            </select>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="closeModal" class="px-3 py-1 rounded bg-gray-200 text-gray-700">ยกเลิก</button>
            <button type="submit" class="px-3 py-1 rounded bg-sky-700 text-white">{{ isEdit ? 'บันทึก' : 'เพิ่ม' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal ยืนยันลบ -->
    <div v-if="showDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-xs p-6 relative">
        <Icon icon="mdi:alert" class="w-10 h-10 text-red-400 mb-2 mx-auto" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2 text-center">ยืนยันการลบ</h3>
        <p class="text-center text-gray-500 mb-4">คุณต้องการลบศูนย์กระจายสินค้านี้ใช่หรือไม่?</p>
        <div class="flex justify-end space-x-2 mt-2">
          <button @click="showDelete = false" class="px-3 py-1 rounded bg-gray-200 text-gray-700">ยกเลิก</button>
          <button @click="deleteWarehouse" class="px-3 py-1 rounded bg-red-600 text-white">ลบ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useWarehouseManageStore } from '@/stores/modules/warehouseManage'

const search = ref('')
const warehouseStore = useWarehouseManageStore()

onMounted(() => {
  warehouseStore.fetchWarehouses()
})

const filteredWarehouses = computed(() =>
  warehouseStore.warehouses.filter(w =>
    (w.who_no + '').includes(search.value) ||
    (w.who_name || '').includes(search.value)
  )
)

console.log(warehouseStore.warehouses)

const showModal = ref(false)
const isEdit = ref(false)
const form = ref({ who_no: '', who_name: '', active_status: '1' })
const showDelete = ref(false)
const deleteTarget = ref(null)

function openAddModal() {
  isEdit.value = false
  form.value = { who_no: '', who_name: '', active_status: '1' }
  showModal.value = true
}
function openEditModal(item) {
  isEdit.value = true
  form.value = { ...item }
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}
async function saveWarehouse() {
  try {
    if (isEdit.value) {
      await warehouseStore.updateWarehouse({ id: form.value.who_no, warehouse_name: form.value.who_name, status: form.value.active_status })
    } else {
      await warehouseStore.addWarehouse({ warehouse_id: form.value.who_no, warehouse_name: form.value.who_name, status: form.value.active_status })
    }
    showModal.value = false
  } catch (e) {}
}
function openDeleteModal(item) {
  deleteTarget.value = item
  showDelete.value = true
}
async function deleteWarehouse() {
  try {
    await warehouseStore.deleteWarehouse(deleteTarget.value.who_no)
    showDelete.value = false
  } catch (e) {}
}
async function toggleStatus(item) {
  try {
    await warehouseStore.toggleWarehouseStatus(item.who_no)
  } catch (e) {}
}

function statusText(status) {
  if (status === '1') return 'ใช้งาน';
  if (status === '0') return 'ไม่ใช้งาน';
  if (status === '3') return 'ทั้งหมด';
  return 'อื่นๆ';
}
function statusClass(status) {
  if (status === '1') return 'text-green-600';
  if (status === '0') return 'text-gray-400';
  if (status === '3') return 'text-blue-500';
  return 'text-orange-500';
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb #fff;
}
</style> 