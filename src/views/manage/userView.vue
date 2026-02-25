<template>
  <div class="flex-1 bg-gray-50 min-h-screen">

    <!-- Loading overlay -->
    <div v-if="userStore.loading" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div class="flex flex-col items-center">
        <Icon icon="mdi:loading" class="animate-spin w-12 h-12 text-sky-600 mb-2" />
        <div class="text-sky-700 font-medium">กำลังโหลดข้อมูลผู้ใช้งาน...</div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mt-4 p-4">
      <div class="border-b border-gray-200 mb-4">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'employee'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'employee'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <Icon icon="mdi:account-group" class="w-4 h-4 inline mr-2" />
            ข้อมูลพนักงาน
          </button>
          <button
            @click="activeTab = 'access'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'access'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <Icon icon="mdi:shield-account" class="w-4 h-4 inline mr-2" />
            จัดการการเข้าใช้งาน
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div v-if="activeTab === 'employee'">
        <!-- Employee Data Tab Content -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <!-- จำนวนทั้งหมด ฝั่งซ้าย -->
          <div class="text-xs text-gray-600 w-full sm:w-auto mb-2 sm:mb-0">
            จำนวนทั้งหมด: <span class="font-semibold">{{ filteredUsers.length }}</span> คน
          </div>
          
          <!-- Filter แผนก ขวา (medium) -->
          <div class="flex flex-col sm:flex-row justify-end items-center gap-2 w-full sm:w-auto">
            <button @click="downloadUsersExcel" class="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded px-4 py-1.5 transition-colors shadow min-w-[80px] justify-center">
              <Icon icon="file-icons:microsoft-excel" width="16" height="16" class="mr-1.5" />
              Export Excel
            </button>
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <label class="text-xs font-medium text-gray-700 whitespace-nowrap">แผนก : </label>
              <select v-model="selectedDepartment"
                class="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full sm:w-44 py-1.5 px-3">
                <option value="">ทุกแผนก</option>
                <option v-for="dept in departmentOptions" :key="dept" :value="dept">{{ dept }}</option>
              </select>
            </div>
            <!-- ช่องค้นหา ขวา (medium) -->
            <div class="relative w-full sm:w-60">
              <Icon icon="mdi:magnify" class="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input v-model="search" type="text" placeholder="ค้นหา..." class="w-full pl-10 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <!-- ปุ่ม Export Excel -->
          
          </div>
        </div>
        <!-- Action bar -->
        <div v-if="selectedEmployeeIDs.length" class="flex items-center gap-2 mb-2">
          <span class="text-xs">เลือก {{ selectedEmployeeIDs.length }} คน</span>
          <select v-model="bulkRole" class="border border-gray-300 rounded px-2 py-1 text-xs">
            <option value="">เลือกสิทธิ์ใหม่</option>
            <option v-for="opt in roleOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <button @click="saveBulkRole" :disabled="!bulkRole || bulkLoading" class="px-2 py-1 rounded bg-sky-700 text-white text-xs">
            <Icon v-if="bulkLoading" icon="mdi:loading" class="animate-spin w-4 h-4 inline mr-1" />
            บันทึกสิทธิ์ที่เลือก
          </button>
        </div>
        <div class="overflow-x-auto rounded-lg overflow-y-auto custom-scrollbar" style="height: calc(100vh - 280px);">
          <div class="virtual-table-container rounded-lg overflow-auto" style="height: calc(100vh - 280px);" @scroll="handleScroll">
            <table class="min-w-full text-xs text-left text-gray-700 border border-gray-200 bg-white">
              <thead class="bg-gray-100 sticky top-0">
                <tr>
                  <th class="p-3">
                    <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
                  </th>
                  <th class="p-3">รูป</th>
                  <th class="p-3">รหัสพนักงาน</th>
                  <th class="p-3">ชื่อผู้ใช้</th>
                  <th class="p-3">ชื่อ-สกุล (ไทย)</th>
                  <th class="p-3">อีเมล</th>
                  <th class="p-3">แผนก</th>
                  <th class="p-3">ตำแหน่ง</th>
                  <th class="p-3">สิทธิ์</th>
                  <th class="p-3 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                <!-- Top padding for virtual scrolling -->
                <tr v-if="topPadding > 0">
                  <td :colspan="10" :style="{ height: topPadding + 'px', padding: 0 }"></td>
                </tr>

                <tr v-if="virtualScrollData.length === 0">
                  <td colspan="10" class="text-center text-gray-400 py-6">ไม่พบข้อมูลผู้ใช้งาน</td>
                </tr>
                <tr v-else v-for="(user, idx) in virtualScrollData" :key="user.employeeID" class="hover:bg-sky-50 transition cursor-pointer" @click="openUserDetail(user)">
                  <td class="p-3">
                    <input
                      type="checkbox"
                      :checked="selectedEmployeeIDs.includes(user.employeeID)"
                      @change.stop="toggleSelectOne(user.employeeID)"
                      @click.stop
                    />
                  </td>
                  <td class="p-3" @click="openUserDetail(user)" style="cursor:pointer">
                    <img
                      :src="user.imgUrl || defaultAvatar(user)"
                      :alt="user.fullNameThai"
                      class="w-8 h-8 rounded-full object-cover border border-gray-300"
                      @error="onImgError($event, user)"
                    />
                  </td>
                  <td class="p-3">{{ user.employeeID }}</td>
                  <td class="p-3">{{ user.userName }}</td>
                  <td class="p-3">{{ user.fullNameThai }}</td>
                  <td class="p-3">{{ user.mail || '-' }}</td>
                  <td class="p-3">{{ user.department || '-' }}</td>
                  <td class="p-3">{{ user.positon || '-' }}</td>
                  <td class="p-3">{{ user.role }}</td>
                  <td class="p-3 text-center">
                    <span :class="user.status === 1 ? 'text-green-600' : 'text-red-500'">
                      <Icon :icon="user.status === 1 ? 'mdi:check-circle' : 'mdi:close-circle'" class="w-4 h-4 inline" />
                      {{ user.status === 1 ? 'เปิดใช้งาน' : 'ปิด' }}
                    </span>
                  </td>
                </tr>

                <!-- Bottom padding for virtual scrolling -->
                <tr v-if="bottomPadding > 0">
                  <td :colspan="10" :style="{ height: bottomPadding + 'px', padding: 0 }"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Access Management Tab Content -->
      <div v-else-if="activeTab === 'access'">
        <div class="space-y-6">
          <!-- Access Control Overview -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">ภาพรวมการเข้าใช้งาน</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-white rounded-lg p-4 shadow-sm">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">ผู้ใช้งานทั้งหมด</p>
                    <p class="text-2xl font-bold text-gray-900">{{ userStore.users.length }}</p>
                  </div>
                  <Icon icon="mdi:account-group" class="w-8 h-8 text-sky-600" />
                </div>
              </div>
              <div class="bg-white rounded-lg p-4 shadow-sm">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">ผู้ใช้งานที่เปิดใช้งาน</p>
                    <p class="text-2xl font-bold text-green-600">{{ userStore.users.filter(u => u.status === 1).length }}</p>
                  </div>
                  <Icon icon="mdi:check-circle" class="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div class="bg-white rounded-lg p-4 shadow-sm">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">ผู้ใช้งานที่ปิดใช้งาน</p>
                    <p class="text-2xl font-bold text-red-600">{{ userStore.users.filter(u => u.status === 0).length }}</p>
                  </div>
                  <Icon icon="mdi:close-circle" class="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          <!-- Role Management -->
          <div class="bg-white rounded-lg border border-gray-200">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-800">จัดการสิทธิ์การเข้าใช้งาน</h3>
              <p class="text-sm text-gray-600 mt-1">กำหนดสิทธิ์การเข้าถึงระบบสำหรับผู้ใช้งานแต่ละคน</p>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div v-for="role in roleOptions" :key="role.value" class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-medium text-gray-800">{{ role.label }}</h4>
                    <span class="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded-full">
                      {{ userStore.users.filter(u => u.role === role.value).length }} คน
                    </span>
                  </div>
                  <p class="text-xs text-gray-600">
                    {{ getRoleDescription(role.value) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Access Log -->
          <div class="bg-white rounded-lg border border-gray-200">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-800">ประวัติการเข้าใช้งาน</h3>
              <p class="text-sm text-gray-600 mt-1">ดูประวัติการเข้าใช้งานระบบล่าสุด</p>
            </div>
            <div class="p-4">
              <div class="bg-gray-50 rounded-lg p-4 text-center">
                <Icon icon="mdi:clock-outline" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p class="text-gray-600">ยังไม่มีข้อมูลประวัติการเข้าใช้งาน</p>
                <p class="text-sm text-gray-500">ข้อมูลจะแสดงที่นี่เมื่อมีการเข้าใช้งานระบบ</p>
              </div>
            </div>
          </div>

          <!-- Security Settings -->
          <div class="bg-white rounded-lg border border-gray-200">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-800">การตั้งค่าความปลอดภัย</h3>
              <p class="text-sm text-gray-600 mt-1">กำหนดนโยบายความปลอดภัยสำหรับการเข้าใช้งานระบบ</p>
            </div>
            <div class="p-4 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-800">การยืนยันตัวตนแบบ 2 ขั้นตอน</h4>
                  <p class="text-sm text-gray-600">เปิดใช้งานการยืนยันตัวตนด้วย SMS หรือ Email</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="securitySettings.twoFactor" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-800">จำกัดการเข้าใช้งานตาม IP</h4>
                  <p class="text-sm text-gray-600">อนุญาตให้เข้าใช้งานเฉพาะจาก IP ที่กำหนด</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="securitySettings.ipRestriction" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-800">บันทึกประวัติการเข้าใช้งาน</h4>
                  <p class="text-sm text-gray-600">บันทึกข้อมูลการเข้าใช้งานของผู้ใช้ทุกคน</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="securitySettings.accessLog" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Add/Edit User -->
    <div v-if="showUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <h3 class="text-lg font-semibold mb-4">{{ editingUser ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งาน' }}</h3>
        <form @submit.prevent="saveUser">
          <div class="mb-3">
            <label class="block text-xs font-medium mb-1">ชื่อผู้ใช้</label>
            <input v-model="userForm.userName" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500" required />
          </div>
          <div class="mb-3">
            <label class="block text-xs font-medium mb-1">อีเมล</label>
            <input v-model="userForm.mail" type="email" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500" required />
          </div>
          <div class="mb-3">
            <label class="block text-xs font-medium mb-1">สิทธิ์</label>
            <select v-model="userForm.role" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500" required>
              <option value="">เลือกสิทธิ์</option>
              <option value="admin">ผู้ดูแล</option>
              <option value="user">ผู้ใช้งาน</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-xs font-medium mb-1">สถานะ</label>
            <select v-model="userForm.status" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500">
              <option :value="1">เปิดใช้งาน</option>
              <option :value="0">ปิด</option>
            </select>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="closeUserModal" class="px-3 py-1 rounded bg-gray-200 text-gray-700">ยกเลิก</button>
            <button type="submit" class="px-3 py-1 rounded bg-sky-700 text-white">{{ editingUser ? 'บันทึก' : 'เพิ่ม' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Confirm Delete -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-xs p-6 relative">
        <Icon icon="mdi:alert" class="w-10 h-10 text-red-400 mb-2 mx-auto" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2 text-center">ยืนยันการลบผู้ใช้งาน</h3>
        <p class="text-center text-gray-500 mb-4">คุณต้องการลบผู้ใช้งานนี้ใช่หรือไม่?</p>
        <div class="flex justify-end space-x-2 mt-2">
          <button @click="showDeleteModal = false" class="px-3 py-1 rounded bg-gray-200 text-gray-700">ยกเลิก</button>
          <button @click="deleteUser" class="px-3 py-1 rounded bg-red-600 text-white">ลบ</button>
        </div>
      </div>
    </div>

    <!-- Modal: User Detail -->
    <div v-if="showUserDetailModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-8 relative">
        <button @click="closeUserDetailModal" class="absolute top-3 right-3 p-2 rounded hover:bg-gray-200">
          <Icon icon="mdi:close" class="w-6 h-6 text-gray-400" />
        </button>
        <div class="flex flex-col items-center">
          <img :src="selectedUserDetail.imgUrl || defaultAvatar(selectedUserDetail)" :alt="selectedUserDetail.fullNameThai" class="w-28 h-28 rounded-full object-cover border border-gray-300 mb-4" @error="onImgError($event, selectedUserDetail)" />
          <div class="text-xl font-semibold mb-1 text-center">{{ selectedUserDetail.fullNameThai || '-' }}</div>
          <div class="text-sm text-gray-500 mb-3 text-center">{{ selectedUserDetail.userName }}</div>
          <div class="w-full text-sm text-gray-700 space-y-2">
            <div><span class="font-medium">รหัสพนักงาน:</span> {{ selectedUserDetail.employeeID }}</div>
            <div><span class="font-medium">อีเมล:</span> {{ selectedUserDetail.mail || '-' }}</div>
            <div><span class="font-medium">แผนก:</span> {{ selectedUserDetail.department || '-' }}</div>
            <div><span class="font-medium">ตำแหน่ง:</span> {{ selectedUserDetail.positon || '-' }}</div>
            <div class="flex items-center gap-2">
              <span class="font-medium">สิทธิ์:</span>
              <select v-model="selectedUserDetail.role" class="border border-gray-300 rounded px-2 py-1 text-xs" required>
                <option disabled value="">เลือกสิทธิ์</option>
                <option v-for="opt in roleOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
            <div><span class="font-medium">สถานะ:</span>
              <span :class="selectedUserDetail.status === 1 ? 'text-green-600' : 'text-red-500'">
                <Icon :icon="selectedUserDetail.status === 1 ? 'mdi:check-circle' : 'mdi:close-circle'" class="w-5 h-5 inline" />
                {{ selectedUserDetail.status === 1 ? 'เปิดใช้งาน' : 'ปิด' }}
              </span>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6 w-full">
            <button @click="closeUserDetailModal" class="px-3 py-1 rounded bg-gray-200 text-gray-700">ยกเลิก</button>
            <button @click="saveUserRole" :disabled="!selectedUserDetail.role" class="px-3 py-1 rounded bg-sky-700 text-white">บันทึก</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import PageHeader from '@/components/PageHeader.vue';
import { useUserStore } from '@/stores/modules/user';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const userStore = useUserStore();
const search = ref('');
const selectedDepartment = ref('');
const showUserModal = ref(false);
const editingUser = ref(null);
const userForm = ref({ employeeID: '', userName: '', fullNameThai: '', mail: '', department: '', position: '', role: '', status: 1 });
const showDeleteModal = ref(false);
const userToDelete = ref(null);
const selectedUserDetail = ref(null);
const showUserDetailModal = ref(false);
const editedRole = ref('');
const selectedEmployeeIDs = ref([]);
const activeTab = ref('employee');

// Security settings for access management tab
const securitySettings = ref({
  twoFactor: false,
  ipRestriction: false,
  accessLog: true
});

const isAllSelected = computed(() =>
  filteredUsers.value.length > 0 &&
  filteredUsers.value.every(u => selectedEmployeeIDs.value.includes(u.employeeID))
);

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedEmployeeIDs.value = [];
  } else {
    selectedEmployeeIDs.value = filteredUsers.value.map(u => u.employeeID);
  }
}

function toggleSelectOne(employeeID) {
  if (selectedEmployeeIDs.value.includes(employeeID)) {
    selectedEmployeeIDs.value = selectedEmployeeIDs.value.filter(id => id !== employeeID);
  } else {
    selectedEmployeeIDs.value.push(employeeID);
  }
}

const bulkRole = ref('');
const bulkLoading = ref(false);
async function saveBulkRole() {
  if (!bulkRole.value) return;
  bulkLoading.value = true;
  for (const id of selectedEmployeeIDs.value) {
    await userStore.updateUserRole(id, bulkRole.value);
    const u = userStore.users.find(u => u.employeeID === id);
    if (u) u.role = bulkRole.value;
  }
  selectedEmployeeIDs.value = [];
  bulkRole.value = '';
  bulkLoading.value = false;
}

const departmentOptions = computed(() => {
  const set = new Set(userStore.users.map(u => u.department).filter(Boolean));
  return Array.from(set);
});

const roleOptions = [
  { value: 'User', label: 'User' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Supervisor', label: 'Supervisor' },
  { value: 'NoUse', label: 'NoUse' },
];

// Function to get role description
function getRoleDescription(role) {
  const descriptions = {
    'User': 'ผู้ใช้งานทั่วไป สามารถดูข้อมูลและรายงานได้',
    'Admin': 'ผู้ดูแลระบบ มีสิทธิ์เต็มในการจัดการระบบ',
    'Manager': 'ผู้จัดการ สามารถจัดการข้อมูลและดูรายงานได้',
    'Supervisor': 'หัวหน้างาน สามารถดูและจัดการข้อมูลในส่วนที่รับผิดชอบ',
    'NoUse': 'ไม่มีการใช้งานในระบบ'
  };
  return descriptions[role] || 'ไม่ระบุ';
}

const filteredUsers = computed(() => {
  let arr = userStore.users;
  if (selectedDepartment.value) {
    arr = arr.filter(u => u.department === selectedDepartment.value);
  }
  if (search.value) {
    const s = search.value.toLowerCase();
    arr = arr.filter(u =>
      (u.userName?.toLowerCase().includes(s) ||
      u.fullNameThai?.toLowerCase().includes(s) ||
      u.mail?.toLowerCase().includes(s) ||
      u.department?.toLowerCase().includes(s) ||
      u.position?.toLowerCase().includes(s) ||
      u.role?.toLowerCase().includes(s))
    );
  }
  // เรียงตาม department (null/undefined/ว่าง อยู่ล่างสุด)
  return arr.slice().sort((a, b) => {
    if (!a.department && !b.department) return 0;
    if (!a.department) return 1;
    if (!b.department) return -1;
    return a.department.localeCompare(b.department, 'th', { sensitivity: 'base' });
  });
});

// Virtual scrolling properties
const rowHeight = 60; // ความสูงแต่ละแถว (px)
const visibleRows = 15; // จำนวนแถวที่แสดงพร้อมกัน
const scrollTop = ref(0);
const containerHeight = ref(0);

// คำนวณแถวที่ควรแสดงจาก scroll position
const virtualScrollData = computed(() => {
  if (!filteredUsers.value) return [];

  const startIndex = Math.floor(scrollTop.value / rowHeight);
  const endIndex = Math.min(startIndex + visibleRows, filteredUsers.value.length);

  return filteredUsers.value.slice(startIndex, endIndex).map((user, index) => ({
    ...user,
    virtualIndex: startIndex + index,
    originalIndex: startIndex + index
  }));
});

// คำนวณ padding-top เพื่อให้ scroll bar ถูกต้อง
const topPadding = computed(() => {
  return Math.floor(scrollTop.value / rowHeight) * rowHeight;
});

// คำนวณ padding-bottom เพื่อให้ความสูงรวมเท่าเดิม
const bottomPadding = computed(() => {
  if (!filteredUsers.value) return 0;
  const totalHeight = filteredUsers.value.length * rowHeight;
  const visibleHeight = visibleRows * rowHeight;
  const remainingHeight = totalHeight - visibleHeight - topPadding.value;
  return Math.max(0, remainingHeight);
});

// จัดการ scroll event
const handleScroll = (event) => {
  scrollTop.value = event.target.scrollTop;
};

// ตั้งค่าความสูง container
const setContainerHeight = () => {
  const container = document.querySelector('.virtual-table-container');
  if (container) {
    containerHeight.value = container.clientHeight;
  }
};

onMounted(() => {
  userStore.fetchUsers();
});

function defaultAvatar(user) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullNameThai || user.fullName || user.userName || 'User')}`;
}
function onImgError(event, user) {
  event.target.src = defaultAvatar(user);
}

function openAddUser() {
  editingUser.value = null;
  userForm.value = { employeeID: '', userName: '', fullNameThai: '', mail: '', department: '', position: '', role: '', status: 1 };
  showUserModal.value = true;
}
function editUser(user) {
  editingUser.value = user;
  userForm.value = { ...user };
  showUserModal.value = true;
}
function closeUserModal() {
  showUserModal.value = false;
}
function saveUser() {
  // TODO: Implement API call for add/edit user
  showUserModal.value = false;
}
function confirmDelete(user) {
  userToDelete.value = user;
  showDeleteModal.value = true;
}
function deleteUser() {
  // TODO: Implement API call for delete user
  showDeleteModal.value = false;
}
function openUserDetail(user) {
  selectedUserDetail.value = { ...user };
  editedRole.value = user.role;
  showUserDetailModal.value = true;
}
function closeUserDetailModal() {
  showUserDetailModal.value = false;
}

async function saveUserRole() {
  if (!selectedUserDetail.value.role) return;
  try {
    await userStore.updateUserRole(selectedUserDetail.value.employeeID, selectedUserDetail.value.role);
    const u = userStore.users.find(u => u.employeeID === selectedUserDetail.value.employeeID);
    if (u) u.role = selectedUserDetail.value.role;
    showUserDetailModal.value = false;
  } catch (e) {
    // handle error (optional)
  }
}

function downloadUsersExcel() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Users');
  // Header
  worksheet.addRow([
    'รหัสพนักงาน', 'ชื่อผู้ใช้', 'ชื่อ-สกุล (ไทย)', 'อีเมล', 'แผนก', 'ตำแหน่ง', 'สิทธิ์', 'สถานะ'
  ]);
  // Data
  filteredUsers.value.forEach(user => {
    worksheet.addRow([
      user.employeeID,
      user.userName,
      user.fullNameThai,
      user.mail || '-',
      user.department || '-',
      user.position || '-',
      user.role,
      user.status === 1 ? 'เปิดใช้งาน' : 'ปิด',
    ]);
  });
  // Style header
  worksheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF3F4F6' }
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
    };
  });
  // Set column widths
  [15, 18, 28, 28, 18, 18, 12, 12].forEach((w, i) => worksheet.getColumn(i + 1).width = w);
  workbook.xlsx.writeBuffer().then(buffer => {
    saveAs(new Blob([buffer]), `users_${new Date().toISOString().slice(0, 10)}.xlsx`);
  });
}
</script>

<style scoped>
/* Virtual scrolling styles */
.virtual-table-container {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.virtual-table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.virtual-table-container::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 4px;
}

.virtual-table-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.virtual-table-container::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Ensure table rows have consistent height */
.virtual-table-container tbody tr {
  height: 60px;
}

/* Smooth scrolling */
.virtual-table-container {
  scroll-behavior: smooth;
}
</style> 