<script lang="ts">
</script>

<div class="picker">
	<div class="hour">
		{#each Array(48) as _, i}
			<span>Dec {i.toString().padStart(2, '0')}</span>
		{/each}
	</div>
</div>

<style lang="scss">
	.picker {
		color: var(--b2);
		display: flex;
		align-items: center;
		font-size: 1rem;
		position: relative;
	}

	.hour {
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
