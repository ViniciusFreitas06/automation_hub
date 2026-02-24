import api from './api';

export async function getDashboardMetrics() {
  const { data } = await api.get('/dashboard/metrics')
  return data
}