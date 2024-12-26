<script lang="ts">
	import Input from './Input.svelte';
	import ListEntry from './ListEntry.svelte';
	import ListGroup from './ListGroup.svelte';
	import { entries } from '$lib/app';
	import type { Entry } from '$lib/schema';

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
			<ListEntry
				{entry}
				on:update={(e) => updateEntry(e.detail.uuid, e.detail.entry)}
				on:delete={(e) => deleteEntry(e.detail)}
			/>
		{/each}
	</ListGroup>
{/each}

<style lang="scss">
</style>
