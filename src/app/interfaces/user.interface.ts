export interface User {
  id: string;
  username: string;
  role: 'Usuario' | 'Administrador';
}

export interface UpdateUserPayload {
  username: string;
  role: 'Usuario' | 'Administrador';
  password?: string;
}
