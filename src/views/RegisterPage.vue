<template>
  <div class="register-page">
    <div class="register-container">
      <Register @register-success="handleRegisterSuccess" />
    </div>
  </div>
</template>

<script>
import Register from '@/components/Register.vue';
import { useRouter } from 'vue-router';

export default {
  components: {
    Register,
  },
  setup() {
    const router = useRouter();

    const handleRegisterSuccess = () => {
      router.push('/chat');
    };

    return {
      handleRegisterSuccess,
    };
  },
};
</script>

<style scoped>
.register-page {
  align-items: center;
  background: linear-gradient(135deg, #cecbc5, #8a7778);
  border-radius: 10px;
  display: flex;
  height: 75vh;
  justify-content: center;
}

.register-container {
  align-items: center;
  display: flex;
  justify-content: center;
  max-width: 450px;
  width: 100%;
}
</style>