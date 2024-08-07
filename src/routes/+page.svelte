<script lang="ts">
	import Calendar from './Calendar.svelte';
	import Entry from './Entry.svelte';
	import Header from './Header.svelte';

	export let selected = 'List';
</script>

<Header bind:selected />
<section class="view">
	{#if selected === 'List'}
		{#each Array(20) as _}
			<Entry />
		{/each}
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
