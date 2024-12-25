<script lang="ts">
	import Editor from './Editor.svelte';
	import { createEventDispatcher } from 'svelte';
	import { clients, formatHour } from '$lib/app';
	import { Kanban, Layers } from 'lucide-svelte';
	import type { Entry } from '$lib/schema';

	const dispatch = createEventDispatcher();

	$: client = $clients.find((c) => c.name === entry.client) || { color: 'var(--b3)', projects: [] };
	$: project = client.projects.find((p) => p.name === entry.project) || { color: 'var(--b3)' };

	export let entry: Entry;

	let edit = false;
</script>

<button class="entry" class:edit on:click={() => (edit = !edit)}>
	<div class="data">
		<span>{entry.task}</span>
		<span>
			<Layers size="12px" color={project.color} />{entry.project} •
			<Kanban size="12px" color={client.color} />{entry.client}
		</span>
	</div>
	<div class="meta">
		<span>{formatHour(entry.duration)}</span>
		<span>
			{#each entry.tags as tag}
				{tag}
			{/each}
		</span>
	</div>
	{#if edit}
		<Editor bind:entry />
	{/if}
</button>

<style lang="scss">
	.entry {
		background: transparent;
		border: none;
		border-top: 1px dotted var(--b2);
		box-sizing: border-box;
		color: inherit;
		display: flex;
		justify-content: space-between;
		font-family: inherit;
		font-size: 0.8rem;
		height: 4rem;
		padding: 0.75rem 1rem;
		width: 100%;
		text-align: left;
		position: relative;

		&.edit {
			background: var(--b2);
			border-radius: 0.5rem;

			&::before {
				background: linear-gradient(to bottom, transparent, #0006);
				content: '';
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				z-index: 1;
			}
		}

		div {
			display: flex;
			flex-direction: column;
		}

		.data span:last-child {
			color: var(--b3);
			display: flex;
			align-items: center;
			gap: 0.3rem;
			font-size: 0.7rem;
		}

		.meta {
			align-items: flex-end;
		}
		.meta span:last-of-type {
			color: var(--b3);
			display: flex;
			align-items: center;
			gap: 0.5rem;
			font-size: 0.7rem;
		}
	}
</style>
