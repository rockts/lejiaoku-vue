import { createApp } from 'vue';
import App from './app/App.vue';
import router from './app/app.router';
import store from './app/app.store';
import { titleMixin } from './app/app.mixin';
import moment from 'moment';
import 'jquery';
import 'popper.js';
import 'bootstrap';
import 'normalize.css/normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

moment.locale('zh-cn');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
createApp(App)
    .use(store)
    .use(router)
    .mixin(titleMixin)
    .mount('#app');
