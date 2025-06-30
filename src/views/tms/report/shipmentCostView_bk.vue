<template>
  <!-- ฟอร์มค้นหา mockup ตามภาพ -->
  <!-- <div class="max-w-xs mx-auto mt-8 mb-8 p-4 bg-white rounded shadow">
    <div class="mb-2">
      <label class="block mb-1 text-sm">Shipment:</label>
      <input type="text" v-model="mockShipment" class="w-full border rounded px-2 py-1" />
    </div>
    <div class="mb-2">
      <label class="block mb-1 text-sm">ช่องทาง</label>
      <select v-model="mockChannel" class="w-full border rounded px-2 py-1">
        <option value="1">ราคา 1</option>
        <option value="2">ราคา 2</option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block mb-1 text-sm">รหัสร่วม:</label>
      <select v-model="mockCode" class="w-full border rounded px-2 py-1">
        <option value="0">Code 0</option>
        <option value="1">Code 1</option>
      </select>
    </div>
    <button class="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded mb-3">ค้นหา</button>
    <button class="w-full bg-green-400 hover:bg-green-500 text-white py-2 rounded">EXPORT EXCEL</button>
  </div> -->
  <!-- END ฟอร์มค้นหา mockup -->
  <div class="flex-1 bg-gray-50 min-h-screen">
      <PageHeader>
          <template #actions>
              
          </template>
      </PageHeader>
      <!-- ตารางรายงานค่าขนส่ง (Mockup) -->
      <div class="p-6 bg-white rounded-lg shadow max-w-4xl mx-auto mt-8">
        <!-- Header -->
        <div class="grid grid-cols-3 gap-2 mb-2">
          <div>
            <div>L030060</div>
            <div>2508763</div>
          </div>
          <div class="text-center font-bold">รายงานค่าขนส่ง</div>
          <div class="text-right">
            <div>BN6708-สุวรรณ</div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 mb-4">
          <div></div>
          <div class="text-center">นายสุวรรณ บัวบาน</div>
          <div class="text-right">20250621</div>
        </div>
        <!-- Table Header -->
        <div class="grid grid-cols-8 gap-1 font-bold border-b border-gray-300 py-1">
          <div>อำเภอ</div>
          <div>ประเภท</div>
          <div>เลขที่เอกสารฯ</div>
          <div>จำนวน</div>
          <div>ราคา/หน่วย</div>
          <div>ค่าขนส่ง</div>
          <div>ค่าพิเศษ</div>
          <div>ค่าขนส่งรวม</div>
        </div>
        <!-- Table Rows (Mockup) -->
        <div v-for="(row, idx) in mockData" :key="idx" class="grid grid-cols-8 gap-1 border-b border-gray-100 py-1">
          <div>{{ row.area }}</div>
          <div>{{ row.type }}</div>
          <div>{{ row.docNo }}</div>
          <div class="text-right">{{ row.qty }}</div>
          <div class="text-right">{{ row.price }}</div>
          <div class="text-right">{{ row.transport }}</div>
          <div class="text-right">{{ row.special }}</div>
          <div class="text-right font-semibold">{{ row.total }}</div>
        </div>
        <!-- Summary -->
        <div class="grid grid-cols-8 gap-1 font-bold py-2 border-t border-gray-300">
          <div class="col-span-3 text-right">รวม</div>
          <div class="text-right">{{ totalQty }}</div>
          <div></div>
          <div></div>
          <div></div>
          <div class="text-right">{{ totalSum }}</div>
        </div>
        <!-- Footer -->
        <div class="mt-6 grid grid-cols-2 gap-4">
          <div>ผู้จัดทำรายงาน.............................................</div>
          <div class="text-right">ผู้รับรองรายงาน.............................................</div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick ,computed} from 'vue';
import { Icon } from '@iconify/vue';
import PageHeader from '@/components/PageHeader.vue';

const mockData = [
  { area: 'อรัญประเทศ', type: '021', docNo: '680614061', qty: 26, price: 13, transport: 338, special: 130, total: 468 },
  { area: 'ศรีมหาโพธิ์', type: '021', docNo: '680615034', qty: 51, price: 9, transport: 459, special: 255, total: 714 },
  { area: 'ศรีมหาโพธิ์', type: '021', docNo: '680615035', qty: 50, price: 9, transport: 450, special: 0, total: 450 },
  { area: 'อรัญประเทศ', type: '021', docNo: '680614005', qty: 107, price: 13, transport: 1391, special: 0, total: 1391 },
  { area: 'เขาน้ำซับน้อย', type: '041', docNo: '680610104', qty: 1, price: 9, transport: 9, special: 5, total: 14 },
  { area: 'เขาภูสรรค์', type: 'T05', docNo: 'W680622104', qty: 98, price: 11, transport: 1078, special: 0, total: 1078 },
];
const totalQty = computed(() => mockData.reduce((sum, r) => sum + r.qty, 0));
const totalSum = computed(() => mockData.reduce((sum, r) => sum + r.total, 0));

const mockShipment = ref('2508882');
const mockChannel = ref('1');
const mockCode = ref('0');

</script>

<style scoped>
</style>
