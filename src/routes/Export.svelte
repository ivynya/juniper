<script lang="ts">
	import { entries, clients, computeColumn } from '$lib/app';
	import { parseCSV } from '$lib/csv';
	import { resetStorage } from '$lib/data';
	import type { Entry } from '$lib/schema';

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
</script>

<section>
	<h3>CLIENTS & PROJECTS</h3>
	{#each $clients as client}
		<div class="client" style="--client: {client.color};">
			<h4>{client.name} {client.color} <input type="color" bind:value={client.color} /></h4>
			{#each client.projects as project, p}
				<div class="project" style="--project: {project.color};">
					<h5>{project.name} <input type="color" bind:value={client.projects[p].color} /></h5>
				</div>
			{/each}
		</div>
	{/each}

	<h3>STORAGE</h3>
	<p>last saved: {new Date(window.localStorage.getItem('time') || '').toUTCString()}</p>
	<p>{JSON.parse(window.localStorage.getItem('data') || '[]').length} entries</p>
	<p>{JSON.parse(window.localStorage.getItem('meta') || '[]').length} clients</p>
	<button on:click={() => resetStorage()}>Reset Storage</button>
	<button>Refresh</button>

	<h3>IMPORT</h3>
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

		h5 {
			color: var(--project);
			font-size: 0.8rem;
			margin: 0;
		}
	}
</style>
