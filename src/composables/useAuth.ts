import { ref, computed } from 'vue';
import type { User } from '../types';
import { UserRepository } from '../db/repositories/userRepository';
import { AuditRepository } from '../db/repositories/auditRepository';
import { hashPassword, verifyPassword, generateToken, userSchema } from '../utils/auth';

export function useAuth() {
  const currentUser = ref<User | null>(null);
  const isAuthenticated = computed(() => !!currentUser.value);

  async function login(email: string, password: string) {
    const user = UserRepository.findByEmail(email);
    if (!user) throw new Error('User not found');

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) throw new Error('Invalid password');

    currentUser.value = user;
    const token = generateToken(user.id);
    
    AuditRepository.log(user.id, 'login');
    return token;
  }

  async function register(data: { email: string; password: string; name: string; phone?: string }) {
    const validated = userSchema.parse(data);
    const passwordHash = await hashPassword(validated.password);

    const user = UserRepository.create({
      ...validated,
      passwordHash,
    });

    AuditRepository.log(user.id, 'register');
    return login(validated.email, validated.password);
  }

  function logout() {
    if (currentUser.value) {
      AuditRepository.log(currentUser.value.id, 'logout');
    }
    currentUser.value = null;
  }

  return {
    currentUser,
    isAuthenticated,
    login,
    register,
    logout,
  };
}