import { lazy, type ComponentType } from 'react';

const RELOAD_STORAGE_KEY = 'bt_lazy_chunk_reload_at';
const RELOAD_COOLDOWN_MS = 10_000;

export function lazyWithRetry<T extends ComponentType<any>>(
  importer: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await importer();
    } catch (firstError) {
      await new Promise((resolve) => window.setTimeout(resolve, 250));
      try {
        return await importer();
      } catch (secondError) {
        if (typeof window !== 'undefined') {
          const lastReloadRaw = window.sessionStorage.getItem(RELOAD_STORAGE_KEY);
          const lastReload = lastReloadRaw ? Number(lastReloadRaw) : 0;
          const now = Date.now();
          if (!Number.isFinite(lastReload) || now - lastReload > RELOAD_COOLDOWN_MS) {
            window.sessionStorage.setItem(RELOAD_STORAGE_KEY, String(now));
            window.location.reload();
            return await new Promise<{ default: T }>(() => {});
          }
        }
        throw secondError ?? firstError;
      }
    }
  });
}
