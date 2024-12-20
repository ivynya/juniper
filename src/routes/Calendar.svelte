<script lang="ts">
	import CalendarHour from './CalendarHour.svelte';
	import Input from './Input.svelte';
	import { entries } from '$lib/app';

	let resolution = 2;
	let wakingHoursOnly = false;
	let todayDate: string;

	$: hours = wakingHoursOnly ? Array(18 * resolution) : Array(24 * resolution);
	$: today = $entries.filter((e) => new Date(e.z_start).toDateString() === todayDate);

	let isDragging = false;
	let timeA = -1;
	let timeB = -1;
	let timeP = -1;

	function adjustHour(hour: number): number {
		return hour + 24 * resolution - hours.length;
	}
</script>

<Input bind:resolution bind:wakingHoursOnly bind:todayDate showCalControls />
<section>
	{#each hours.reverse() as _, i (i)}
		<CalendarHour
			bind:isDragging
			bind:timeA
			bind:timeB
			bind:timeP
			bind:resolution
			bind:entries={today}
			i={adjustHour(i)}
		/>
	{/each}
</section>

<style lang="scss">
</style>
