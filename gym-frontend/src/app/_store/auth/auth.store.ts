// src/app/_store/auth/auth.store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AuthActions, LoginResponse } from './interfaces/types';

type StoreState = AuthState & AuthActions;

export const useAuthStore = create<StoreState>()(
  persist(
    (set) => ({
      
      isAuthenticated: false,
      user: null,
      token: null,
      
      login: (data: LoginResponse) => {
        
        const { token, ...userData } = data;

        set({
          isAuthenticated: true,
          user: userData, 
          token: token,   
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        });
      },
    }),
    {
      name: 'auth-storage', 
    }
  )
);