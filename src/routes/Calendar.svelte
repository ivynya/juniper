<script lang="ts">
	import CalendarHour from './CalendarHour.svelte';
	import Input from './Input.svelte';
	import { onMount, onDestroy } from 'svelte';

	let resolution = 4;
	let wakingHoursOnly = false;
	let todayDate: string;

	$: hours = wakingHoursOnly ? Array(18 * resolution) : Array(24 * resolution);

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

	function updateCurrentTimePosition() {
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes();

		// Calculate position based on current time
		// For wakingHoursOnly mode, we adjust the calculation
		const totalMinutes = hours * 60 + minutes;
		const hourHeight = 30 - resolution * 4; // Height of each hour

		if (wakingHoursOnly) {
			// If showing only waking hours (6am to midnight = 18 hours)
			if (hours < 6) {
				// Before 6am, position at the top
				currentTimePosition = '0px';
			} else {
				// Position relative to 6am
				const wakeMinutes = totalMinutes - 6 * 60;
				const position = (wakeMinutes / (18 * 60)) * (hourHeight * 18 * resolution);
				currentTimePosition = `${position}px`;
			}
		} else {
			// For 24 hour mode
			const position = (totalMinutes / (24 * 60)) * (hourHeight * 24 * resolution);
			currentTimePosition = `${position}px`;
		}
	}

	onMount(() => {
		updateCurrentTimePosition();
		timeInterval = setInterval(updateCurrentTimePosition, 60000); // Update every minute
	});

	onDestroy(() => {
		clearInterval(timeInterval);
	});

	// Update position when resolution or wakingHoursOnly changes
	$: if (resolution !== undefined || wakingHoursOnly !== undefined) {
		updateCurrentTimePosition();
	}
</script>

<Input bind:resolution bind:wakingHoursOnly bind:todayDate showCalControls />
<section>
	<div class="current-time-indicator" style="top: {currentTimePosition};"></div>
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
		position: absolute;
		width: 100%;
		height: 2px;
		background-color: red;
		z-index: 10;
		pointer-events: none;
	}
</style>
