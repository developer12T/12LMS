import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/modules/auth';

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'login', component: () => import('../authentication/login.vue'), meta: { requiresGuest: true } },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/dashboardView.vue'), meta: { requiresAuth: true } },
  { path: '/tms', redirect: '/tms/report/percent-fill-to-dc', meta: { requiresAuth: true } },
  { path: '/tms/report', redirect: '/tms/report/percent-fill-to-dc', meta: { requiresAuth: true } },
  { path: '/tms/report/percent-fill-to-dc', name: 'percent-fill-to-dc', component: () => import('../views/tms/report/percentFillToDCView.vue'), meta: { requiresAuth: true } },
  { path: '/tms/report/stock-on-hand', name: 'stock-on-hand', component: () => import('../views/tms/report/stockOnHandView.vue'), meta: { requiresAuth: true } },
  { path: '/tms/report/daily-stock', name: 'daily-stock', component: () => import('../views/tms/report/dailyStockView.vue'), meta: { requiresAuth: true } },
  { path: '/tms/report/not-open-invoice', name: 'not-open-invoice', component: () => import('../views/tms/report/notOpenInvoiceView.vue'), meta: { requiresAuth: true } },
  { path: '/tms/report/backlog-unit', name: 'backlog-unit-report', component: () => import('../views/tms/report/backlogUnitReportView.vue'), meta: { requiresAuth: true } },
  { path: '/tms/report/plan', name: 'plan', component: () => import('../views/tms/report/planView.vue'), meta: { requiresAuth: true } },
  { path: '/tms/report/plan-total', name: 'plan-total', component: () => import('../views/tms/report/planTotalView.vue'), meta: { requiresAuth: true } },
  { path: '/tms/report/stock-age', name: 'stock-age', component: () => import('../views/tms/report/stockAgeView.vue'), meta: { requiresAuth: true } },
  { path: '/tms/report/shipment-cost', name: 'shipment-cost', component: () => import('../views/tms/report/shipmentCostView.vue'), meta: { requiresAuth: true } },
  { path: '/tms/report/shared-vehicle-cost', name: 'shared-vehicle-cost', component: () => import('../views/tms/report/sharedVehicleCostView.vue'), meta: { requiresAuth: true } },
  { path: '/tms/report/ontime-percent', name: 'ontime-percent', component: () => import('../views/tms/report/ontimePercentView.vue'), meta: { requiresAuth: true } },
  { path: '/tms/manage', redirect: '/tms/manage/backlog', meta: { requiresAuth: true } },
  { path: '/tms/manage/backlog', name: 'backlog', component: () => import('../views/tms/manage/backlogView.vue'), meta: { requiresAuth: true } },
  { path: '/tms/manage/backlog-unit', name: 'backlog-unit', component: () => import('../views/tms/manage/backlogUnitView.vue'), meta: { requiresAuth: true } },
  { path: '/tms/manage/weight-volume', name: 'weight-volume', component: () => import('../views/tms/manage/weightVolumeView.vue'), meta: { requiresAuth: true } },
  { path: '/tms/manage/shipcost', name: 'shipcost', component: () => import('../views/tms/manage/shipcostView.vue'), meta: { requiresAuth: true } },
  { path: '/tms/manage/shipcost-setting', name: 'shipcost-setting', component: () => import('../views/tms/manage/shipcostSettingView.vue'), meta: { requiresAuth: true } },
  { path: '/logout', name: 'Logout', beforeEnter: (to, from, next) => {
    const authStore = useAuthStore();
    authStore.logout();
    // next({ name: '/login' });
    window.location.href = "http://localhost:5173/";
  } },
  { path: '/:pathMatch(.*)*', redirect: '/' } 
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Initialize auth state if not already done
  if (!authStore.isAuthenticated) {
    authStore.initAuth();
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
    return;
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard');
    return;
  }

  next();
});

export default router;
