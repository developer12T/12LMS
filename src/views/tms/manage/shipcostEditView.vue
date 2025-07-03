<template>
    <div class="flex-1 bg-gray-50 min-h-screen p-4">
        <div class="mx-auto bg-white rounded-lg shadow p-2 px-4">
            <div v-if="isLoading" class="flex items-center justify-center p-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
            <div v-else-if="error" class="p-8 text-center text-red-500">{{ error }}</div>
            <div v-else>
                <div class="mb-2 flex flex-row items-center gap-4">
                    <button
                        class="flex items-center justify-center bg-white border border-[#00569D] text-[#00569D] hover:bg-[#00569D] hover:text-white rounded-full shadow w-8 h-8 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        @click="backtomainpage"
                        title="ย้อนกลับ"
                    >
                        <Icon icon="mdi:arrow-left" class="w-4 h-4" />
                    </button>
                    <h2 class="text-lg font-bold text-gray-800 tracking-tight">
                        การจัดการ Shipment : {{ shipment?.OQCONN }}
                    </h2>
                </div>
                
                <div class="flex justify-between gap-1">
                    <!-- Section ข้อมูลสรุป shipment -->
                    <div
                        class="flex flex-col h-full justify-between gap-2 w-2/5 bg-white shadow-sm border border-gray-200 rounded-lg p-2">
                        <div class="flex flex-row ">
                            <label class="block text-sm font-bold">วันที่ :</label>
                            <div class="text-gray-800 text-sm font-normal">{{ shipment?.OQDSDT || '-' }}</div>
                        </div>
                        <div class="flex flex-row">
                            <label class="block text-sm font-bold">คลัง :</label>
                            <div class="text-gray-800 text-sm font-normal">{{ shipment?.wh_name || '-' }}</div>
                        </div>
                        <div class="flex flex-row">
                            <label class="block text-sm whitespace-nowrap font-bold">เส้นทางขนส่ง :</label>
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
                    <div class="w-3/5 bg-white shadow-sm border border-gray-200 rounded-lg p-2">
                        <div class="flex flex-row gap-3 items-stretch min-h-[220px]">
                            <!-- ฝั่งซ้าย -->
                            <div class="flex flex-col gap-3 flex-1 h-full justify-between">
                                <div>
                                    <label class="block text-sm font-medium">รูปแบบ :</label>
                                    <select v-model="selectedCostType" class="w-full border rounded px-2 py-1 text-sm">
                                        <option v-for="type in costTypes" :key="type.cost_type_id"
                                            :value="type.cost_type_id">
                                            {{ type.cost_type_name }}
                                        </option>
                                    </select>
                                </div>
                                <template v-if="getCostTypeName(selectedCostType) === 'หีบ'">
                                    <div>
                                        <label class="block text-sm font-medium">เด็กรถ :</label>
                                        <input class="w-full border rounded px-2 py-1 text-sm" v-model="helper" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium">% ค่าน้ำมัน :</label>
                                        <input class="w-full border rounded px-2 py-1 text-sm" v-model="oilPercent" />
                                    </div>
                                </template>
                                <template v-else-if="getCostTypeName(selectedCostType) === 'เหมา'">
                                    <div>
                                        <label class="block text-sm font-medium">EXTRA :</label>
                                        <input class="w-full border rounded px-2 py-1 text-sm" v-model="extra" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium">ราคาเหมา :</label>
                                        <select class="w-full border rounded px-2 py-1 text-sm" v-model="lumpSumPrice">
                                            <option v-for="rate in costRates.filter(r => r.FORDESC === 'เหมา')"
                                                :key="rate.FORCOST" :value="rate.FORCOST">
                                                {{ rate.FORCOST }}
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium">ค่าพาเลท :</label>
                                        <input class="w-full border rounded px-2 py-1 text-sm" v-model="palletCost" />
                                    </div>
                                </template>
                            </div>
                            <!-- ฝั่งขวา -->
                            <div class="flex flex-col gap-3 flex-1 h-full justify-between">
                                <div class="flex flex-col h-full">
                                    <label class="block text-sm font-medium mb-1">รายละเอียด :</label>
                                    <textarea class="w-full border rounded px-2 py-1 flex-1 min-h-[90px] resize-none text-sm" v-model="remark" rows="3"></textarea>
                                </div>
                                <div>
                                    <table class="w-full border text-right text-sm bg-white mb-2">
                                        <tr>
                                            <td class="border px-2 py-1 bg-gray-100 text-left font-medium">ค่าขนส่ง</td>
                                            <td class="border px-2 py-1">
                                                {{ isFinite(calculatedCost) && calculatedCost > 0 ?
                                                    calculatedCost.toLocaleString(undefined,
                                                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00' }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="border px-2 bg-gray-100 py-1 text-left font-medium">ราคาต่อหีบ
                                            </td>
                                            <td class="border px-2 py-1">
                                                {{ isFinite(calculatedCostCtn) && calculatedCostCtn > 0 ?
                                                    calculatedCostCtn.toLocaleString(undefined, {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    }) :
                                                    '0.00' }}
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="flex flex-row gap-2 mt-auto justify-end">
                                    <button class="w-full bg-green-600 text-white py-1 rounded text-sm w-[100px]"
                                        @click="save">บันทึก</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white shadow-sm border border-gray-200 rounded-lg p-2 mt-2">
            
            <div class="overflow-x-auto" style="height: calc(100vh - 450px);">
                <table class="min-w-full text-xs text-center border border-gray-200 bg-white">
                    <thead class="sticky top-0">
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
                        <tr v-for="(item, idx) in details" :key="item.URRIDL" :class="{ 'bg-gray-50': idx % 2 === 1 }">
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
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

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
const extra = ref('');
const lumpSumPrice = ref('');
const calculatedCost = ref(0);
const calculatedCostCtn = ref(0);

const save = () => {
    alert('Save (mock)');
    router.push({ name: 'shipcost-management' });
};
const cancel = () => {
    router.push({ name: 'shipcost-management' });
};

const backtomainpage = () => {
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
        // ดึง costRates จาก API ใหม่
        const ratesRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/transport/cost-rates`);
        const ratesData = await ratesRes.json();
        costRates.value = ratesData.data || [];
        details.value = data.data.details;
        session.value = data.data.session;
        // Default cost type
        if (shipment.value?.cost_type_id) {
            selectedCostType.value = shipment.value.cost_type_id;
        } else {
            const lumpType = costTypes.value.find(t => t.cost_type_name === 'เหมา');
            if (lumpType) selectedCostType.value = lumpType.cost_type_id;
        }
        // Default lumpSumPrice
        const lumpRates = costRates.value.filter(r => r.FORDESC === 'เหมา');
        if (lumpRates.length > 0) {
            lumpSumPrice.value = lumpRates[0].FORCOST;
        }
    } catch (e) {
        error.value = e.message;
    } finally {
        isLoading.value = false;
    }
};

const getCostTypeName = (typeId) => {
    const type = costTypes.value.find(t => t.cost_type_id === typeId);
    return type?.cost_type_name || '';
};

function calculateCost() {
    let val1 = 0, val2 = 0, val3 = 0;
    if (getCostTypeName(selectedCostType.value) === 'เหมา') {
        val1 = Number(lumpSumPrice.value) || 0;
        val2 = Number(extra.value) || 0;
        val3 = Number(palletCost.value) || 0;
    } else {
        val1 = Number(helper.value) || 0;
        val2 = Number(oilPercent.value) || 0;
        val3 = Number(palletCost.value) || 0;
    }
    const total = val1 + val2 + val3;
    const fg = Number(shipment.value?.URPLQA) || 0;
    const premium = Number(shipment.value?.URPRQA) || 0;
    const qty = fg + premium;
    calculatedCost.value = total;
    calculatedCostCtn.value = qty > 0 ? total / qty : 0;
}

// Watch input fields and recalculate automatically
watch([
    selectedCostType, helper, oilPercent, extra, lumpSumPrice, palletCost, shipment],
    () => {
        calculateCost();
    },
    { immediate: true }
);

onMounted(fetchShipmentData);
</script>