<template>
  <div class="register-card">
    <h2 class="register-title">Create Account</h2>
    <form @submit.prevent="handleRegister">
      <div class="input-group">
        <input v-model="username" type="text" placeholder="Username" class="input-field"
          :class="{ 'error-border': errorMessage }" required />
      </div>
      <div class="input-group">
        <input v-model="email" type="email" placeholder="Email" class="input-field"
          :class="{ 'error-border': errorMessage }" required />
      </div>
      <div class="input-group">
        <input v-model="password" type="password" placeholder="Password" class="input-field"
          :class="{ 'error-border': errorMessage }" required />
      </div>
      <div class="input-group">
        <input v-model="passwordConfirmation" type="password" placeholder="Confirm Password" class="input-field"
          :class="{ 'error-border': errorMessage }" required />
      </div>
      <div class="error-placeholder">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
      <div class="form-actions">
        <button type="submit" class="register-btn">Register</button>
      </div>
    </form>
    <div class="auth-footer">
      <p>
        Already have an account? <router-link to="/">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { registerUser, loginUser } from '@/services/auth';
import { useUserStore } from '@/stores/user';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      errorMessage: '',
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.passwordConfirmation) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }

      try {
        const response = await registerUser(
          this.username,
          this.email,
          this.password,
          this.passwordConfirmation
        );

        if (response.error) {
          this.errorMessage = Object.values(response.error).join(', ');
          return;
        }

        await this.performLogin(this.username, this.password);
      } catch (error) {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    },
    async performLogin(username, password) {
      try {
        const { token, user } = await loginUser(username, password);
        localStorage.setItem('authToken', token);
        useUserStore().setUser(user);
        this.$router.push('/chat');
      } catch (loginError) {
        this.errorMessage = 'Login failed after registration. Please try again.';
      }
    },
  },
};
</script>

<style scoped>
.register-card {
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

.register-title {
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

.register-btn {
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

.register-btn:hover {
  background-color: #24c968;
}

.register-btn:active {
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
