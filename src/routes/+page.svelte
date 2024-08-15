<script lang="ts">
	import Calendar from './Calendar.svelte';
	import Header from './Header.svelte';
	import List from './List.svelte';

	export let selected = 'List';
</script>

<Header bind:selected />
<section class="view">
	{#if selected === 'List'}
		<List />
	{:else if selected === 'Calendar'}
		<Calendar />
	{:else}
		<p>Report</p>
	{/if}
</section>

<style lang="scss">
	.view {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 1rem;
		padding: 0.5rem 2rem;
		padding-bottom: 2rem;
	}
</style>
