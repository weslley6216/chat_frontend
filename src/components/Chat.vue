<template>
  <div class="chat-window">
    <div class="chat-header" v-if="selectedConversation">
      <h2>{{ selectedConversation.name }}</h2>
    </div>

    <div class="chat-messages">
      <div v-for="(message, index) in formattedMessages" :key="index"
        :class="['message', message.isCurrentUser ? 'sent' : 'received']">
        <span class="message-text">{{ message.content }}</span>
      </div>
    </div>

    <div class="input-area">
      <input v-model="newMessage" placeholder="Type a message..." @keyup.enter="sendMessage" />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import { fetchMessages, sendMessage } from '@/services/chatApi';
import { useUserStore } from '@/stores/user';

export default {
  props: {
    selectedConversation: Object,
  },
  data() {
    return {
      messages: [],
      newMessage: "",
    };
  },
  computed: {
    currentUser() {
      return useUserStore().username;
    },
    formattedMessages() {
      return this.messages.map(message => ({
        ...message,
        isCurrentUser: message.sender === this.currentUser,
      }));
    }
  },
  watch: {
    selectedConversation: "loadMessages"
  },
  created() {
    this.loadMessages();
  },
  methods: {
    async loadMessages() {
      if (!this.selectedConversation) return;
      try {
        this.messages = await fetchMessages(this.selectedConversation.id);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    },
    async sendMessage() {
      if (!this.newMessage.trim()) return;

      try {
        await sendMessage(this.selectedConversation.id, this.newMessage);
        this.messages.push({
          sender: this.currentUser,
          content: this.newMessage,
        });
        this.newMessage = "";
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
  },
};
</script>

<style scoped>
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 90%;
}

.chat-header {
  padding: 5px;
  background: #f4f4f4;
  color: black;
  text-align: center;
  font-size: 1rem;
  border-radius: 10px;
  margin-left: 10px;
}

.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.message {
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  margin: 5px 5px;
}

.sent {
  background: #dcf8c6;
  align-self: flex-end;
}

.received {
  background: #e5e5e5;
  align-self: flex-start;
}

.input-area {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  background: #fff;
  border-top: 1px solid #ccc;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: left;
}

button {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;
}
</style>
