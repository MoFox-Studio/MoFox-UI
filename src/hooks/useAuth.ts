import { useState, useEffect } from "react";

interface User {
  username: string;
  displayName: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });

  // 检查本地存储中的登录状态
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const savedAuth = localStorage.getItem("mofox_auth");
        if (savedAuth) {
          const authData = JSON.parse(savedAuth);
          if (authData.isAuthenticated && authData.user) {
            setAuthState({
              isAuthenticated: true,
              user: authData.user,
              isLoading: false
            });
            return;
          }
        }
      } catch (error) {
        console.error("Failed to parse auth data:", error);
      }
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false
      });
    };

    checkAuthStatus();
  }, []);

  const login = (credentials: { username: string; password: string; rememberMe: boolean }) => {
    // 模拟用户数据
    const user: User = {
      username: credentials.username,
      displayName: credentials.username === "admin" ? "系统管理员" : credentials.username,
      role: "admin"
    };

    const authData = {
      isAuthenticated: true,
      user,
      timestamp: Date.now()
    };

    // 如果选择记住登录状态，保存到localStorage
    if (credentials.rememberMe) {
      localStorage.setItem("mofox_auth", JSON.stringify(authData));
    }

    setAuthState({
      isAuthenticated: true,
      user,
      isLoading: false
    });
  };

  const logout = () => {
    localStorage.removeItem("mofox_auth");
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
  };

  return {
    ...authState,
    login,
    logout
  };
}