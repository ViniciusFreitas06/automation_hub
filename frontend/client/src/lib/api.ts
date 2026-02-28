/**
 * Configuração da API
 * Minimalismo Técnico - Conexão com FastAPI
 */

import { register } from "module";

// URL base da API FastAPI
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    scripts: {
      list: `${API_BASE_URL}/scripts/`,
      detail: (id: number) => `${API_BASE_URL}/scripts/${id}`,
      upload: `${API_BASE_URL}/scripts/upload`,
      delete: (id: number) => `${API_BASE_URL}/scripts/${id}`,
    },

    runner: {
      run: `${API_BASE_URL}/runner`,
    },

    auth: {
      login: `${API_BASE_URL}/auth/login`,
      me: `${API_BASE_URL}/auth/me`,
      register: `${API_BASE_URL}/auth/register`,
    },

    admin: {
      listUsers: `${API_BASE_URL}/admin/users`,
      changeRole: (id: number) =>
        `${API_BASE_URL}/admin/users/${id}/role`,
      deleteUser: (id: number) => `${API_BASE_URL}/admin/users/${id}`,
    },

  },
};

export default apiConfig; 