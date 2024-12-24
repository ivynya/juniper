<script lang="ts">
	import { Clock, ChevronLeft, ChevronRight, MoonStar, Timer } from 'lucide-svelte';
	import { entries, formatHour } from '$lib/app';

	export let resolution: number = 2;
	export let wakingHoursOnly: boolean = false;
	export let showCalControls: boolean = false;
	export let todayDate: string = new Date().toDateString();

	let todayOffset: number = 0;
	let active = false;
	$: total = $entries.map((e) => e.duration).reduce((a, b) => a + b, 0);

	function cycleResolution() {
		resolution = (resolution % 4) * 2 || 1;
	}

	function recalculateToday(delta: number) {
		todayOffset += delta;
		const today = new Date();
		today.setDate(today.getDate() + todayOffset);
		todayDate = today.toDateString();
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
	<button><Timer size="16px" /></button>
</form>
<section class="opts">
	<span>
		<Clock size="18px" />
		{formatHour(total)} today
	</span>
	<span class="spacer" />
	{#if showCalControls}
		<button class="resolution" on:click={cycleResolution}>
			{resolution}x
		</button>
		<label for="waking-hours">
			<MoonStar size="18px" color={wakingHoursOnly ? 'var(--b4)' : 'var(--b2)'} />
			<input type="checkbox" id="waking-hours" hidden bind:checked={wakingHoursOnly} />
		</label>
		<span>{todayDate}</span>
		<button on:click={() => recalculateToday(-1)}>
			<ChevronLeft size="18px" />
		</button>
		<button on:click={() => recalculateToday(1)}>
			<ChevronRight size="18px" />
		</button>
	{:else}
		<span>{todayDate}</span>
	{/if}
</section>

<style lang="scss">
	.entry {
		display: flex;
		align-items: center;

		&.active input {
			border: 1px dotted var(--b3);
		}

		input {
			background: transparent;
			border: none;
			border: 1px dotted var(--b2);
			border-top-left-radius: 20px;
			border-bottom-left-radius: 20px;
			box-sizing: border-box;
			color: inherit;
			font-family: inherit;
			font-size: 0.7rem;
			margin: 0;
			padding: 0.35rem 0;
			padding-left: 15px;
			width: 100%;
			outline: none;

			&::placeholder {
				color: var(--b2);
			}
		}

		select {
			appearance: none;
			background: none;
			border: 1px dotted var(--b2);
			border-left: none;
			border-radius: 0;
			border-top-right-radius: 20px;
			border-bottom-right-radius: 20px;
			color: var(--b2);
			cursor: pointer;
			font-family: inherit;
			font-size: 0.7rem;
			margin-right: 10px;
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
			border: 1px dotted var(--b2);
			border-radius: 20px;
			color: var(--b2);
			cursor: pointer;
			display: grid;
			place-items: center;
			width: 2.75rem;
			padding: 0.35rem;

			&:hover {
				border-color: var(--b3);
				color: var(--a2);
			}
		}
	}

	.opts {
		background-color: var(--b0);
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
			color: var(--b4);
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
			color: var(--b4);
			cursor: pointer;
			display: grid;
			place-items: center;
			font-family: inherit;
			font-size: 0.8rem;
			margin: 0;
			padding: 0;
		}
	}
</style>
