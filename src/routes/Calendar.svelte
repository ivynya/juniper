<script lang="ts">
	import { Clock, Calendar, ChevronLeft, ChevronRight, MoonStar } from 'lucide-svelte';
	import { entries, formatHour } from '$lib/app';
	import CalendarHour from './CalendarHour.svelte';

	let resolution = 2;
	let wakingHoursOnly = false;

	$: hours = wakingHoursOnly ? Array(18 * resolution) : Array(24 * resolution);
	$: today = $entries.map((e) => e.duration).reduce((a, b) => a + b, 0);

	let isDragging = false;
	let timeA = -1;
	let timeB = -1;
	let timeP = -1;

	function cycleResolution() {
		resolution = (resolution % 4) * 2 || 1;
	}
	function adjustHour(hour: number): number {
		return hour + 24 * resolution - hours.length;
	}
</script>

<section class="entry">
	<input type="text" placeholder="Time Entry" />
</section>
<section class="opts">
	<span>
		<Clock size="18px" />
		{formatHour(today)} today
	</span>
	<span class="spacer" />
	<button class="resolution" on:click={cycleResolution}>
		{resolution}x
	</button>
	<label for="waking-hours">
		<MoonStar size="18px" color={wakingHoursOnly ? '#345' : '#134'} />
		<input type="checkbox" id="waking-hours" hidden bind:checked={wakingHoursOnly} />
	</label>
	<span>
		<Calendar size="18px" />
		<br />
		<span>January 1st, 2018</span>
		<ChevronLeft size="18px" />
		<ChevronRight size="18px" />
	</span>
</section>
<section>
	{#each hours.reverse() as _, i (i)}
		<CalendarHour
			bind:isDragging
			bind:timeA
			bind:timeB
			bind:timeP
			bind:resolution
			i={adjustHour(i)}
		/>
	{/each}
</section>

<style lang="scss">
	.entry {
		input {
			background: #011627;
			border: none;
			border-radius: 0.125rem;
			box-sizing: border-box;
			color: #f5fff1;
			font-family: inherit;
			font-size: 0.8rem;
			margin: 0;
			padding: 0.25rem 0;
			width: 100%;
			outline: none;

			&::placeholder {
				color: #567;
			}
		}
	}

	.opts {
		background-color: #011627;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-bottom: 0.5rem;
		position: sticky;
		top: 0;
		z-index: 5;

		.spacer {
			flex: 1;
		}

		span {
			color: #567;
			display: flex;
			align-items: center;
			gap: 0.5rem;
			font-size: 0.8rem;
		}

		label {
			display: flex;
			align-items: center;
			padding: 2px;
		}

		button {
			background: transparent;
			border: none;
			border-radius: 0.25rem;
			color: #134;
			cursor: pointer;
			font-family: inherit;
			font-size: 0.8rem;
			margin: 0;
			padding: 0;
		}
	}
</style>
