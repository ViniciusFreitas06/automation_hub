/**
 * Configuração da API
 * Minimalismo Técnico - Conexão com FastAPI
 */

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
    },

    admin: {
      listUsers: `${API_BASE_URL}/admin/users`,
      changeRole: (id: number) =>
        `${API_BASE_URL}/admin/users/${id}/role`,
    },

  },
};

export default apiConfig; 