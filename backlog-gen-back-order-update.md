# Backlog Page - Gen Back Order Integration

## Overview
อัปเดตหน้า Backlog ให้ปุ่ม "ดึงข้อมูลใหม่" ยิง API `/api/transport/gen-back-order` แทนการโหลดข้อมูล transport ธรรมดา

## Changes Made

### 1. Updated Button Text
**Before:**
```vue
<button @click="showConfirmReload = true">
    {{ isLoadingTransport ? 'กำลังโหลด...' : 'ดึงข้อมูลใหม่' }}
</button>
```

**After:**
```vue
<button @click="showConfirmReload = true" :disabled="isLoadingTransport || isReloading">
    <Icon v-if="isReloading" icon="mdi:loading" class="animate-spin w-4 h-4 mr-1.5" />
    <Icon v-else icon="mdi:database-sync" width="16" height="16" class="mr-1.5" />
    {{ isReloading ? 'กำลังประมวลผล...' : 'Gen Back Order' }}
</button>
```

### 2. Updated confirmReload Function
**Before:**
```javascript
const confirmReload = async () => {
    showConfirmReload.value = false;
    isReloading.value = true;
    // เพิ่ม delay 2 วินาที (2000 ms) เพื่อทดสอบ
    await new Promise(resolve => setTimeout(resolve, 2000));
    await loadTransportData();
    isReloading.value = false;
};
```

**After:**
```javascript
const confirmReload = async () => {
    showConfirmReload.value = false;
    isReloading.value = true;
    
    try {
        // Call gen-back-order API
        const params = {
            warehouse: selectedDC.value || '',
            start_date: '', // You can add date filters if needed
            end_date: ''
        };
        
        const result = await transportStore.getGenBackOrderData(params);
        
        if (result.success) {
            showSuccess('สำเร็จ', 'ดึงข้อมูลใหม่เรียบร้อยแล้ว');
            // Optionally reload the current backlog data
            if (selectedDC.value && selectedStatus.value) {
                await loadData();
            }
        } else {
            showError('ผิดพลาด', result.message || 'ไม่สามารถดึงข้อมูลใหม่ได้');
        }
    } catch (err) {
        showError('ผิดพลาด', 'เกิดข้อผิดพลาดในการดึงข้อมูลใหม่');
        console.error('Error in confirmReload:', err);
    } finally {
        isReloading.value = false;
    }
};
```

### 3. Updated Modal Text
**Before:**
```vue
<h3 class="text-lg font-semibold">ยืนยันการดึงข้อมูลใหม่</h3>
<p>คุณต้องการดึงข้อมูลใหม่ใช่หรือไม่?</p>
```

**After:**
```vue
<h3 class="text-lg font-semibold">ยืนยันการ Gen Back Order</h3>
<p>คุณต้องการสร้างข้อมูล Back Order ใหม่ใช่หรือไม่?</p>
<p class="text-sm text-gray-600">การดำเนินการนี้อาจใช้เวลาสักครู่</p>
```

### 4. Updated Loading Text
**Before:**
```vue
<p class="text-center text-gray-600 mt-2">กำลังโหลดข้อมูลใหม่...</p>
```

**After:**
```vue
<p class="text-center text-gray-600 mt-2">กำลังสร้างข้อมูล Back Order...</p>
```

## API Integration

### API Endpoint
```
POST /api/transport/gen-back-order
```

### Request Parameters
```javascript
{
    warehouse: selectedDC.value || '',  // รหัสคลังที่เลือก
    start_date: '',                     // วันที่เริ่มต้น (สามารถเพิ่มได้)
    end_date: ''                        // วันที่สิ้นสุด (สามารถเพิ่มได้)
}
```

### Response Handling
- **Success**: แสดงข้อความสำเร็จ และโหลดข้อมูล backlog ใหม่ (ถ้ามีการเลือก DC และสถานะ)
- **Error**: แสดงข้อความ error และ log error ใน console

## User Flow

1. **User clicks "Gen Back Order" button**
2. **Confirmation modal appears**
3. **User confirms action**
4. **Loading modal shows "กำลังสร้างข้อมูล Back Order..."**
5. **API call to `/api/transport/gen-back-order`**
6. **Success/Error message displayed**
7. **If success and DC/Status selected, reload backlog data**

## Benefits

1. **Clear Purpose**: ปุ่มมีวัตถุประสงค์ที่ชัดเจน (Gen Back Order)
2. **Better UX**: ข้อความที่ชัดเจนและ informative
3. **Error Handling**: จัดการ error cases อย่างเหมาะสม
4. **Loading States**: แสดงสถานะ loading ที่เหมาะสม
5. **Integration**: เชื่อมต่อกับ API ที่ถูกต้อง

## Testing

### Test Cases
1. **Click Gen Back Order button** → Modal should appear
2. **Confirm action** → Loading should show, API should be called
3. **Success response** → Success message, data reloaded (if applicable)
4. **Error response** → Error message displayed
5. **Cancel action** → Modal should close, no API call

### Manual Testing
1. ไปที่หน้า backlog
2. เลือก DC และสถานะ (ถ้าต้องการ)
3. กดปุ่ม "Gen Back Order"
4. ยืนยันการดำเนินการ
5. ตรวจสอบผลลัพธ์

## Notes
- API endpoint นี้จะสร้างข้อมูล Back Order ใหม่
- หลังจาก Gen Back Order สำเร็จ จะโหลดข้อมูล backlog ใหม่ (ถ้ามีการเลือก DC และสถานะ)
- สามารถเพิ่ม date filters ได้ในอนาคต
- Error handling ครอบคลุมทั้ง network errors และ API errors 