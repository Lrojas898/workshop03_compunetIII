import { ValidRoles } from "@/lib/configuration/api-endpoints";

export interface Role {
  id: string;
  name: ValidRoles; 
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
  updateUser: (data: Partial<User>) => void;
}
