import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';

export const useOmsBacklogStore = defineStore('omsBacklog', () => {
    // State
    const apiData = ref(null);
    const isLoadingData = ref(false);
    const apiError = ref(null);
    const searchQuery = ref('');
    const collapsedRows = ref(new Set());
    
    // Warehouse (DC) state
    const warehouseData = ref([]);
    const isLoadingWarehouse = ref(false);
    const warehouseError = ref(null);
    
    // Province filter state
    const selectedProvincesFilter = ref([]);

    // Getters
    const processedData = computed(() => {
        if (!apiData.value || !apiData.value.data) {
            return { provinces: [], dateRange: null };
        }
        
        const data = apiData.value.data;
        const dateRange = data.dateRange;
        const dateRangeTable = data.dateRangeTable;
        
        // Group by province
        const provinceGroups = {};
        dateRangeTable.forEach(item => {
            const provinceCode = item.code_province;
            const provinceName = item.name_province;
            
            if (!provinceGroups[provinceCode]) {
                provinceGroups[provinceCode] = {
                    id: provinceCode,
                    label: provinceName,
                    isParent: true,
                    children: []
                };
            }
            
            // Add child item
            provinceGroups[provinceCode].children.push({
                id: `${provinceCode}_${item.cus_code.trim()}`,
                label: item.cus_name,
                isParent: false,
                dateData: item.dateData
            });
        });
        
        // Convert to array and calculate totals
        const result = Object.values(provinceGroups).map(province => {
            // Calculate province total
            let provinceTotal = 0;
            province.children.forEach(child => {
                dateRange.allDates.forEach(date => {
                    const value = child.dateData[date];
                    if (value && value !== "-" && !isNaN(value)) {
                        provinceTotal += value;
                    }
                });
            });
            
            return {
                ...province,
                total: provinceTotal,
                grandTotal: provinceTotal
            };
        });
        
        return {
            provinces: result,
            dateRange: dateRange
        };
    });

    const filteredPlanningData = computed(() => {
        let data = processedData.value.provinces;
        
        // Filter by search query
        if (searchQuery.value) {
            data = data.filter(item => 
                item.label.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                item.children.some(child => 
                    child.label.toLowerCase().includes(searchQuery.value.toLowerCase())
                )
            );
        }
        
        // Filter by selected provinces
        if (selectedProvincesFilter.value.length > 0) {
            data = data.filter(item => 
                selectedProvincesFilter.value.includes(item.label)
            );
        }
        
        return data;
    });

    // Default collapsed state - ยุบทุกจังหวัดตั้งแต่เริ่มต้น
    const defaultCollapsedRows = computed(() => {
        const data = processedData.value.provinces;
        return new Set(data.map(province => province.id));
    });

    // Initialize collapsedRows with default collapsed state
    const initializeCollapsedRows = () => {
        if (processedData.value.provinces.length > 0) {
            // ยุบทุกจังหวัดเป็น default
            collapsedRows.value = new Set(processedData.value.provinces.map(province => province.id));
        }
    };

    // Actions
    const fetchWarehouseData = async () => {
        isLoadingWarehouse.value = true;
        warehouseError.value = null;
        try {
            const response = await api.get('/api/warehouse');
            const data = response.data;
            if (data.success) {
                warehouseData.value = data.data || [];
            } else {
                warehouseError.value = 'Failed to fetch warehouse data';
            }
        } catch (error) {
            warehouseError.value = 'Network error: ' + (error?.message || error);
        } finally {
            isLoadingWarehouse.value = false;
        }
    };

    const fetchData = async (dc) => {
        isLoadingData.value = true;
        apiError.value = null;
        try {
            const params = { who: dc };
            if (dc) params.dc = dc;
            
            const response = await api.get('/api/oms/manage/backlog/reorganized', { params });
            const data = response.data;
            if (data.success) {
                apiData.value = data;
                // Initialize collapsed state after data is loaded
                initializeCollapsedRows();
            } else {
                apiError.value = 'Failed to fetch data';
            }
        } catch (error) {
            apiError.value = 'Network error: ' + (error?.message || error);
        } finally {
            isLoadingData.value = false;
        }
    };

    const toggleRow = (rowId) => {
        if (collapsedRows.value.has(rowId)) {
            collapsedRows.value.delete(rowId);
        } else {
            collapsedRows.value.add(rowId);
        }
    };

    const isRowCollapsed = (rowId) => {
        return collapsedRows.value.has(rowId);
    };

    const setSearchQuery = (query) => {
        searchQuery.value = query;
    };

    const setProvinceFilter = (provinces) => {
        selectedProvincesFilter.value = provinces;
    };

    const clearProvinceFilter = () => {
        selectedProvincesFilter.value = [];
    };

    // Utility functions
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        return `${day}-${month}`;
    };

    const getProvinceTotal = (province, date) => {
        let total = 0;
        province.children.forEach(child => {
            const value = child.dateData[date];
            if (value && value !== "-" && !isNaN(value)) {
                total += value;
            }
        });
        return total > 0 ? total : null;
    };

    const getCustomerTotal = (child) => {
        let total = 0;
        processedData.value.dateRange?.allDates.forEach(date => {
            const value = child.dateData[date];
            if (value && value !== "-" && !isNaN(value)) {
                total += value;
            }
        });
        return total > 0 ? total : null;
    };

    return {
        // State
        apiData,
        isLoadingData,
        apiError,
        searchQuery,
        collapsedRows,
        
        // Warehouse state
        warehouseData,
        isLoadingWarehouse,
        warehouseError,
        
        // Province filter state
        selectedProvincesFilter,
        
        // Getters
        processedData,
        filteredPlanningData,
        
        // Actions
        fetchWarehouseData,
        fetchData,
        toggleRow,
        isRowCollapsed,
        setSearchQuery,
        setProvinceFilter,
        clearProvinceFilter,
        initializeCollapsedRows,
        
        // Utility functions
        formatDate,
        getProvinceTotal,
        getCustomerTotal
    };
}); 