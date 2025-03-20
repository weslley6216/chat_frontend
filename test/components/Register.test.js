import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Register from '@/components/Register.vue';
import { registerUser, loginUser } from '@/services/auth';
import { useUserStore } from '@/stores/user';

vi.mock('@/services/auth');
vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn(),
}));

describe('Register.vue', () => {
  let router;
  let userStore;

  beforeEach(async () => {
    router = {
      push: vi.fn(),
      currentRoute: { value: { path: '/register' } },
    };

    userStore = {
      setUser: vi.fn(),
    };
    useUserStore.mockReturnValue(userStore);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when registration is successful', () => {
    it('should call handleRegister when the form is submitted', async () => {
      const wrapper = mount(Register, { global: { mocks: { $router: router } } });
      const handleRegisterSpy = vi.spyOn(wrapper.vm, 'handleRegister');

      await wrapper.find('form').trigger('submit.prevent');

      expect(handleRegisterSpy).toHaveBeenCalled();
    });

    it('should pass correct values to handleRegister', async () => {
      const wrapper = mount(Register, { global: { mocks: { $router: router } } });
      const usernameInput = wrapper.find('input[placeholder="Username"]');
      const emailInput = wrapper.find('input[placeholder="Email"]');
      const passwordInput = wrapper.find('input[placeholder="Password"]');
      const passwordConfirmationInput = wrapper.find('input[placeholder="Confirm Password"]');

      await usernameInput.setValue('testuser');
      await emailInput.setValue('test@example.com');
      await passwordInput.setValue('password123');
      await passwordConfirmationInput.setValue('password123');
      await wrapper.find('form').trigger('submit.prevent');

      expect(wrapper.vm.username).toBe('testuser');
      expect(wrapper.vm.email).toBe('test@example.com');
      expect(wrapper.vm.password).toBe('password123');
      expect(wrapper.vm.passwordConfirmation).toBe('password123');
    });

    it('should call registerUser and loginUser with correct values, set user, and redirect to /chat', async () => {
      registerUser.mockResolvedValue({ user: { id: 1, username: 'testuser' } });
      loginUser.mockResolvedValue({ token: 'mockToken', user: { id: 1, username: 'testuser' } });
      const wrapper = mount(Register, { global: { mocks: { $router: router } } });

      await wrapper.find('input[placeholder="Username"]').setValue('testuser');
      await wrapper.find('input[placeholder="Email"]').setValue('test@example.com');
      await wrapper.find('input[placeholder="Password"]').setValue('password123');
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('password123');
      await wrapper.find('form').trigger('submit.prevent');

      expect(registerUser).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123', 'password123');
      expect(loginUser).toHaveBeenCalledWith('testuser', 'password123');
      expect(userStore.setUser).toHaveBeenCalledWith({ id: 1, username: 'testuser' });
      expect(router.push).toHaveBeenCalledWith('/chat');
    });
  });

  describe('when registration fails', () => {
    it('should display error message for passwords do not match', async () => {
      const wrapper = mount(Register, { global: { mocks: { $router: router } } });

      await wrapper.find('input[placeholder="Password"]').setValue('password123');
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('password456');
      await wrapper.find('form').trigger('submit.prevent');
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.error-message').text()).toBe('Passwords do not match.');
      expect(router.push).not.toHaveBeenCalled();
    });

    it('should display error message for registration error', async () => {
      registerUser.mockRejectedValue(new Error('Registration failed'));
      const wrapper = mount(Register, { global: { mocks: { $router: router } } });

      await wrapper.find('input[placeholder="Username"]').setValue('testuser');
      await wrapper.find('input[placeholder="Email"]').setValue('test@example.com');
      await wrapper.find('input[placeholder="Password"]').setValue('password123');
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('password123');
      await wrapper.find('form').trigger('submit.prevent');

      expect(wrapper.find('.error-message').text()).toBe('Registration failed. Please try again.');
      expect(router.push).not.toHaveBeenCalled();
    });

    it('should display error message for error response from registerUser', async () => {
      registerUser.mockResolvedValue({ error: { email: 'Email already taken' } });
      const wrapper = mount(Register, { global: { mocks: { $router: router } } });

      await wrapper.find('input[placeholder="Username"]').setValue('testuser');
      await wrapper.find('input[placeholder="Email"]').setValue('test@example.com');
      await wrapper.find('input[placeholder="Password"]').setValue('password123');
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('password123');
      await wrapper.find('form').trigger('submit.prevent');

      expect(wrapper.find('.error-message').text()).toBe('Email already taken');
      expect(router.push).not.toHaveBeenCalled();
    });

    it('should display error message for login error after registration', async () => {
      registerUser.mockResolvedValue({ user: { id: 1, username: 'testuser' } });
      loginUser.mockRejectedValue(new Error('Login failed'));
      const wrapper = mount(Register, { global: { mocks: { $router: router } } });

      await wrapper.find('input[placeholder="Username"]').setValue('testuser');
      await wrapper.find('input[placeholder="Email"]').setValue('test@example.com');
      await wrapper.find('input[placeholder="Password"]').setValue('password123');
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('password123');
      await wrapper.find('form').trigger('submit.prevent');

      expect(wrapper.find('.error-message').text()).toBe('Login failed after registration. Please try again.');
      expect(router.push).not.toHaveBeenCalled();
    });
  });
});
