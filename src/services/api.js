import axios from 'axios';

// Updated to use environment variable for API URL
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://crackzy-backend.onrender.com/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);
export const getProfile = () => api.get('/auth/profile');

// Test endpoints
export const getTests = () => api.get('/tests');
export const getTestById = (id) => api.get(`/tests/${id}`);
export const createTest = (testData) => api.post('/tests', testData);
export const updateTest = (id, testData) => api.put(`/tests/${id}`, testData);
export const deleteTest = (id) => api.delete(`/tests/${id}`);

// Note endpoints
export const getNotes = () => api.get('/notes');
export const getNoteById = (id) => api.get(`/notes/${id}`);
export const createNote = (noteData) => api.post('/notes', noteData);
export const updateNote = (id, noteData) => api.put(`/notes/${id}`, noteData);
export const deleteNote = (id) => api.delete(`/notes/${id}`);

// News endpoints
export const getNews = () => api.get('/news');
export const getNewsById = (id) => api.get(`/news/${id}`);
export const createNews = (newsData) => api.post('/news', newsData);
export const updateNews = (id, newsData) => api.put(`/news/${id}`, newsData);
export const deleteNews = (id) => api.delete(`/news/${id}`);

// Game endpoints (updated from quiz to games)
export const getGames = () => api.get('/games');
export const getGameById = (id) => api.get(`/games/${id}`);
export const submitGameResults = (results) => api.post('/games/results', results);
export const getGameResults = () => api.get('/games/results');

// User endpoints
export const getUsers = () => api.get('/users');
export const createUser = (userData) => api.post('/users', userData);
export const promoteUser = (id) => api.put(`/users/${id}/promote`);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export default api;