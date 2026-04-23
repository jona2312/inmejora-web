import { apiCall } from '@/lib/apiClient';

const cache = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const fetchWithCache = async (key, fetcher) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};

export const catalogAPI = {
  getColors: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.familia) searchParams.append('familia', params.familia);
    if (params.search) searchParams.append('search', params.search);
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.offset) searchParams.append('offset', params.offset);
    
    const query = searchParams.toString();
    const key = `colors_${query}`;
    
    return fetchWithCache(key, async () => {
      return await apiCall(`/api/horizon/catalogo/colores${query ? `?${query}` : ''}`, 'GET');
    });
  },
  getProducts: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.categoria) searchParams.append('categoria', params.categoria);
    if (params.uso) searchParams.append('uso', params.uso);
    if (params.acabado) searchParams.append('acabado', params.acabado);
    if (params.search) searchParams.append('search', params.search);
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.offset) searchParams.append('offset', params.offset);

    const query = searchParams.toString();
    const key = `products_${query}`;
    
    return fetchWithCache(key, async () => {
      return await apiCall(`/api/horizon/catalogo/productos${query ? `?${query}` : ''}`, 'GET');
    });
  }
};