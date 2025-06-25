# Gen Back Order API Documentation

## Overview
API endpoint สำหรับสร้างและดึงข้อมูล Back Order สำหรับการจัดการ

## Endpoint
```
POST /api/transport/gen-back-order
```

## Request Body Parameters
```json
{
  "warehouse": "string",     // รหัสคลัง (optional)
  "start_date": "string",    // วันที่เริ่มต้น (YYYY-MM-DD format)
  "end_date": "string"       // วันที่สิ้นสุด (YYYY-MM-DD format)
}
```

### Parameters Description
- `warehouse`: รหัสคลังที่ต้องการดึงข้อมูล (ถ้าไม่ระบุจะดึงข้อมูลทุกคลัง)
- `start_date`: วันที่เริ่มต้นในการดึงข้อมูล
- `end_date`: วันที่สิ้นสุดในการดึงข้อมูล

## Response Format
```json
{
  "status": {
    "code": 200,
    "message": "Success"
  },
  "data": [
    {
      "warehouse": "101",
      "document_no": "BO20241201001",
      "date": "2024-12-01",
      "item_code": "10010101001",
      "item_name": "น้ำปลา ร้าดังสุด ฟ้าไทย 400ml x12x2",
      "quantity": 10,
      "status": "pending"
    }
  ]
}
```

### Response Data Structure
- `warehouse`: รหัสคลัง
- `document_no`: เลขที่เอกสาร Back Order
- `date`: วันที่สร้าง Back Order
- `item_code`: รหัสสินค้า
- `item_name`: ชื่อสินค้า
- `quantity`: จำนวน
- `status`: สถานะ (pending, processing, completed, cancelled)

## Frontend Implementation

### Store Function
```javascript
// ใน src/stores/modules/transport.js
const getGenBackOrderData = async (params) => {
  // Implementation details...
};
```

### Usage in Component
```javascript
// ใน src/views/tms/manage/genBackOrderView.vue
const generateBackOrder = async () => {
  const params = {
    warehouse: filters.value.warehouse,
    start_date: filters.value.startDate,
    end_date: filters.value.endDate
  };

  const result = await transportStore.getGenBackOrderData(params);
  if (result.success) {
    genBackOrderData.value = result.data || [];
  }
};
```

## Features

### 1. Filtering
- กรองตามคลัง
- กรองตามช่วงวันที่

### 2. Data Display
- แสดงข้อมูลในรูปแบบตาราง
- สถานะการแสดงผลที่แตกต่างกัน
- สรุปจำนวนรวม

### 3. Export Functionality
- ส่งออกเป็นไฟล์ Excel
- กำหนดความกว้างคอลัมน์อัตโนมัติ

### 4. Error Handling
- จัดการ error ต่างๆ
- แสดงข้อความ error ที่เหมาะสม
- Loading states

## Route Configuration
```javascript
// ใน src/router/index.js
{
  path: '/tms/manage/gen-back-order',
  name: 'gen-back-order',
  component: () => import('../views/tms/manage/genBackOrderView.vue'),
  meta: { 
    requiresAuth: true, 
    breadcrumb: 'TMS / จัดการ / Gen Back Order' 
  }
}
```

## Testing

### Test Cases
1. **กรณีไม่มีข้อมูล**: ควรแสดงข้อความ "ไม่มีข้อมูล"
2. **กรณีมีข้อมูล**: ควรแสดงตารางข้อมูล
3. **กรณี error**: ควรแสดงข้อความ error
4. **กรณี loading**: ควรแสดง loading spinner
5. **กรณี export**: ควรสร้างไฟล์ Excel

### Manual Testing
1. ไปที่หน้า `/tms/manage/gen-back-order`
2. เลือกคลังและช่วงวันที่
3. กดปุ่ม "สร้าง Back Order"
4. ตรวจสอบข้อมูลที่แสดง
5. ทดสอบการส่งออก Excel

## Notes
- API endpoint นี้ใช้ POST method เพื่อรองรับการส่ง parameters ที่ซับซ้อน
- ข้อมูลที่ส่งกลับควรมีโครงสร้างที่สอดคล้องกับ frontend
- ควรมีการ validate parameters ที่ส่งมา
- ควรมีการ handle error cases ต่างๆ 