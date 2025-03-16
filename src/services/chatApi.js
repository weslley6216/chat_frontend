import axios from './axios';

export const fetchConversations = async () => {
  try {
    const response = await axios.get('/conversations');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchMessages = async (conversationId) => {
  try {
    const response = await axios.get(`/conversations/${conversationId}/messages`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendMessage = async (conversationId, messageContent) => {
  try {
    const response = await axios.post(`/conversations/${conversationId}/messages`, {
      message: {
        content: messageContent
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


