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
		const start = new Date(z_start).getTime();
		const end = new Date(z_end).getTime();

		const entry: Entry = {
			__uuid__: nanoid(),
			__column__: 0,
			task: row[header.indexOf('Description')],
			project: row[header.indexOf('Project')],
			client: row[header.indexOf('Client')],
			start: start,
			end: end,
			duration: end - start,
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

export function formatCSV(p: ParseResult): string[] {
	const dataHeader = ['Task', 'Project', 'Client', 'Start', 'End', 'Duration', 'Tags'];
	try {
		const data = p.entries.map((entry) => {
			return [
				entry.task,
				entry.project,
				entry.client,
				new Date(entry.start).toISOString(),
				new Date(entry.end).toISOString(),
				entry.duration,
				Array.isArray(entry.tags) ? entry.tags.join(';') : entry.tags
			].join(',');
		});
		const entryExport = dataHeader.join(',') + '\n' + data.join('\n');

		const metaHeader = ['Client', 'Color', 'Project', 'ProjectColor'];
		const meta = p.clients.map((client) => {
			return client.projects
				.map((project) => {
					return [client.name, client.color, project.name, project.color].join(',');
				})
				.join('\n');
		});
		const metaExport = metaHeader.join(',') + '\n' + meta.join('\n');

		return [entryExport, metaExport];
	} catch (e) {
		alert(e);
		return [];
	}
}
