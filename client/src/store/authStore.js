import { create } from 'zustand';
import API from '../utils/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  loading: true,

  login: async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      set({ 
        user: data.user, 
        token: data.token, 
        isAuthenticated: true 
      });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ loading: false });
      return;
    }

    try {
      const { data } = await API.get('/auth/me');
      set({ 
        user: data.user, 
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error) {
      localStorage.removeItem('token');
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        loading: false 
      });
    }
  },
}));
