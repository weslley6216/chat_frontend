import '@testing-library/jest-dom/vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import RegisterPage from '@/views/RegisterPage.vue';
import router from '@/router';
import Register from '@/components/Register.vue';

describe('RegisterPage', () => {
  beforeEach(() => {
    router.push = vi.fn();
    vi.clearAllMocks();
  });

  describe('when rendering correctly', () => {
    it('should render the Register component', () => {
      const wrapper = mount(RegisterPage, { global: { plugins: [router] } });
      expect(wrapper.findComponent(Register).exists()).toBe(true);
    });
  });

  describe('when registration is successful', () => {
    it('should call handleRegisterSuccess and redirect to /chat', async () => {
      const wrapper = mount(RegisterPage, { global: { plugins: [router] } });
      const registerComponent = wrapper.findComponent(Register);

      await registerComponent.vm.$emit('register-success');

      expect(router.push).toHaveBeenCalledWith('/chat');
    });
  });
});
