<script lang="ts">
	import { clients } from '$lib/app';
	import { createEventDispatcher } from 'svelte';
	import { Check, Trash } from 'lucide-svelte';
	import type { Entry } from '$lib/schema';

	const dispatch = createEventDispatcher();

	export let entry: Entry;

	function save() {
		dispatch('save', entry);
	}
	function prevent(e: Event) {
		e.stopPropagation();
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="editor" on:click={prevent}>
	<h6><span>Entry Editor</span></h6>
	<label for="">Task</label>
	<input type="text" bind:value={entry.task} />
	<label for="">Client</label>
	<select id="" bind:value={entry.client}>
		{#each $clients as client}
			<option value={client.name}>{client.name}</option>
		{/each}
	</select>
	<label for="">Project</label>
	<select name="" id="">
		{#each $clients as client}
			{#each client.projects as project}
				<option value={project.name}>{project.name}</option>
			{/each}
		{/each}
	</select>

	<br />
	<div class="save">
		<button><Trash size="12px" />Bye</button>
		<button><Check size="12px" />Save</button>
	</div>
</div>

<style lang="scss">
	.editor {
		background: var(--b1);
		border: 1px solid var(--a1);
		border-radius: 0.25rem;
		box-sizing: border-box;
		box-shadow: 0 0 2rem 0 var(--b0);
		color: var(--a2);
		display: flex;
		flex-direction: column;

		width: 300px;
		padding: 0 1rem;
		padding-bottom: 1rem;

		position: absolute;
		right: 5%;
		top: 50%;
		z-index: 3;

		h6 {
			background: radial-gradient(circle, var(--a1) 1px, transparent 1px);
			background-size: 3px 3px;
			color: var(--a1);
			font-size: 0.7rem;
			margin: 0;
			margin-top: 0.75rem;
			padding: 0;
			width: 100%;
			text-transform: uppercase;

			span {
				background: var(--b1);
				padding-right: 0.25rem;
			}
		}

		label {
			color: var(--b3);
			font-size: 0.7rem;
			font-weight: bold;
			text-transform: uppercase;
			margin-top: 0.5rem;
			margin-bottom: 0.1rem;
		}

		input,
		select {
			appearance: none;
			background: transparent;
			border: none;
			border-bottom: 1px dotted var(--b3);
			border-radius: 0;
			box-sizing: border-box;
			color: var(--a2);
			font-family: inherit;
			font-size: 0.7rem;
			outline: none;
			padding: 0.125rem 0;
			width: 100%;
		}

		.save {
			display: flex;
			justify-content: space-between;

			button {
				background: transparent;
				border: 1px dotted var(--b3);
				border-radius: 0.25rem;
				color: var(--b3);
				cursor: pointer;
				display: flex;
				align-items: center;
				gap: 0.25rem;
				font-family: inherit;
				font-size: 0.7rem;
				padding: 0.125rem 0.25rem;
				text-transform: uppercase;
				transition-duration: 0.2s;

				&:hover {
					background: var(--b3);
					color: var(--a2);
				}
			}

			button:first-of-type {
				border-color: #fa0;
				color: #fa0;

				&:hover {
					background: #fa0;
					color: var(--b1);
				}
			}
		}
	}
</style>
