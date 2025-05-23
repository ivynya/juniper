<script lang="ts">
	import CalendarEntry from './CalendarEntry.svelte';
	import { entries, inputData, computeColumn, computeColumns, ut } from '$lib/app';
	import { nanoid } from '$lib/nanoid';
	import type { Entry } from '$lib/schema';

	export let isDragging: boolean;
	export let timeA: number;
	export let timeB: number;
	export let timeP: number;
	export let i: number;
	export let resolution: number;
	export let todayDate: string;

	$: todayTime = new Date(todayDate).getTime();
	$: today = $entries
		.filter((e) => new Date(e.start).toDateString() === todayDate)
		.sort((a, b) => a.start - b.start);
	$: height = 30 - resolution * 5;
	$: naptime = i / resolution < 6 || i / resolution == 23;
	$: highlighted = isDragging && i >= timeA && i <= timeB;

	$: _scaleA = (timeA / resolution) * 60 * 60 * 1000;
	$: _scaleB = (timeB / resolution) * 60 * 60 * 1000;

	$: renderedEntries = [
		...computeColumns(today),
		{
			__uuid__: '',
			__column__: computeColumn(today, todayTime + _scaleA, todayTime + _scaleB),
			task: $inputData.task || 'New entry',
			project: $inputData.clientProject.split(',')[1],
			client: $inputData.clientProject.split(',')[0],
			start: todayTime + _scaleA,
			end: todayTime + _scaleB,
			duration: Math.abs(_scaleB - _scaleA),
			tags: []
		}
	].filter((e) => e.duration > 0);
	$: cols = Math.max(...renderedEntries.map((e) => e.__column__)) + 1;

	function deleteEntry(uuid: string) {
		$entries = $entries.filter((e) => e.__uuid__ !== uuid);
	}
	function updateEntry(uuid: string, n: Entry) {
		$entries = $entries.map((e) => (e.__uuid__ === uuid ? n : e));
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
			__uuid__: nanoid(),
			__column__: 0,
			task: $inputData.task || 'New entry',
			project: $inputData.clientProject.split(',')[1],
			client: $inputData.clientProject.split(',')[0],
			start: todayTime + _scaleA,
			end: todayTime + _scaleB,
			duration: Math.abs(_scaleB - _scaleA),
			tags: []
		});
		$entries = $entries;

		isDragging = false;
		timeA = timeB = timeP = -1;
	}

	function unixToHours(unix: number): number {
		const d = new Date(unix);
		return d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600;
	}

	function unixToLeftover(unix: number, resolution: number): number {
		const baseline = 60 / resolution; // 60, 30, or 15 minutes
		const leftover = new Date(unix).getUTCMinutes();
		if (leftover % baseline === 0) return 0;
		return (leftover % baseline) / 60;
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
			<span class="label">{((i / resolution) % 12 || 12).toString().padStart(2, '0')}:00</span>
			<hr />
		{:else}
			<span class="label" style="opacity: 0.25;">·····</span>
		{/if}
	</span>
	<div class="entries" style="grid-template-columns: repeat({cols}, 1fr);">
		{#each renderedEntries.filter((e) => Math.floor(unixToHours(ut(e.start)) * resolution) === i) as e}
			<CalendarEntry
				entry={e}
				height={height * unixToHours(e.duration) * resolution}
				offset={height * unixToLeftover(e.start, resolution) * resolution}
				editing={isDragging}
				delEntry={deleteEntry}
				updEntry={updateEntry}
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
