<template>
  <div class="chat-container">
    <div class="sidebar">
      <h2>Conversations</h2>
      <ul>
        <li v-for="conversation in conversations" :key="conversation.id"
          :class="{ active: conversation.id === selectedConversation.id }" @click="selectConversation(conversation)">
          {{ conversation.name }}
        </li>
      </ul>
    </div>

    <chat :selectedConversation="selectedConversation" />
  </div>
</template>

<script>
import { fetchConversations } from '@/services/chatApi';
import Chat from '@/components/Chat.vue';

export default {
  components: {
    Chat
  },
  data() {
    return {
      conversations: [],
      selectedConversation: null,
    };
  },
  async created() {
    try {
      this.conversations = await fetchConversations();
      if (this.conversations.length > 0) {
        this.selectedConversation = this.conversations[0];
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  },
  methods: {
    selectConversation(conversation) {
      this.selectedConversation = conversation;
    }
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 80vh;
}

.sidebar {
  width: 20%;
  height: 90%;
  background: #f4f4f4;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
}

.sidebar li:hover,
.sidebar li.active {
  background: #ddd;
}
</style>
