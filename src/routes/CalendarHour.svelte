<script lang="ts">
	import type { Entry } from '$lib/schema';
	import { entries, formatHour } from '$lib/app';
	import CalendarEntry from './CalendarEntry.svelte';

	export let isDragging: boolean;
	export let timeA: number;
	export let timeB: number;
	export let timeP: number;
	export let i: number;
	export let resolution: number;

	$: height = 35 - resolution * 5;
	$: naptime = i / resolution < 6 || i / resolution == 23;
	$: highlighted = isDragging && i >= timeA && i <= timeB;

	$: renderedEntries = [
		...$entries.map((e, i) => {
			return {
				...e,
				__column__: computeColumn($entries.slice(0, i), e.start, e.end)
			};
		}),
		{
			__column__: computeColumn($entries, timeA / resolution, timeB / resolution),
			name: 'New entry',
			client: '',
			start: timeA / resolution,
			end: timeB / resolution,
			duration: Math.abs(timeB - timeA) / resolution,
			tags: []
		}
	];
	$: cols = Math.max(...renderedEntries.map((e) => e.__column__)) + 1;

	function computeColumn(entries: Entry[], start: number, end: number): number {
		const conflicting = entries
			.filter((e) => {
				return (
					(e.start < end && e.start >= start) ||
					(e.end <= end && e.end > start) ||
					(e.start <= start && e.end >= end)
				);
			})
			.map((e) => e.__column__);
		return [0, 1, 2, 3, 4, 5, 6].filter((i) => !conflicting.includes(i)).at(0) || 0;
	}

	function deleteEntry(i: number) {
		$entries = $entries.filter((_, j) => j !== i).filter((e) => e.duration > 0);
	}

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
		if (timeA == timeB || timeA < 0 || timeB < 0) {
			isDragging = false;
			timeA = timeB = timeP = -1;
			return;
		}
		$entries.push({
			__column__: computeColumn($entries, timeA / resolution, timeB / resolution),
			name: 'New entry',
			client: '',
			start: timeA / resolution,
			end: timeB / resolution,
			duration: Math.abs(timeB - timeA) / resolution,
			tags: []
		});
		$entries = $entries;

		isDragging = false;
		timeA = timeB = timeP = -1;
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
		{#each renderedEntries.filter((e) => e.start * resolution === i) as e}
			<CalendarEntry
				bind:entry={e}
				height={height * e.duration * resolution}
				editing={isDragging}
				on:delete={() => deleteEntry(renderedEntries.indexOf(e))}
			/>
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
			gap: 0.125rem;
			position: absolute;
			top: 10px;
			left: 58px;
			right: 10px;
		}
	}
</style>
