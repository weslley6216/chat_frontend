import { sendMessage } from '@/services/chatApi';
import ChatChannel from '@/channels/chat_channel';

export default {
  chatChannel: null,

  setupChatChannel(conversationId, messageHandler) {
    if (this.chatChannel) return;

    this.chatChannel = new ChatChannel(conversationId, (data) => {
      const receivedMessage = data.message;
      messageHandler(receivedMessage);
    });

    this.chatChannel.subscribe();
  },

  async sendMessageApi(conversationId, messageContent) {
    await sendMessage(conversationId, messageContent);
  },

  sendMessageWebSocket(messageContent) {
    if (this.chatChannel) {
      this.chatChannel.sendMessage({
        content: messageContent,
      });
    }
  },

  unsubscribeChatChannel() {
    if (this.chatChannel) {
      this.chatChannel.unsubscribe();
      this.chatChannel = null;
    }
  },
};
