<template>
  <div class="login-card">
    <h2 class="login-title">Welcome Back!</h2>
    <form @submit.prevent="handleLogin">
      <div class="input-group">
        <input
          v-model="username"
          type="text"
          placeholder="Email or Username"
          class="input-field"
          required
        />
      </div>
      <div class="input-group">
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="input-field"
          required
        />
      </div>
      <div class="form-actions">
        <button type="submit" class="login-btn">Login</button>
      </div>
    </form>
    <div class="auth-footer">
      <p>Don't have an account? <router-link to="/register">Sign Up</router-link></p>
    </div>
  </div>
</template>

<script>
import { loginUser } from '@/services/auth';
import { useUserStore } from '@/stores/user';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async handleLogin() {
      try {
        const { token, user } = await loginUser(this.username, this.password);
        localStorage.setItem('authToken', token);
        useUserStore().setUser(user);
        this.$router.push('/chat');
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
  },
};
</script>

<style scoped>
.login-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-title {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
}

.input-group {
  margin-bottom: 15px;
  width: 100%;
}

.input-field {
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #2575fc;
}

.form-actions {
  width: 100%;
  display: flex;
  justify-content: center;
}

.login-btn {
  background-color: #2cc007;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  width: 70%;
  transition: background-color 0.3s ease;
}

.login-btn:hover {
  background-color: #24c968;
}

.login-btn:active {
  background-color: #28b46d;
}

.auth-footer {
  margin-top: 15px;
  text-align: center;
}

.auth-footer a {
  color: #2575fc;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
