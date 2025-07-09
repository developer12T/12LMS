<template>
  <div class="w-full px-2 py-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold flex items-center space-x-2 text-sky-800 dark:text-white">
        <Icon icon="mdi:chart-timeline-variant" class="w-7 h-7 text-sky-700 dark:text-sky-400" />
        <span>API Logs Dashboard</span>
      </h1>
    </div>
    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-sky-900 rounded-lg shadow border border-sky-100 dark:border-sky-800 p-4">
        <div class="text-gray-500 text-xs mb-1">Total API Calls</div>
        <div class="text-2xl font-bold text-sky-700 dark:text-white">{{ statistics?.totalCalls?.toLocaleString() ?? '-' }}</div>
      </div>
      <div class="bg-white dark:bg-sky-900 rounded-lg shadow border border-sky-100 dark:border-sky-800 p-4">
        <div class="text-gray-500 text-xs mb-1">Average Response Time</div>
        <div class="text-2xl font-bold text-sky-700 dark:text-white">{{ statistics ? Math.round(statistics.averageResponseTime) + 'ms' : '-' }}</div>
      </div>
      <div class="bg-white dark:bg-sky-900 rounded-lg shadow border border-sky-100 dark:border-sky-800 p-4">
        <div class="text-gray-500 text-xs mb-1">Today's Calls</div>
        <div class="text-2xl font-bold text-sky-700 dark:text-white">{{ todayCalls }}</div>
      </div>
      <div class="bg-white dark:bg-sky-900 rounded-lg shadow border border-sky-100 dark:border-sky-800 p-4">
        <div class="text-gray-500 text-xs mb-1">Slow Calls (&gt;1s)</div>
        <div class="text-2xl font-bold text-sky-700 dark:text-white">{{ slowCalls }}</div>
      </div>
    </div>
    <!-- Navigation Tabs -->
    <div class="flex space-x-2 border-b border-sky-200 dark:border-sky-800 mb-4">
      <button v-for="tab in tabs" :key="tab.key" @click="activeTab=tab.key"
        :class="[activeTab===tab.key ? 'bg-sky-700 text-white' : 'bg-sky-100 dark:bg-sky-800 text-sky-700 dark:text-sky-200',
        'px-4 py-2 rounded-t-lg font-medium flex items-center space-x-2 transition-colors']">
        <Icon :icon="tab.icon" class="w-5 h-5" />
        <span>{{ tab.label }}</span>
      </button>
    </div>
    <!-- Tab Content -->
    <div>
      <!-- Recent Calls Tab -->
      <div v-show="activeTab==='recent'">
        <div class="bg-white dark:bg-sky-900 rounded-lg shadow border border-sky-100 dark:border-sky-800 p-4 mb-4">
          <div class="font-semibold text-sky-700 dark:text-sky-200 mb-2 flex items-center space-x-2">
            <Icon icon="mdi:clock-outline" class="w-5 h-5" />
            <span>Recent API Calls (Last 24 Hours)</span>
          </div>
          <div class="overflow-x-auto overflow-y-auto" style="max-height: calc(100vh - 400px);">
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
                <tr v-else-if="recentLogs.length === 0"><td colspan="8" class="text-center py-4">No data found</td></tr>
                <tr v-for="log in recentLogs" :key="log._id" :class="rowClass(log)">
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
            <span>Search by Employee</span>
          </div>
          <div class="flex flex-col sm:flex-row gap-2 mb-3">
            <input type="text" class="flex-1 px-3 py-2 rounded border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-800 text-sky-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="employeeID" placeholder="Enter Employee ID">
            <button class="px-4 py-2 bg-sky-700 text-white rounded hover:bg-sky-800 transition-colors" @click="searchByEmployee">
              <Icon icon="mdi:magnify" class="w-4 h-4 mr-1" /> Search
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-xs text-left">
              <thead class="bg-sky-100 dark:bg-sky-800 text-sky-700 dark:text-sky-200">
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
                <tr v-else-if="employeeLogs.length === 0"><td colspan="7" class="text-center py-4">Enter Employee ID to search</td></tr>
                <tr v-for="log in employeeLogs" :key="log._id" :class="rowClass(log)">
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
          <div class="flex flex-col sm:flex-row gap-2 mb-3">
            <input type="datetime-local" class="flex-1 px-3 py-2 rounded border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-800 text-sky-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="startDate">
            <input type="datetime-local" class="flex-1 px-3 py-2 rounded border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-800 text-sky-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="endDate">
            <button class="px-4 py-2 bg-sky-700 text-white rounded hover:bg-sky-800 transition-colors" @click="searchByDate">
              <Icon icon="mdi:magnify" class="w-4 h-4 mr-1" /> Search
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-xs text-left">
              <thead class="bg-sky-100 dark:bg-sky-800 text-sky-700 dark:text-sky-200">
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
                <tr v-else-if="dateLogs.length === 0"><td colspan="7" class="text-center py-4">Select date range to search</td></tr>
                <tr v-for="log in dateLogs" :key="log._id" :class="rowClass(log)">
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
            <input type="number" class="flex-1 px-3 py-2 rounded border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-800 text-sky-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400" v-model.number="threshold" min="100">
            <input type="number" class="flex-1 px-3 py-2 rounded border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-800 text-sky-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400" v-model.number="limit" min="1" max="1000">
            <button class="px-4 py-2 bg-sky-700 text-white rounded hover:bg-sky-800 transition-colors" @click="searchSlowCalls">
              <Icon icon="mdi:magnify" class="w-4 h-4 mr-1" /> Search
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-xs text-left">
              <thead class="bg-sky-100 dark:bg-sky-800 text-sky-700 dark:text-sky-200">
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
                <tr v-else-if="slowLogs.length === 0"><td colspan="7" class="text-center py-4">Click Search to find slow calls</td></tr>
                <tr v-for="log in slowLogs" :key="log._id" :class="rowClass(log)">
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