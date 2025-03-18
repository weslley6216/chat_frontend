<template>
  <div class="login-card">
    <h2 class="login-title">Welcome Back!</h2>
    <form @submit.prevent="handleLogin">
      <div class="input-group">
        <input v-model="username" type="text" placeholder="Email or Username" class="input-field"
          :class="{ 'error-border': errorMessage }" required />
      </div>
      <div class="input-group">
        <input v-model="password" type="password" placeholder="Password" class="input-field"
          :class="{ 'error-border': errorMessage }" required />
      </div>
      <div class="error-placeholder">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
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
      errorMessage: '', // Adicionada variável de estado
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
        if (!error.response || error.response.status !== 401) {
          this.errorMessage = 'An error occurred. Please try again.';
          return;
        }

        this.errorMessage = 'Invalid email, username or password';
      }
    },
  },
};
</script>

<style scoped>
.login-card {
  align-items: center;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 40px;
  position: relative;
  width: 100%;
}

.login-title {
  color: #333;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.input-group {
  margin-bottom: 15px;
  width: 100%;
}

.input-field {
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  outline: none;
  padding: 12px;
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #2575fc;
}

.form-actions {
  display: flex;
  justify-content: center;
  width: 100%;
}

.login-btn {
  background-color: #2cc007;
  border-radius: 8px;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 12px 20px;
  transition: background-color 0.3s ease;
  width: 70%;
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

.error-placeholder {
  height: 25px;
}

.error-message {
  color: red;
  margin: 0;
  text-align: center;
}

.input-field.error-border {
  border-color: red;
}
</style>
