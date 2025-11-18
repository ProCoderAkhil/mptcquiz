import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { adminCredentials } from "@/config/admin";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = "mptcquiz-admin-auth";

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(stored === "true");
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const allowedEmail = adminCredentials.email.toLowerCase();
    const allowedPassword = adminCredentials.password;

    const success = normalizedEmail === allowedEmail && normalizedPassword === allowedPassword;
    if (success) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
      setIsAuthenticated(true);
    }
    return success;
  };

  const logout = () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      isLoading,
    }),
    [isAuthenticated, isLoading]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
};

export const getAdminCredentials = () => adminCredentials;

