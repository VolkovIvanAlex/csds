// user-actions.ts
import { atom } from 'jotai';
import { authStateAtom } from './atoms/authState';
import { api } from '@/utils/api';
import { User } from './atoms/user';

export const allUsersAtom = atom<User[]>([]);
export const usersLoadingAtom = atom<boolean>(false);
export const usersErrorAtom = atom<string | null>(null);

export const updateUserProfileAtom = atom(
  null,
  async (
    get,
    set,
    { userData, options }: { userData: Partial<User>; options?: { onSuccess?: (user: User) => void; onError?: (error: any) => void } }
  ) => {
    const authState = get(authStateAtom);
    if (!authState.isAuthenticated || !authState.user) {
      throw new Error('User must be authenticated to update profile');
    }

    set(authStateAtom, { ...authState, isLoading: true, error: null });

    try {
      const response = await api.put(`/users/${authState.user.id}`, userData);
      if (response.status === 200) {
        const updatedUser = response.data;
        set(authStateAtom, {
          ...authState,
          user: updatedUser,
          isLoading: false,
          error: null,
        });
        options?.onSuccess?.(updatedUser);
      } else {
        throw new Error('Failed to update user profile');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Error updating user profile';
      set(authStateAtom, { ...authState, isLoading: false, error: message });
      options?.onError?.(error);
    }
  }
);

export const fetchAllUsersAtom = atom(
  get => get(allUsersAtom),
  async (get, set) => {
    set(usersLoadingAtom, true);
    set(usersErrorAtom, null);
    try {
      const response = await api.get('/users');
      set(allUsersAtom, response.data);
      console.log('All users fetched:', response.data);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Error fetching users';
      set(usersErrorAtom, message);
      console.error('Error fetching users:', message);
    } finally {
      set(usersLoadingAtom, false);
    }
  }
);