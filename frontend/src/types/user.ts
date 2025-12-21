export interface User {
  id: string;
  name: string;
  email: string;
}
export interface AuthResponse {
  accessToken: string;
  user: User;
}
