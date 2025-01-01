<script lang="ts">
	import { onMount } from 'svelte';

	let dateEl: HTMLElement;
	export let date = 0;

	onMount(() => {
		dateEl.scrollTo({
			top: date * 20 - 16,
			behavior: 'instant'
		});

		dateEl.addEventListener('scroll', () => {
			const index = Math.round(dateEl.scrollTop / 20);
			date = index;
		});
	});
</script>

<div class="picker">
	<div class="date" bind:this={dateEl}>
		<span>--</span>
		{#each Array(31) as _, i}
			<span class:hl={date === i}>Dec {(i + 1).toString().padStart(2, '0')}</span>
		{/each}
		<span>--</span>
	</div>
</div>

<style lang="scss">
	.picker {
		color: var(--b2);
		display: flex;
		align-items: center;
		line-height: 1;
		font-size: 1rem;
		position: relative;
	}

	.date {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		max-height: 4rem;
		overflow: auto;
		scroll-snap-type: y mandatory;

		&::-webkit-scrollbar {
			display: none;
		}
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */

		> span {
			max-height: 16px;
			scroll-snap-align: center;

			&.hl {
				color: var(--b3);
			}
		}
		> span:first-of-type {
			margin-top: 0.25rem;
		}
		> span:last-of-type {
			margin-bottom: 0.25rem;
		}
	}
</style>
