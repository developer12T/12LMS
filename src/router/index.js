import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/modules/auth';

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'login', component: () => import('../authentication/login.vue'), meta: { requiresGuest: true } },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/dashboardView.vue'), meta: { requiresAuth: true, breadcrumb: 'Dashboard' } },
  { path: '/tms', redirect: '/tms/report/percent-fill-to-dc', meta: { requiresAuth: true } },
  { path: '/tms/report', redirect: '/tms/report/percent-fill-to-dc', meta: { requiresAuth: true } },
  { path: '/tms/report/percent-fill-to-dc', name: 'percent-fill-to-dc', component: () => import('../views/tms/report/percentFillToDCView.vue'), meta: { requiresAuth: true, breadcrumb: 'TMS / รายงาน / %เติมสินค้าเข้า DC' } },
  { path: '/tms/report/stock-on-hand', name: 'stock-on-hand', component: () => import('../views/tms/report/stockOnHandView.vue'), meta: { requiresAuth: true, breadcrumb: 'TMS / รายงาน / Stock On Hand' } },
  { path: '/tms/report/daily-stock', name: 'daily-stock', component: () => import('../views/tms/report/dailyStockView.vue'), meta: { requiresAuth: true, breadcrumb: 'TMS / รายงาน / Daily Stock' } },
  { path: '/tms/report/not-bill', name: 'not-bill', component: () => import('../views/tms/report/notBillView.vue'), meta: { requiresAuth: true, breadcrumb: 'TMS / รายงาน / รายการที่ไม่ได้วางบิล' } },
  { path: '/tms/report/not-open-invoice', name: 'not-open-invoice', component: () => import('../views/tms/report/notOpenInvoiceView.vue'), meta: { requiresAuth: true, breadcrumb: 'TMS / รายงาน / สินค้าที่ยังไม่ได้เปิด Invoice' } },
  { path: '/tms/report/backlog-unit', name: 'backlog-unit-report', component: () => import('../views/tms/report/backlogUnitReportView.vue'), meta: { requiresAuth: true, breadcrumb: 'TMS / รายงาน / ออเดอร์ค้างส่ง(หน่วยรถ)' } },
  { path: '/tms/report/plan', name: 'plan', component: () => import('../views/tms/report/planView.vue'), meta: { requiresAuth: true, breadcrumb: 'TMS / รายงาน / วางแผน' } },
  { path: '/tms/report/plan-total', name: 'plan-total', component: () => import('../views/tms/report/planTotalView.vue'), meta: { requiresAuth: true, breadcrumb: 'TMS / รายงาน / วางแผนรวม' } },
  { path: '/tms/report/stock-age', name: 'stock-age', component: () => import('../views/tms/report/stockAgeView.vue'), meta: { requiresAuth: true, breadcrumb: 'TMS / รายงาน / อายุสินค้าคงเหลือ' } },
  { path: '/tms/report/shipment-cost', name: 'shipment-cost', component: () => import('../views/tms/report/shipmentCostView.vue'), meta: { requiresAuth: true, breadcrumb: 'TMS / รายงาน / ค่าขนส่ง(shipment)' } },
  { path: '/tms/report/shared-vehicle-cost', name: 'shared-vehicle-cost', component: () => import('../views/tms/report/sharedVehicleCostView.vue'), meta: { requiresAuth: true, breadcrumb: 'TMS / รายงาน / ค่าขนส่ง(รถร่วม)' } },
  { path: '/tms/report/ontime-percent', name: 'ontime-percent', component: () => import('../views/tms/report/ontimePercentView.vue'), meta: { requiresAuth: true, breadcrumb: 'TMS / รายงาน / % ontime' } },
  { path: '/tms/manage', redirect: '/tms/manage/backlog', meta: { requiresAuth: true } },
  { path: '/tms/manage/backlog', name: 'backlog', component: () => import('../views/tms/manage/backlogView.vue'), meta: { requiresAuth: true, breadcrumb: 'TMS / จัดการ / ออเดอร์ค้างส่ง' } },
  { path: '/tms/manage/backlog-unit', name: 'backlog-unit', component: () => import('../views/tms/manage/backlogUnitView.vue'), meta: { requiresAuth: true, breadcrumb: 'TMS / จัดการ / ออเดอร์ค้างส่ง(หน่วยรถ)' } },
  { path: '/tms/manage/weight-volume', name: 'weight-volume', component: () => import('../views/tms/manage/weightVolumeView.vue'), meta: { requiresAuth: true, breadcrumb: 'TMS / จัดการ / กำหนดปริมาตรและน้ำหนักรถบรรทุก' } },
  { path: '/tms/manage/shipcost-management', name: 'shipcost-management', component: () => import('../views/tms/manage/shipcostView.vue'), meta: { requiresAuth: true, breadcrumb: 'TMS / จัดการ / จัดการค่าขนส่ง' } },
  { path: '/tms/manage/shipcost-setting', name: 'shipcost-setting', component: () => import('../views/tms/manage/shipcostSettingView.vue'), meta: { requiresAuth: true, breadcrumb: 'TMS / จัดการ / กำหนดค่าขนส่ง' } },
  { path: '/tms/manage/shipcost-edit', name: 'shipcost-edit', component: () => import('../views/tms/manage/shipcostEditView.vue'), meta: { requiresAuth: true, breadcrumb: 'TMS / จัดการ / แก้ไขค่าขนส่ง' } },
  { path: '/manage/user', name: 'user-management', component: () => import('../views/manage/userView.vue'), meta: { requiresAuth: true, breadcrumb: 'จัดการสิทธิ์การใช้งาน' } },
  { path: '/logout', name: 'Logout', beforeEnter: (to, from, next) => {
    const authStore = useAuthStore();
    authStore.logout();
    // next({ name: '/login' });
    window.location.href = "http://localhost:5173/";
  } },
  {
    path: '/order-detail/:productCode',
    name: 'OrderDetail',
    component: () => import('@/views/tms/report/OrderDetailView.vue'),
    props: route => ({ productCode: route.params.productCode, productName: route.query.productName })
  },
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
