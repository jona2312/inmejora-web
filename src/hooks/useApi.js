import { clientAuthBlocked } from '@/contexts/identityContainment';

// Preserve the hook result contract while denying this legacy identity channel.
const request = async () => ({ data: null, error: clientAuthBlocked.error });
export const useApi = () => ({ request, loading: false, error: clientAuthBlocked.error });
