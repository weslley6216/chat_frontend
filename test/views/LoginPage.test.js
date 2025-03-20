import '@testing-library/jest-dom/vitest';
import { mount } from '@vue/test-utils';
import LoginPage from '@/views/LoginPage.vue';
import Login from '@/components/Login.vue';
import router from '@/router';

describe('LoginPage', () => {
  it('should render the Login component', () => {
    const wrapper = mount(LoginPage, { global: { plugins: [router] } });
    expect(wrapper.findComponent(Login).exists()).toBe(true);
  });

  it('should render the "Sign Up" link', () => {
    const wrapper = mount(LoginPage, { global: { plugins: [router] } });
    const signUpLink = wrapper.find('a[href="/register"]');
    expect(signUpLink.exists()).toBe(true);
    expect(signUpLink.text()).toBe('Sign Up');
  });

  it('should render the heading "Welcome Back!"', () => {
    const wrapper = mount(LoginPage, { global: { plugins: [router] } });
    const loginComponent = wrapper.findComponent(Login);
    expect(loginComponent.find('h2').text()).toBe('Welcome Back!');
  });
});
