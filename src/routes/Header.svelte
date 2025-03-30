<script lang="ts">
	import Slider from './Slider.svelte';

	export let selected: string;
</script>

<header>
	<h1><span>FAUNA</span></h1>
	<Slider options={['List', 'Calendar', 'Report']} bind:selected />
</header>

<style lang="scss">
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 1.25rem;
		padding-top: 0.35rem;

		h1 {
			display: flex;
			align-items: center;
			font-size: 1.5em;
			flex: 10 0;
			margin: 0;
		}
	}
</style>
