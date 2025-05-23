<script lang="ts">
	import Input from './Input.svelte';
	import ListEntry from './ListEntry.svelte';
	import ListGroup from './ListGroup.svelte';
	import { onMount } from 'svelte';
	import { entries } from '$lib/app';
	import type { Entry } from '$lib/schema';

	let maximum = $state(100);

	let groups: Record<string, any[]> = $state({});

	onMount(() => {
		entries.subscribe((entries) => {
			groups = entries
				.sort((a, b) => b.start - a.start)
				.slice(0, Math.min(entries.length, maximum))
				.reduce(
					(acc, entry) => {
						const date = new Date(entry.start);
						const key = date.toDateString();
						if (!acc[key]) acc[key] = [];
						acc[key].push(entry);
						return acc;
					},
					{} as Record<string, any[]>
				);
		});
	});

	function deleteEntry(uuid: string) {
		console.log('delete', uuid);
		$entries = $entries.filter((e) => e.__uuid__ !== uuid);
	}
	function updateEntry(uuid: string, n: Entry) {
		$entries = $entries.map((e) => (e.__uuid__ === uuid ? n : e));
	}
</script>

<Input />
{#each Object.entries(groups) as [date, entries], i}
	<ListGroup {date} hours={entries.reduce((acc, entry) => acc + entry.duration, 0)}>
		{#each entries as entry, j}
			<ListEntry {entry} updEntry={updateEntry} delEntry={deleteEntry} />
		{/each}
	</ListGroup>
{/each}

<button onclick={() => (maximum += 100)}>Show More</button>
