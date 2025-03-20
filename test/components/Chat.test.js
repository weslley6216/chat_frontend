import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Chat from '@/components/Chat.vue';
import {
  fetchMessages,
  initializeChatSubscription,
  sendMessageApi,
  sendMessageWebSocket,
  unsubscribeChatChannel,
} from '@/services/chatService';
import { useUserStore } from '@/stores/user';

vi.mock('@/services/chatService', () => ({
  fetchMessages: vi.fn(),
  initializeChatSubscription: vi.fn(),
  sendMessageApi: vi.fn(),
  sendMessageWebSocket: vi.fn(),
  unsubscribeChatChannel: vi.fn(),
}));

vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn(),
}));

describe('Chat.vue', () => {
  let userStore;
  let selectedConversation;

  beforeEach(() => {
    userStore = {
      username: 'testuser',
      id: 1,
    };
    useUserStore.mockReturnValue(userStore);

    selectedConversation = {
      id: 1,
      name: 'Test Conversation',
    };

    fetchMessages.mockResolvedValue([]);
    initializeChatSubscription.mockImplementation(() => { });
    unsubscribeChatChannel.mockImplementation(() => { });
    sendMessageApi.mockResolvedValue({ id: 1, content: 'Test message', sender: 'testuser' });
    sendMessageWebSocket.mockImplementation(() => { });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the chat header with the conversation name', () => {
    const wrapper = mount(Chat, {
      props: { selectedConversation },
    });

    expect(wrapper.find('.chat-header h2').text()).toBe('Test Conversation');
  });

  it('fetches and displays messages on mount', async () => {
    fetchMessages.mockResolvedValue([{ id: 1, content: 'Hello', sender: 'otheruser' }]);

    const wrapper = mount(Chat, {
      props: { selectedConversation },
    });

    await flushPromises();

    expect(fetchMessages).toHaveBeenCalledWith(1);
    expect(wrapper.find('.message-text').text()).toBe('Hello');
  });

  it('displays sent messages correctly', async () => {
    fetchMessages.mockResolvedValue([{ id: 1, content: 'Hello', sender: 'testuser' }]);

    const wrapper = mount(Chat, {
      props: { selectedConversation },
    });

    await flushPromises();

    expect(wrapper.find('.message.sent').exists()).toBe(true);
  });

  it('displays received messages correctly', async () => {
    fetchMessages.mockResolvedValue([{ id: 1, content: 'Hello', sender: 'otheruser' }]);

    const wrapper = mount(Chat, {
      props: { selectedConversation },
    });

    await flushPromises();

    expect(wrapper.find('.message.received').exists()).toBe(true);
  });

  it('sends a message when the send button is clicked', async () => {
    const wrapper = mount(Chat, {
      props: { selectedConversation },
    });

    await wrapper.find('input').setValue('Test message');
    await wrapper.find('button').trigger('click');

    expect(sendMessageApi).toHaveBeenCalledWith(1, 'Test message');
    expect(sendMessageWebSocket).toHaveBeenCalled();
    expect(wrapper.find('input').element.value).toBe('');
  });

  it('sends a message when enter key is pressed', async () => {
    const wrapper = mount(Chat, {
      props: { selectedConversation },
    });

    await wrapper.find('input').setValue('Test message');
    await wrapper.find('input').trigger('keyup.enter');

    expect(sendMessageApi).toHaveBeenCalledWith(1, 'Test message');
    expect(sendMessageWebSocket).toHaveBeenCalled();
    expect(wrapper.find('input').element.value).toBe('');
  });

  it('sets up and unsubscribes from the chat channel', async () => {
    const wrapper = mount(Chat, {
      props: { selectedConversation },
    });

    await flushPromises();

    expect(initializeChatSubscription).toHaveBeenCalled();

    wrapper.unmount();

    expect(unsubscribeChatChannel).toHaveBeenCalledTimes(2);
  });

  it('adds received messages from websocket', async () => {
    const wrapper = mount(Chat, {
      props: { selectedConversation },
    });

    await flushPromises();

    const callback = initializeChatSubscription.mock.calls[0][1];
    callback({ sender: 'otheruser', content: 'New message' });

    await flushPromises();

    expect(wrapper.findAll('.message-text').map(el => el.text())).toContain('New message');
  });
});
