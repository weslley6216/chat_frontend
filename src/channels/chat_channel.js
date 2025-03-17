import cable from './cable';

export default class ChatChannel {
  constructor(conversationId, onMessageReceived) {
    this.conversationId = conversationId;
    this.onMessageReceived = onMessageReceived;
    this.channel = null;
  }

  subscribe() {
    this.channel = cable.subscriptions.create(
      { channel: "ChatChannel", conversation_id: this.conversationId },
      {
        received: this.onMessageReceived,
      }
    );
  }

  unsubscribe() {
    if (this.channel) {
      this.channel.unsubscribe();
    }
  }

  sendMessage(message) {
    if (this.channel) {
      this.channel.send(message);
    }
  }
}
