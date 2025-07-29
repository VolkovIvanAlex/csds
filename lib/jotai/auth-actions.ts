import { ActionOptions } from "./action-options";
import { User } from "./atoms/user";
import { authStateAtom } from "./atoms/authState";
import { atom } from "jotai";
import { HttpStatusCode } from 'axios';
import { api } from "@/utils/api";

export enum UserRole {
  GovBody = "GovBody",
  DataProvider = "DataProvider",
  DataConsumer = "DataConsumer",
}

export const loginAtom = atom(
  null,
  async (get, set, { privyAccessToken , options }: { privyAccessToken: string; options?: ActionOptions }) => {
    set(authStateAtom, { ...get(authStateAtom), isLoading: true, error: null });

    try {
      const response = await api.post("/auth/login/privy", { privyAccessToken });

      if (response.status === 201) {
        const user = response.data;
        console.log(user);
        set(authStateAtom, { user, isAuthenticated: true, isLoading: false, error: null });
        console.log("Updated auth state:", get(authStateAtom));
        options?.onSuccess?.(user);
      } else {
        throw new Error("Login failed");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Login error";
      set(authStateAtom, { ...get(authStateAtom), isLoading: false, error: message });
      options?.onError?.(error);
    }
  }
);

export const registerAtom = atom(
  null,
  async (get, set, { privyAccessToken , name, jobTitle, role, options }: { privyAccessToken: string; name: string; jobTitle: string; role: UserRole; options?: ActionOptions }) => {
    set(authStateAtom, { ...get(authStateAtom), isLoading: true, error: null });

    try {
      const response = await api.post("/auth/register/privy", { 
        privyAccessToken,
        name,
        jobTitle, 
        role,
       });

      if (response.status === 201) {
        const user = response.data;
        console.log(user);
        set(authStateAtom, { user, isAuthenticated: true, isLoading: false, error: null });
        options?.onSuccess?.(user);
      } else {
        throw new Error("Register failed");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Login error";
      set(authStateAtom, { ...get(authStateAtom), isLoading: false, error: message });
      options?.onError?.(error);
    }
  }
);

export const logoutAtom = atom(
  null,
  async (
    get,
    set,
    options?: ActionOptions,
  ) => {
    set(authStateAtom, { ...get(authStateAtom), isLoading: true, error: null });

    try {
      const response = await api.post('auth/logout');
      console.log('logout response', response)
      if ([HttpStatusCode.Ok, HttpStatusCode.Created].includes(response.status)) {
        set(authStateAtom, { user: null, isAuthenticated: false, isLoading: false, error: null });
        options?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Logout error";
      options?.onError?.(error);
      set(authStateAtom, { ...get(authStateAtom), isLoading: false, error: message });
    }
  },
);

export const fetchUserAtom = atom(
  (get) => get(authStateAtom),
  async (get, set, options?: ActionOptions) => {
    const authState = get(authStateAtom);
    if (!authState.isAuthenticated) {
      set(logoutAtom, options);
      return;
    }

    set(authStateAtom, { ...authState, isLoading: true, error: null });

    try {
      console.log("before");
      const response = await api.get("/auth/user");
      console.log(response);
      if (response.status === 200) {
        const user = response.data;
        set(authStateAtom, { ...authState, user, isLoading: false, error: null });
        options?.onSuccess?.(user);
      } else if (response.status === 403) { //if server returns 403 - session is expired
        const user = response.data;
        set(authStateAtom, { user: null, isAuthenticated: false, isLoading: false, error: null });
        options?.onSuccess?.(user);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error: any) {
      console.log("error", error);
      const message = error?.response?.data?.message || "Error fetching user data";
      if (error.status === 403) {
        set(authStateAtom, { user: null, isAuthenticated: false, isLoading: false, error: null });
      } else {
        set(authStateAtom, { ...authState, isLoading: false, error: message });
      }
      options?.onError?.(error);
    }
  }
);