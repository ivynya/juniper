<script lang="ts">
	import CalendarHour from './CalendarHour.svelte';
	import Input from './Input.svelte';

	let resolution = 2;
	let wakingHoursOnly = false;

	$: hours = wakingHoursOnly ? Array(18 * resolution) : Array(24 * resolution);

	let isDragging = false;
	let timeA = -1;
	let timeB = -1;
	let timeP = -1;

	function adjustHour(hour: number): number {
		return hour + 24 * resolution - hours.length;
	}
</script>

<Input bind:resolution bind:wakingHoursOnly showCalControls />
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
</style>
