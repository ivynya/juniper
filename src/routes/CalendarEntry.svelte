<script lang="ts">
	import type { Entry } from '$lib/schema';
	import { Trash } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let editing: boolean;
	export let entry: Entry;
	export let height: number;

	$: _grid = `grid-column: ${entry.__column__ + 1}; grid-row: 1 / 1;`;
	$: _height = `height: ${height}px`;

	function del() {
		dispatch('delete', entry);
	}
	function stopProp(e: Event) {
		e.stopPropagation();
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="entry" style="{_grid}; {_height}" class:editing on:mousedown={stopProp}>
	<div class="info">
		<input type="text" bind:value={entry.name} />
		<span>
			<select value="etc">
				<option value="etc">etc</option>
			</select>
			•
			<select value="etc">
				<option value="etc">etc</option>
			</select>
		</span>
	</div>
	<div class="opts">
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

		input,
		select {
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
			flex-direction: column;

			span {
				color: #fff8;
				display: flex;
				align-items: center;
				gap: 0.5rem;
				font-size: 0.7rem;
				margin-top: 0.125rem;

				select {
					border: none;
					max-width: fit-content;
				}
			}
		}

		.opts {
			display: flex;
			justify-content: space-between;
			width: 100%;

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
