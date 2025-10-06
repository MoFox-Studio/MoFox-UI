import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

interface AuthContextType extends AuthState {
    login: (credentials: { username: string; password: string; rememberMe: boolean }) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
        isLoading: true
    });

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

    const value = {
        ...authState,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}