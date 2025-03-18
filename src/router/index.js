import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/views/LoginPage.vue';
import ChatPage from '@/views/ChatPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';

const routes = [
  { path: '/', name: 'Home', component: LoginPage },
  { path: '/chat', name: 'MockChat', component: ChatPage },
  { path: '/register', name: 'Register', component: RegisterPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
