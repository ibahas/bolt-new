import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { adminRoutes } from './admin';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      component: () => import('../views/Login.vue'),
      meta: { guest: true }
    },
    {
      path: '/register',
      component: () => import('../views/Register.vue'),
      meta: { guest: true }
    },
    ...adminRoutes
  ]
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && !auth.user?.isAdmin) {
    next('/');
  } else if (to.meta.guest && auth.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;