import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '../types';
import { useAuth } from '../composables/useAuth';

export const useAuthStore = defineStore('auth', () => {
  const { login, register, logout } = useAuth();
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout
  };
});