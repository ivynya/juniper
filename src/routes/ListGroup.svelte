<script lang="ts">
	import { formatHour } from '$lib/app';

	export let date: string;
	export let hours: number;
</script>

<section class="group">
	<h6><span>{date}</span><span>{formatHour(hours)}</span></h6>
	<slot></slot>
</section>

<style lang="scss">
	.group {
		background-color: var(--b1);
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		width: 100%;

		h6 {
			color: var(--b2);
			display: flex;
			justify-content: space-between;
			font-size: 0.8rem;
			margin: 0;
			padding: 0.5rem 1rem;
		}
	}
</style>
