import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import UserList from '@/components/UserList.vue';
import { fetchUsers, startConversation } from '@/services/userService';

vi.mock('@/services/userService', () => ({
  fetchUsers: vi.fn(),
  startConversation: vi.fn(),
}));

describe('UserList.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component correctly', () => {
    const wrapper = mount(UserList);
    expect(wrapper.find('h2').text()).toBe('Connect with a user to start chatting!');
  });

  describe('when fetching users is successful', () => {
    it('displays the fetched users', async () => {
      fetchUsers.mockResolvedValue([{ id: 1, username: 'user1' }, { id: 2, username: 'user2' }]);
      const wrapper = mount(UserList);
      await flushPromises();

      expect(fetchUsers).toHaveBeenCalled();
      expect(wrapper.findAll('.user-list li').length).toBe(2);
      expect(wrapper.find('.user-list li:first-child').text()).toContain('user1');
    });

    it('displays a message when no users are available', async () => {
      fetchUsers.mockResolvedValue([]);
      const wrapper = mount(UserList);
      await flushPromises();

      expect(wrapper.find('.user-list-card div:last-child').text()).toBe('No new users to add at this time.');
    });
  });

  describe('when starting a conversation is successful', () => {
    it('emits the conversation-started event', async () => {
      fetchUsers.mockResolvedValue([{ id: 1, username: 'user1' }]);
      startConversation.mockResolvedValue({ id: 1, user_id: 1 });
      const wrapper = mount(UserList);
      await flushPromises();

      await wrapper.find('.add-conversation-btn').trigger('click');

      expect(startConversation).toHaveBeenCalledWith(1);
      expect(wrapper.emitted('conversation-started')).toBeTruthy();
      expect(wrapper.emitted('conversation-started')[0]).toEqual([{ id: 1, user_id: 1 }]);
    });
  });

  describe('when fetching users fails', () => {
    it('handles errors when fetching users', async () => {
      fetchUsers.mockRejectedValue(new Error('Network error'));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mount(UserList);
      await flushPromises();

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('when starting a conversation fails', () => {
    it('handles errors when starting a conversation', async () => {
      fetchUsers.mockResolvedValue([{ id: 1, username: 'user1' }]);
      startConversation.mockRejectedValue(new Error('Conversation error'));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const wrapper = mount(UserList);
      await flushPromises();

      await wrapper.find('.add-conversation-btn').trigger('click');

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
