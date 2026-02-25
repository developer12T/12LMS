<template>
    <div class="min-h-screen bg-gray-50 py-1">
        <div class=" mx-auto px-4 flex justify-between gap-4">
            <!-- Upload Form -->
            <div class="w-1/4 h-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-2">
                <div class="flex flex-col justify-between h-full">
                    <div class="mb-2">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">อัพโหลดไฟล์ Excel</h3>
                        <p class="text-sm text-gray-600 mb-2">สำหรับบันทึกข้อมูลวางแผนรวม</p>

                        <!-- ข้อมูลตัวอย่าง -->
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                            <h4 class="text-sm font-medium text-blue-900 mb-2">รูปแบบข้อมูลที่รองรับ:</h4>
                            <ul class="text-xs text-blue-800 space-y-1">
                                <li>• คอลัมน์ที่ 1: รหัสสินค้า</li>
                                <li>• คอลัมน์ที่ 2: รายละเอียดสินค้า</li>
                                <li>• คอลัมน์ที่ 3+: ข้อมูลตามวันที่</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <form @submit.prevent="handleSave" class="space-y-2">
                    <!-- Employee ID Input -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <Icon icon="mdi:account" class="w-4 h-4 inline mr-2" />
                            รหัสพนักงาน *
                        </label>
                        <input v-model="employeeId" type="text" required placeholder="กรุณากรอกรหัสพนักงาน"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <!-- File Upload -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <Icon icon="mdi:file-upload" class="w-4 h-4 inline mr-2" />
                            เลือกไฟล์ Excel *
                        </label>
                        <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors"
                            @drop="handleDrop" @dragover="handleDragOver" @dragleave="handleDragLeave"
                            :class="{ 'border-blue-400 bg-blue-50': isDragOver }">
                            <div class="space-y-1 text-center">
                                <Icon icon="mdi:file-excel" class="mx-auto h-12 w-12 text-gray-400" />
                                <div class="flex text-sm text-gray-600">
                                    <label
                                        class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                        <span>อัพโหลดไฟล์</span>
                                        <input ref="fileInput" type="file" accept=".xlsx,.xls"
                                            @change="handleFileChange" class="sr-only" required />
                                    </label>
                                    <p class="pl-1">หรือลากและวาง</p>
                                </div>
                                <p class="text-xs text-gray-500">XLSX, XLS สูงสุด 10MB</p>
                            </div>
                        </div>
                        <div v-if="selectedFile" class="mt-2 flex items-center space-x-2">
                            <Icon icon="mdi:file-check" class="w-5 h-5 text-green-500" />
                            <span class="text-sm text-gray-600">{{ selectedFile.name }}</span>
                            <button type="button" @click="clearFile" class="text-red-500 hover:text-red-700">
                                <Icon icon="mdi:close" class="w-4 h-4" />
                            </button>
                        </div>
                                        </div>

                    <!-- Save Button -->
                    <div class="flex justify-end mt-6">
                        <button type="submit"
                            :disabled="!employeeId || !selectedFile || !previewData.length || isProcessing"
                            class="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors">
                            <Icon v-if="saving" icon="mdi:loading" class="w-4 h-4 animate-spin" />
                            <Icon v-else icon="mdi:content-save" class="w-4 h-4" />
                            <span>{{ saving ? 'กำลังบันทึกข้อมูล...' : 'อัพโหลดข้อมูล' }}</span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Preview Section -->
            <div class="w-3/4 bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
                <!-- Loading Overlay -->
                <div v-if="isProcessing"
                    class="absolute inset-0 bg-white bg-opacity-75 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div class="text-center">
                        <Icon icon="mdi:loading" class="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                        <p class="text-gray-600">กำลังประมวลผลไฟล์...</p>
                    </div>
                </div>

                <div v-if="previewData.length > 0">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h2 class="text-lg font-semibold text-gray-900">Preview ข้อมูล</h2>
                                                             <div class="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                     <span>จำนวนข้อมูล: {{ previewData.length }} รายการ</span>
                                     <span>จำนวนคอลัมน์: {{ (tableHeaders.includes('__EMPTY') ? 1 : 0) + (tableHeaders.includes('__EMPTY_1') ? 1 : 0) + dateColumns.length }} คอลัมน์</span>
                                     <span v-if="dateColumns.length > 0">ช่วงวันที่: {{ dateRange }}</span>
                                     <span v-if="dateColumns.length > 0">({{ dateColumns.length }} วัน)</span>
                                     <span class="text-blue-600">ข้อมูลที่จะส่ง: {{ getTotalPlans() }} รายการ</span>
                                 </div>
                                 
                                 <!-- ข้อมูลสรุปตามวันที่ -->
                                 <!-- <div v-if="dateColumns.length > 0" class="mt-2 flex flex-wrap gap-2">
                                     <span v-for="date in dateColumns" :key="date" 
                                         class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                         <span class="font-medium">{{ date }}:</span>
                                         <span class="ml-1">{{ dataSummary[date] || 0 }} รายการ</span>
                                     </span>
                                 </div> -->
                        </div>
                    </div>

                    <!-- Preview Table -->
                    <div class="overflow-x-auto overflow-y-auto h-[70vh]">
                        <table class="min-w-full divide-y divide-gray-200 text-xs">
                                                         <thead class="bg-gray-50 sticky top-0">
                                 <tr>
                                     <!-- รหัสสินค้า -->
                                     <th v-if="tableHeaders.includes('__EMPTY')" :key="'__EMPTY'"
                                         class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                         รหัสสินค้า
                                     </th>
                                     <!-- รายละเอียดสินค้า -->
                                     <th v-if="tableHeaders.includes('__EMPTY_1')" :key="'__EMPTY_1'"
                                         class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                         ชื่อสินค้า
                                     </th>
                                     <!-- ข้อมูลวันที่ (กรอง __EMPTY_3 เป็นต้นไปออก) -->
                                     <th v-for="header in dateColumns" :key="header"
                                         class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                         {{ header }}
                                     </th>
                                 </tr>
                             </thead>
                             <tbody class="bg-white divide-y divide-gray-200">
                                 <tr v-for="(row, index) in previewData" :key="index" class="hover:bg-gray-50">
                                     <!-- รหัสสินค้า -->
                                     <td v-if="tableHeaders.includes('__EMPTY')" :key="'__EMPTY'"
                                         class="px-4 py-2 whitespace-nowrap text-xs text-gray-900 border-r border-gray-100 font-medium bg-blue-50">
                                         {{ row['__EMPTY'] || '-' }}
                                     </td>
                                     <!-- รายละเอียดสินค้า -->
                                     <td v-if="tableHeaders.includes('__EMPTY_1')" :key="'__EMPTY_1'"
                                         class="px-4 py-2 whitespace-nowrap text-xs text-gray-900 border-r border-gray-100 bg-gray-50">
                                         {{ row['__EMPTY_1'] || '-' }}
                                     </td>
                                     <!-- ข้อมูลวันที่ -->
                                     <td v-for="header in dateColumns" :key="header"
                                         class="px-4 py-2 whitespace-nowrap text-xs text-gray-900 border-r border-gray-100 text-center">
                                         <span class="inline-flex items-center">
                                             {{ row[header] || '-' }}
                                             <span v-if="row[header] && row[header] !== '-'"
                                                 class="ml-1 text-red-500 text-xs">●</span>
                                         </span>
                                     </td>
                                 </tr>
                             </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Success Message -->
            <div v-if="showSuccess" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div class="mt-3 text-center">
                        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <Icon icon="mdi:check" class="w-6 h-6 text-green-600" />
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mt-4">บันทึกข้อมูลสำเร็จ!</h3>
                        <p class="text-sm text-gray-500 mt-2">ข้อมูลได้ถูกบันทึกลงในระบบแล้ว</p>
                        <div class="mt-4">
                            <button @click="closeSuccess"
                                class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                                ตกลง
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Processing Popup -->
            <div v-if="saving" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div class="mt-3 text-center">
                        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                            <Icon icon="mdi:loading" class="w-6 h-6 text-blue-600 animate-spin" />
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mt-4">กำลังบันทึกข้อมูล</h3>
                        <p class="text-sm text-gray-500 mt-2">กรุณารอสักครู่...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from '@iconify/vue'
import * as XLSX from 'xlsx'
import { apiClient } from '@/utils/api'

export default {
    name: 'UploadExcelView',
    components: {
        Icon
    },
    data() {
        return {
            employeeId: '',
            selectedFile: null,
            saving: false,
            previewData: [],
            tableHeaders: [],
            showSuccess: false,
            isDragOver: false,
            isProcessing: false
        }
    },
      computed: {
    dateColumns() {
      if (this.tableHeaders.length <= 2) return []
      
      // ใช้คอลัมน์ที่ 3 เป็นต้นไป (ข้อมูลวันที่) และตัด __EMPTY_3 เป็นต้นไปออก
      const allCols = this.tableHeaders.slice(2)
      const dateCols = allCols.filter(header => {
        const isDateColumn = header && typeof header === 'string' && 
                           (header.includes('-') || header.includes('Jul') || header.includes('ก.ค.'))
        const isNotEmpty = !header.startsWith('__EMPTY_3')
        return isDateColumn && isNotEmpty
      })
      
      console.log('All headers:', this.tableHeaders)
      console.log('All columns from index 2:', allCols)
      console.log('Date columns (filtered):', dateCols)
      console.log('Filtered out columns:', allCols.filter(header => header.startsWith('__EMPTY_3')))
      return dateCols
    },
    
    dateRange() {
      if (this.dateColumns.length === 0) return ''
      
      const firstDate = this.dateColumns[0]
      const lastDate = this.dateColumns[this.dateColumns.length - 1]
      
      // ถ้าวันที่แรกและวันสุดท้ายเหมือนกัน แสดงแค่วันเดียว
      if (firstDate === lastDate) {
        return firstDate
      }
      
      // ถ้าเป็นช่วงวันที่ แสดงช่วง
      return `${firstDate} - ${lastDate}`
    },
    
    dataSummary() {
      if (this.dateColumns.length === 0) return {}
      
      const summary = {}
      this.dateColumns.forEach(date => {
        let count = 0
        this.previewData.forEach(row => {
          if (row[date] && row[date] !== '-' && row[date] !== '') {
            count++
          }
        })
        summary[date] = count
      })
      
      return summary
    }
  },
    methods: {
        getTotalPlans() {
            let total = 0
            this.previewData.forEach(row => {
                this.dateColumns.forEach(date => {
                    const planValue = row[date]
                    // นับเฉพาะข้อมูลที่มีค่าจริง (ไม่ใช่ 0 หรือค่าว่าง)
                    if (planValue && planValue !== '' && planValue !== '-' && planValue !== '0') {
                        total++
                    }
                })
            })
            return total
        },

        convertDateToFormat(dateStr) {
            // Convert "18-Jul" to "1807xxxx" format
            if (!dateStr || typeof dateStr !== 'string') return dateStr
            
            const match = dateStr.match(/(\d+)-(\w+)/)
            if (!match) return dateStr
            
            const day = match[1]
            const month = match[2]
            
            // Map month abbreviations to numbers
            const monthMap = {
                'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
                'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
                'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
            }
            
            const monthNum = monthMap[month] || '00'
            const currentYear = new Date().getFullYear().toString()
            
            // Format: DDMMYYYY (e.g., "18072024")
            return `${day.padStart(2, '0')}${monthNum}${currentYear}`
        },

        async handleFileChange(event) {
            const file = event.target.files[0]
            if (file) {
                this.selectedFile = file
                // Preview ข้อมูลทันทีที่เลือกไฟล์
                await this.previewExcelFile(file)
            }
        },

        clearFile() {
            this.selectedFile = null
            this.previewData = []
            this.tableHeaders = []
            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = ''
            }
        },

        async handleSave() {
            if (!this.employeeId || !this.selectedFile || !this.previewData.length) {
                alert('กรุณากรอกรหัสพนักงานและเลือกไฟล์ที่มีข้อมูล')
                return
            }

            this.saving = true

            try {
                // เตรียมข้อมูลในรูปแบบที่ต้องการ
                const productList = []
                
                this.previewData.forEach(row => {
                    const productId = row['__EMPTY'] || ''
                    const productName = row['__EMPTY_1'] || ''
                    
                    // ส่งข้อมูลทุกวันที่มีในตาราง
                    this.dateColumns.forEach(date => {
                        const planValue = row[date]
                        // ถ้าไม่มีข้อมูลหรือเป็นค่าว่าง ให้ใส่ 0
                        const finalValue = (planValue && planValue !== '' && planValue !== '-') ? planValue : '0'
                        
                        productList.push({
                            id: productId,
                            name: productName,
                            plan_date: this.convertDateToFormat(date), // แปลงเฉพาะตอนส่ง API
                            plan_value: finalValue
                        })
                    })
                })

                const payload = {
                    emp_id: this.employeeId,
                    productList: productList
                }

                console.log('Prepared data for API:', payload)
                console.log('Total products with plans:', productList.length)

                // เรียก API /api/import-product-plan
                const response = await apiClient.post('/api/import-product-plan', payload)

                console.log('API Response:', response)

                // Show success message
                this.showSuccess = true

                // Reset form
                this.clearForm()

            } catch (error) {
                console.error('Error saving data:', error)
                alert(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message}`)
            } finally {
                this.saving = false
            }
        },

        readExcelFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()

                reader.onload = (e) => {
                    try {
                        const data = new Uint8Array(e.target.result)
                        const workbook = XLSX.read(data, { 
                            type: 'array',
                            cellDates: false,
                            cellNF: false,
                            cellText: true
                        })
                        const sheetName = workbook.SheetNames[0]
                        const worksheet = workbook.Sheets[sheetName]
                        
                        // อ่านข้อมูลแบบ raw โดยไม่แปลง
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                            raw: true,
                            defval: ''
                        })
                        
                        resolve(jsonData)
                    } catch (error) {
                        reject(error)
                    }
                }

                reader.onerror = reject
                reader.readAsArrayBuffer(file)
            })
        },



        clearForm() {
            this.employeeId = ''
            this.selectedFile = null
            this.previewData = []
            this.tableHeaders = []
            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = ''
            }
        },

        closeSuccess() {
            this.showSuccess = false
        },

        handleDragOver(event) {
            event.preventDefault()
            this.isDragOver = true
        },

        handleDragLeave(event) {
            event.preventDefault()
            this.isDragOver = false
        },

        async handleDrop(event) {
            event.preventDefault()
            this.isDragOver = false

            const files = event.dataTransfer.files
            if (files.length > 0) {
                const file = files[0]
                if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                    file.type === 'application/vnd.ms-excel' ||
                    file.name.endsWith('.xlsx') ||
                    file.name.endsWith('.xls')) {
                    this.selectedFile = file
                    // Preview ข้อมูลทันทีที่ลากไฟล์
                    await this.previewExcelFile(file)
                } else {
                    alert('กรุณาเลือกไฟล์ Excel (.xlsx หรือ .xls) เท่านั้น')
                }
            }
        },

        async previewExcelFile(file) {
            this.isProcessing = true

            try {
                // Simulate processing time
                await new Promise(resolve => setTimeout(resolve, 1500))

                // Read Excel file
                const data = await this.readExcelFile(file)

                if (data.length > 0) {
                    this.tableHeaders = Object.keys(data[0])
                    // แสดงข้อมูลทั้งหมด ยกเว้นแถวสุดท้ายที่มีรหัสสินค้าเป็น "(ว่าง)"
                    this.previewData = data.filter(row => {
                        return row['__EMPTY'] && row['__EMPTY'] !== '' && row['__EMPTY'] !== '-' && row['__EMPTY'] !== '(ว่าง)'
                    })
                } else {
                    alert('ไม่พบข้อมูลในไฟล์ Excel')
                }
            } catch (error) {
                console.error('Error processing file:', error)
                alert('เกิดข้อผิดพลาดในการประมวลผลไฟล์')
            } finally {
                this.isProcessing = false
            }
        },
    }
}
</script>

<style scoped>
/* Custom styles for file upload area */
.border-dashed:hover {
    border-color: #3b82f6;
}
</style>