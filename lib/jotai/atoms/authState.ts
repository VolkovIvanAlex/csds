// atoms/authState.ts
import { atom } from "jotai";
import { User } from "./user";
import { atomWithStorage } from "jotai/utils";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const authStateAtom = atomWithStorage<AuthState>('cybershield_auth', {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
});