import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    username: '',
    email: '',
  }),
  actions: {
    setUser(user) {
      this.id = user.id;
      this.username = user.username;
      this.email = user.email;
    },
    clearUser() {
      this.id = null;
      this.username = '';
      this.email = '';
    },
    loadUserFromStorage() {
      const user = localStorage.getItem('user');
      if (user) {
        this.setUser(JSON.parse(user));
      }
    },
  },
  persist: true,
});
