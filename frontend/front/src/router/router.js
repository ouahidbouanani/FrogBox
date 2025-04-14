import { createRouter, createWebHistory } from 'vue-router'
import login from '../views/login.vue'
import register from '../views/register.vue'
import dash from '../views/dash.vue'
import pdfmerge from '../views/pdf-merge.vue'
import pdfsplit from '../views/pdf-split.vue'
import Profile from '../views/Profile.vue'
import formdatachip from '@/views/form-data-chip.vue'
import smart from '@/views/smart.vue'
import datachip from '@/views/data-chip.vue'
import pdfimage from '@/views/pdf-image.vue'
import pdfword from '@/views/pdf-word.vue'
import pdfexcel from '@/views/pdf-excel.vue'
import formdatawafer from '@/views/form-data-wafer.vue'
import datawafer from '@/views/data-wafer.vue'
import organizepdf from '@/views/organize-pdf.vue'
import pdftoppt from '@/views/pdftoppt.vue'
import ajoutnumero from '@/views/ajout-numero.vue'
import rotationpdf from '@/views/rotation_pdf.vue'
import DebutEtching from '@/views/from-semi/DebutEtching.vue'
import DeclarationWafer from '@/views/from-semi/DeclarationWafer.vue'
import FinImpression from '@/views/from-semi/FinImpression.vue'
import PriseCotes from '@/views/from-semi/PriseCotes.vue'
import DebutTomo from '@/views/from-semi/DebutTomo.vue'
import FinTomo from '@/views/from-semi/FinTomo.vue'
const routes = [
  {
    path: '/login',
    name: 'login',
    component: login,
  },
  {
    path: '/DebutEtching',
    name: 'DebutEtching',
    component: DebutEtching,
  },
  {
    path: '/DeclarationWafer',
    name: 'DeclarationWafer',
    component: DeclarationWafer,
  },
  {
    path: '/PriseCotes',
    name: 'PriseCotes',
    component: PriseCotes, 
  },
  {
    path: '/DebutTomo',
    name: 'DebutTomo',
    component: DebutTomo, 
  },
  {
    path: '/FinTomo',
    name: 'FinTomo',
    component: FinTomo, 
  },
  {
    path: '/FinImpression',
    name: 'FinImpression',
    component: FinImpression, 
  },

  {
    path: '/register',
    name: 'register',
    component: register,
  },
  {
    path: '/pdf-merge',
    name: 'pdfmerge',
    component: pdfmerge,
  },
  {
    path: '/pdf-split',
    name: 'pdfsplit',
    component: pdfsplit,
  },
  {
    path: '/smart',
    name: 'smart',
    component: smart,
  },
  {
    path: '/form-data-chip',
    name: 'form-data-chip',
    component: formdatachip,
  },
  {
    path: '/data-chip',
    name: 'data-chip',
    component: datachip,
  },
  {
    path: '/pdf-image',
    name: 'pdf-image',
    component: pdfimage,
  },
  {
    path: '/pdf-word',
    name: 'pdf-word',
    component: pdfword,
  },
  {
    path: '/pdf-excel',
    name: 'pdf-excel',
    component: pdfexcel,
  },
  {
    path: '/organize-pdf',
    name: 'organize-pdf',
    component: organizepdf,
  },
  {
    path: '/pdftoppt',
    name: 'pdftoppt',
    component: pdftoppt,
  },
  {
    path: '/rotation-pdf',
    name: 'rotation-pdf',
    component: rotationpdf,
  },
  {
    path: '/ajout-numero',
    name: 'ajout-numero',
    component: ajoutnumero,
  },
  {
    path: '/form-data-wafer',
    name: 'form-data-wafer',
    component: formdatawafer,
  },
  {
    path: '/data-wafer',
    name: 'data-wafer',
    component: datawafer,
  },
 
  {
    path: '/dash',
    name: 'dash',
    component: dash,
    meta: { requiresAuth: true }, 
  },
  {
    path: '/',
    redirect: '/login', // Par défaut
  },
  { path: '/profile', component: Profile }
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
