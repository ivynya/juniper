<script lang="ts">
</script>

<div id="app">
	<slot></slot>
</div>

<style lang="scss">
	:global(:root) {
		--a1: #f2ecca; // fauna ivory
		--a2: #fcfbf3;
		--a3: #ffffff;

		--b0: #0d1926; // (HSL1)-5L
		--b1: #132539; // fauna blue
		--b2: #3d5b6b;
		--b3: #678e98;
		--b4: #c2d2d6; // (HSL3)+30L
	}

	:global(body) {
		background: var(--b0);
		color: var(--a2);
		font-family: 'cartograph-cf', serif;

		height: 100vh;
		margin: 0;
		padding: 0;
	}

	#app {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
</style>
