import axios from './axios';

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post('/login', { username, password });
    const { token, user } = response.data;

    if (!token || !user) {
      throw new Error('Invalid token or user');
    }

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return { token, user };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const logoutUser = () => {
  if (!localStorage.getItem('authToken')) return;

  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
};
