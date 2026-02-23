import api from './api';

type LoginPayload = {
  email: string;
  password: string;
};

export const AuthService = {
  login: (data: LoginPayload) => api.post('/login', data),
};