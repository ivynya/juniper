import { writable } from 'svelte/store';
import type { Entry, Client } from './schema';

export const entries = writable<Entry[]>([
	{
		__column__: 0,
		task: 'Entry',
		project: 'Project',
		client: 'Self',
		z_start: '2021-09-01T00:00:00Z',
		z_end: '2021-09-01T01:00:00Z',
		start: 0,
		end: 5,
		duration: 5,
		tags: ['']
	},
	{
		__column__: 1,
		task: 'Entry',
		project: 'Project',
		client: 'Self',
		z_start: '2021-09-01T01:00:00Z',
		z_end: '2021-09-01T02:00:00Z',
		start: 3,
		end: 10,
		duration: 7,
		tags: ['']
	}
]);
export const clients = writable<Client[]>([]);

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
	return [0, 1, 2, 3, 4, 5, 6].filter((i) => !conflicting.includes(i)).at(0) || 0;
}

export function formatHour(hour: number): string {
	const hrs = hour - (hour % 1);
	const min = Math.round((hour % 1) * 60)
		.toString()
		.padStart(2, '0');
	return hrs < 10 ? `0${hrs}:${min}` : `${hrs}:${min}`;
}
