import { createRouter, createWebHistory } from 'vue-router';
import login from '../views/login.vue'; // Assure-toi que le chemin est correct
import register from '../views/register.vue'; // Assure-toi que le chemin est correct
import dash from '../views/dash.vue'; // Assure-toi que le chemin est correct

const routes = [
  {
    path: '/login',
    name: 'login',
    component: login,
  },
  {
    path: '/register',
    name: 'register',
    component: register,
  },
  {
    path: '/dash',
    name: 'dash',
    component: dash,
    meta: { requiresAuth: true }, 
  },
  {
    path: '/',
    redirect: '/login', // Par défaut, redirige vers la page login
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Vérifie si le token est présent

  if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login'); // Rediriger vers la page de connexion si non connecté
  } else {
      next(); // Sinon, continuer la navigation
  }
});

export default router;
