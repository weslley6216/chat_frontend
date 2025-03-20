import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loginUser } from '@/services/auth';
import axios from '@/services/axios';

vi.mock('@/services/axios');

describe('loginUser', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the login is successful', () => {
    it('should store the token and user in localStorage', async () => {
      const mockResponse = {
        data: {
          token: 'mockToken',
          user: { id: 1, username: 'testuser' },
        },
      };
      axios.post.mockResolvedValue(mockResponse);

      const result = await loginUser('testuser', 'password');

      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem('authToken')).toBe('mockToken');
      expect(localStorage.getItem('user')).toBe(JSON.stringify({ id: 1, username: 'testuser' }));
      expect(axios.defaults.headers.common['Authorization']).toBe(`Bearer mockToken`);
    });
  });

  describe('when the login fails', () => {
    it('should throw an error', async () => {
      axios.post.mockRejectedValue(new Error('Login failed'));

      await expect(loginUser('testuser', 'password')).rejects.toThrow('Login failed');
    });
  });
});
