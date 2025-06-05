import { createRouter, createWebHistory } from 'vue-router'
import {allRoutes} from "@/router/routes";
import { useAuthStore } from '@/stores/auth' // adapte selon ton projet



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes,

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  },
})

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some((route) => route.meta.authRequired);
  const authStore = useAuthStore();

  authStore.loadUserFromLocalStorage(); // Vérification et met à jour le statut auth

  if (!authRequired) return next();

  if (authStore.isAuthenticated) {
    return next();
  }

  return next({ name: 'login', query: { redirectFrom: to.fullPath } });
});


export default router
