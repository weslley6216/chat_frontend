import axios from './axios';
import ChatChannel from '@/channels/chat_channel';

let chatChannel = null;

export async function fetchConversations() {
  try {
    const response = await axios.get('/conversations');
    return response.data;
  } catch (error) {
    console.error('chatService: Error fetching conversations:', error);
    throw error;
  }
}

export async function fetchMessages(conversationId) {
  try {
    const response = await axios.get(`/conversations/${conversationId}/messages`);
    return response.data;
  } catch (error) {
    console.error('chatService: Error fetching messages:', error);
    throw error;
  }
}

export async function sendMessageApi(conversationId, messageContent) {
  try {
    const response = await axios.post(
      `/conversations/${conversationId}/messages`,
      { message: { content: messageContent } }
    );
    return response.data;
  } catch (error) {
    console.error('chatService: Error sending message:', error);
    throw error;
  }
}

export function initializeChatSubscription(conversationId, messageHandler) {
  if (chatChannel) return;
  chatChannel = new ChatChannel(
    conversationId,
    (data) => messageHandler(data.message)
  );
  chatChannel.subscribe();
}

export function sendMessageWebSocket(userId, messageId, conversationId) {
  chatChannel?.sendMessage({
    user_id: userId,
    message_id: messageId,
    conversation_id: conversationId,
  });
}

export function unsubscribeChatChannel() {
  chatChannel?.unsubscribe();
  chatChannel = null;
}
