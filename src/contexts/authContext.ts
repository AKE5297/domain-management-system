import { createContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
  user?: {
    id: string;
    username: string;
    email: string;
    password?: string; // 可选字段，用于本地存储密码
  };
  updateUser: (userData: { username?: string; password?: string; email?: string }) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  logout: () => {},
  user: {
    id: "1",
    username: "admin",
    email: "admin@example.com"
  },
  updateUser: (userData: { username?: string; password?: string; email?: string }) => {},
});