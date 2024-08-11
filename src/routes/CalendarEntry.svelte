<script lang="ts">
	import type { Entry } from '$lib/schema';

	export let editing: boolean;
	export let entry: Entry;
	export let height: number;

	$: _grid = `grid-column: ${entry.__column__ + 1}; grid-row: 1 / 1;`;
	$: _height = `height: ${height}px`;
</script>

<div class="entry" style="{_grid}; {_height}" class:editing>
	<span>{entry.name}</span>
</div>

<style lang="scss">
	.entry {
		background-color: #345;
		border-radius: 0.25rem;
		box-sizing: border-box;
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		font-size: 0.8rem;
		text-align: center;
		padding: 0.5rem 1rem;
		position: relative;
		z-index: 1;

		&.editing {
			pointer-events: none;
		}
	}
</style>
