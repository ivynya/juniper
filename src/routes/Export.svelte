<script lang="ts">
	import { entries, clients, computeColumn } from '$lib/app';
	import { parseCSV } from '$lib/csv';
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
	<h3>CLIENTS</h3>
	<h3>PROJECTS</h3>

	<h3>IMPORT</h3>
	<input type="file" accept=".csv" on:change={handleFileUpload} />
	<pre>{JSON.stringify(raw, null, 2)}</pre>
	<pre>{JSON.stringify(data, null, 2)}</pre>
</section>

<style lang="scss">
	h3 {
		border-bottom: 1px dotted var(--a1);
		color: var(--a1);
	}
</style>
