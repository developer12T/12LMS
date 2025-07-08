<template>
  <nav class="flex items-center space-x-2 text-sm">
    <template v-for="(item, idx) in breadcrumbs" :key="idx">
      <template v-if="idx === 0">
        <span v-if="item.icon" class="mr-1"><Icon :icon="item.icon" class="w-4 h-4 align-middle" /></span>
        <span v-if="item.to">
          <router-link :to="item.to" class="font-semibold hover:underline">{{ item.label }}</router-link>
        </span>
        <span v-else class="font-semibold">{{ item.label }}</span>
      </template>
      <template v-else>
        <span class="mx-1 text-gray-400">&gt;</span>
        <span v-if="item.to">
          <router-link :to="item.to" class="hover:underline">{{ item.label }}</router-link>
        </span>
        <span v-else :class="idx === breadcrumbs.length - 1 ? 'text-[#1976d2] font-semibold' : ''">{{ item.label }}</span>
      </template>
    </template>
  </nav>
</template>

<script setup>
import { Icon } from '@iconify/vue';
const props = defineProps({
  breadcrumbs: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
nav {
  margin-bottom: 0.5rem;
}
</style> 