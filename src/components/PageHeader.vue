<template>
  <div v-if="route.meta.breadcrumb"  class="flex mb-2 justify-between items-center">
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-[#00569D]">
            <Icon icon="mdi:home" class="w-4 h-4 mr-2" />
            Dashboard
          </router-link>
        </li>
        <li v-for="(item, index) in breadcrumbs" :key="index">
          <div class="flex items-center">
            <Icon icon="mdi:chevron-right" class="w-4 h-4 text-gray-400" />
            <span v-if="index === breadcrumbs.length - 1" class="ml-1 text-sm font-medium text-[#00569D] md:ml-2" aria-current="page">
              {{ item }}
            </span>
            <span v-else class="ml-1 text-sm font-medium text-gray-500 md:ml-2">
              {{ item }}
            </span>
          </div>
        </li>
        <!-- <template v-if="authStore.currentUser && route.path === '/tms/manage/backlog'">
        <img :src="authStore.userImgUrl || 'logo12.png'" :alt="authStore.userFullName"
          class="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
          @error="$event.target.src = 'logo12.png'" />
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-800 truncate">{{ authStore.userFullNameThai }}</p>
          <p class="text-xs text-gray-500 truncate">{{ authStore.userPosition }}</p>
        </div>
      </template> -->
      </ol>
    </nav>
    <!-- User Info + Actions Slot -->
    <div class="flex items-center space-x-2">
      <template v-if="authStore.currentUser && route.path !== '/tms/manage/backlog' && route.path !== '/tms/report/shipment-cost'">
        <img :src="authStore.userImgUrl || 'logo12.png'" :alt="authStore.userFullName"
          class="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
          @error="$event.target.src = 'logo12.png'" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-800 truncate">{{ authStore.userFullNameThai }}</p>
          <p class="text-xs text-gray-500 truncate">{{ authStore.userPosition }}</p>
        </div>
      </template>
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores';
import { Icon } from '@iconify/vue';

const route = useRoute();
const authStore = useAuthStore();

const breadcrumbs = computed(() => {
  const metaBreadcrumb = route.meta.breadcrumb || '';
  if (metaBreadcrumb && typeof metaBreadcrumb === 'string') {
    // For Dashboard, return empty array since it's already shown as home
    if (metaBreadcrumb === 'Dashboard') return [];
    return metaBreadcrumb.split(' / ');
  }
  return [];
});
</script> 