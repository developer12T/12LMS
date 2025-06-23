<script setup>   
import { useAuthStore } from './stores'
const authStore = useAuthStore()
import SideBar from "@/components/sideBar.vue";
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
    <div :class="authStore.user">
        <div v-if="route.path !== '/'" class="flex h-screen">
            <SideBar v-if="route.path !== '/login'" />
            <div class="flex-1 overflow-auto">
                <router-view />
            </div>
        </div>
        <router-view v-else />
    </div>
</template>

<style>

</style>