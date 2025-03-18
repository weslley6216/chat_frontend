<template>
  <div class="user-list-card">
    <h2>Connect with a user to start chatting!</h2>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.username }}
        <button class="add-conversation-btn" @click="startConversation(user.id)">+</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from '@/services/axios';

export default {
  data() {
    return {
      users: [],
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('/users');
        this.users = response.data;
        console.log('Users fetched successfully:', this.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async startConversation(userId) {
      try {
        const response = await axios.post('/conversations', { conversation: { user_id: userId } });
        console.log('Conversation started successfully:', response.data);
        this.$emit('conversation-started', response.data);
      } catch (error) {
        console.error('Error starting conversation:', error);
      }
    },
  },
};
</script>

<style scoped>
.user-list-card {
  width: 50%;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-list-card h2 {
  margin-bottom: 20px;
}

.user-list-card ul {
  list-style: none;
  padding: 0;
}

.user-list-card li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.user-list-card li:hover {
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
