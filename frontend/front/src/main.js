import { createApp } from 'vue'
import router from "./router/router.js"
import App from './app.vue';

createApp(App)
  .use(router)  
  .mount('#app'); 