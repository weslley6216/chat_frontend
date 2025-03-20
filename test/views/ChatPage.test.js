import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { vi } from 'vitest';
import ChatPage from '@/views/ChatPage.vue';
import { fetchMessages, fetchConversations } from '@/services/chatService';
import { fetchUsers } from '@/services/userService';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('@/services/chatService', () => ({
  fetchConversations: vi.fn(),
  fetchMessages: vi.fn(),
  sendMessageApi: vi.fn(),
  initializeChatSubscription: vi.fn(),
  sendMessageWebSocket: vi.fn(),
  unsubscribeChatChannel: vi.fn(),
}));

vi.mock('@/services/userService', () => ({
  fetchUsers: vi.fn(),
}));

const mockConversations = [
  { id: 1, name: 'Chat 1' },
  { id: 2, name: 'Chat 2' }
];

const mockMessages = [
  { id: 1, content: 'Olá!', conversation_id: 1 },
  { id: 2, content: 'Oi!', conversation_id: 1 }
];

const mockUsers = [
  { id: 1, name: 'User 1' },
  { id: 2, name: 'User 2' }
];

beforeEach(() => {
  setActivePinia(createPinia());
  fetchConversations.mockResolvedValue(mockConversations);
  fetchMessages.mockResolvedValue(mockMessages);
  fetchUsers.mockResolvedValue(mockUsers);
});

describe('ChatPage', () => {

  it('loads and displays conversations in the sidebar', async () => {
    render(ChatPage);

    const chatItems = await screen.findAllByText('Chat 1');

    expect(chatItems[0]).toBeInTheDocument();
    expect(await screen.findByText('Chat 2')).toBeInTheDocument();
  });

  it('selects a conversation and displays the chat', async () => {
    render(ChatPage);

    const chatItem = await screen.findAllByText('Chat 1');
    fireEvent.click(chatItem[0]);

    expect(await screen.findByText('Olá!')).toBeInTheDocument();
    expect(await screen.findByText('Oi!')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Chat 1' })).toBeInTheDocument();
  });

  it('opens the user list when clicking the "New Chat" button', async () => {
    render(ChatPage);

    const newChatButton = await screen.findByRole('button', { name: 'New Chat' });
    fireEvent.click(newChatButton);

    expect(await screen.findByText('Connect with a user to start chatting!')).toBeInTheDocument();
  });
});