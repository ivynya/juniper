<script lang="ts">
	import { tz, ut } from '$lib/app';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	let hrEl: HTMLElement;
	let minEl: HTMLElement;
	let hr: number = 0;
	let min: number = 0;
	export let time: number = 0;

	function updTime() {
		time = hr + min / 60;
		dispatch('upd', { time });
	}

	onMount(() => {
		hr = Math.floor(time);
		min = (time % 1) * 60;

		hrEl.scrollTo({
			top: hr * 20,
			behavior: 'instant'
		});
		minEl.scrollTo({
			top: min * 20,
			behavior: 'instant'
		});

		hrEl.addEventListener('scroll', () => {
			const index = Math.round(hrEl.scrollTop / 20);
			hr = index;
			updTime();
		});
		minEl.addEventListener('scroll', () => {
			const index = Math.round(minEl.scrollTop / 20);
			min = index;
			updTime();
		});
	});
</script>

<div class="picker">
	<div class="hour" bind:this={hrEl}>
		<span>--</span>
		{#each Array(24) as _, i}
			<span class:hl={hr === i}>{i.toString().padStart(2, '0')}</span>
		{/each}
		<span>--</span>
	</div>
	<b>:</b>
	<div class="minute" bind:this={minEl}>
		<span>--</span>
		{#each Array(60) as _, i}
			<span class:hl={min === i}>{i.toString().padStart(2, '0')}</span>
		{/each}
		<span>--</span>
	</div>
</div>

<style lang="scss">
	.picker {
		color: var(--b2);
		display: flex;
		align-items: center;
		gap: 0.25rem;
		line-height: 1;
		font-size: 1rem;
		position: relative;
	}

	b {
		margin-bottom: 0.125rem;
	}

	.hour,
	.minute {
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
