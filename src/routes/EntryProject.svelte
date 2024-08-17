<script lang="ts">
	import type { Entry } from '$lib/schema';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let entry: Entry;

	function upd() {
		dispatch('update', entry);
	}
</script>

<span>
	<select bind:value={entry.project} on:change={upd}>
		<option value="etc">etc</option>
	</select>
	•
	<select bind:value={entry.client} on:change={upd}>
		<option value="etc">etc</option>
	</select>
</span>

<style lang="scss">
	span {
		color: #fff8;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.7rem;
		width: fit-content;
	}

	select {
		appearance: none;
		background-color: transparent;
		border: none;
		border-radius: 0;
		color: inherit;
		font-family: inherit;
		font-size: inherit;
		margin: 0;
		padding: 0;
		outline: none;
		width: 100%;

		&:focus {
			border-bottom: 1px dashed #fff;
		}
	}
</style>
