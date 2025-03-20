import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/vue';
import Login from '@/components/Login.vue';
import LoginPage from '@/views/LoginPage.vue';
import router from '@/router';
import { vi } from 'vitest';

vi.mock('@/services/auth', () => ({
  loginUser: vi.fn(),
}));

vi.mock('@/services/chatService', () => ({
  fetchMessages: vi.fn(),
  initializeChatSubscription: vi.fn(),
  sendMessageApi: vi.fn(),
  sendMessageWebSocket: vi.fn(),
  unsubscribeChatChannel: vi.fn(),
}));

describe('LoginPage', () => {
  it('should render the "Sign Up" link', () => {
    render(Login, { global: { plugins: [router] } });
    const signUpLink = screen.getByRole('link', { name: /Sign Up/i });

    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', '/register');
  });

  it('should find the input tags', () => {
    render(LoginPage, { global: { plugins: [router] } });
    const inputElements = screen.getAllByRole('textbox');
    expect(inputElements.length).toBe(2);
  });

  it('should find the form tag', () => {
    render(LoginPage, { global: { plugins: [router] } });
    const formElement = screen.getByRole('form');
    expect(formElement.tagName).toBe('FORM');
  });

  it('should render the login form', () => {
    render(LoginPage, { global: { plugins: [router] } });
    expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
  });

  it('should find the h2 tag with text "Welcome Back!"', () => {
    render(LoginPage, { global: { plugins: [router] } });
    expect(screen.getByRole('heading', { name: /Welcome Back!/i })).toBeInTheDocument();
  });
});
