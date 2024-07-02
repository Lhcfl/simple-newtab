import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
// import Antd from 'ant-design-vue'
import { createVfm } from 'vue-final-modal';
import i18n from './i18n';
import I18NextVue from 'i18next-vue';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
// app.use(Antd)
app.use(router);
app.use(createVfm());
app.use(I18NextVue, { i18next: i18n.i18next });

app.mount('#app');

console.log('New Tab loaded!');
