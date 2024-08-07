<script lang="ts">
	export let options: string[];
	export let selected: string;
	$: active = options.findIndex((o) => o === selected);
	$: ratchet = 100 / options.length;
	$: leftness = active * 100;
</script>

<div class="slider">
	<span style="transform:translateX({leftness}%);width:{ratchet}%;" />
	<div class="options">
		{#each options as o, i}
			<button class:active={i === active} on:click={() => (selected = o)}>
				{o}
			</button>
		{/each}
	</div>
</div>

<style lang="scss">
	.slider {
		border: 1px solid #567;
		border-radius: 2px;
		transition-duration: 0.5s;
		height: 22px;
		padding: 5px 0;
		position: relative;
		z-index: 5;

		span {
			box-sizing: border-box;
			border: 2px solid;
			border-radius: 2px;
			transition-duration: 0.5s;
			display: block;
			height: 35px;
			margin: auto 0;

			position: absolute;
			top: -30px;
			bottom: -30px;
			z-index: -1;
		}

		.options {
			display: flex;
			align-items: center;
			height: 100%;
		}
		.options button {
			background-color: transparent;
			border: none;
			color: inherit;
			cursor: pointer;
			display: grid;
			place-items: center;
			flex: 1 1;

			padding: auto 0;
			margin: auto 0;
			min-height: 100%;
			min-width: 80px;

			line-height: 1;
			font-family: inherit;
			font-size: 0.6rem;
			letter-spacing: 1px;
			text-align: center;
			text-transform: uppercase;
			transition-duration: 0.2s;

			&:not(.active) {
				opacity: 0.5;
			}
		}
	}
</style>
