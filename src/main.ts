import { createApp } from 'vue';
import App from './app/App.vue';
import router from './app/app.router';
import store from './app/app.store';
import 'jquery';
import 'popper.js';
import 'bootstrap';
import 'normalize.css/normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

createApp(App)
  .use(store)
  .use(router)
  .mount('#app');
