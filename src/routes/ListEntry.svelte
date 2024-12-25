<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { clients, formatHour } from '$lib/app';
	import { Kanban, Layers } from 'lucide-svelte';
	import type { Entry } from '$lib/schema';

	const dispatch = createEventDispatcher();

	$: client = $clients.find((c) => c.name === entry.client) || { color: 'var(--b3)', projects: [] };
	$: project = client.projects.find((p) => p.name === entry.project) || { color: 'var(--b3)' };

	export let entry: Entry;
</script>

<article class="entry">
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
</article>

<style lang="scss">
	.entry {
		border-top: 1px dotted var(--b2);
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		height: 4rem;
		padding: 0.75rem 1rem;
		width: 100%;

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
