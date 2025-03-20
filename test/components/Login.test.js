import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Login from '@/components/Login.vue';
import { loginUser } from '@/services/auth';
import { useUserStore } from '@/stores/user';
import router from '@/router';

vi.mock('@/services/auth');
vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn(),
}));

describe('Login.vue', () => {
  let userStore;

  beforeEach(async () => {
    router.push = vi.fn();

    userStore = {
      setUser: vi.fn(),
    };
    useUserStore.mockReturnValue(userStore);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when login is successful', () => {
    it('should call handleLogin when the form is submitted', async () => {
      const wrapper = mount(Login, { global: { plugins: [router] } });
      const handleLoginSpy = vi.spyOn(wrapper.vm, 'handleLogin');

      await wrapper.find('form').trigger('submit.prevent');

      expect(handleLoginSpy).toHaveBeenCalled();
    });

    it('should pass correct values to handleLogin', async () => {
      const wrapper = mount(Login, { global: { plugins: [router] } });
      const usernameInput = wrapper.find('input[type="text"]');
      const passwordInput = wrapper.find('input[type="password"]');

      await usernameInput.setValue('testuser');
      await passwordInput.setValue('password');
      await wrapper.find('form').trigger('submit.prevent');

      expect(wrapper.vm.username).toBe('testuser');
      expect(wrapper.vm.password).toBe('password');
    });

    it('should call loginUser with correct values, set user, and redirect to /chat', async () => {
      loginUser.mockResolvedValue({ token: 'mockToken', user: { id: 1, username: 'testuser' } });
      const wrapper = mount(Login, { global: { plugins: [router] } });

      await wrapper.find('input[type="text"]').setValue('testuser');
      await wrapper.find('input[type="password"]').setValue('password');
      await wrapper.find('form').trigger('submit.prevent');
      await wrapper.vm.$nextTick();

      expect(loginUser).toHaveBeenCalledWith('testuser', 'password');
      expect(userStore.setUser).toHaveBeenCalledWith({ id: 1, username: 'testuser' });
      expect(router.push).toHaveBeenCalledWith('/chat');
    });
  });

  describe('when login fails', () => {
    it('should display error message for invalid login', async () => {
      const error = new Error('Invalid credentials');
      error.response = { status: 401 };
      loginUser.mockRejectedValue(error);
      const wrapper = mount(Login, { global: { plugins: [router] } });

      await wrapper.find('input[type="text"]').setValue('testuser');
      await wrapper.find('input[type="password"]').setValue('wrongpassword');
      await wrapper.find('form').trigger('submit.prevent');
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.error-message').text()).toBe('Invalid email, username or password');
      expect(router.push).not.toHaveBeenCalled();
    });

    it('should display generic error message for other errors', async () => {
      loginUser.mockRejectedValue(new Error('Network error'));
      const wrapper = mount(Login, { global: { plugins: [router] } });

      await wrapper.find('input[type="text"]').setValue('testuser');
      await wrapper.find('input[type="password"]').setValue('wrongpassword');
      await wrapper.find('form').trigger('submit.prevent');
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.error-message').text()).toBe('An error occurred. Please try again.');
      expect(router.push).not.toHaveBeenCalled();
    });
  });
});
