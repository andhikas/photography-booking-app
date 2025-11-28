import type { User } from '~/types';

export const useAuth = () => {
  const user = useState<User | null>('user', () => null);

  const fetchUser = async () => {
    try {
      const data = await $fetch<User>('/api/auth/session');
      user.value = data;
    } catch (error) {
      user.value = null;
    }
  };

  const login = async (email, password) => {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    await fetchUser();
    return response;
  };

  const register = async (name, email, password, role) => {
    return await $fetch('/api/auth/register', {
      method: 'POST',
      body: { name, email, password, role },
    });
  };

  const logout = async () => {
    await $fetch('/api/auth/logout', {
      method: 'POST',
    });
    user.value = null;
  };

  return {
    user,
    fetchUser,
    login,
    register,
    logout,
  };
};
