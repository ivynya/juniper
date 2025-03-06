<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		val: number;
		upd: (time: number) => void;
	}
	let { val, upd }: Props = $props();

	let hrEl: HTMLElement;
	let minEl: HTMLElement;
	let amEl: HTMLElement;
	let hr: number = $state(0);
	let min: number = $state(0);
	let pm: boolean = $state(false);

	let time: number = $state(0);
	const base = $derived(new Date(val).setHours(0, 0, 0, 0));

	let testIndex = $state(0);

	function updTime() {
		time = hr * 60 * 60 * 1000 + min * 60 * 1000;
		upd(base + time);
	}

	function hourToTime(hour: number) {
		return hour % 12 || 12;
	}

	onMount(() => {
		const base = new Date(val).setHours(0, 0, 0, 0);
		time = val - base;
		hr = Math.floor(time / (60 * 60 * 1000));
		min = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000));
		pm = hr >= 12;

		hrEl.scrollTo({
			top: hr * 20,
			behavior: 'instant'
		});
		minEl.scrollTo({
			top: min * 20,
			behavior: 'instant'
		});
		amEl.scrollTo({
			top: pm ? 20 : 0,
			behavior: 'instant'
		});

		hrEl.addEventListener('scroll', () => {
			const index = Math.round(hrEl.scrollTop / 20);
			testIndex = index;
			hr = Math.max(Math.min(index, 23), 0);
			pm = hr >= 12;
			amEl.scrollTo({
				top: pm ? 20 : 0,
				behavior: 'instant'
			});
			updTime();
		});
		minEl.addEventListener('scroll', () => {
			const index = Math.round(minEl.scrollTop / 20);
			min = Math.max(Math.min(index, 59), 0);
			updTime();
		});
	});
</script>

<div class="picker">
	<div class="scroll" bind:this={hrEl}>
		<span>--</span>
		{#each Array(24) as _, i}
			<span class:hl={hr === i}>{hourToTime(i).toString().padStart(2, '0')}</span>
		{/each}
		<span>--</span>
	</div>
	<b>:</b>
	<div class="scroll" bind:this={minEl}>
		<span>--</span>
		{#each Array(60) as _, i}
			<span class:hl={min === i}>{i.toString().padStart(2, '0')}</span>
		{/each}
		<span>--</span>
	</div>
	<br />
	<div class="scroll no-input" bind:this={amEl}>
		<span>--</span>
		<span class:hl={!pm}>AM</span>
		<span class:hl={pm}>PM</span>
		<span>--</span>
	</div>
</div>
{base}
{base + time === val}
{val}
{time}
{min}
{hr * 60 * 60 * 1000}
{testIndex}

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

	.scroll {
		border: 1px solid var(--b2);
		border-radius: 5px;
		padding: 0 0.25rem;
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

		&.no-input {
			border: none;
			padding: 0;
			pointer-events: none;
		}
	}
</style>
