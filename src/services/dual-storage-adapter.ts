import type { BGMap } from '../types';
import type { StorageAdapter } from './storage-adapter';
import { LocalStorageAdapter } from './local-storage-adapter';
import { SupabaseStorageAdapter } from './supabase-storage-adapter';

export class DualStorageAdapter implements StorageAdapter {
  private local = new LocalStorageAdapter();
  private remote = new SupabaseStorageAdapter();
  private saveTimeout: ReturnType<typeof setTimeout> | null = null;

  async load(defaults: BGMap): Promise<BGMap> {
    try {
      const remoteBgs = await this.remote.load(defaults);
      // Sync remote data to localStorage as cache
      await this.local.save(remoteBgs);
      return remoteBgs;
    } catch (e) {
      console.warn('Failed to load from Supabase, falling back to localStorage:', e);
      return this.local.load(defaults);
    }
  }

  async save(bgs: BGMap): Promise<void> {
    // Save to localStorage immediately (sync UX)
    await this.local.save(bgs);

    // Debounce Supabase writes
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.remote.save(bgs).catch((e) => {
        console.warn('Failed to save to Supabase:', e);
      });
    }, 1000);
  }
}
