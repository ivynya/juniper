<script lang="ts">
	import { Clock, ChevronLeft, ChevronRight, MoonStar, Timer } from 'lucide-svelte';
	import { entries, formatHour } from '$lib/app';

	export let resolution: number = 2;
	export let wakingHoursOnly: boolean = false;
	export let showCalControls: boolean = false;

	let active = false;
	$: today = $entries.map((e) => e.duration).reduce((a, b) => a + b, 0);

	function cycleResolution() {
		resolution = (resolution % 4) * 2 || 1;
	}
</script>

<form class="entry" class:active>
	<input
		type="text"
		placeholder="What are you working on?"
		on:focus={() => (active = true)}
		on:blur={() => (active = false)}
	/>
	<select name="" id="">
		<option value="a">EEC 100A</option>
		<option value="a">EEC 018</option>
		<option value="a">Cmongus</option>
	</select>
	<select name="" id="">
		<option value="a">UC Davis</option>
		<option value="a">Bevel Home</option>
	</select>
	<button><Timer size="16px" /></button>
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
			<MoonStar size="18px" color={wakingHoursOnly ? '#f5fff1aa' : '#135'} />
			<input type="checkbox" id="waking-hours" hidden bind:checked={wakingHoursOnly} />
		</label>
		<span>
			<span>January 1st, 2018</span>
			<ChevronLeft size="18px" />
			<ChevronRight size="18px" />
		</span>
	{:else}
		<span>
			<span>January 1st, 2018</span>
		</span>
	{/if}
</section>

<style lang="scss">
	.entry {
		border: 1.5px dotted #147;
		border-radius: 20px;
		display: flex;
		align-items: center;

		&.active {
			border: 1.5px dotted #269;
		}

		input {
			background: #011627;
			border: none;
			border-top-left-radius: 20px;
			border-bottom-left-radius: 20px;
			box-sizing: border-box;
			color: #f5fff1;
			font-family: inherit;
			font-size: 0.7rem;
			margin: 0;
			padding: 0.35rem 0;
			padding-left: 15px;
			width: 100%;
			outline: none;

			&::placeholder {
				color: #567;
			}
		}

		select {
			appearance: none;
			background: none;
			border: none;
			border-left: 1.5px dotted #147;
			border-radius: 0;
			color: #567;
			cursor: pointer;
			font-family: inherit;
			font-size: 0.7rem;
			margin: -1px 0;
			padding: 0.35rem 0.5rem;
			outline: none;
			width: 100%;
			max-width: 50px;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}

		select:first-of-type {
			color: #0af;
			max-width: 75px;
		}

		button {
			background: transparent;
			border: none;
			border-left: 1.5px dotted #147;
			border-radius: 20px;
			border-bottom-left-radius: 0;
			border-top-left-radius: 0;
			color: #567;
			cursor: pointer;
			display: grid;
			place-items: center;
			width: 3rem;
			padding: 0.35rem;
			padding-right: 0.5rem;

			&:hover {
				color: #f5fff1;
			}
		}
	}

	.opts {
		background-color: #011627;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		height: 25px;
		margin-top: 0.55rem;
		margin-bottom: 0.25rem;
		padding-bottom: 0.5rem;
		position: sticky;
		top: 0;
		z-index: 5;

		.spacer {
			flex: 1;
		}

		span {
			color: #f5fff1aa;
			display: flex;
			align-items: center;
			gap: 0.5rem;
			font-size: 0.7rem;
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
			color: #f5fff1aa;
			cursor: pointer;
			font-family: inherit;
			font-size: 0.8rem;
			margin: 0;
			padding: 0;
		}
	}
</style>
