import axios from './axios';

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const loginUser = async (usernameOrEmail, password) => {
  try {
    const loginField = isValidEmail(usernameOrEmail) ? 'email' : 'username';
    const response = await axios.post('/login', {
      [loginField]: usernameOrEmail,
      password: password,
    });
    const { token, user } = response.data;

    if (!token || !user) {
      throw new Error('Invalid token or user');
    }

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return { token, user };
  } catch (error) {
    throw error;
  }
};

export const logoutUser = () => {
  if (!localStorage.getItem('authToken')) return;

  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];

  const channel = new BroadcastChannel('auth');
  channel.postMessage('logout');
  channel.close();
};

export async function registerUser(username, email, password, passwordConfirmation) {
  try {
    const response = await axios.post('/users', {
      user: {
        username,
        email,
        password,
        password_confirmation: passwordConfirmation,
      },
    });
    return { user: response.data };
  } catch (error) {
    if (error.response && error.response.status === 422) {
      return { error: error.response.data.errors };
    }
    throw error;
  }
}
