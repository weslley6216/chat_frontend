import axios from './axios';

export async function fetchUsers() {
  try {
    const response = await axios.get('/users');
    return response.data;
  } catch (error) {
    console.error('userService: Error fetching users:', error);
    throw error;
  }
}

export async function startConversation(userId) {
  try {
    const response = await axios.post('/conversations', { conversation: { user_id: userId } });
    return response.data;
  } catch (error) {
    console.error('userService: Error starting conversation:', error);
    throw error;
  }
}
