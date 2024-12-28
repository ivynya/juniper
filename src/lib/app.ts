import { writable } from 'svelte/store';
import type { Entry, Client, InputData } from '$lib/schema';

export const entries = writable<Entry[]>([
	{
		__uuid__: '0',
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
				__archived__: false,
				name: 'App',
				color: '#000000'
			}
		]
	}
]);

export const inputData = writable<InputData>({
	task: '',
	clientProject: ',',
	start: undefined
});

export function computeColumn(entries: Entry[], start: number, end: number): number {
	const conflicting = entries
		.filter((e) => {
			return (
				(e.start < end && e.start >= start) ||
				(e.end <= end && e.end > start) ||
				(e.start <= start && e.end >= end) ||
				(e.end < start && e.start > start)
			);
		})
		.map((e) => e.__column__);
	const col = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter((i) => !conflicting.includes(i)).at(0);
	if (col === undefined) return 0;
	return col;
}

export function computeColumns(entries: Entry[]): Entry[] {
	for (let i = 0; i < entries.length; i++) {
		const entry = entries[i];
		entry.__column__ = computeColumn(entries.slice(0, i), entry.start, entry.end);
	}
	return entries;
}

export function formatHour(hour: number, includeSeconds: boolean = true): string {
	const hrs = Math.floor(hour);
	const min = Math.floor((hour % 1) * 60)
		.toString()
		.padStart(2, '0');
	const sec = Math.round((((hour % 1) * 60) % 1) * 60)
		.toString()
		.padStart(2, '0');
	if (includeSeconds) return `${hrs < 10 ? `0${hrs}` : hrs}:${min}:${sec}`;
	else return `${hrs < 10 ? `0${hrs}` : hrs}:${min}`;
}
