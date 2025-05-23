<script lang="ts">
	export let options: string[];
	export let selected: string;
	$: active = Math.abs(options.findIndex((o) => o === selected));
	$: ratchet = 100 / options.length;
	$: leftness = active * 100;
</script>

<div class="slider">
	<span style="transform:translateX({leftness}%);width:{ratchet}%;"></span>
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
		border: 1px dotted var(--b2);
		border-radius: 15px;
		transition-duration: 0.3s;
		height: 18px;
		flex: 1 1;
		padding: 5px 0;
		position: relative;
		z-index: 5;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;

		span {
			box-sizing: border-box;
			border: 2px solid;
			border-radius: 15px;
			transition-duration: 0.3s;
			display: block;
			height: 30px;
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
				color: var(--b3);
			}
		}
	}
</style>
