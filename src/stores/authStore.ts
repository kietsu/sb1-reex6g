import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import type { LoginCredentials, LoginResponse, UserData } from '../types/auth';
import api from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const userData = ref<UserData | null>(null);

  if (token.value) {
    try {
      const decoded = jwtDecode(token.value);
      userData.value = (decoded as any).data;
      // Set the token in the API configuration
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    } catch (error) {
      token.value = null;
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  }

  const isAuthenticated = computed(() => !!token.value);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post<LoginResponse>(
        'https://v3.eglisedessaules.ch/login',
        credentials
      );

      if (response.data.status === 'success') {
        token.value = response.data.token;
        localStorage.setItem('token', response.data.token);
        
        const decoded = jwtDecode(response.data.token);
        userData.value = (decoded as any).data;
        
        // Configure axios defaults for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    token.value = null;
    userData.value = null;
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  return {
    token,
    userData,
    isAuthenticated,
    login,
    logout
  };
});