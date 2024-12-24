<script lang="ts">
	import { entries } from '$lib/app';
	import Input from './Input.svelte';
	import ListEntry from './ListEntry.svelte';
	import ListGroup from './ListGroup.svelte';

	$: groups = $entries
		.sort((a, b) => (new Date(a.z_start).getTime() - new Date(b.z_start).getTime()) * -1)
		.reduce(
			(acc, entry) => {
				const date = new Date(entry.z_start);
				const key = date.toDateString();
				if (!acc[key]) acc[key] = [];
				acc[key].push(entry);
				return acc;
			},
			{} as Record<string, any[]>
		);
</script>

<Input />
{#each Object.entries(groups) as [date, entries]}
	<ListGroup {date} hours={entries.reduce((acc, entry) => acc + entry.duration, 0)}>
		{#each entries as entry}
			<ListEntry {entry} />
		{/each}
	</ListGroup>
{/each}

<style lang="scss">
</style>
