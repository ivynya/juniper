<script lang="ts">
	import { entries } from '$lib/app';
	import Input from './Input.svelte';
	import ListEntry from './ListEntry.svelte';
</script>

<Input />
{#each $entries as entry}
	<ListEntry {entry} />
{/each}

<style lang="scss">
</style>
