<template>
  <div class="w-full px-4" style="max-width: calc(100vw - 100px);">
    <div class="space-y-6">
      <!-- Loading -->
      <div v-if="reportTmsStore.loadingPlanning" class="flex justify-center items-center py-8">
        <Icon icon="mdi:loading" class="animate-spin w-8 h-8 text-sky-600" />
        <span class="ml-2 text-sky-700">กำลังโหลดข้อมูล...</span>
      </div>

      <!-- Table Section -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-0 w-full">
        <!-- Tab Navigation -->
        <div class="border-b border-gray-200">
          <div class="flex">
              <button @click="toggleActive('12T')"
                :class="activeButton === '12T' ? 'border-[#00569D] text-[#00569D] bg-[#00569D] bg-opacity-10' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                class="flex items-center gap-2 px-6 py-2 text-sm font-medium border-b-2 transition-colors">
                <img src="/logo-onetwo.png" alt="12Trading" class="w-5 h-5"> 12Trading
              </button>
              <button @click="toggleActive('Fplus')"
                :class="activeButton === 'Fplus' ? 'border-[#53C9EF] text-[#53C9EF] bg-[#53C9EF] bg-opacity-10' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                class="flex items-center gap-2 px-6 py-2 text-sm font-medium border-b-2 transition-colors">
                <img src="/logo-fplus.png" alt="Fplus" class="w-5 h-5"> Fplus
              </button>  
          </div>
        </div>

        <div class="flex flex-col md:flex-row md:items-center md:justify-between px-4 pt-2">
          <div class="flex items-center justify-center flex-row">
            <!-- Record Count -->
            <ResultCount :label="'ผลลัพธ์:'" :current="searchQuery ? filteredTableData.length : null"
              :total="reportTmsStore.planningData.length" icon="mdi:table" iconColor="#00569D" class="" />
          </div>
          <div class="flex items-center space-x-2">
            <div class=" flex flex-row gap-1 items-center">
              <button type="button" @click="exportToExcel" :disabled="!reportTmsStore.planningData.length"
                class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center justify-center dark:focus:ring-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Icon icon="file-icons:microsoft-excel" width="16" height="16" class="mr-1.5" />
                Export Excel
              </button>
            </div>
              <!-- Brand Filter -->
              <div class="relative" ref="brandDropdownRef">
                <button @click="toggleBrandDropdown"
                  class="text-white bg-[#00569D] text-xs hover:bg-[#004080] focus:ring-4 focus:outline-none focus:ring-[#00569D]/30 font-medium rounded-lg px-3 py-1.5 text-center inline-flex items-center transition-colors shadow-sm"
                  type="button">
                  <Icon icon="mdi:tag" class="w-4 h-4 mr-2" />
                  แบรนด์
                  <svg class="w-2 h-2 ml-2 transition-transform" :class="{ 'rotate-180': showBrandDropdown }"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m1 1 4 4 4-4" />
                  </svg>
                </button>

                <!-- Brand Dropdown menu -->
                <div v-show="showBrandDropdown" @click.stop
                  class="absolute right-0 mt-2 w-56 bg-white divide-y divide-gray-100 rounded-lg shadow-lg border border-gray-200 dark:bg-gray-800 dark:divide-gray-600 dark:border-gray-700 z-50">
                  <div class="p-3">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">เลือกแบรนด์</h3>
                    <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                      <li>
                        <div
                          class="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          @click.stop>
                          <input id="brand-12t" type="checkbox" v-model="selectedBrands" value="12T"
                            class="w-4 h-4 text-[#00569D] bg-gray-100 border-gray-300 rounded focus:ring-[#00569D] dark:focus:ring-[#00569D] dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                          <label for="brand-12t"
                            class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center">
                            <img src="/logo-onetwo.png" alt="12Trading" class="w-4 h-4 mr-2"> 12Trading
                          </label>
                        </div>
                      </li>
                      <li>
                        <div
                          class="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          @click.stop>
                          <input id="brand-fplus" type="checkbox" v-model="selectedBrands" value="Fplus"
                            class="w-4 h-4 text-[#53C9EF] bg-gray-100 border-gray-300 rounded focus:ring-[#53C9EF] dark:focus:ring-[#53C9EF] dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                          <label for="brand-fplus"
                            class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center">
                            <img src="/logo-fplus.png" alt="Fplus" class="w-4 h-4 mr-2"> Fplus
                          </label>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
                    <button @click="applyBrandFilter"
                      class="w-full bg-[#00569D] hover:bg-[#004080] text-white text-sm font-medium py-2 px-3 rounded-md transition-colors">
                      ใช้การกรอง
                    </button>
                  </div>
                </div>
              </div>

              <!-- Product Group Filter -->
              <div class="relative" ref="productGroupDropdownRef">
                <button @click="toggleProductGroupDropdown"
                  class="text-white bg-[#E48009] text-xs hover:bg-[#ed8d21] focus:ring-4 focus:outline-none focus:ring-[#ed8d21]/30 font-medium rounded-lg px-3 py-1.5 text-center inline-flex items-center transition-colors shadow-sm"
                  type="button">
                  <Icon icon="mdi:package-variant" class="w-4 h-4 mr-2" />
                  กลุ่มสินค้า
                  <svg class="w-2 h-2 ml-2 transition-transform" :class="{ 'rotate-180': showProductGroupDropdown }"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m1 1 4 4 4-4" />
                  </svg>
                </button>

                <!-- Product Group Dropdown menu -->
                <div v-show="showProductGroupDropdown" @click.stop
                  class="absolute right-0 mt-2 w-56 bg-white divide-y divide-gray-100 rounded-lg shadow-lg border border-gray-200 dark:bg-gray-800 dark:divide-gray-600 dark:border-gray-700 z-50">
                  <div class="p-3">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">เลือกกลุ่มสินค้า</h3>
                    <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                      <li>
                        <div
                          class="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          @click.stop>
                          <input id="product-group-1" type="checkbox" v-model="selectedProductGroups"
                            value="electronics"
                            class="w-4 h-4 text-[#00569D] bg-gray-100 border-gray-300 rounded focus:ring-[#00569D] dark:focus:ring-[#00569D] dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                          <label for="product-group-1"
                            class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center">
                            <Icon icon="mdi:laptop" class="w-4 h-4 mr-2 text-blue-600" /> อิเล็กทรอนิกส์
                          </label>
                        </div>
                      </li>
                      <li>
                        <div
                          class="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          @click.stop>
                          <input id="product-group-2" type="checkbox" v-model="selectedProductGroups" value="clothing"
                            class="w-4 h-4 text-[#53C9EF] bg-gray-100 border-gray-300 rounded focus:ring-[#53C9EF] dark:focus:ring-[#53C9EF] dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                          <label for="product-group-2"
                            class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center">
                            <Icon icon="mdi:tshirt-crew" class="w-4 h-4 mr-2 text-cyan-500" /> เสื้อผ้า
                          </label>
                        </div>
                      </li>
                      <li>
                        <div
                          class="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          @click.stop>
                          <input id="product-group-3" type="checkbox" v-model="selectedProductGroups" value="food"
                            class="w-4 h-4 text-[#E48009] bg-gray-100 border-gray-300 rounded focus:ring-[#E48009] dark:focus:ring-[#E48009] dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                          <label for="product-group-3"
                            class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center">
                            <Icon icon="mdi:food-apple" class="w-4 h-4 mr-2 text-orange-500" /> อาหาร
                          </label>
                        </div>
                      </li>
                      <li>
                        <div
                          class="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          @click.stop>
                          <input id="product-group-4" type="checkbox" v-model="selectedProductGroups" value="home"
                            class="w-4 h-4 text-[#10B981] bg-gray-100 border-gray-300 rounded focus:ring-[#10B981] dark:focus:ring-[#10B981] dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                          <label for="product-group-4"
                            class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center">
                            <Icon icon="mdi:home" class="w-4 h-4 mr-2 text-green-500" /> ของใช้ในบ้าน
                          </label>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
                    <button @click="applyProductGroupFilter"
                      class="w-full bg-[#00569D] hover:bg-[#004080] text-white text-sm font-medium py-2 px-3 rounded-md transition-colors">
                      ใช้การกรอง
                    </button>
                  </div>
                </div>
              </div>

            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon icon="mdi:magnify" class="w-4 h-4 text-gray-400" />
              </div>
              <input type="text" v-model="searchQuery" placeholder="ค้นหา..."
                class="w-64 pl-10 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400">
            </div>
            <div class="flex-shrink-0 self-end">
              <button type="submit" @click="reportTmsStore.fetchPlanningAll()"
                :disabled="reportTmsStore.loadingPlanning"
                class="flex items-center gap-1 bg-[#00569D] hover:bg-[#6B9AC4] disabled:bg-gray-400 text-white text-xs font-medium rounded-md px-4 py-1.5 transition-colors shadow min-w-[80px] justify-center">
                <Icon v-if="reportTmsStore.loadingPlanning" icon="mdi:loading" class="w-4 h-4 animate-spin" />
                <Icon v-else icon="mdi:refresh" class="w-4 h-4" />
                {{ reportTmsStore.loadingPlanning ? 'กำลังโหลด...' : 'รีเฟรชข้อมูล' }}
              </button>
            </div>
          </div>
        </div>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg max-h-[73vh] mt-2 px-2 pb-2">
          <table class="w-full text-xs text-left text-gray-500 border-collapse border border-gray-300">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
              <tr>
                <th class="px-2 py-2 text-center border-r border-gray-200">รหัสสินค้า</th>
                <th class="px-2 py-2 text-center border-r border-gray-200">ชื่อสินค้า</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">F-plus นครปฐม</th>
                <th class="px-2 py-2  text-[10px] text-center border-r border-gray-200">Balance 12 T</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">นครปฐม (101)</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">มหาสารคาม (102)</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">ลำพูน (103)</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">สุราษฎร์ (104)</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">บางนา (105)</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">บางนา F-plus (105)</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">นครสวรรค์ (106)</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">นครราชสีมา (109)</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">นครปฐม2 (111)</th>
                <th class="px-2 py-2 text-[10px] text-center border-r border-gray-200">นครปฐม2 F-plus (111)</th>
                <th v-for="dateColumn in dateColumns" :key="dateColumn"
                  class="px-2 py-2 text-[10px] text-center border-r border-gray-200">{{ dateColumn }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in filteredTableData" :key="idx"
                :class="idx % 2 === 1 ? 'bg-gray-100' : 'bg-white'"
                class="cursor-pointer hover:bg-blue-100 transition-colors duration-100" @click="openModal(item)">
                <td class="px-2 py-1 text-center border-r border-gray-200">{{ item.item_code?.trim() }}</td>
                <td class="px-2 py-1 border-r border-gray-200">{{ item.item_name }}</td>
                <td :class="!item.blfplus ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'"
                  class="px-2 py-1 text-center border-r border-gray-200"
                  @click.stop="item.blfplus && handleCellClick(item, 'blfplus')">{{ item.blfplus || '-' }}</td>
                <td :class="!item.bl12t ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'"
                  class="px-2 py-1 text-end border-r border-gray-200"
                  @click.stop="item.bl12t && handleCellClick(item, 'bl12t')">{{ item.bl12t || '-' }}</td>
                <td :class="!item.wh_101 ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'"
                  class="px-2 py-1 text-end border-r border-gray-200"
                  @click.stop="item.wh_101 && handleCellClick(item, 'wh_101')">{{ item.wh_101 || '-' }}</td>
                <td :class="!item.wh_102 ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'"
                  class="px-2 py-1 text-end border-r border-gray-200"
                  @click.stop="item.wh_102 && handleCellClick(item, 'wh_102')">{{ item.wh_102 || '-' }}</td>
                <td :class="!item.wh_103 ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'"
                  class="px-2 py-1 text-end border-r border-gray-200"
                  @click.stop="item.wh_103 && handleCellClick(item, 'wh_103')">{{ item.wh_103 || '-' }}</td>
                <td :class="!item.wh_104 ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'"
                  class="px-2 py-1 text-end border-r border-gray-200"
                  @click.stop="item.wh_104 && handleCellClick(item, 'wh_104')">{{ item.wh_104 || '-' }}</td>
                <td :class="!item.wh_105 ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'"
                  class="px-2 py-1 text-end border-r border-gray-200"
                  @click.stop="item.wh_105 && handleCellClick(item, 'wh_105')">{{ item.wh_105 || '-' }}</td>
                  <td :class="!item.wh_105F ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'"
                  class="px-2 py-1 text-end border-r border-gray-200"
                  @click.stop="item.wh_105F && handleCellClick(item, 'wh_105F')">{{ item.wh_105F || '-' }}</td>
                <td :class="!item.wh_106 ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'"
                  class="px-2 py-1 text-end border-r border-gray-200"
                  @click.stop="item.wh_106 && handleCellClick(item, 'wh_106')">{{ item.wh_106 || '-' }}</td>
                <td :class="!item.wh_109 ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'"
                  class="px-2 py-1 text-end border-r border-gray-200"
                  @click.stop="item.wh_109 && handleCellClick(item, 'wh_109')">{{ item.wh_109 || '-' }}</td>
                <td :class="!item.wh_111 ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'"
                  class="px-2 py-1 text-end border-r border-gray-200"
                  @click.stop="item.wh_111 && handleCellClick(item, 'wh_111')">{{ item.wh_111 || '-' }}</td>
                <td :class="!item.wh_111F ? 'text-gray-500 cursor-default' : 'text-blue-600 underline cursor-pointer'"
                  class="px-2 py-1 text-end border-r border-gray-200"
                  @click.stop="item.wh_111F && handleCellClick(item, 'wh_111F')">{{ item.wh_111F || '-' }}</td>
                <td v-for="dateColumn in dateColumns" :key="dateColumn"
                  class="px-2 py-1 text-end border-r border-gray-200" :class="getDateCellClass(item[dateColumn])">{{
                    item[dateColumn] || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Popup -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fade-in">
          <button @click="showModal = false"
            class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl">&times;</button>
          <h3 class="text-lg font-bold mb-4 text-[#00569D]">รายละเอียดสินค้า</h3>
          <div class="text-sm space-y-2">
            <div><span class="font-medium">รหัสสินค้า:</span> {{ selectedRow.item_code?.trim() }}</div>
            <div><span class="font-medium">ชื่อสินค้า:</span> {{ selectedRow.item_name }}</div>
            <div><span class="font-medium">F-plus นครปฐม:</span> {{ selectedRow.blfplus || '-' }}</div>
            <div><span class="font-medium">Balance 12 T:</span> {{ selectedRow.bl12t || '-' }}</div>
            <div><span class="font-medium">นครปฐม (101):</span> {{ selectedRow.wh_101 || '-' }}</div>
            <div><span class="font-medium">มหาสารคาม (102):</span> {{ selectedRow.wh_102 || '-' }}</div>
            <div><span class="font-medium">ลำพูน (103):</span> {{ selectedRow.wh_103 || '-' }}</div>
            <div><span class="font-medium">สุราษฎร์ (104):</span> {{ selectedRow.wh_104 || '-' }}</div>
            <div><span class="font-medium">บางนา (105):</span> {{ selectedRow.wh_105 || '-' }}</div>
            <div><span class="font-medium">นครสวรรค์ (106):</span> {{ selectedRow.wh_106 || '-' }}</div>
            <div><span class="font-medium">นครราชสีมา (109):</span> {{ selectedRow.wh_109 || '-' }}</div>
            <div><span class="font-medium">นนทบุรี (110):</span> {{ selectedRow.wh_110 || '-' }}</div>
            <div><span class="font-medium">นครปฐม2:</span> {{ selectedRow.wh_111 || '-' }}</div>
            <div class="border-t pt-2 mt-2">
              <div class="font-medium text-blue-600 mb-2">ข้อมูลวางแผนตามวันที่:</div>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div v-for="dateColumn in dateColumns" :key="dateColumn"
                  :class="getDateCellClass(selectedRow[dateColumn])">
                  <span class="font-medium">{{ dateColumn }}:</span> {{ selectedRow[dateColumn] || '-' }}
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6 text-right">
            <button @click="showModal = false"
              class="px-4 py-1.5 bg-[#00569D] text-white rounded hover:bg-[#004080]">ปิด</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import ResultCount from '@/components/ResultCount.vue';
import { useRouter } from 'vue-router';
import { useReportTmsStore } from '@/stores/modules/reportTms';

const filter = ref({
  dc: '12',
  year: '2568',
  allDC: false,
  showMonth: false,
  dateRange: '1 มิ.ย. 2025 - 30 มิ.ย. 2025',
  search: '',
});

const reportTmsStore = useReportTmsStore();
const searchQuery = ref('');

// Filter states
const selectedBrands = ref(['12T', 'Fplus']); // Default to both brands selected
const selectedProductGroups = ref(['electronics', 'clothing', 'food', 'home']); // Default to all product groups selected
const showBrandDropdown = ref(false); // Brand dropdown visibility state
const showProductGroupDropdown = ref(false); // Product group dropdown visibility state
const brandDropdownRef = ref(null); // Reference to brand dropdown container
const productGroupDropdownRef = ref(null); // Reference to product group dropdown container

// Toggle button state with localStorage persistence
const activeButton = ref(localStorage.getItem('planTotalActiveButton') || '12T'); // Default to 12T, but check localStorage

// Toggle function
function toggleActive(buttonType) {
  activeButton.value = buttonType;

  // Save to localStorage for persistence
  localStorage.setItem('planTotalActiveButton', buttonType);

  // Emit values based on button type
  if (buttonType === '12T') {
    // Emit value 380 for 12T
    console.log('12T selected - value: 380');
    // You can add your emit logic here or call a store method
  } else if (buttonType === 'Fplus') {
    // Emit value 410 for Fplus
    console.log('Fplus selected - value: 410');
    // You can add your emit logic here or call a store method
  }
}

const filteredTableData = computed(() => {
  let filteredData = reportTmsStore.planningData;

  // Filter by brand
  if (selectedBrands.value.length > 0) {
    filteredData = filteredData.filter(item => {
      // Add your brand filtering logic here based on your data structure
      // This is a placeholder - adjust according to your actual data
      return true; // For now, show all data
    });
  }

  // Filter by product group
  if (selectedProductGroups.value.length > 0) {
    filteredData = filteredData.filter(item => {
      // Add your product group filtering logic here based on your data structure
      // This is a placeholder - adjust according to your actual data
      return true; // For now, show all data
    });
  }

  // Filter by search query
  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase();
    filteredData = filteredData.filter(item =>
      (item.item_code?.trim() || '').toLowerCase().includes(term) ||
      (item.item_name || '').toLowerCase().includes(term)
    );
  }

  return filteredData;
});

const dateColumns = computed(() => {
  if (reportTmsStore.planningData.length === 0) return [];

  // หาคอลัมน์วันที่จากข้อมูลแรก
  const firstItem = reportTmsStore.planningData[0];
  const dateKeys = Object.keys(firstItem).filter(key =>
    key.includes('-') && (key.includes('jan') || key.includes('feb') || key.includes('mar') ||
      key.includes('apr') || key.includes('may') || key.includes('jun') ||
      key.includes('jul') || key.includes('aug') || key.includes('sep') ||
      key.includes('oct') || key.includes('nov') || key.includes('dec'))
  );

  return dateKeys.sort();
});

// Modal state
const showModal = ref(false)
const selectedRow = ref({})
function openModal(row) {
  selectedRow.value = row
  showModal.value = true
}

const router = useRouter();

function handleCellClick(item, column) {
  router.push({
    name: 'plan-total-detail',
    query: { column }
  });
}

function getDateCellClass(value) {
  if (!value || value === '0' || value === '-') {
    return 'text-gray-400'
  }
  return 'text-green-600 font-medium'
}

function exportToExcel() {
  // สามารถเพิ่ม logic ดาวน์โหลดข้อมูลจริงได้
  alert('ดาวน์โหลดข้อมูล!');
}

function applyBrandFilter(event) {
  event.stopPropagation(); // Prevent event bubbling
  console.log('Applied brand filter:', selectedBrands.value);
  showBrandDropdown.value = false;
  // You can add additional logic here if needed
}

function toggleBrandDropdown(event) {
  event.stopPropagation(); // Prevent event bubbling
  showBrandDropdown.value = !showBrandDropdown.value;
  console.log('Toggle brand dropdown:', showBrandDropdown.value); // Debug log
}

function applyProductGroupFilter(event) {
  event.stopPropagation(); // Prevent event bubbling
  console.log('Applied product group filter:', selectedProductGroups.value);
  showProductGroupDropdown.value = false;
  // You can add additional logic here if needed
}

function toggleProductGroupDropdown(event) {
  event.stopPropagation(); // Prevent event bubbling
  showProductGroupDropdown.value = !showProductGroupDropdown.value;
  console.log('Toggle product group dropdown:', showProductGroupDropdown.value); // Debug log
}

onMounted(() => {
  reportTmsStore.fetchPlanningAll();

  // Close dropdowns when clicking outside
  document.addEventListener('click', (event) => {
    if (brandDropdownRef.value && !brandDropdownRef.value.contains(event.target)) {
      showBrandDropdown.value = false;
    }
    if (productGroupDropdownRef.value && !productGroupDropdownRef.value.contains(event.target)) {
      showProductGroupDropdown.value = false;
    }
  });
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>