"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth.hooks";
import { useLogout } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { authState, fetchAuthState } = useAuth();
  const { logout: privyLogout } = useLogout();
  const router = useRouter();
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch auth state
  useEffect(() => {
    if (!hasFetched) {
      fetchAuthState({
        onSuccess: () => setHasFetched(true),
        onError: () => setHasFetched(true),
      });
    }
  }, [authState.isAuthenticated, authState.isLoading, fetchAuthState, hasFetched]);

  // Handle logout if fetchAuthState indicates invalid session
  useEffect(() => {
    if (hasFetched && !authState.isAuthenticated) {
      const performLogout = async () => {
        try {
          await privyLogout();
          router.push("/login"); // Redirect to login page
        } catch (error) {
          console.error("Privy logout failed:", error);
        }
      };
      performLogout();
    }
  }, [authState.isAuthenticated, hasFetched]);

  // Loading state
  if (authState.isLoading || !hasFetched) {
    return <div>Loading...</div>;
  }

  // Authenticated: render children
  return <>{children}</>;
}