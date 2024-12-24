<script lang="ts">
	import CalendarEntry from './CalendarEntry.svelte';
	import { entries, clients, formatHour, computeColumn } from '$lib/app';
	import { createEventDispatcher } from 'svelte';
	import type { Entry } from '$lib/schema';

	export let isDragging: boolean;
	export let timeA: number;
	export let timeB: number;
	export let timeP: number;
	export let i: number;
	export let resolution: number;
	export let todayDate: string;

	$: today = $entries.filter((e) => new Date(e.z_start).toDateString() === todayDate);
	$: height = 30 - resolution * 5;
	$: naptime = i / resolution < 6 || i / resolution == 23;
	$: highlighted = isDragging && i >= timeA && i <= timeB;

	$: renderedEntries = [
		...today.map((e, i) => {
			return {
				...e,
				__column__: computeColumn(today.slice(0, i), e.start, e.end)
			};
		}),
		{
			__column__: computeColumn(today, timeA / resolution, timeB / resolution),
			task: 'New entry',
			project: $clients[0].projects[0].name,
			client: $clients[0].name,
			z_start: '',
			z_end: '',
			start: timeA / resolution,
			end: timeB / resolution,
			duration: Math.abs(timeB - timeA) / resolution,
			tags: []
		}
	];
	$: cols = Math.max(...renderedEntries.map((e) => e.__column__)) + 1;

	function deleteEntry(i: number) {
		const globalIndex = $entries.indexOf(today[i]);
		$entries = $entries.filter((_, j) => j !== globalIndex).filter((e) => e.duration > 0);
	}
	function updateEntry(i: number, n: Entry) {
		const globalIndex = $entries.indexOf(today[i]);
		$entries = $entries.map((e, j) => (j === globalIndex ? n : e));
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
			__column__: computeColumn(today, timeA / resolution, timeB / resolution),
			task: 'New entry',
			project: $clients[0].projects[0].name,
			client: $clients[0].name,
			z_start: new Date(
				new Date(todayDate).setHours(
					Math.floor(timeA / resolution),
					((timeA / resolution) % 1) * 60,
					0,
					0
				)
			).toISOString(),
			z_end: new Date(
				new Date(todayDate).setHours(
					Math.floor(timeB / resolution),
					((timeB / resolution) % 1) * 60,
					0,
					0
				)
			).toISOString(),
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
				entry={e}
				height={height * e.duration * resolution}
				editing={isDragging}
				on:delete={() => deleteEntry(renderedEntries.indexOf(e))}
				on:update={(v) => updateEntry(renderedEntries.indexOf(e), v.detail)}
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
		font-size: 0.7rem;
		padding: 0;
		height: 30px;
		width: 100%;
		position: relative;

		&.highlighted .row .label {
			color: var(--a1);
		}

		.row {
			display: flex;
			gap: 0.5rem;
			align-items: center;
			width: 100%;

			.label {
				color: var(--b2);
			}

			> hr {
				border: none;
				border-top: 1px solid var(--b1);
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
