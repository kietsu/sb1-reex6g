export interface LoginCredentials {
  usernameEmail: string;
  password: string;
  remember: boolean;
}

export interface LoginResponse {
  status: string;
  message: string;
  token: string;
}

export interface UserData {
  userId: number;
  userName: string;
  role: string;
}