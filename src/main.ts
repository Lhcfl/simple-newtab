import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
// import Antd from 'ant-design-vue'
import { createVfm } from 'vue-final-modal';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
// app.use(Antd)
app.use(router);
app.use(createVfm());

app.mount('#app');

console.log('New Tab loaded!');
