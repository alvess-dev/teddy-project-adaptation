import axios from 'axios';
import Cookies from 'js-cookie'; 

const http = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

http.interceptors.request.use(config => {
  const token = localStorage.getItem('token') || Cookies.get('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default http;


