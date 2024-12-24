<script lang="ts">
	import EntryProject from './EntryProject.svelte';
	import { Trash } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { formatHour } from '$lib/app';
	import type { Entry } from '$lib/schema';

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
		<input type="text" bind:value={entry.task} on:keypress={upd} />
		<EntryProject {entry} on:update={upd} />
	</div>
	<div class="opts">
		<span>{formatHour(entry.duration)}</span>
		<button on:click={del}><Trash size="14px" /></button>
	</div>
</div>

<style lang="scss">
	.entry {
		background-image: radial-gradient(circle, #0001 1px, transparent 1px);
		background-size: 8px 8px;
		background-color: var(--b3);
		border: 1px solid var(--a1);
		border-radius: 0.25rem;
		box-sizing: border-box;
		color: var(--a2);
		cursor: initial;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		font-size: 0.7rem;
		text-align: center;
		padding: 0.2rem 0.3rem;
		padding-bottom: 0.1rem;
		position: relative;
		z-index: 1;
		overflow: hidden;

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
			flex: 1 1;
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
				color: var(--b2);
				font-size: 0.6rem;
			}

			button {
				background: transparent;
				border: none;
				color: var(--b2);
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
