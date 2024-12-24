import { writable } from 'svelte/store';
import type { Entry, Client } from './schema';

export const entries = writable<Entry[]>([
	{
		__column__: 0,
		task: 'Loading data...',
		project: 'App',
		client: 'Fauna',
		z_start: new Date().toISOString(),
		z_end: new Date().toISOString(),
		start: 0,
		end: 0,
		duration: 0,
		tags: ['']
	}
]);
export const clients = writable<Client[]>([
	{
		name: 'Fauna',
		color: '#000000',
		projects: [
			{
				name: 'App',
				color: '#000000'
			}
		]
	}
]);

export function computeColumn(entries: Entry[], start: number, end: number): number {
	const conflicting = entries
		.filter((e) => {
			return (
				(e.start < end && e.start >= start) ||
				(e.end <= end && e.end > start) ||
				(e.start <= start && e.end >= end)
			);
		})
		.map((e) => e.__column__);
	return [0, 1, 2, 3, 4, 5, 6, 7, 8].filter((i) => !conflicting.includes(i)).at(0) || 0;
}

export function formatHour(hour: number): string {
	const hrs = hour - (hour % 1);
	const min = Math.round((hour % 1) * 60)
		.toString()
		.padStart(2, '0');
	return hrs < 10 ? `0${hrs}:${min}` : `${hrs}:${min}`;
}
