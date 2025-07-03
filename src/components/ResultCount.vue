<template>
  <div class="flex items-center gap-2 px-2 py-1 bg-white rounded-md border border-gray-200 shadow-sm">
    <Icon :icon="icon" :color="iconColor" class="w-4 h-4 mr-1" v-if="icon" />
    <div class="flex items-center gap-1 text-xs font-sarabun text-gray-700">
      <span class="font-medium">{{ label }}</span>
      <span v-if="typeof current === 'number'" class="inline-flex items-center px-2 py-0.5 bg-gray-50 text-gray-600 rounded font-bold text-xs">
        {{ current }}
      </span>
      <span class="text-gray-400" v-if="typeof current === 'number'">/</span>
      <span v-if="typeof total === 'number'" class="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-600 rounded font-medium text-xs">
        {{ total }}
      </span>
      <span>รายการ</span>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { computed } from 'vue';

const props = defineProps({
  label: { type: String, default: 'ผลลัพธ์:' },
  current: { type: Number, default: null },
  total: { type: Number, default: null },
  icon: { type: String, default: 'streamline-ultimate:time-daily-1-bold' },
  iconColor: { type: String, default: '#374151' },
});
</script>

<style scoped>
.font-sarabun {
  font-family: 'Sarabun', sans-serif;
}
</style> 