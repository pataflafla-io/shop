export interface SeedUser {
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'user';
}
