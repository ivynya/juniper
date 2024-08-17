<script lang="ts">
	import type { Entry } from '$lib/schema';
	import { formatHour } from '$lib/app';
	import { Trash } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import EntryProject from './EntryProject.svelte';

	const dispatch = createEventDispatcher();

	export let editing: boolean;
	export let entry: Entry;
	export let height: number;

	$: _grid = `grid-column: ${entry.__column__ + 1}; grid-row: 1 / 1;`;
	$: _height = `height: ${height}px`;

	function del() {
		dispatch('delete', entry);
	}
	function upd() {
		dispatch('update', entry);
	}
	function stopProp(e: Event) {
		e.stopPropagation();
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="entry" style="{_grid}; {_height}" class:editing on:mousedown={stopProp}>
	<div class="info">
		<input type="text" bind:value={entry.name} on:keypress={upd} />
		<EntryProject {entry} on:update={upd} />
	</div>
	<div class="opts">
		<span>{formatHour(entry.duration)}</span>
		<button on:click={del}><Trash size="14px" /></button>
	</div>
</div>

<style lang="scss">
	.entry {
		background: repeating-linear-gradient(
			-60deg,
			#0001,
			#0001 1px,
			transparent 1px,
			transparent 8px
		);
		background-color: #453;
		border: 1px solid #0003;
		border-radius: 0.25rem;
		box-sizing: border-box;
		color: #fff;
		cursor: initial;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		font-size: 0.8rem;
		text-align: center;
		padding: 0.5rem 0.75rem;
		position: relative;
		z-index: 1;

		&.editing {
			pointer-events: none;
		}

		input {
			appearance: none;
			background-color: transparent;
			border: none;
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

		.info {
			display: flex;
			justify-content: space-between;
			gap: 0.5rem;
			width: 100%;
		}

		.opts {
			display: flex;
			justify-content: space-between;
			width: 100%;

			span {
				color: #fff8;
				font-size: 0.7rem;
			}

			button {
				background: transparent;
				border: none;
				color: #123;
				cursor: pointer;
				font-size: inherit;
				margin: 0;
				padding: 0;

				&:hover {
					color: #f53;
				}
			}
		}
	}
</style>
