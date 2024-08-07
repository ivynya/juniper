<script lang="ts">
	import Viewer from './Viewer.svelte';

	export let selected: string;
</script>

<header>
	<h1>FAUNA</h1>
	<Viewer options={['Report', 'List', 'Calendar']} bind:selected />
</header>

<style lang="scss">
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 2rem;
		padding-top: 0.35rem;

		h1 {
			display: flex;
			align-items: center;
			font-size: 1.5em;
			margin: 0;
		}
	}
</style>
