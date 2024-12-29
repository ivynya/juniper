<script lang="ts">
</script>

<div class="picker">
	<div class="hour">
		{#each Array(48) as _, i}
			<span>{i.toString().padStart(2, '0')}</span>
		{/each}
	</div>
	:
	<div class="minute">
		{#each Array(60) as _, i}
			<span>{i.toString().padStart(2, '0')}</span>
		{/each}
	</div>
</div>

<style lang="scss">
	.picker {
		color: var(--b3);
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 1rem;
		position: relative;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 15px;
			pointer-events: none;
		}

		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 15px;
			pointer-events: none;
		}
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
			line-height: 1;
			scroll-snap-align: center;
		}
		> span:first-of-type {
			margin-top: 0.25rem;
		}
		> span:last-of-type {
			margin-bottom: 0.25rem;
		}
	}
</style>
