import { writable } from 'svelte/store';
import type { Entry } from './schema';

export const entries = writable<Entry>();
