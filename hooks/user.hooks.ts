import { useAtom } from 'jotai';
import { fetchAllUsersAtom, updateUserProfileAtom } from '@/lib/jotai/user-actions';

export const useUser = () => {
  const [allUsers, fetchAllUsers] = useAtom(fetchAllUsersAtom);
  const [, updateUserProfile] = useAtom(updateUserProfileAtom);

  return {
    updateUserProfile,
    allUsers, 
    fetchAllUsers
  };
};