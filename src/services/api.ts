import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const API_URL = 'https://v3.eglisedessaules.ch';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const authStore = useAuthStore();
      const router = useRouter();
      
      // Clear authentication state
      authStore.logout();
      
      // Redirect to login page if not already there
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

export interface ApiEvent {
  id: number;
  create_spy: string;
  update_spy: string;
  date_heure: string;
  titre: string;
  description: string | null;
  lieu: string | null;
}

function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const eventApi = {
  async getEventsBetweenDates(startDate: Date, endDate?: Date, limit?: number): Promise<ApiEvent[]> {
    try {
      const params = new URLSearchParams();
      params.append('start_date', formatDateForApi(startDate));
      
      if (endDate) {
        params.append('end_date', formatDateForApi(endDate));
      }
      
      if (limit) {
        params.append('limit', limit.toString());
      }
      
      const response = await api.get<ApiEvent[]>(`/evenements/between-dates?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async getEvent(id: number): Promise<ApiEvent> {
    const response = await api.get<ApiEvent>(`/evenements/${id}`);
    return response.data;
  },

  async createEvent(event: Partial<ApiEvent>): Promise<ApiEvent> {
    const response = await api.post<ApiEvent>('/evenements', event);
    return response.data;
  },

  async updateEvent(id: number, event: Partial<ApiEvent>): Promise<ApiEvent> {
    const response = await api.put<ApiEvent>(`/evenements/${id}`, event);
    return response.data;
  },

  async deleteEvent(id: number): Promise<void> {
    await api.delete(`/evenements/${id}`);
  }
};

export default api;