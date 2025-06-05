import { defineStore } from 'pinia';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    const now = Date.now() / 1000; // timestamp en secondes
    return decoded.exp < now;
  } catch (e) {
    return true; // Considérer invalide s'il ne peut pas être décodé
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: null as string | null,
    isAuthenticated: false,
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });

        if (response.data.token) {
          this.token = response.data.token;
          this.user = response.data.user;
          this.isAuthenticated = true;

          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));

          return true;
        }

        return false;
      } catch (error) {
        console.error('Login failed:', error);
        this.isAuthenticated = false;
        return false;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    loadUserFromLocalStorage() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user && !isTokenExpired(token)) {
        this.token = token;
        this.user = JSON.parse(user);
        this.isAuthenticated = true;
      } else {
        this.logout(); // Token expiré ou absent = forcer la déconnexion
      }
    },
  },
});
