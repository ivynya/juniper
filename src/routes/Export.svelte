<script lang="ts">
	import { entries, clients, inputData, computeColumn } from '$lib/app';
	import { formatCSV, parseCSV } from '$lib/csv';
	import { resetStorage } from '$lib/data';
	import { CirclePower, Origami } from 'lucide-svelte';
	import type { Entry, Client } from '$lib/schema';

	let raw: string[][] = [];
	let data: Entry[] = [];

	function handleFileUpload(event: Event) {
		let target = event.target as HTMLInputElement;
		if (!target || !target.files) return;
		if (target.files.length === 0) return;
		const file = target.files[0];
		console.log(target.files);
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (!e.target) return;
				const content = e.target.result as string;
				raw = content.split('\n').map((line) => line.split(','));
				const parse = parseCSV(content);
				data = parse.entries;
				for (let i = 0; i < data.length; i++) {
					data[i].__column__ = computeColumn(data, data[i].start, data[i].end);
				}
				entries.set(data);
				clients.set(parse.clients);
			};
			reader.readAsText(file);
		}
	}

	function exportData() {
		const today = new Date();
		const ex = formatCSV({ entries: $entries, clients: $clients, input: $inputData });

		const data = new Blob([ex[0]], { type: 'text/csv' });
		const dataURL = URL.createObjectURL(data);
		const a = document.createElement('a');
		a.href = dataURL;
		a.download = `fauna-data-${today.toISOString().split('T')[0]}.csv`;
		a.click();
		URL.revokeObjectURL(dataURL);
		document.body.removeChild(a);
	}

	function exportMeta() {
		const today = new Date();
		const ex = formatCSV({ entries: $entries, clients: $clients, input: $inputData });

		const blob = new Blob([ex[1]], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const b = document.createElement('a');
		b.href = url;
		b.download = `fauna-meta-${today.toISOString().split('T')[0]}.csv`;
		b.click();
		URL.revokeObjectURL(url);
		document.body.removeChild(b);
	}

	let projectName = '';
	function createProject(client: Client) {
		client.projects.push({ name: projectName, color: '#fff', __archived__: false });
		projectName = '';
	}
</script>

<section>
	<h3>CLIENTS & PROJECTS</h3>
	{#each $clients as client}
		<div class="client" style="--client: {client.color};">
			<h4>{client.name} {client.color} <input type="color" bind:value={client.color} /></h4>
			{#each client.projects as project, p}
				<div class="project" style="--project: {project.color};">
					<span>{project.name}</span>
					<input type="color" bind:value={client.projects[p].color} />
					<input type="checkbox" bind:checked={client.projects[p].__archived__} />
				</div>
			{/each}
			<form>
				<input type="text" bind:value={projectName} />
				<button on:click={() => createProject(client)}>+</button>
			</form>
		</div>
	{/each}

	<h3>STORAGE</h3>
	<p>last saved: {new Date(window.localStorage.getItem('time') || '').toUTCString()}</p>
	<p>{JSON.parse(window.localStorage.getItem('data') || '[]').length} entries</p>
	<p>{JSON.parse(window.localStorage.getItem('meta') || '[]').length} clients</p>
	<button on:click={() => exportData()}>Export Data</button>
	<button on:click={() => exportMeta()}>Export Metadata</button>
	<br />
	<button on:click={() => resetStorage()}>Reset Storage</button>

	<h3>IMPORT</h3>
	<div class="import">
		<button><CirclePower size="14px" />From Toggl Track</button>
		<button><Origami size="14px" />From Fauna Export</button>
	</div>
	<input type="file" accept=".csv" on:change={handleFileUpload} />
	<p>imported {data.length} entries</p>
</section>

<style lang="scss">
	h3 {
		border-bottom: 1px dotted var(--a1);
		color: var(--a1);
		margin-bottom: 0.5rem;
	}

	p {
		color: var(--a2);
		font-size: 0.8rem;
		margin: 0;
	}

	button {
		background: transparent;
		border: 1px solid var(--b3);
		border-radius: 0.25rem;
		color: var(--b3);
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-family: inherit;
		font-size: 0.8rem;
		margin: 0.5rem 0;
		padding: 0.125rem 0.5rem;

		&:hover {
			background: var(--b3);
			color: var(--a3);
		}
	}

	.client {
		border: 1px solid var(--client);
		border-radius: 0.25rem;
		margin: 0.5rem 0;
		padding: 0.25rem 0.5rem;

		h4 {
			color: var(--client);
			font-size: 1rem;
			margin: 0;
		}

		span {
			color: var(--project);
			font-size: 0.8rem;
			margin: 0;
		}
	}

	.import {
		display: flex;
		gap: 0.5rem;
	}
</style>
