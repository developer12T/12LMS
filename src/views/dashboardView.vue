<template>
    <div class="flex-1 p-6 bg-gray-50 min-h-screen">
         <!-- Page Header -->
         <div class="mb-6">
            <nav class="flex mb-4" aria-label="Breadcrumb">
                <ol class="inline-flex items-center space-x-1 md:space-x-3">
                    <li class="inline-flex items-center">
                        <router-link to="/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-[#00569D]">
                            <Icon icon="mdi:home" class="w-4 h-4 mr-2" />
                            Dashboard
                        </router-link>
                    </li>
                </ol>
            </nav>
        </div>
      <div class="p-4 mt-14">
            <div class="max-w-md">
               <h1 class="text-2xl font-bold dark:text-white">สวัสดี, Hello</h1>
              <p class="py-6 dark:text-white">ยินดีต้อนรับเข้าสู่ระบบจัดการ Logistics Management System</p>
            </div>
      </div>
    </div>
  </template>
  
  <script setup>  
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

</script>
  