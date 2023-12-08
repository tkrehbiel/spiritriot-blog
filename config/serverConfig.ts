// Resource configuration for the site (mostly AWS)

// import { safeStringify } from '@/types/strings';
import { getEnv, ENV } from './env';

export function getFileConcurrency(): number {
  return Number.parseFloat(getEnv(ENV.CONCURRENCY));
}
