<template>
    <div>
      <button @click="logout">Logout</button>
    </div>
  </template>
  
  <script>
  import { useUserStore } from '@/stores/user';
  
  export default {
    methods: {
      logout() {
        const userStore = useUserStore();
        userStore.clearUser();
  
        localStorage.removeItem('authToken');
  
        this.$router.push('/login');
      },
    },
  };
  </script>
  