<template>
  <div class="w-full px-2 py-1">
    <div class="mb-2">
      <h1 class="text-sm font-bold flex items-center space-x-2 text-sky-800 dark:text-white">
        <Icon icon="mdi:chart-timeline-variant" class="w-7 h-7 text-sky-700 dark:text-sky-400" />
        <span>API Logs Dashboard</span>
      </h1>
    </div>
    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
      <div class="bg-white dark:bg-sky-900 rounded-lg shadow border border-sky-100 dark:border-sky-800 p-3">
        <div class="text-gray-500 text-xs mb-1">Total API Calls</div>
        <div class="text-sm font-bold text-sky-700 dark:text-white">{{ statistics?.totalCalls?.toLocaleString() ?? '-' }}</div>
      </div>
      <div class="bg-white dark:bg-sky-900 rounded-lg shadow border border-sky-100 dark:border-sky-800 p-3">
        <div class="text-gray-500 text-xs mb-1">Average Response Time</div>
        <div class="text-sm font-bold text-sky-700 dark:text-white">{{ statistics ? Math.round(statistics.averageResponseTime) + 'ms' : '-' }}</div>
      </div>
      <div class="bg-white dark:bg-sky-900 rounded-lg shadow border border-sky-100 dark:border-sky-800 p-3">
        <div class="text-gray-500 text-xs mb-1">Today's Calls</div>
        <div class="text-sm font-bold text-sky-700 dark:text-white">{{ todayCalls }}</div>
      </div>
      <div class="bg-white dark:bg-sky-900 rounded-lg shadow border border-sky-100 dark:border-sky-800 p-3">
        <div class="text-gray-500 text-xs mb-1">Slow Calls (&gt;1s)</div>
        <div class="text-sm font-bold text-sky-700 dark:text-white">{{ slowCalls }}</div>
      </div>
    </div>
    <!-- Navigation Tabs -->
    <div class="flex space-x-2 border-b border-sky-200 dark:border-sky-800 mb-2">
      <button v-for="tab in tabs" :key="tab.key" @click="activeTab=tab.key"
        :class="[activeTab===tab.key ? 'bg-sky-700 text-white' : 'bg-sky-100 dark:bg-sky-800 text-sky-700 dark:text-sky-200',
        'px-4 py-2 rounded-t-lg font-medium text-xs flex items-center space-x-2 transition-colors']">
        <Icon :icon="tab.icon" class="w-5 h-5" />
        <span>{{ tab.label }}</span>
      </button>
    </div>
    <!-- Tab Content -->
    <div>
      <!-- Recent Calls Tab -->
      <div v-show="activeTab==='recent'">
        <div class="bg-white dark:bg-sky-900 rounded-lg shadow border border-sky-100 dark:border-sky-800 p-4 mb-4">
          <div class="font-semibold  text-sm text-sky-700 dark:text-sky-200 mb-2 flex items-center space-x-2">
            <Icon icon="mdi:clock-outline" class="w-5 h-5" />
            <span>Recent API Calls (Last 24 Hours)</span>
          </div>
          <!-- Search and Sort Controls -->
          <div class="flex flex-col sm:flex-row gap-2 mb-3">
            <div class="flex-1">
              <input type="text" v-model="searchTerm" placeholder="ค้นหา..." 
                class="w-full px-3 py-2 rounded border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-800 text-sky-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 text-xs">
            </div>
            <select v-model="sortBy" @change="sortData"
              class="px-3 py-2 rounded border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-800 text-sky-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 text-xs">
              <option value="timestamp">เรียงตามเวลา</option>
              <option value="method">เรียงตาม Method</option>
              <option value="statusCode">เรียงตาม Status</option>
              <option value="duration">เรียงตาม Duration</option>
              <option value="fullName">เรียงตาม Employee</option>
            </select>
            <button @click="toggleSortOrder" 
              class="px-3 py-2 bg-sky-700 text-white rounded hover:bg-sky-800 transition-colors text-xs">
              <Icon :icon="sortOrder === 'desc' ? 'mdi:sort-descending' : 'mdi:sort-ascending'" class="w-4 h-4" />
            </button>
          </div>
          <div class="overflow-x-auto overflow-y-auto" style="max-height: calc(100vh - 370px);">
            <table class="min-w-full text-xs text-left">
              <thead class="bg-sky-100 dark:bg-sky-800 text-sky-700 dark:text-sky-200 sticky top-0">
                <tr>
                  <th class="px-2 py-2">Time</th>
                  <th class="px-2 py-2">Method</th>
                  <th class="px-2 py-2">URL</th>
                  <th class="px-2 py-2">Employee</th>
                  <th class="px-2 py-2">Department</th>
                  <th class="px-2 py-2">Status</th>
                  <th class="px-2 py-2">Duration</th>
                  <!-- <th class="px-2 py-2">IP</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading"><td colspan="8" class="text-center py-4">Loading...</td></tr>
                <tr v-else-if="filteredRecentLogs.length === 0"><td colspan="8" class="text-center py-4">No data found</td></tr>
                <tr v-for="log in filteredRecentLogs" :key="log._id" :class="rowClass(log)">
                  <td class="px-2 py-1">{{ formatDate(log.timestamp) }}</td>
                  <td class="px-2 py-1"><span class="inline-block px-2 py-0.5 rounded bg-sky-200 dark:bg-sky-700 text-sky-800 dark:text-sky-100">{{ log.method }}</span></td>
                  <td class="px-2 py-1">{{ log.url }}</td>
                  <td class="px-2 py-1">{{ log.headers?.fullName || log.headers?.employeeID || 'N/A' }}</td>
                  <td class="px-2 py-1">{{ log.headers?.department || 'N/A' }}</td>
                  <td class="px-2 py-1"><span :class="statusClass(log.statusCode)">{{ log.statusCode }}</span></td>
                  <td class="px-2 py-1">{{ log.duration }}ms</td>
                  <!-- <td class="px-2 py-1">{{ log.ip }}</td> -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- By Employee Tab -->
      <div v-show="activeTab==='by-employee'">
        <div class="bg-white dark:bg-sky-900 rounded-lg shadow border border-sky-100 dark:border-sky-800 p-4 mb-4">
          <div class="font-semibold text-sky-700 dark:text-sky-200 mb-2 flex items-center space-x-2">
            <Icon icon="mdi:account-search-outline" class="w-5 h-5" />
            <span>ค้นหาโดยพนักงาน</span>
          </div>
          <div class="flex flex-row sm:flex-row gap-2 mb-3">
            <input type="text" class="flex-1 px-3 py-2 rounded border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-800 text-sky-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 text-xs" v-model="employeeID" placeholder="ค้นหาด้วยรหัสพนักงาน">
            <button class="px-4 py-2 bg-sky-700 text-white text-xs rounded hover:bg-sky-800 transition-colors" @click="searchByEmployee">
              <Icon icon="mdi:magnify" class="w-3 h-3" />
            </button>
          </div>
          <!-- Search and Sort Controls -->
          <div class="flex flex-col sm:flex-row gap-2 mb-3">
            <div class="flex-1">
              <input type="text" v-model="searchTerm" placeholder="ค้นหา..." 
                class="w-full px-3 py-2 rounded border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-800 text-sky-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 text-xs">
            </div>
            <select v-model="sortBy" @change="sortData"
              class="px-3 py-2 rounded border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-800 text-sky-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 text-xs">
              <option value="timestamp">เรียงตามเวลา</option>
              <option value="method">เรียงตาม Method</option>
              <option value="statusCode">เรียงตาม Status</option>
              <option value="duration">เรียงตาม Duration</option>
            </select>
            <button @click="toggleSortOrder" 
              class="px-3 py-2 bg-sky-700 text-white rounded hover:bg-sky-800 transition-colors text-xs">
              <Icon :icon="sortOrder === 'desc' ? 'mdi:sort-descending' : 'mdi:sort-ascending'" class="w-4 h-4" />
            </button>
          </div>
          <div class="overflow-x-auto overflow-y-auto" style="max-height: calc(100vh - 420px);">
            <table class="min-w-full text-xs text-left">
              <thead class="bg-sky-100 dark:bg-sky-800 text-sky-700 dark:text-sky-200 sticky top-0">
                <tr>
                  <th class="px-2 py-2">Time</th>
                  <th class="px-2 py-2">Method</th>
                  <th class="px-2 py-2">URL</th>
                  <th class="px-2 py-2">Employee</th>
                  <th class="px-2 py-2">Department</th>
                  <th class="px-2 py-2">Status</th>
                  <th class="px-2 py-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading"><td colspan="7" class="text-center py-4">Loading...</td></tr>
                <tr v-else-if="filteredEmployeeLogs.length === 0"><td colspan="7" class="text-center py-4">Enter Employee ID to search</td></tr>
                <tr v-for="log in filteredEmployeeLogs" :key="log._id" :class="rowClass(log)">
                  <td class="px-2 py-1">{{ formatDate(log.timestamp) }}</td>
                  <td class="px-2 py-1"><span class="inline-block px-2 py-0.5 rounded bg-sky-200 dark:bg-sky-700 text-sky-800 dark:text-sky-100">{{ log.method }}</span></td>
                  <td class="px-2 py-1">{{ log.url }}</td>
                  <td class="px-2 py-1">{{ log.headers?.fullName || log.headers?.employeeID || 'N/A' }}</td>
                  <td class="px-2 py-1">{{ log.headers?.department || 'N/A' }}</td>
                  <td class="px-2 py-1"><span :class="statusClass(log.statusCode)">{{ log.statusCode }}</span></td>
                  <td class="px-2 py-1">{{ log.duration }}ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- By Date Tab -->
      <div v-show="activeTab==='by-date'">
        <div class="bg-white dark:bg-sky-900 rounded-lg shadow border border-sky-100 dark:border-sky-800 p-4 mb-4">
          <div class="font-semibold text-sky-700 dark:text-sky-200 mb-2 flex items-center space-x-2">
            <Icon icon="mdi:calendar-range-outline" class="w-5 h-5" />
            <span>Search by Date Range</span>
          </div>
          <div class="flex flex-row sm:flex-row gap-2 mb-3">
            <input type="datetime-local" class="flex-1 px-3 py-2 rounded border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-800 text-sky-900 dark:text-white focus:outline-none focus:ring-2 text-xs focus:ring-sky-400" v-model="startDate">
            <input type="datetime-local" class="flex-1 px-3 py-2 rounded border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-800 text-sky-900 dark:text-white focus:outline-none focus:ring-2 text-xs focus:ring-sky-400" v-model="endDate">
            <button class="px-4 py-2 bg-sky-700 text-white text-xs rounded hover:bg-sky-800 transition-colors" @click="searchByDate">
              <Icon icon="mdi:magnify" class="w-4 h-4" />
            </button>
          </div>
          <!-- Search and Sort Controls -->
          <div class="flex flex-col sm:flex-row gap-2 mb-3">
            <div class="flex-1">
              <input type="text" v-model="searchTerm" placeholder="ค้นหา..." 
                class="w-full px-3 py-2 rounded border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-800 text-sky-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 text-xs">
            </div>
            <select v-model="sortBy" @change="sortData"
              class="px-3 py-2 rounded border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-800 text-sky-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 text-xs">
              <option value="timestamp">เรียงตามเวลา</option>
              <option value="method">เรียงตาม Method</option>
              <option value="statusCode">เรียงตาม Status</option>
              <option value="duration">เรียงตาม Duration</option>
            </select>
            <button @click="toggleSortOrder" 
              class="px-3 py-2 bg-sky-700 text-white rounded hover:bg-sky-800 transition-colors text-xs">
              <Icon :icon="sortOrder === 'desc' ? 'mdi:sort-descending' : 'mdi:sort-ascending'" class="w-4 h-4" />
            </button>
          </div>
          <div class="overflow-x-auto overflow-y-auto" style="max-height: calc(100vh - 420px);">
            <table class="min-w-full text-xs text-left">
              <thead class="bg-sky-100 dark:bg-sky-800 text-sky-700 dark:text-sky-200 sticky top-0">
                <tr>
                  <th class="px-2 py-2">Time</th>
                  <th class="px-2 py-2">Method</th>
                  <th class="px-2 py-2">URL</th>
                  <th class="px-2 py-2">Employee</th>
                  <th class="px-2 py-2">Department</th>
                  <th class="px-2 py-2">Status</th>
                  <th class="px-2 py-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading"><td colspan="7" class="text-center py-4">Loading...</td></tr>
                <tr v-else-if="filteredDateLogs.length === 0"><td colspan="7" class="text-center py-4">Select date range to search</td></tr>
                <tr v-for="log in filteredDateLogs" :key="log._id" :class="rowClass(log)">
                  <td class="px-2 py-1">{{ formatDate(log.timestamp) }}</td>
                  <td class="px-2 py-1"><span class="inline-block px-2 py-0.5 rounded bg-sky-200 dark:bg-sky-700 text-sky-800 dark:text-sky-100">{{ log.method }}</span></td>
                  <td class="px-2 py-1">{{ log.url }}</td>
                  <td class="px-2 py-1">{{ log.headers?.fullName || log.headers?.employeeID || 'N/A' }}</td>
                  <td class="px-2 py-1">{{ log.headers?.department || 'N/A' }}</td>
                  <td class="px-2 py-1"><span :class="statusClass(log.statusCode)">{{ log.statusCode }}</span></td>
                  <td class="px-2 py-1">{{ log.duration }}ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- Slow Calls Tab -->
      <div v-show="activeTab==='slow-calls'">
        <div class="bg-white dark:bg-sky-900 rounded-lg shadow border border-sky-100 dark:border-sky-800 p-4 mb-4">
          <div class="font-semibold text-sky-700 dark:text-sky-200 mb-2 flex items-center space-x-2">
            <Icon icon="mdi:alert-outline" class="w-5 h-5" />
            <span>Slow API Calls</span>
          </div>
          <div class="flex flex-col sm:flex-row gap-2 mb-3">
            <input type="number" class="flex-1 px-3 py-2 rounded border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-800 text-sky-900 dark:text-white focus:outline-none focus:ring-2 text-xs focus:ring-sky-400" v-model.number="threshold" min="100">
            <input type="number" class="flex-1 px-3 py-2 rounded border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-800 text-sky-900 dark:text-white focus:outline-none focus:ring-2 text-xs focus:ring-sky-400" v-model.number="limit" min="1" max="1000">
            <button class="px-4 py-2 bg-sky-700 text-white text-xs rounded hover:bg-sky-800 transition-colors" @click="searchSlowCalls">
              <Icon icon="mdi:magnify" class="w-4 h-4" />
            </button>
          </div>
          <!-- Search and Sort Controls -->
          <div class="flex flex-col sm:flex-row gap-2 mb-3">
            <div class="flex-1">
              <input type="text" v-model="searchTerm" placeholder="ค้นหา..." 
                class="w-full px-3 py-2 rounded border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-800 text-sky-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 text-xs">
            </div>
            <select v-model="sortBy" @change="sortData"
              class="px-3 py-2 rounded border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-800 text-sky-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 text-xs">
              <option value="timestamp">เรียงตามเวลา</option>
              <option value="method">เรียงตาม Method</option>
              <option value="statusCode">เรียงตาม Status</option>
              <option value="duration">เรียงตาม Duration</option>
            </select>
            <button @click="toggleSortOrder" 
              class="px-3 py-2 bg-sky-700 text-white rounded hover:bg-sky-800 transition-colors text-xs">
              <Icon :icon="sortOrder === 'desc' ? 'mdi:sort-descending' : 'mdi:sort-ascending'" class="w-4 h-4" />
            </button>
          </div>
          <div class="overflow-x-auto overflow-y-auto" style="max-height: calc(100vh - 420px);">
            <table class="min-w-full text-xs text-left">
              <thead class="bg-sky-100 dark:bg-sky-800 text-sky-700 dark:text-sky-200 sticky top-0">
                <tr>
                  <th class="px-2 py-2">Time</th>
                  <th class="px-2 py-2">Method</th>
                  <th class="px-2 py-2">URL</th>
                  <th class="px-2 py-2">Employee</th>
                  <th class="px-2 py-2">Department</th>
                  <th class="px-2 py-2">Status</th>
                  <th class="px-2 py-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading"><td colspan="7" class="text-center py-4">Loading...</td></tr>
                <tr v-else-if="filteredSlowLogs.length === 0"><td colspan="7" class="text-center py-4">Click Search to find slow calls</td></tr>
                <tr v-for="log in filteredSlowLogs" :key="log._id" :class="rowClass(log)">
                  <td class="px-2 py-1">{{ formatDate(log.timestamp) }}</td>
                  <td class="px-2 py-1"><span class="inline-block px-2 py-0.5 rounded bg-sky-200 dark:bg-sky-700 text-sky-800 dark:text-sky-100">{{ log.method }}</span></td>
                  <td class="px-2 py-1">{{ log.url }}</td>
                  <td class="px-2 py-1">{{ log.headers?.fullName || log.headers?.employeeID || 'N/A' }}</td>
                  <td class="px-2 py-1">{{ log.headers?.department || 'N/A' }}</td>
                  <td class="px-2 py-1"><span :class="statusClass(log.statusCode)">{{ log.statusCode }}</span></td>
                  <td class="px-2 py-1">{{ log.duration }}ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useLogDataStore } from '@/stores/modules/logData';
import { Icon } from '@iconify/vue';

const logStore = useLogDataStore();
const activeTab = ref('recent');
const employeeID = ref('');
const startDate = ref('');
const endDate = ref('');
const threshold = ref(1000);
const limit = ref(50);

// Search and Sort
const searchTerm = ref('');
const sortBy = ref('timestamp');
const sortOrder = ref('desc'); // Default: newest first

const tabs = [
  { key: 'recent', label: 'Recent Calls', icon: 'mdi:clock-outline' },
  { key: 'by-employee', label: 'By Employee', icon: 'mdi:account-search-outline' },
  { key: 'by-date', label: 'By Date', icon: 'mdi:calendar-range-outline' },
  { key: 'slow-calls', label: 'Slow Calls', icon: 'mdi:alert-outline' },
];

const loading = computed(() => logStore.loading);
const statistics = computed(() => logStore.statistics);
const recentLogs = computed(() => logStore.recentLogs);
const employeeLogs = computed(() => logStore.employeeLogs);
const dateLogs = computed(() => logStore.dateLogs);
const slowLogs = computed(() => logStore.slowLogs);

const todayCalls = ref('-');
const slowCalls = ref('-');

// Filter and Sort Functions
function filterLogs(logs) {
  if (!searchTerm.value) return logs;
  
  const search = searchTerm.value.toLowerCase();
  return logs.filter(log => 
    log.method?.toLowerCase().includes(search) ||
    log.url?.toLowerCase().includes(search) ||
    log.headers?.fullName?.toLowerCase().includes(search) ||
    log.headers?.employeeID?.toLowerCase().includes(search) ||
    log.headers?.department?.toLowerCase().includes(search) ||
    log.statusCode?.toString().includes(search) ||
    log.duration?.toString().includes(search) ||
    log.ip?.toLowerCase().includes(search)
  );
}

function sortLogs(logs) {
  if (!logs || logs.length === 0) return logs;
  
  return [...logs].sort((a, b) => {
    let aVal, bVal;
    
    switch (sortBy.value) {
      case 'timestamp':
        aVal = new Date(a.timestamp);
        bVal = new Date(b.timestamp);
        break;
      case 'method':
        aVal = a.method || '';
        bVal = b.method || '';
        break;
      case 'statusCode':
        aVal = a.statusCode || 0;
        bVal = b.statusCode || 0;
        break;
      case 'duration':
        aVal = a.duration || 0;
        bVal = b.duration || 0;
        break;
      case 'fullName':
        aVal = a.headers?.fullName || a.headers?.employeeID || '';
        bVal = b.headers?.fullName || b.headers?.employeeID || '';
        break;
      default:
        aVal = new Date(a.timestamp);
        bVal = new Date(b.timestamp);
    }
    
    if (sortOrder.value === 'desc') {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    } else {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    }
  });
}

// Computed properties for filtered and sorted data
const filteredRecentLogs = computed(() => {
  const filtered = filterLogs(recentLogs.value);
  return sortLogs(filtered);
});

const filteredEmployeeLogs = computed(() => {
  const filtered = filterLogs(employeeLogs.value);
  return sortLogs(filtered);
});

const filteredDateLogs = computed(() => {
  const filtered = filterLogs(dateLogs.value);
  return sortLogs(filtered);
});

const filteredSlowLogs = computed(() => {
  const filtered = filterLogs(slowLogs.value);
  return sortLogs(filtered);
});

function formatDate(ts) {
  if (!ts) return '-';
  const date = new Date(ts);
  return date.toLocaleString('th-TH');
}

function statusClass(code) {
  if (code >= 200 && code < 300) return 'inline-block px-2 py-0.5 rounded bg-green-100 text-green-700';
  if (code >= 400 && code < 500) return 'inline-block px-2 py-0.5 rounded bg-red-100 text-red-700';
  if (code >= 500) return 'inline-block px-2 py-0.5 rounded bg-orange-100 text-orange-700';
  return 'inline-block px-2 py-0.5 rounded bg-sky-200 text-sky-800';
}

function rowClass(log) {
  if (log.duration > 5000) return 'bg-red-50 dark:bg-red-900';
  if (log.duration > 2000) return 'bg-yellow-50 dark:bg-yellow-900';
  return '';
}

function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc';
}

function sortData() {
  // Trigger reactive update
  sortOrder.value = sortOrder.value;
}

async function searchByEmployee() {
  if (!employeeID.value) return;
  await logStore.fetchEmployeeLogs(employeeID.value);
}

async function searchByDate() {
  if (!startDate.value || !endDate.value) return;
  await logStore.fetchDateLogs(startDate.value, endDate.value);
}

async function searchSlowCalls() {
  await logStore.fetchSlowLogs(threshold.value, limit.value);
}

async function loadTodayCalls() {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString();
  await logStore.fetchDateLogs(startOfDay, endOfDay);
  todayCalls.value = Array.isArray(logStore.dateLogs) ? logStore.dateLogs.length : 0;
}

async function loadSlowCalls() {
  await logStore.fetchSlowLogs(1000, 1000);
  slowCalls.value = Array.isArray(logStore.slowLogs) ? logStore.slowLogs.length : 0;
}

onMounted(async () => {
  await logStore.fetchStatistics();
  await logStore.fetchRecentLogs();
  await loadTodayCalls();
  await loadSlowCalls();
});
</script>

<style scoped>
/* Custom scrollbar for table */
::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: #e0e7ef;
  border-radius: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
</style> 