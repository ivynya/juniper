<script lang="ts">
	import { clients, entries, formatHour } from '$lib/app';
	import { getDataPeriod } from '$lib/metric';
	import ListEntry from './ListEntry.svelte';
	import ReportChart from './ReportChart.svelte';
	import Slider from './Slider.svelte';

	let projects = $clients.map((c) => c.projects).flat();

	let by: 'project' | 'task' = $state('project');
	let start: string = $state(
		new Date(new Date(new Date().getTime() - 36e5 * 24 * 7).setHours(0, 0, 0, 0))
			.toISOString()
			.slice(0, 10)
	);
	let periods = $state(7);
	let divisor: 'month' | 'week' | 'day' = $state('day');
	let ex: string = $state(''); // filter property
	let exs: string[] = $derived(ex.split(','));

	let from = $derived(new Date(start).getTime() + new Date().getTimezoneOffset() * 6e4);
	let computed = $derived(getDataPeriod($entries, projects, from, divisor, periods + 1, by, exs));
</script>

<section>
	<h3>
		<span>{divisor}:{by} Graph</span>
		<span><small>{computed.entries.length}E</small> / {formatHour(computed.time)}</span>
	</h3>

	<div class="chart">
		{#if computed.entries.length > 0}
			<ReportChart data={computed.data} />
		{:else}
			<p>No entries</p>
		{/if}
	</div>

	<div class="controls">
		<Slider options={['month', 'week', 'day']} bind:selected={divisor} />
		<Slider options={['project', 'task']} bind:selected={by} />
	</div>
	<div class="controls">
		<input type="date" bind:value={start} />
		<input type="number" bind:value={periods} />
		<input type="text" bind:value={ex} />
	</div>

	{#each computed.entries as entry, j}
		<ListEntry {entry} />
	{/each}
</section>

<style lang="scss">
	section {
		border: 1px dotted var(--b2);
		border-radius: 15px;
		padding: 0.5rem;

		h3 {
			color: var(--b4);
			display: flex;
			justify-content: space-between;
			font-size: 1rem;
			margin: 0 0.5rem;
			margin-bottom: 1rem;
			text-transform: uppercase;

			:last-child {
				color: var(--a2);
			}
		}

		.chart {
			margin: 0.25rem 0.5rem;
			margin-bottom: 1.25rem;
		}

		.controls {
			display: flex;
			align-items: center;
			gap: 1rem;
			margin: 0 0.5rem;
			margin-bottom: 1rem;
		}

		input {
			background-color: transparent;
			border: 1px dotted var(--b2);
			border-radius: 15px;
			color: var(--b3);
			font-family: inherit;
			font-size: 0.8rem;
			flex: 1 1;
			min-width: 50px;
			padding: 0.25rem 0.5rem;
		}
	}
</style>
