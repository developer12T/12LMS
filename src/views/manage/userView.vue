<template>
  <div class="flex-1 bg-gray-50 min-h-screen">

    <!-- Loading overlay -->
    <div v-if="userStore.loading" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div class="flex flex-col items-center">
        <Icon icon="mdi:loading" class="animate-spin w-12 h-12 text-sky-600 mb-2" />
        <div class="text-sky-700 font-medium">กำลังโหลดข้อมูลผู้ใช้งาน...</div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mt-4 p-4">
      <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <!-- จำนวนทั้งหมด ฝั่งซ้าย -->
        <div class="text-xs text-gray-600 w-full sm:w-auto mb-2 sm:mb-0">
          จำนวนทั้งหมด: <span class="font-semibold">{{ filteredUsers.length }}</span> คน
        </div>
        <!-- Filter แผนก ขวา (medium) -->
        <div class="flex flex-col sm:flex-row justify-end items-center gap-2 w-full sm:w-auto">
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
      <div class="overflow-x-auto rounded-lg overflow-y-auto custom-scrollbar" style="height: calc(100vh - 200px);">
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
            <tr v-if="filteredUsers.length === 0">
              <td colspan="10" class="text-center text-gray-400 py-6">ไม่พบข้อมูลผู้ใช้งาน</td>
            </tr>
            <tr v-for="(user, idx) in filteredUsers" :key="user.employeeID" class="hover:bg-sky-50 transition cursor-pointer" @click="openUserDetail(user)">
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
          </tbody>
        </table>
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
</script> 