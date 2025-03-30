<script lang="ts">
	import Calendar from './Calendar.svelte';
	import Header from './Header.svelte';
	import Manage from './Manage.svelte';
	import List from './List.svelte';
	import Report from './Report.svelte';

	export let selected = 'List';
	const order = ['List', 'Calendar', 'Report'];

	function handleKeydown(event: KeyboardEvent) {
		// left and right arrow keys
		if (event.key === 'ArrowLeft')
			selected = order[Math.max(order.findIndex((o) => o === selected) - 1, 0)];
		if (event.key === 'ArrowRight')
			selected = order[Math.min(order.findIndex((o) => o === selected) + 1, order.length - 1)];
		if (!event.ctrlKey) return;
		if (event.key === 'l') selected = 'List';
		if (event.key === 'c') selected = 'Calendar';
		if (event.key === 'r') selected = 'Report';
		if (event.key === 'e') selected = 'Export';
	}
</script>

<svelte:window on:keydown={handleKeydown} />
<Header bind:selected />
<section class="view">
	{#if selected === 'List'}
		<List />
	{:else if selected === 'Calendar'}
		<Calendar />
	{:else if selected === 'Report'}
		<Report />
	{:else}
		<Manage />
	{/if}
</section>

<style lang="scss">
	.view {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 0.5rem;
		padding: 0.5rem 1.25rem;
		padding-bottom: 2rem;
	}
</style>
