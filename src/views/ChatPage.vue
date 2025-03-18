<template>
  <div class="chat-container">
    <div class="sidebar">
      <h2>Conversations</h2>
      <ul v-if="conversations.length > 0">
        <li
          v-for="conversation in conversations"
          :key="conversation.id"
          :class="{ active: conversation.id === selectedConversation?.id }"
          @click="selectConversation(conversation)"
        >
          {{ conversation.name }}
        </li>
      </ul>
    </div>

    <div class="chat-area">
      <UserList v-if="conversations.length === 0" @conversation-started="handleConversationStarted" />
      <chat v-else :selectedConversation="selectedConversation" />
    </div>
  </div>
</template>

<script>
import { fetchConversations } from '@/services/chatApi';
import Chat from '@/components/Chat.vue';
import UserList from '@/components/UserList.vue';

export default {
  components: {
    Chat,
    UserList,
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
      console.log('Conversations:', this.conversations); // Adicionado console.log
      if (this.conversations.length > 0) {
        this.selectedConversation = this.conversations[0];
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  },
  methods: {
    selectConversation(conversation) {
      this.selectedConversation = conversation;
    },
    handleConversationStarted(newConversation) {
      this.conversations.push(newConversation);
      this.selectedConversation = newConversation;
    },
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
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.sidebar li:hover,
.sidebar li.active {
  background: #ddd;
}

.chat-area {
  flex: 1;
  height: 90%;
}
</style>
