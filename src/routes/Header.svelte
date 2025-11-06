<script lang="ts">
	import { onMount } from 'svelte';
	import Slider from './Slider.svelte';

	let { selected = $bindable() } = $props();

	let hostname = $state('');
	onMount(() => (hostname = window.location.hostname));
</script>

<header>
	<h1>
		<span>JUNIPER</span>
		{#if hostname === 'localhost'}
			<span class="tag">DEV</span>
		{/if}
	</h1>
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
			font-size: 1.5rem;
			flex: 10 0;
			margin: 0;

			.tag {
				background-color: var(--b2);
				border-radius: 5px;
				color: var(--a1);
				font-size: 0.7rem;
				align-self: flex-start;
				margin-left: 0.25rem;
				margin-top: 0.5rem;
				padding: 0 0.25rem;
			}
		}
	}
</style>
