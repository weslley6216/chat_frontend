import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './services/axios';
import { useUserStore } from './stores/user';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');

document.body.style.overflow = 'hidden';

const userStore = useUserStore();

if (localStorage.getItem('authToken') && localStorage.getItem('user')) {
  try {
    userStore.setUser(JSON.parse(localStorage.getItem('user')));
    if (userStore.user) {
      router.push('/chat');
    }
  } catch (error) {
    console.error('Error setting user from localStorage:', error);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/');
  }
}

const channel = new BroadcastChannel('auth');
channel.onmessage = (event) => {
  if (event.data === 'logout') {
    userStore.clearUser();
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/');
  }
};
