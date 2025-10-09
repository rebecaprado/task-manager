import { create } from "zustand";
import { User } from "schemas/userSchema";

// Zustand store for authentication state
// AuthState groups the properties and methods that are related to authentication
type AuthState = {
  user: User | null; // Either the user object or null
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null; // Either the error message or null
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setIsAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

