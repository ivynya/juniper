<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { formatHour } from '$lib/app';
	import type { Entry } from '$lib/schema';

	const dispatch = createEventDispatcher();

	export let entry: Entry;
</script>

<article class="entry">
	<div class="data">
		<span>{entry.task}</span>
		<span>{entry.project} • {entry.client}</span>
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
