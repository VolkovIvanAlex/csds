import { useAtom } from 'jotai';
import { loginAtom, registerAtom, logoutAtom, fetchUserAtom } from '@/lib/jotai/auth-actions';
import { updateUserProfileAtom } from '@/lib/jotai/user-actions';
import { authStateAtom } from '@/lib/jotai/atoms/authState';

export const useAuth = () => {
  const [authState] = useAtom(authStateAtom);
  const [, fetchAuthState] = useAtom(fetchUserAtom);
  const [, loginPrivy] = useAtom(loginAtom);
  const [, registerPrivy] = useAtom(registerAtom);
  const [, logout] = useAtom(logoutAtom);
  const [, updateUserProfile] = useAtom(updateUserProfileAtom);

  return {
    authState,
    fetchAuthState,
    updateUserProfile,
    loginPrivy,
    registerPrivy,
    logout,
  };
};