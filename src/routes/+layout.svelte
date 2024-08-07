<script lang="ts">
</script>

<div id="app">
	<slot></slot>
</div>

<style lang="scss">
	:global(body) {
		background: #011627;
		color: #f5fff1;
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
