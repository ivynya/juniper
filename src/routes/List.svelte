<script lang="ts">
	import { entries } from '$lib/app';
	import Input from './Input.svelte';
	import ListEntry from './ListEntry.svelte';
	import ListGroup from './ListGroup.svelte';
</script>

<Input />
<ListGroup>
	{#each $entries as entry}
		<ListEntry {entry} />
	{/each}
</ListGroup>

<style lang="scss">
</style>
