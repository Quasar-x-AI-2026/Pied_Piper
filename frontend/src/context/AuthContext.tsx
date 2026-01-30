import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";


interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (name: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}


const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserProfile = useCallback(async (): Promise<void> => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/v1/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      if (data.success) {
        setUser(data.data as User);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      if (token) {
        await fetchUserProfile();
      }
      setLoading(false);
    };

    initAuth();
  }, [token, fetchUserProfile]);


  const login = async (
    email: string,
    password: string
  ): Promise<any> => {
    const response = await fetch(`${API_URL}/api/v1/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to login");
    }

    const newToken: string = data.data.token;
    localStorage.setItem("token", newToken);
    setToken(newToken);

    return data;
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<any> => {
    const response = await fetch(`${API_URL}/api/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to create account");
    }

    return data;
  };

  const logout = (): void => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
