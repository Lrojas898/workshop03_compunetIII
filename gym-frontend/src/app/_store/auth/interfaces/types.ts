
export interface Role {
  id: string;
  name: 'admin' | 'coach' | 'client' | 'receptionist'; 
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  age: number;
  isActive: boolean;
  roles: Role[]; 
}


export interface LoginResponse {
  id: string;
  email: string;
  fullName: string;
  age: number;
  isActive: boolean;
  roles: Role[];
  token: string;
}


export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}


export interface AuthActions {
  login: (data: LoginResponse) => void; 
  logout: () => void;
}