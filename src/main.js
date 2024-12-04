import { createApp } from 'vue';
import App from './App.vue';
import Ongs from './components/Ongs.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: Ongs },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');
