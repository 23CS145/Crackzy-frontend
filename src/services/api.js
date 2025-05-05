import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token if available
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

// Auth API
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);
export const getProfile = () => api.get('/auth/profile');

// Tests API
export const getTests = () => api.get('/tests');
export const getTestById = (id) => api.get(`/tests/${id}`);
export const createTest = (testData) => api.post('/tests', testData);
export const updateTest = (id, testData) => api.put(`/tests/${id}`, testData);
export const deleteTest = (id) => api.delete(`/tests/${id}`);

// Notes API
export const getNotes = () => api.get('/notes');
export const createNote = (noteData) => api.post('/notes', noteData);
export const deleteNote = (id) => api.delete(`/notes/${id}`);

// News API
export const getNews = () => api.get('/news');
export const createNews = (newsData) => api.post('/news', newsData);
export const deleteNews = (id) => api.delete(`/news/${id}`);

// Game API
export const getQuizQuestions = () => api.get('/game/quiz');
export const submitQuizAnswers = (answers) => api.post('/game/quiz', { answers });

export default api;