import { nanoid } from '$lib/nanoid';
import type { Entry, Client, InputData } from '$lib/schema';

export interface ParseResult {
	entries: Entry[];
	clients: Client[];
	input: InputData;
}

export function parseCSV(csv: string): ParseResult {
	const rows = csv
		.split('\n')
		.map((row) => row.split(',').map((cell) => cell.trim().replaceAll('"', '')));
	const header = rows[0];
	const data = rows.slice(1);

	const entries = data.map((row) => {
		const z_start = `${row[header.indexOf('Start date')]}T${row[header.indexOf('Start time')]}Z`;
		const z_end = `${row[header.indexOf('End date')]}T${row[header.indexOf('End time')]}Z`;
		const start = new Date(z_start).getHours() + new Date(z_start).getMinutes() / 60;
		let end = new Date(z_end).getHours() + new Date(z_end).getMinutes() / 60;

		if (new Date(z_end).getHours() < new Date(z_start).getHours()) {
			end += 24;
		}

		const entry: Entry = {
			__uuid__: nanoid(),
			__column__: 0,
			task: row[header.indexOf('Description')],
			project: row[header.indexOf('Project')],
			client: row[header.indexOf('Client')],
			z_start: z_start,
			z_end: z_end,
			start: Math.round(start * 1e6) / 1e6,
			end: Math.round(end * 1e6) / 1e6,
			duration: Math.round((end - start) * 1e6) / 1e6,
			tags: row[header.indexOf('Tags')].split(',').map((tag) => tag.trim())
		};
		return entry;
	});

	const clients = entries
		.map((entry) => entry.client)
		.filter((client, index, self) => self.indexOf(client) === index)
		.map((client) => {
			return {
				name: client || 'No Client',
				color: '#678e98',
				projects: entries
					.filter((entry) => entry.client === client)
					.map((entry) => entry.project)
					.filter((project, index, self) => self.indexOf(project) === index)
					.map((project) => {
						return {
							__archived__: false,
							name: project,
							color: '#678e98'
						};
					})
			};
		});

	return {
		entries,
		clients,
		input: {
			task: '',
			clientProject: ',',
			start: undefined
		}
	};
}
