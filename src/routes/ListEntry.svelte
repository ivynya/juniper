<script lang="ts">
	import { formatHour } from '$lib/app';
	import type { Entry } from '$lib/schema';
	import { createEventDispatcher } from 'svelte';
	import EntryProject from './EntryProject.svelte';

	const dispatch = createEventDispatcher();

	export let entry: Entry;

	function upd() {
		dispatch('update', entry);
	}
</script>

<article class="entry">
	<div class="data">
		<input type="text" bind:value={entry.task} on:keypress={upd} />
		<span><EntryProject {entry} on:update={upd} /></span>
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
		border-top: 1px solid #234;
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

		.meta {
			align-items: flex-end;
		}
		.meta span:last-of-type {
			color: #fff8;
			display: flex;
			align-items: center;
			gap: 0.5rem;
			font-size: 0.7rem;
		}
	}

	input {
		background-color: transparent;
		border: none;
		border-radius: 0.125rem;
		box-sizing: border-box;
		color: #f5fff1;
		font-family: inherit;
		font-size: 0.8rem;
		margin: 0;
		padding: 0;
		width: 100%;
		outline: none;

		&::placeholder {
			color: #567;
		}
	}
</style>
