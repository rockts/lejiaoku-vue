import { createApp } from 'vue';
import axios from 'axios';
import App from '@/app/App.vue';
import router from '@/app/app-router';
import store from '@/app/app-store';
import 'jquery';
import 'popper.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

axios.get('http://localhost:3000').then((resp) => {
  console.log(resp.data);
});
createApp(App)
  .use(store)
  .use(router)
  .mount('#app');
