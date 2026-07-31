export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  avatar_url?: string;
}

export interface UserPersona {
  role: string;
  email: string;
  name: string;
  avatar: string;
}
