<template>
  <div class="chat-container">
    <div class="sidebar">
      <div class="sidebar-header">
        <button class="add-conversation-btn" @click="showUserList">New Chat</button>
        <h2>Conversations</h2>
      </div>
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
      <UserList v-if="showUserListFlag" @conversation-started="handleConversationStarted" />
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
      showUserListFlag: false,
    };
  },
  async created() {
    try {
      this.conversations = await fetchConversations();
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
      this.showUserListFlag = false;
    },
    handleConversationStarted(newConversation) {
      this.conversations.push(newConversation);
      this.selectedConversation = newConversation;
      this.showUserListFlag = false;
    },
    showUserList() {
      this.showUserListFlag = true;
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
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  flex-grow: 1;
  overflow-y: auto;
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

.add-conversation-btn {
  margin-top: 20px;
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
