import type { BGMap } from '../types';

export interface StorageAdapter {
  load(defaults: BGMap): Promise<BGMap>;
  save(bgs: BGMap): Promise<void>;
}
