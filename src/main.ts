import { createApp } from 'vue';
import axios from 'axios';
import App from '@/app/App.vue';
import router from '@/app/app-router';
import store from '@/app/app-store';

axios.get('http://localhost:3000').then((resp) => {
  console.log(resp.data);
});
createApp(App)
  .use(store)
  .use(router)
  .mount('#app');
