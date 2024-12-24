<script lang="ts">
	import { clients } from '$lib/app';
	import type { Entry } from '$lib/schema';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let entry: Entry;
	$: client = $clients.find((c) => c.name === entry.client) || { projects: [] };

	function upd() {
		dispatch('update', entry);
	}
</script>

<span>
	<select bind:value={entry.project} on:change={upd}>
		{#each client.projects as project}
			<option value={project.name}>{project.name}</option>
		{/each}
	</select>
	•
	<select bind:value={entry.client} on:change={upd}>
		{#each $clients as client}
			<option value={client.name}>{client.name}</option>
		{/each}
	</select>
</span>

<style lang="scss">
	span {
		color: var(--b3);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.7rem;
	}

	select {
		appearance: none;
		background-color: transparent;
		border: none;
		border-bottom: 1px dashed transparent;
		border-radius: 0;
		color: inherit;
		font-family: inherit;
		font-size: inherit;
		margin: 0;
		padding: 0;
		outline: none;

		&:hover {
			border-bottom: 1px dashed var(--b3);
			cursor: pointer;
		}

		&:focus {
			border-bottom: 1px dashed var(--a3);
		}
	}
</style>
