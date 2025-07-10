import { createApp, type Plugin } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import BootstrapVueNext from 'bootstrap-vue-next';
import VueApexCharts from 'vue3-apexcharts';
import VueTheMask from 'vue-the-mask';

import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

import moment from 'moment';
window.moment = moment;

import 'simplebar';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import 'admin-resources/jquery.vectormap/jquery-jvectormap-1.2.2.css';
import 'daterangepicker/daterangepicker.css';
import 'vue-multiselect/dist/vue-multiselect.css';
import 'jquery-toast-plugin/dist/jquery.toast.min.css';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import 'jstree/dist/themes/default/style.min.css';
import 'vue3-form-wizard/dist/style.css';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css';
import 'bootstrap-timepicker/css/bootstrap-timepicker.min.css';
import 'flatpickr/dist/flatpickr.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@/assets/scss/app-saas.scss';
import '@/assets/scss/icons.scss';
import 'vue-multiselect/dist/vue-multiselect.min.css'
import PrimeVue from 'primevue/config';
import { useAuthStore } from '@/stores/auth'; // 👈 IMPORT du store

const app = createApp(App);

const pinia = createPinia();
app.use(pinia); // 👈 Installer Pinia

// 🔥 Charger l'utilisateur depuis localStorage dès le démarrage
const authStore = useAuthStore(pinia);
authStore.loadUserFromLocalStorage(); // 👈 C'EST CETTE LIGNE QUI MANQUAIT

app.use(router);
app.use(BootstrapVueNext);
app.use(VueApexCharts);

app.use(PrimeVue);

const MetaPlug: Plugin = {
  install: (app: any, options: any) => {
    const useMeta = (item: { [key: string]: any }) => {
      console.info(item);
    };
    app.mixin({
      methods: {
        useMeta(item: { [key: string]: any }) {
          document.head.querySelector("title")!.innerHTML =
            "FrogBox";
        },
      },
    });
  },
};
app.use(MetaPlug);

app.mount('#app');
