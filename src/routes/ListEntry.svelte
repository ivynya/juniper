<script lang="ts">
	import type { Entry } from '$lib/schema';

	export let entry: Entry;
</script>

<article class="entry">
	<span>{entry.name}</span>
</article>

<style lang="scss">
	article {
		border-top: 1px solid #234;
		box-sizing: border-box;
		padding: 5px 10px;
		width: 100%;
	}
</style>
