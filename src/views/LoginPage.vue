<template>
  <div class="login-page">
    <div class="login-container">
      <Login />
    </div>
  </div>
</template>

<script>
import Login from '@/components/Login.vue';

export default {
  components: {
    Login,
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75vh;
  background: linear-gradient(135deg, #cecbc5, #8a7778);
  border-radius: 10px;
}

.login-container {
  width: 100%;
  max-width: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
