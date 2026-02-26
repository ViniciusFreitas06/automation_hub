/**
 * Configuração da API
 * Minimalismo Técnico - Conexão com FastAPI
 */

// URL base da API FastAPI
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    scripts: {
      list: `${API_BASE_URL}/scripts/`,
      detail: (id: number) => `${API_BASE_URL}/scripts/${id}`,
      upload: `${API_BASE_URL}/scripts/upload`,
      delete: (id: number) => `${API_BASE_URL}/scripts/${id}`,
    },
  },
};

export default apiConfig;
