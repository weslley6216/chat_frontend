import axios from 'axios';

const token = localStorage.getItem('authToken');

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

axios.defaults.baseURL = 'http://localhost:3000';

export default axios;
