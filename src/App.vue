<script setup>   
import { useAuthStore } from './stores'
const authStore = useAuthStore()
import SideBar from "@/components/sideBar.vue";
import PageHeader from "@/components/PageHeader.vue";
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
    <div :class="authStore.user">
        <div v-if="route.path !== '/'" class="flex h-screen bg-gray-50">
            <SideBar v-if="route.path !== '/login'" />
            <div class="flex-1 flex flex-col">
                <main :class="route.path !== '/login' ? 'flex-1 p-6' : ''">
                    <PageHeader v-if="route.path !== '/login' && route.meta.breadcrumb && route.path !== '/tms/manage/backlog' && route.path !== '/tms/report/shipment-cost'" />
                    <router-view />
                </main>
            </div>
        </div>
        <router-view v-else />
    </div>
</template>

<style>

</style>