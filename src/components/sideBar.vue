<template>
  <!-- Collapsible Sidebar -->
  <div :class="[
    'bg-sky-700 text-white transition-all duration-300 relative h-screen flex flex-col',
    isCollapsed ? 'w-16' : 'w-72'
  ]">
    <!-- Header with Logo -->
    <div class="p-4 border-b border-sky-800 flex-shrink-0">
      <div class="flex items-center justify-between">
        <div v-if="!isCollapsed" class="flex items-center space-x-3">
          <img src="/logo-onetwo.png" alt="Company Logo" class="h-8 w-auto" />
          <h5 class="text-sm font-semibold">Logistic Management</h5>
        </div>
        <button @click="toggleCollapse" class="p-2 rounded-lg hover:bg-sky-600 transition-colors">
          <Icon icon="mdi:menu" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Search - Only show when expanded -->
    <div v-if="!isCollapsed" class="p-4 flex-shrink-0">
      <div class="relative">
        <Icon icon="mdi:magnify" class="w-4 h-4 absolute left-3 top-3 text-gray-300" />
        <input v-model="searchTerm" type="text" placeholder="12Pilots..."
          class="w-full pl-10 pr-4 py-2 bg-sky-800 border border-sky-700 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white" />
      </div>
    </div>

    <!-- Navigation - Scrollable -->
    <nav :class="[isCollapsed ? 'overflow-visible' : 'overflow-y-auto overflow-x-hidden', 'flex-1']">
      <div v-for="(data, system) in menuData" :key="system" class="relative" v-show="isMenuVisible(system, data)">
        <button @click="isCollapsed ? toggleMiniMenu(system) : toggleMenu(system)" v-if="system === 'OMS'"
          :title="isCollapsed ? 'คลิกเพื่อขยายเมนู' : ''" :class="[
            'w-full flex items-center px-4 py-3 text-left hover:bg-sky-600 transition-colors relative text-sm',
            isCollapsed ? 'justify-center' : 'justify-between',
            isCollapsed && isActiveSystem(system, data) ? 'bg-sky-600' : ''
          ]">
          <div class="flex items-center space-x-3">
            <Icon :icon="data.icon" class="w-5 h-5" />
            <span v-if="!isCollapsed" class="font-medium">{{ system }}</span>
          </div>
          <Icon v-if="!isCollapsed" :icon="expandedMenus[system] ? 'mdi:chevron-down' : 'mdi:chevron-right'"
            class="w-4 h-4" />
        </button>

        <!-- Mini Menu Dropdown - Show on hover when collapsed -->
        <div v-if="isCollapsed && activeMiniMenu === system"
          class="absolute left-full top-0 ml-2 w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50 max-h-[80vh] overflow-y-auto">
          <div class="p-3 border-b border-slate-700 flex-shrink-0">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Icon :icon="data.icon" class="w-5 h-5 text-sky-500" />
                <span class="font-semibold text-white text-sm">{{ data.label }}</span>
              </div>
              <button @click="activeMiniMenu = null" class="p-1 hover:bg-slate-600 rounded transition-colors"
                title="ปิดเมนู">
                <Icon icon="mdi:close" class="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>
          <div class="p-2">
            <div v-for="(categoryData, category) in data.items" :key="category" class="mb-3"
              v-show="isCategoryVisible(system, category, categoryData)">
              <div class="flex items-center space-x-2 px-3 py-2 text-xs font-medium text-gray-300">
                <Icon :icon="categoryData.icon" class="w-4 h-4" />
                <span>{{ category }}</span>
              </div>
              <div class="ml-3">
                <router-link v-for="item in categoryData.children" :key="item"
                  :to="getRoutePath(system, category, item)" :class="[
                    'block px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-sky-600 rounded transition-colors relative',
                    isActiveRoute(system, category, item) ? 'bg-slate-700 text-white font-semibold' : ''
                  ]" v-show="isItemVisible(system, category, item)">
                  <div class="flex items-center justify-between">
                    <span>{{ item }}</span>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Expanded Menu - Show when not collapsed -->
        <div v-if="expandedMenus[system] && !isCollapsed" class="ml-4 border-l border-sky-800">
          <div v-for="(categoryData, category) in data.items" :key="category" class="mb-1"
            v-show="isCategoryVisible(system, category, categoryData)">
            <button @click="toggleMenu(`${system}-${category}`)" :class="[
              'w-full flex items-center justify-between px-4 py-2 text-xs hover:bg-sky-600 transition-colors relative',
              isActiveCategory(system, category, categoryData) ? 'text-white' : 'text-gray-300'
            ]">
              <div class="flex items-center space-x-2">
                <Icon :icon="categoryData.icon" class="w-4 h-4" />
                <span>{{ category }}</span>
              </div>
              <Icon :icon="expandedMenus[`${system}-${category}`] ? 'mdi:chevron-down' : 'mdi:chevron-right'"
                class="w-3 h-3" />
            </button>

            <div v-if="expandedMenus[`${system}-${category}`]" class="ml-6">
              <router-link v-for="item in categoryData.children" :key="item" :to="getRoutePath(system, category, item)"
                :class="[
                  'block px-4 py-2 text-xs text-gray-200 hover:text-white hover:bg-sky-600 rounded transition-colors relative',
                  isActiveRoute(system, category, item) ? 'bg-sky-800 text-white font-semibold' : ''
                ]" v-show="isItemVisible(system, category, item)">
                <div class="flex items-center justify-between">
                  <span>{{ item }}</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Footer - Always show home icon when collapsed -->
    <div class="p-4 border-t border-sky-800 flex-shrink-0">
      <router-link :to="'/dashboard'" :class="[
        'w-full flex items-center space-x-3 px-2 py-2 hover:bg-sky-600 rounded transition-colors text-sm',
        isCollapsed ? 'justify-center' : ''
      ]">
        <Icon icon="mdi:home" class="w-6 h-6" />
        <span v-if="!isCollapsed">หน้าหลัก</span>
      </router-link>

      <button @click="confirmLogout" :class="[
        'w-full flex items-center space-x-3 px-2 py-2 hover:bg-sky-600 rounded transition-colors text-sm',
        isCollapsed ? 'justify-center' : ''
      ]">
        <Icon icon="mdi:logout" class="w-6 h-6 text-red-400" />
        <span v-if="!isCollapsed" class="text-red-400">ออกจากระบบ</span>
      </button>
    </div>

    <!-- Modal ยืนยัน logout (Best Practice) -->
    <div v-if="showLogoutModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-xs p-6 relative">
        <h3 class="text-lg font-semibold mb-4 text-center">ยืนยันการออกจากระบบ</h3>
        <div class="flex justify-end space-x-2 mt-2">
          <button @click="cancelLogout" class="px-3 py-1 rounded bg-gray-200 text-gray-700">ยกเลิก</button>
          <button @click="proceedLogout" class="px-3 py-1 rounded bg-sky-600 text-white">ตกลง</button>
        </div>
      </div>
    </div>
  </div>

  <footer :class="[
    'fixed bottom-0 bg-none dark:bg-gray-800 z-30 ml-2 transition-all duration-300',
    // 'fixed bottom-0 bg-[#F3F4F6] rounded-lg shadow-sm dark:bg-gray-800 z-30 ml-2 transition-all duration-300',
    isCollapsed ? 'left-14 right-4' : 'left-72 right-4'
  ]">
    <div class="w-full mx-auto p-4 pb-2">

      <div class="flex items-center justify-start space-x-2">
        <img src="/logo-fplus.png" alt="logo" class="h-4 object-contain" />
        <span class="text-xs text-gray-500 dark:text-gray-400">
          Copyright One Two Trading Co., Ltd. All rights reserved.
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/modules/auth';

const route = useRoute();
const router = useRouter();
const isCollapsed = ref(true);
const searchTerm = ref('');
const activeMiniMenu = ref(null);
const expandedMenus = ref({});
const authStore = useAuthStore();
const showLogoutModal = ref(false);

const menuData = {
  OMS: {
    icon: 'lets-icons:order-fill',
    label: 'Order Management',
    items: {
      'รายงาน': {
        icon: 'mdi:file-document',
        children: [
          // '%เติมสินค้าเข้า DC',
          // 'Stock On Hand',
          'Daily Stock',
          // 'สินค้าที่ยังไม่ได้เปิด Invoice',
          // 'ออเดอร์ค้างส่ง(หน่วยรถ)',
          // 'วางแผน',
          // 'วางแผนรวม',
          // 'อายุสินค้าคงเหลือ',
          // 'ค่าขนส่ง(shipment)',
          // '% ontime'
        ]
      },
      'จัดการ': {
        icon: 'mdi:cog',
        children: [
          'ออเดอร์ค้างส่ง',
          // 'ออเดอร์ค้างส่ง(หน่วยรถ)',
          // 'กำหนดปริมาตรและน้ำหนักรถบรรทุก',
          // 'จัดการค่าขนส่ง',
          // 'กำหนดค่าขนส่ง'
        ]
      }
    }
  },
  WMS: {
    icon: 'mdi:warehouse',
    label: 'Warehouse Management',
    items: {
      'Reports': {
        icon: 'mdi:file-chart',
        children: []
      },
      'Management': {
        icon: 'mdi:cog',
        children: []
      }
    }
  },
  TMS: {
    icon: 'mdi:truck',
    label: 'Transport Management',
    items: {
      'Reports': {
        icon: 'mdi:file-document',
        children: []
      },
      'Management': {
        icon: 'mdi:cog',
        children: []
      }
    }
  },
  PMS: {
    icon: 'icon-park-solid:plan',
    label: 'Planning Management',
    items: {
      'Reports': {
        icon: 'mdi:trending-up',
        children: []
      },
      'Management': {
        icon: 'mdi:package-variant',
        children: []
      }
    }
  }
};

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
}

function toggleMenu(menuKey) {
  expandedMenus.value[menuKey] = !expandedMenus.value[menuKey];
}

function toggleMiniMenu(system) {
  if (activeMiniMenu.value === system) {
    activeMiniMenu.value = null;
  } else {
    activeMiniMenu.value = system;
  }
}

function getRoutePath(system, category, item) {
  const routeMap = {
    'OMS': {
      'รายงาน': {
        '%เติมสินค้าเข้า DC': '/tms/report/percent-fill-to-dc',
        'Stock On Hand': '/tms/report/stock-on-hand',
        'Daily Stock': '/tms/report/daily-stock',
        'สินค้าที่ยังไม่ได้เปิด Invoice': '/tms/report/not-open-invoice',
        'ออเดอร์ค้างส่ง(หน่วยรถ)': '/tms/report/backlog-unit',
        'วางแผน': '/tms/report/plan',
        'วางแผนรวม': '/tms/report/plan-total',
        'อายุสินค้าคงเหลือ': '/tms/report/stock-age',
        'ค่าขนส่ง(shipment)': '/tms/report/shipment-cost',
        'ค่าขนส่ง(รถร่วม)': '/tms/report/shared-vehicle-cost',
        '% ontime': '/tms/report/ontime-percent'
      },
      'จัดการ': {
        'ออเดอร์ค้างส่ง': '/tms/manage/backlog',
        'ออเดอร์ค้างส่ง(หน่วยรถ)': '/tms/manage/backlog-unit',
        'กำหนดปริมาตรและน้ำหนักรถบรรทุก': '/tms/manage/weight-volume',
        'จัดการค่าขนส่ง': '/tms/manage/shipcost-management',
        'กำหนดค่าขนส่ง': '/tms/manage/shipcost-setting'
      }
    },
    'WMS': {
      'Reports': {
      },
      'Management': {
      }
    },
    'TMS': {
      'Reports': {
      },
      'Management': {
      }
    },
    'PMS': {
      'Reports': {
      },
      'Management': {
      }
    }
  };

  // Return mapped route or default to dashboard
  return routeMap[system]?.[category]?.[item] || '/dashboard';
}

// Search functionality
function isMenuVisible(system, data) {
  if (!searchTerm.value) return true;

  const searchLower = searchTerm.value.toLowerCase();

  // Check if system name matches
  if (system.toLowerCase().includes(searchLower)) return true;

  // Check if any category or item matches
  for (const [category, categoryData] of Object.entries(data.items)) {
    if (category.toLowerCase().includes(searchLower)) return true;

    for (const item of categoryData.children) {
      if (item.toLowerCase().includes(searchLower)) return true;
    }
  }

  return false;
}

function isCategoryVisible(system, category, categoryData) {
  if (!searchTerm.value) return true;

  const searchLower = searchTerm.value.toLowerCase();

  // Check if category name matches
  if (category.toLowerCase().includes(searchLower)) return true;

  // Check if any item in this category matches
  for (const item of categoryData.children) {
    if (item.toLowerCase().includes(searchLower)) return true;
  }

  return false;
}

function isItemVisible(system, category, item) {
  if (!searchTerm.value) return true;

  const searchLower = searchTerm.value.toLowerCase();
  return item.toLowerCase().includes(searchLower);
}

// Function to check if a menu item is active
function isActiveRoute(system, category, item) {
  const currentPath = route.path;
  const itemPath = getRoutePath(system, category, item);
  return currentPath === itemPath;
}

// Function to check if a category is active (has active children)
function isActiveCategory(system, category, categoryData) {
  return categoryData.children.some(item => isActiveRoute(system, category, item));
}

// Function to check if a system is active (has active categories)
function isActiveSystem(system, data) {
  for (const [category, categoryData] of Object.entries(data.items)) {
    if (isActiveCategory(system, category, categoryData)) {
      return true;
    }
  }
  return false;
}

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

// สำหรับ modal
const confirmLogout = () => {
  showLogoutModal.value = true;
};
const cancelLogout = () => {
  showLogoutModal.value = false;
};
const proceedLogout = async () => {
  showLogoutModal.value = false;
  await handleLogout();
};
</script>

<style scoped>
/* Custom Scrollbar Styles */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(0, 64, 128, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  transition: background 0.2s ease;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Firefox scrollbar styles */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) rgba(0, 64, 128, 0.3);
}

/* Smooth scrolling for better UX */
.overflow-y-auto {
  scroll-behavior: smooth;
}

/* Hide scrollbar when not needed */
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: transparent;
}

.overflow-y-auto:hover::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
}

/* Custom scrollbar for mini menu dropdown */
.max-h-\[80vh\]::-webkit-scrollbar {
  width: 4px;
}

.max-h-\[80vh\]::-webkit-scrollbar-track {
  background: rgba(51, 51, 51, 0.3);
  border-radius: 2px;
}

.max-h-\[80vh\]::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  transition: background 0.2s ease;
}

.max-h-\[80vh\]::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

.max-h-\[80vh\] {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) rgba(51, 51, 51, 0.3);
}

/* Smooth scrolling for mini menu */
.max-h-\[80vh\] {
  scroll-behavior: smooth;
}

/* Hide scrollbar when not needed for mini menu */
.max-h-\[80vh\]::-webkit-scrollbar-thumb {
  background: transparent;
}

.max-h-\[80vh\]:hover::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

/* Custom tooltip styles */
button[title] {
  position: relative;
}

button[title]:hover::after {
  content: attr(title);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 10px;
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
}

/* Add a small arrow to the tooltip */
button[title]:hover::before {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 2px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent transparent rgba(0, 0, 0, 0.8);
  pointer-events: none;
}

/* Custom tooltip for user avatar */
img[title] {
  position: relative;
}

img[title]:hover::after {
  content: attr(title);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 10px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: 6px;
  font-size: 11px;
  white-space: pre-line;
  z-index: 1000;
  pointer-events: none;
  max-width: 200px;
  line-height: 1.4;
}

img[title]:hover::before {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 2px;
  border-width: 6px;
  border-style: solid;
  border-color: transparent transparent transparent rgba(0, 0, 0, 0.9);
  pointer-events: none;
}
</style>
