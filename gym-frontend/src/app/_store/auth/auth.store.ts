// src/app/_store/auth/auth.store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AuthActions, LoginResponse, User } from './interfaces/types';

type StoreState = AuthState & AuthActions;

export const useAuthStore = create<StoreState>()(
  persist(
    (set, get) => ({
      
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
      updateUser: (data: Partial<User>) => {
        const { user } = get(); // Obtenemos el usuario actual del estado
        if (user) {
          set({
            user: {
              ...user, // Mantenemos los datos del usuario existente
              ...data, // Sobrescribimos con los nuevos datos
            },
          });
        }
      },
    }),

    {
      name: 'auth-storage', 
    }
  )
);