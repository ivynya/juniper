<script lang="ts">
	import { Clock, Calendar, ChevronLeft, ChevronRight, MoonStar, Check } from 'lucide-svelte';
	import { entries, formatHour } from '$lib/app';

	export let resolution: number = 2;
	export let wakingHoursOnly: boolean = false;
	export let showCalControls: boolean = false;

	$: today = $entries.map((e) => e.duration).reduce((a, b) => a + b, 0);

	function cycleResolution() {
		resolution = (resolution % 4) * 2 || 1;
	}
</script>

<form class="entry">
	<input type="text" placeholder="Time Entry" />
	<button><Check size="18px" /></button>
</form>
<section class="opts">
	<span>
		<Clock size="18px" />
		{formatHour(today)} today
	</span>
	<span class="spacer" />
	{#if showCalControls}
		<button class="resolution" on:click={cycleResolution}>
			{resolution}x
		</button>
		<label for="waking-hours">
			<MoonStar size="18px" color={wakingHoursOnly ? '#345' : '#134'} />
			<input type="checkbox" id="waking-hours" hidden bind:checked={wakingHoursOnly} />
		</label>
	{/if}
	{#if showCalControls}
		<span>
			<Calendar size="18px" />
			<br />
			<span>January 1st, 2018</span>
			<ChevronLeft size="18px" />
			<ChevronRight size="18px" />
		</span>
	{:else}
		<span>
			<Calendar size="18px" />
			<span>January 1st, 2018</span>
		</span>
	{/if}
</section>

<style lang="scss">
	.entry {
		display: flex;
		align-items: center;

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

		button {
			background: transparent;
			border: #234 1px solid;
			border-radius: 0.25rem;
			color: #567;
			cursor: pointer;
			width: 1.9rem;
			padding: 0.25rem;
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
