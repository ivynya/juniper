import type { Entry, Client } from '$lib/schema';

export interface ParseResult {
	entries: Entry[];
	clients: Client[];
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
			__column__: 0,
			task: row[header.indexOf('Description')],
			project: row[header.indexOf('Project')],
			client: row[header.indexOf('Client')],
			z_start: z_start,
			z_end: z_end,
			start: Math.round(start * 100) / 100,
			end: Math.round(end * 100) / 100,
			duration: Math.round((end - start) * 100) / 100,
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
				color: '#000000',
				projects: entries
					.filter((entry) => entry.client === client)
					.map((entry) => entry.project)
					.filter((project, index, self) => self.indexOf(project) === index)
					.map((project) => {
						return {
							name: project,
							color: '#000000'
						};
					})
			};
		});

	return {
		entries,
		clients
	};
}
