import { sendMessage } from './chatApi';
import ChatChannel from '@/channels/chat_channel';

export default {
  chatChannel: null,

  setupChatChannel(conversationId, messageHandler) {
    if (this.chatChannel) return;
    this.chatChannel = new ChatChannel(
      conversationId,
      (data) => messageHandler(data.message)
    );
    this.chatChannel.subscribe();
  },

  async sendMessageApi(conversationId, messageContent) {
    try {
      const message = await sendMessage(
        conversationId,
        messageContent
      );
      if (!message || !message.id) {
        console.error('chatService: Error - Invalid API response:', message);
        throw new Error('Invalid API response');
      }
      return message;
    } catch (error) {
      console.error('chatService: Error sending message to API:', error);
      throw error;
    }
  },

  sendMessageWebSocket(userId, messageId, conversationId) {
    this.chatChannel?.sendMessage({
      user_id: userId,
      message_id: messageId,
      conversation_id: conversationId,
    });
  },

  unsubscribeChatChannel() {
    this.chatChannel?.unsubscribe();
    this.chatChannel = null;
  },
};
