<script lang="ts">
	import CalendarHour from './CalendarHour.svelte';
	import Input from './Input.svelte';
	import { formatHour, inputData } from '$lib/app';
	import { onMount, onDestroy } from 'svelte';

	let resolution = 4;
	let todayDate: string;

	$: hours = $inputData.wakingHoursOnly ? Array(18 * resolution) : Array(24 * resolution);

	let isDragging = false;
	let timeA = -1;
	let timeB = -1;
	let timeP = -1;

	function adjustHour(hour: number): number {
		return hour + 24 * resolution - hours.length;
	}

	// Current time indicator position
	let currentTimePosition = '0px';
	let timeInterval: number;
	let timeCurrent: number;

	function updTimeBar() {
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes();

		let offset = hours + minutes / 60;
		timeCurrent = offset > 12 ? offset - 12 : offset;
		if ($inputData.wakingHoursOnly) {
			offset = hours - 6 + minutes / 60;
		}
		const hourHeight = 30 - resolution * 5;

		const position = 10 + offset * hourHeight * resolution;
		currentTimePosition = `${Math.max(position, 0)}px`;
	}

	onMount(() => {
		updTimeBar();
		timeInterval = setInterval(updTimeBar, 60000); // Update every minute
	});
	onDestroy(() => clearInterval(timeInterval));

	// Update position when resolution or wakingHoursOnly changes
	$: if (resolution !== undefined || $inputData.wakingHoursOnly !== undefined) {
		updTimeBar();
	}
</script>

<Input bind:resolution bind:todayDate showCalControls />
<section>
	<div
		class="current-time-indicator"
		style="top: {currentTimePosition};"
		data-time={formatHour(timeCurrent * 36e5).slice(0, 5)}
	></div>
	{#each hours.reverse() as _, i (i)}
		<CalendarHour
			bind:isDragging
			bind:timeA
			bind:timeB
			bind:timeP
			bind:resolution
			bind:todayDate
			i={adjustHour(i)}
		/>
	{/each}
</section>

<style lang="scss">
	section {
		position: relative;
	}

	.current-time-indicator {
		background-color: var(--b2);
		position: absolute;
		width: 100%;
		height: 2px;
		z-index: 2;
		pointer-events: none;

		&::after {
			background-color: var(--b2);
			border-radius: 5px;
			color: var(--a2);
			content: attr(data-time);
			font-size: 0.7rem;
			position: relative;
			top: -15px;
			left: -4px;
			padding: 0 0.25rem;
			padding-bottom: 0.125rem;
		}
	}
</style>
