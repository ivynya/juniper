<script>
	import Entry from './Entry.svelte';
</script>

<section class="list">
	{#each Array(20) as _}
		<Entry />
	{/each}
</section>

<style lang="scss">
	.list {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 1rem;
		padding: 2rem;
	}
</style>
