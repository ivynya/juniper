<script lang="ts">
	import { Clock, Calendar, ChevronLeft, ChevronRight, MoonStar } from 'lucide-svelte';

	let wakingHoursOnly = false;

	$: hours = wakingHoursOnly ? Array(18) : Array(24);

	function adjustHour(hour: number): number {
		return hour + 24 - hours.length;
	}
	function formatHour(hour: number): string {
		return hour < 10 ? `0${hour}:00` : `${hour}:00`;
	}
</script>

<section class="opts">
	<span>
		<Clock size="18px" />
		03:45 today
	</span>
	<span class="spacer" />
	<label for="waking-hours">
		<MoonStar size="18px" color={wakingHoursOnly ? '#345' : '#135'} />
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
{#each hours.reverse() as _, i (i)}
	<div class:naptime={adjustHour(i) < 6 || adjustHour(i) == 23}>
		<span>{formatHour(adjustHour(i))}</span>
		<hr />
	</div>
{/each}

<style lang="scss">
	.opts {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;

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
	}

	div {
		display: flex;
		gap: 0.5rem;
		padding-bottom: 0.25rem;

		&.naptime span,
		&.naptime hr {
			border-color: #135;
			color: #135;
		}

		span {
			color: #345;
			font-size: 0.8rem;
		}

		hr {
			border: none;
			border-top: 1px solid #234;
			flex: 1;
			margin: auto 0;
		}
	}
</style>
