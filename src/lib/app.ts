import { writable } from 'svelte/store';
import type { Entry, Client } from './schema';

export const entries = writable<Entry[]>([
	{
		__column__: 0,
		name: 'Sleep',
		client: 'Self',
		start: 0,
		end: 5,
		duration: 5,
		tags: ['']
	},
	{
		__column__: 1,
		name: 'Sleep',
		client: 'Self',
		start: 3,
		end: 10,
		duration: 7,
		tags: ['']
	}
]);
export const clients = writable<Client[]>([]);
