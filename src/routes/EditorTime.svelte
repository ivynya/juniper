<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		val: number;
		inv: number;
		upd: (time: number) => void;
	}
	let { val, inv, upd }: Props = $props();

	let hrEl: HTMLElement;
	let minEl: HTMLElement;
	let amEl: HTMLElement;
	let hr: number = $state(0);
	let min: number = $state(0);
	let pm: boolean = $state(false);

	let invBase = $derived.by(() => new Date(Math.abs(inv)).setHours(0, 0, 0, 0));
	let invTime = $derived.by(() => Math.abs(inv) - invBase);
	let invDir = $derived(inv > 0 ? 1 : -1);
	let invHr = $derived.by(() => invDir * Math.floor(invTime / (60 * 60 * 1000)));
	let vlt = $derived(invDir === -1 ? hr < Math.abs(invHr) : hr > Math.abs(invHr));

	let time: number = $state(0);
	const base = $derived(new Date(val).setHours(0, 0, 0, 0));

	function updTime() {
		time = hr * 60 * 60 * 1000 + min * 60 * 1000;
		upd(base + time);
	}

	function hourToTime(hour: number) {
		return hour % 12 || 12;
	}

	function tInv(v: number, c: number): boolean {
		const ca = Math.abs(c);
		return c / ca === -1 ? v < ca : v > ca;
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
		<span class="hd">--</span>
		{#each Array(24) as _, i}
			<span class:hl={hr === i} class:wn={tInv(i, invHr)}>
				{hourToTime(i).toString().padStart(2, '0')}
			</span>
		{/each}
		<span class="hd">--</span>
	</div>
	<b class:vlt>:</b>
	<div class="scroll" bind:this={minEl}>
		<span class="hd">--</span>
		{#each Array(60) as _, i}
			<span class:hl={min === i} class:wn={tInv(hr, invHr)}>
				{i.toString().padStart(2, '0')}
			</span>
		{/each}
		<span class="hd">--</span>
	</div>
	<br />
	<div class="scroll no-input" bind:this={amEl}>
		<span class="hd">--</span>
		<span class:hl={!pm}>AM</span>
		<span class:hl={pm}>PM</span>
		<span class="hd">--</span>
	</div>
</div>

<style lang="scss">
	.picker {
		color: var(--b3);
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

	.vlt {
		animation: warn 1.5s infinite;
		color: #fa0;

		@keyframes warn {
			0%,
			49% {
				color: #fa0;
			}
			50%,
			100% {
				color: var(--b2);
			}
		}
	}

	.scroll {
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

			&.hd {
				color: var(--b2);
			}
			&.hl {
				color: var(--b4);
			}
			&.wn {
				color: var(--b2);
			}
			&.wn.hl {
				color: var(--b2);
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
