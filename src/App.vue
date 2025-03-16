<template>
  <div id="app">
    <header>
      <h1>Web Chat</h1>
    </header>

    <main>
      <p v-if="userStore.username" class="welcome-message">
        Welcome, {{ userStore.username }}!
        <button @click="logout">Logout</button>
      </p>
      <router-view />
    </main>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user';
import { logoutUser } from '@/services/auth';

export default {
  name: 'App',
  computed: {
    userStore() {
      const store = useUserStore();
      console.log('userStore:', store);
      return store;
    },
  },
  methods: {
    logout() {
      logoutUser();
      this.userStore.clearUser();
      this.$router.push('/');
    },
  },
  created() {
    this.userStore.loadUserFromStorage();
  },
};
</script>

<style>
#app {
  font-family: 'Arial', sans-serif;
  text-align: center;
}

header {
  background-color: #616774;
  color: white;
  padding: 10px;
  border-radius: 10px;
  margin: 20px;
  font-size: 25px;
}

footer {
  background-color: #282c34;
  color: white;
  padding: 10px;
  position: fixed;
  bottom: 0;
  width: 100%;
}

main {
  margin: 20px;
}

.welcome-message {
  text-align: right;
  margin-right: 20px;
}
</style>
