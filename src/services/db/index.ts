import type { DatabaseAdapter, AuthAdapter } from './types';
import { FirestoreAdapter } from './FirestoreAdapter';
import { SupabaseAdapter } from './SupabaseAdapter';
import { MockAdapter } from './MockAdapter';

const dbType = import.meta.env.VITE_DATABASE_TYPE || 'local';

let selectedDbAdapter: DatabaseAdapter;
let selectedAuthAdapter: AuthAdapter;

if (dbType === 'firestore') {
  const firestore = new FirestoreAdapter();
  selectedDbAdapter = firestore;
  selectedAuthAdapter = firestore;
} else if (dbType === 'supabase') {
  const supabaseAdapter = new SupabaseAdapter();
  selectedDbAdapter = supabaseAdapter;
  selectedAuthAdapter = supabaseAdapter;
} else {
  // Default to local mock database (LocalStorage)
  const mock = new MockAdapter();
  selectedDbAdapter = mock;
  selectedAuthAdapter = mock;
}

export const dbAdapter = selectedDbAdapter;
export const authAdapter = selectedAuthAdapter;
export * from './types';
export { MockAdapter } from './MockAdapter';
export { FirestoreAdapter } from './FirestoreAdapter';
export { SupabaseAdapter } from './SupabaseAdapter';
