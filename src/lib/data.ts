import type { Entry, Client, InputData } from '$lib/schema';
import type { ParseResult } from './csv';

export function saveData(data: Entry[]) {
	window.localStorage.setItem('time', new Date().toISOString());
	window.localStorage.setItem('data', JSON.stringify(data));
}

export function saveMeta(meta: Client[]) {
	window.localStorage.setItem('time', new Date().toISOString());
	window.localStorage.setItem('meta', JSON.stringify(meta));
}

export function saveInput(input: InputData) {
	window.localStorage.setItem('input', JSON.stringify(input));
}

export function loadData(): ParseResult {
	return {
		entries: JSON.parse(window.localStorage.getItem('data') || '[]'),
		clients: JSON.parse(window.localStorage.getItem('meta') || '[]'),
		input: JSON.parse(window.localStorage.getItem('input') || '{ "clientProject": "," }')
	};
}

export function resetStorage() {
	window.localStorage.clear();
}
