<script lang="ts">
	import EditorTime from './EditorTime.svelte';
	import { clients, tz, ut, formatHour } from '$lib/app';
	import { createEventDispatcher } from 'svelte';
	import { scale } from 'svelte/transition';
	import { ArrowRight, Check, Circle, Kanban, Layers, Tag, Trash } from 'lucide-svelte';
	import type { Entry } from '$lib/schema';

	const dispatch = createEventDispatcher();

	export let entry: Entry;
	export let x: number;
	export let y: number;

	$: pos = `top: ${y + 1}%; left: ${x}%;`;
	let trans = { start: 0.95, duration: 200 };

	$: client = $clients.find((c) => c.name === entry.client) || {
		color: 'var(--b3)',
		name: '',
		projects: []
	};
	$: project = client.projects.find((p) => p.name === entry.project) || {
		color: 'var(--b3)',
		name: ''
	};

	function updStart(e: CustomEvent) {
		const base = new Date(entry.start).setHours(0, 0, 0, 0);
		entry.start = base + e.detail.time;
		entry.duration = Math.abs(entry.end - entry.start);
	}
	function updEnd(e: CustomEvent) {
		const base = new Date(entry.end).setHours(0, 0, 0, 0);
		entry.end = base + e.detail.time;
		entry.duration = Math.abs(entry.end - entry.start);
	}

	function del(e: Event) {
		e.preventDefault();
		dispatch('delete');
	}
	function upd(e: Event) {
		e.preventDefault();
		entry.duration = Math.abs(entry.end - entry.start);
		dispatch('update');
	}
	function prevent(e: Event) {
		e.stopPropagation();
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<form class="editor" style={pos} on:click={prevent} transition:scale={trans} on:submit={upd}>
	<h6><span>Entry Editor</span></h6>
	<div class="clientProject">
		<label for="editor-task">Task</label>
		<Circle size="10px" />
		<input id="editor-task" type="text" bind:value={entry.task} />
		<label for="editor-client">Client</label>
		<Kanban size="10px" color={client.color} />
		<select id="editor-client" bind:value={entry.client} style="color: {client.color}">
			{#each $clients as client}
				<option value={client.name}>{client.name}</option>
			{/each}
		</select>
		<label for="editor-project">Project</label>
		<Layers size="10px" color={project.color} />
		<select id="editor-project" bind:value={entry.project} style="color: {project.color}">
			{#each client.projects as project}
				<option value={project.name}>{project.name}</option>
			{/each}
		</select>
	</div>
	<div class="startEnd">
		<EditorTime time={entry.start} on:upd={updStart} />
		<ArrowRight size="20px" color="var(--a1)" />
		<EditorTime time={entry.end} on:upd={updEnd} />
	</div>
	<div class="tags">
		<label for="editor-tags">Tags</label>
		<Tag size="10px" color="var(--a1)" />
		<input id="editor-tags" type="text" bind:value={entry.tags} />
	</div>
	<br />
	<div class="save">
		<button on:click={del} type="button"><Trash size="12px" />Bye</button>
		<button type="submit"><Check size="12px" />Save</button>
	</div>
</form>

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
		z-index: 5;

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
			padding: 0;
			width: 100%;
		}

		.clientProject,
		.tags {
			display: grid;
			grid-template-columns: 70px 15px 1fr;
			align-items: center;
			row-gap: 0.75rem;
			margin: 0.75rem 0;
		}

		.startEnd {
			display: flex;
			justify-content: space-between;
			align-items: center;
			column-gap: 0.75rem;
			margin: 0.25rem 0;
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
