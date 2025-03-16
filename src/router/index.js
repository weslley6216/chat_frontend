import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/views/LoginPage.vue';
import ChatPage from '@/views/ChatPage.vue';

const routes = [
  { path: '/', name: 'Home', component: LoginPage },
  { path: '/chat', name: 'MockChat', component: ChatPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
