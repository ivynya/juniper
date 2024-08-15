<script lang="ts">
	import { formatHour } from '$lib/app';
	import type { Entry } from '$lib/schema';

	export let entry: Entry;
</script>

<article class="entry">
	<div>
		<span>{entry.name}</span>
		<div>
			<span>{entry.project}</span>
			•
			<span>{entry.client}</span>
		</div>
	</div>
	<div>
		<span>{formatHour(entry.duration)}</span>
	</div>
</article>

<style lang="scss">
	.entry {
		border-top: 1px solid #234;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		height: 4rem;
		padding: 0.75rem 1rem;
		width: 100%;
	}
</style>
