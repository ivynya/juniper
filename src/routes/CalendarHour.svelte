<script lang="ts">
	import type { Entry } from '$lib/schema';

	export let isDragging: boolean;
	export let timeA: number;
	export let timeB: number;
	export let timeP: number;
	export let i: number;
	export let resolution: number;

	export let entries: Entry[];
	export let cols: number;

	$: height = 35 - resolution * 5;
	$: naptime = i / resolution < 6 || i / resolution == 23;
	$: highlighted = isDragging && i >= timeA && i <= timeB;

	function mouseDown(h: number) {
		isDragging = true;
		timeA = timeB = timeP = h;
	}
	function mouseEnter(h: number) {
		if (!isDragging) return;
		timeB = h;
		if (timeB <= timeP) {
			timeA = timeB;
			timeB = timeP;
		}
	}
	function mouseUp() {
		isDragging = false;
		timeA = timeB = timeP = -1;
	}

	function formatHour(hour: number): string {
		const hrs = hour - (hour % 1);
		const min = ((hour % 1) * 60).toString().padStart(2, '0');
		return hrs < 10 ? `0${hrs}:${min}` : `${hrs}:${min}`;
	}
</script>

<button
	style="height: {height}px;"
	class="selector"
	class:naptime
	class:highlighted
	on:mousedown={() => mouseDown(i)}
	on:mouseup={mouseUp}
	on:mouseenter={() => mouseEnter(i)}
>
	<span class="row">
		{#if i % resolution === 0}
			<span class="label">{formatHour(i / resolution)}</span>
			<hr />
		{:else}
			<span class="label" style="opacity: 0.25;">·····</span>
		{/if}
	</span>
	<div class="entries" style="grid-template-columns: repeat({cols}, 1fr);">
		{#each entries.filter((e) => e.start * resolution === i) as e}
			<div
				class="entry"
				style="grid-column: {e.__column__ + 1}; height: {height * e.duration * resolution}px;"
			>
				<span>{e.name}</span>
			</div>
		{/each}
	</div>
</button>

<style lang="scss">
	.selector {
		background: none;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: flex-start;
		font-family: inherit;
		font-size: 0.8rem;
		padding: 0;
		height: 30px;
		width: 100%;
		position: relative;

		&.naptime .row {
			.label,
			hr {
				border-color: #135;
				color: #135;
			}
		}

		&.highlighted .row .label {
			color: #fff;
		}

		.row {
			display: flex;
			gap: 0.5rem;
			align-items: center;
			width: 100%;

			.label {
				color: #345;
			}

			> hr {
				border: none;
				border-top: 1px solid #234;
				flex: 1;
				margin: auto 0;
				width: 100%;
			}
		}

		.entries {
			display: grid;
			gap: 0.25rem;
			position: absolute;
			top: 10px;
			left: 58px;
			right: 10px;

			.entry {
				background-color: #345;
				border-radius: 0.25rem;
				color: #fff;
				font-size: 0.8rem;
				text-align: center;
				position: relative;

				z-index: 1;
			}
		}
	}
</style>
