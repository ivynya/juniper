<script lang="ts">
	import { entries, clients, inputData, computeColumn } from '$lib/app';
	import { formatCSV, parseFaunaCSV, parseTogglCSV } from '$lib/csv';
	import { resetStorage } from '$lib/data';
	import { CirclePower, Origami } from 'lucide-svelte';
	import type { Entry, Client } from '$lib/schema';

	let raw = '';
	let rawmeta = '';
	let data: Entry[] = [];

	function handleFileUpload(event: Event) {
		let target = event.target as HTMLInputElement;
		if (!target || !target.files) return;
		if (target.files.length === 0) return;
		const file = target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (!e.target) return;
				raw = e.target.result as string;
			};
			reader.readAsText(file);
		}
	}

	function handleMetaUpload(event: Event) {
		let target = event.target as HTMLInputElement;
		if (!target || !target.files) return;
		const file = target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (!e.target) return;
				rawmeta = e.target.result as string;
			};
			reader.readAsText(file);
		}
	}

	function importAsFauna() {
		const parse = parseFaunaCSV(raw, rawmeta);
		data = parse.entries;
		for (let i = 0; i < data.length; i++) {
			data[i].__column__ = computeColumn(data, data[i].start, data[i].end);
		}
		entries.set(data);
		clients.set(parse.clients);
	}

	function importAsToggl() {
		const parse = parseTogglCSV(raw);
		data = parse.entries;
		for (let i = 0; i < data.length; i++) {
			data[i].__column__ = computeColumn(data, data[i].start, data[i].end);
		}
		entries.set(data);
		clients.set(parse.clients);
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
			<h4>
				<span>{client.name} [{client.color}] <input type="color" bind:value={client.color} /></span>
			</h4>
			<div class="content">
				{#each client.projects as project, p}
					<div
						class="project"
						style="--project: {project.color};"
						class:archived={project.__archived__}
					>
						<span>{project.name}</span>
						<input type="color" bind:value={client.projects[p].color} />
						<input type="checkbox" bind:checked={client.projects[p].__archived__} />
					</div>
				{/each}
				<form class="adder">
					<input type="text" bind:value={projectName} />
					<button on:click={() => createProject(client)}>+</button>
				</form>
			</div>
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
		<button on:click={() => importAsToggl()}><CirclePower size="14px" />From Toggl Track</button>
		<button on:click={() => importAsFauna()}><Origami size="14px" />From Fauna Export</button>
	</div>
	<b>data:</b>
	<input type="file" accept=".csv" on:change={handleFileUpload} />
	<b>meta:</b>
	<input type="file" accept=".csv" on:change={handleMetaUpload} />
	<p>meta content loaded: {rawmeta !== ''}</p>
	<p>file content loaded: {raw !== ''}</p>
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
		background: radial-gradient(var(--client) 1px, transparent 1px);
		background-size: 2px 2px;
		border: 1px solid var(--client);
		border-radius: 0.5rem;
		margin: 0.5rem 0;

		h4 {
			color: var(--client);
			font-size: 1rem;
			margin: 0;
			padding: 0.125rem 0.25rem;

			span {
				background: var(--b0);
				border: 1px solid var(--client);
				border-radius: 0.5rem;
				display: flex;
				align-items: center;
				gap: 0.25rem;
				padding: 0 0.5rem;
				width: fit-content;
			}
		}

		span {
			color: var(--project);
			font-size: 0.8rem;
			margin: 0;
		}

		.content {
			background-color: var(--b0);
			border: 1px solid var(--client);
			border-radius: 0.5rem;
			margin: 0 0.25rem;
			margin-right: 1rem;
			margin-bottom: 0.25rem;
			padding: 0.25rem 0.5rem;

			.project.archived {
				background: repeating-linear-gradient(
					45deg,
					var(--project),
					var(--project) 1px,
					transparent 1px,
					transparent 3px
				);
				opacity: 0.5;
				width: fit-content;
			}

			.adder {
				display: flex;
				align-items: center;
				gap: 0.25rem;
			}
			.adder input {
				background: transparent;
				border: 1px solid var(--b3);
				border-radius: 0.25rem;
				color: var(--a1);
				font-family: inherit;
				font-size: 0.8rem;
				padding: 0.125rem 0.25rem;
			}
		}
	}

	.import {
		display: flex;
		gap: 0.5rem;
	}
</style>
