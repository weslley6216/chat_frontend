<template>
  <div class="user-list-card">
    <h2>Connect with a user to start chatting!</h2>
    <div v-if="users?.length === 0">No new users to add at this time.</div>
    <ul v-else-if="users" class="user-list">
      <li v-for="user in users" :key="user.id">
        {{ user.username }}
        <button class="add-conversation-btn" @click="startConversation(user.id)">+</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { fetchUsers, startConversation } from '@/services/userService';

export default {
  data() {
    return {
      users: [],
    };
  },
  async created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        this.users = await fetchUsers();
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async startConversation(userId) {
      try {
        const response = await startConversation(userId);
        this.$emit('conversation-started', response);
      } catch (error) {
        console.error('Error starting conversation:', error);
      }
    },
  },
};
</script>

<style scoped>
.user-list-card {
  border-radius: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: auto;
  max-height: 95%;
  overflow-y: auto;
  padding: 20px;
  width: 50%;
}

.user-list-card h2 {
  margin-bottom: 20px;
}

.user-list {
  list-style: none;
  padding: 0;
}

.user-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.user-list li:hover {
  background: #f0f0f0;
}

.add-conversation-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
