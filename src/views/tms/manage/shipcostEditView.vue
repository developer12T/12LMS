<template>
    <div class="flex-1 bg-gray-50 min-h-screen p-4">
        <div class="mx-auto bg-white rounded-lg shadow p-2 px-4">
            <div v-if="isLoading" class="flex items-center justify-center p-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
            <div v-else-if="error" class="p-8 text-center text-red-500">{{ error }}</div>
            <div v-else>
                <h2 class="text-md font-bold mb-2">การจัดการ Shipment : {{ shipment?.OQCONN }}</h2>
                <div class="flex justify-between gap-1">
                    <!-- Section ข้อมูลสรุป shipment -->
                    <div class="flex flex-col h-full justify-between gap-2 w-1/3 bg-white shadow-sm border border-gray-200 rounded-lg p-2">
                        <div class="flex flex-row ">
                            <label class="block text-sm font-bold">วันที่ :</label>
                            <div class="text-gray-800 text-sm font-normal">{{ shipment?.OQDSDT || '-' }}</div>
                        </div>
                        <div class="flex flex-row">
                            <label class="block text-sm font-bold">คลัง :</label>
                            <div class="text-gray-800 text-sm font-normal">{{ shipment?.wh_name || '-' }}</div>
                        </div>
                        <div class="flex flex-row">
                            <label class="block text-sm font-bold">เส้นทางขนส่ง :</label>
                            <div class="text-gray-800 text-sm font-normal">{{ shipment?.Route_name || '-' }}</div>
                        </div>
                        <div class="flex flex-row">
                            <label class="block text-sm font-bold">Shipment :</label>
                            <div class="text-gray-800 text-sm font-normal">{{ shipment?.OQCONN || '-' }}</div>
                        </div>
                        <div class="flex flex-row">
                            <label class="block text-sm font-bold">Finished Goods :</label>
                            <div class="text-gray-800 text-sm font-normal">{{ shipment?.URPLQA || '-' }}</div>
                        </div>
                        <div class="flex flex-row">
                            <label class="block text-sm font-bold">Premium :</label>
                            <div class="text-gray-800 text-sm font-normal">{{ shipment?.URPRQA || '-' }}</div>
                        </div>
                    </div>

                    <!-- Section ฟอร์มแก้ไข/คำนวณ -->
                    <div class="w-2/3 bg-white shadow-sm border border-gray-200 rounded-lg p-2">
                        <div class="flex flex-row gap-4">
                            <!-- ฝั่งซ้าย -->
                            <div class="flex flex-col gap-3 flex-1">
                                <div>
                                    <label class="block text-sm font-medium">รูปแบบ :</label>
                                    <select v-model="selectedCostType" class="w-full border rounded px-2 py-1">
                                        <option v-for="type in costTypes" :key="type.cost_type_id"
                                            :value="type.cost_type_id">
                                            {{ type.cost_type_name }}
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium">เด็กรถ :</label>
                                    <input class="w-full border rounded px-2 py-1" v-model="helper" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium">% ค่าน้ำมัน :</label>
                                    <input class="w-full border rounded px-2 py-1" v-model="oilPercent" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium">รายละเอียด :</label>
                                    <input class="w-full border rounded px-2 py-1" v-model="remark" />
                                </div>
                            </div>
                            <!-- ฝั่งขวา -->
                            <div class="flex flex-col gap-3 flex-1">
                                <div>
                                    <label class="block text-sm font-medium">ค่าพาเลท :</label>
                                    <input class="w-full border rounded px-2 py-1" v-model="palletCost" />
                                </div>
                                <button class="w-full bg-teal-500 text-white rounded py-2 mt-1" style="margin-bottom:2px;">คำนวณ</button>
                                <div>
                                    <label class="block text-sm font-medium">ค่าขนส่ง :</label>
                                    <input class="w-full border rounded px-2 py-1 bg-gray-100"
                                        :value="shipment?.calculated_cost" readonly />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium">ราคาต่อทึบ :</label>
                                    <input class="w-full border rounded px-2 py-1 bg-gray-100"
                                        :value="shipment?.calculated_cost_ctn" readonly />
                                </div>
                                <button class="w-full bg-green-600 text-white py-2 rounded mb-2" @click="save">Save</button>
                                <button class="w-full bg-orange-400 text-white py-2 rounded" @click="cancel">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white shadow-sm border border-gray-200 rounded-lg p-2 mt-2">
            <div class="overflow-x-auto">
                    <table class="min-w-full text-xs text-center border border-gray-200 bg-white">
                        <thead>
                            <tr class="bg-gray-100">
                                <th class="px-2 py-2 border">รหัสลูกค้า</th>
                                <th class="px-2 py-2 border">order-type</th>
                                <th class="px-2 py-2 border">order-name</th>
                                <th class="px-2 py-2 border">เลขที่เอกสาร</th>
                                <th class="px-2 py-2 border">รหัสสินค้า</th>
                                <th class="px-2 py-2 border">ชื่อสินค้า</th>
                                <th class="px-2 py-2 border">FG</th>
                                <th class="px-2 py-2 border">Premium</th>
                                <th class="px-2 py-2 border">รูปแบบ</th>
                                <th class="px-2 py-2 border">ค่าขนส่ง</th>
                                <th class="px-2 py-2 border">ราคาต่อทึบ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, idx) in details" :key="item.URRIDL"
                                :class="{ 'bg-gray-50': idx % 2 === 1 }">
                                <td class="border px-2 py-1">{{ item.OACUNO }}</td>
                                <td class="border px-2 py-1">{{ item.ODORTP }}</td>
                                <td class="border px-2 py-1">{{ item.ODTX40 }}</td>
                                <td class="border px-2 py-1">{{ item.OQRIDN }}</td>
                                <td class="border px-2 py-1">{{ item.URITNO }}</td>
                                <td class="border px-2 py-1">{{ item.MMITDS }}</td>
                                <td class="border px-2 py-1">{{ item.CTN_QTY }}</td>
                                <td class="border px-2 py-1">0</td>
                                <td class="border px-2 py-1">{{ shipment?.cost_type_name || '-' }}</td>
                                <td class="border px-2 py-1">XXX</td>
                                <td class="border px-2 py-1">XXX</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
        </div>

       
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const shipment = ref(null);
const costTypes = ref([]);
const costRates = ref([]);
const details = ref([]);
const session = ref({});
const isLoading = ref(false);
const error = ref(null);

const selectedCostType = ref('');
const helper = ref('');
const oilPercent = ref('');
const remark = ref('');
const palletCost = ref('');

const save = () => {
    alert('Save (mock)');
    router.push({ name: 'shipcost-management' });
};
const cancel = () => {
    router.push({ name: 'shipcost-management' });
};

const fetchShipmentData = async () => {
    isLoading.value = true;
    try {
        // รับ params จาก route/query
        const shipment_no = route.query.shipment_no || route.params.shipment_no;
        const who_no = route.query.who_no;
        const begin_no = route.query.begin_no;
        const end_no = route.query.end_no;
        const route_no = route.query.route_no;
        const cal_id1 = route.query.cal_id1;
        const cal_id2 = route.query.cal_id2;
        const cal_id3 = route.query.cal_id3;
        const type_no = route.query.type_no;
        const helpper = route.query.helpper;
        if (!shipment_no || !who_no || !begin_no || !end_no || !route_no) {
            error.value = 'Missing required parameters';
            isLoading.value = false;
            return;
        }
        const url = `${import.meta.env.VITE_API_BASE_URL}/api/transport/cost-edit?who_no=${who_no}&begin_no=${begin_no}&end_no=${end_no}&route_no=${route_no}&shipment_no=${shipment_no}&cal_id1=${cal_id1 || ''}&cal_id2=${cal_id2 || ''}&cal_id3=${cal_id3 || ''}&type_no=${type_no || ''}&helpper=${helpper || ''}`;
        const res = await fetch(url);
        const data = await res.json();
        shipment.value = data.data.shipment;
        costTypes.value = data.data.cost_types;
        costRates.value = data.data.cost_rates;
        details.value = data.data.details;
        session.value = data.data.session;
        selectedCostType.value = shipment.value?.cost_type_id || '';
    } catch (e) {
        error.value = e.message;
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchShipmentData);
</script>