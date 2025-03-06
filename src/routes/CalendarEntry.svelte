<script lang="ts">
	import Editor from './Editor.svelte';
	import { createEventDispatcher } from 'svelte';
	import { clients, entries, formatHour } from '$lib/app';
	import type { Entry } from '$lib/schema';

	const dispatch = createEventDispatcher();

	export let editing: boolean;
	export let entry: Entry;
	export let height: number;
	export let offset: number;

	let entryCopy: Entry = entry;

	$: client = $clients.find((c) => c.name === entry.client) || { color: 'var(--b3)', projects: [] };
	$: project = client.projects.find((p) => p.name === entry.project) || { color: 'var(--b3)' };
	$: _grid = `grid-column: ${entry.__column__ + 1}; grid-row: 1 / 1`;
	$: _height = `height: ${height}px`;
	$: _offset = `margin-top: ${offset}px`;
	$: _color = `background-color: ${project.color}`;

	let editBtn: HTMLButtonElement;
	let edit = false;
	let editY = 0;
	let editX = 0;
	function openEditor(e: MouseEvent) {
		e.preventDefault();
		e.stopImmediatePropagation();
		entryCopy = { ...entry };
		edit = !edit;
		const rect = editBtn.getBoundingClientRect();
		editY = ((e.clientY - rect.top) / rect.height) * 100;
		editX = ((e.clientX - rect.left) / rect.width) * 100;

		const screenWidth = window.innerWidth;
		const editorWidth = 300;
		const editorHeight = 300;
		const right = e.clientX + editorWidth;
		const bottom = e.clientY + editorHeight;
		if (right > screenWidth) {
			editX -= ((right - screenWidth + 20) / rect.width) * 100;
		}
		if (bottom > window.innerHeight) {
			editY -= ((bottom - window.innerHeight + 20) / rect.height) * 100;
		}
	}
	function closeEditor(e: Event) {
		e.stopPropagation();
		if (!edit) return;
		edit = false;
		entry = entryCopy;
	}

	function del() {
		edit = false;
		entry = entryCopy;
		dispatch('delete', entry.__uuid__);
	}
	function upd() {
		edit = false;
		dispatch('update', { uuid: entry.__uuid__, entry: entry });
	}

	function prevent(e: Event) {
		e.stopPropagation();
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<button
	bind:this={editBtn}
	class="entry"
	style="{_grid}; {_height}; {_color}; {_offset}"
	class:editing
	class:edit
	on:click={closeEditor}
	on:contextmenu={openEditor}
	on:mousedown={prevent}
>
	<div class="data">
		<span>{entry.task}</span>
		<span>{entry.project} • {entry.client}</span>
	</div>
	<div class="opts">
		<span>{formatHour(entry.duration)}</span>
	</div>
	{#if edit}
		<Editor bind:entry y={editY} x={editX} {upd} {del} />
	{/if}
</button>

<style lang="scss">
	.entry {
		background-image: radial-gradient(circle, #0002 1px, transparent 1px);
		background-size: 8px 8px;
		background-color: var(--b3);
		border: 1px solid var(--b2);
		border-radius: 0.25rem;
		box-sizing: border-box;
		color: var(--a2);
		cursor: initial;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		font-family: inherit;
		font-size: 0.7rem;
		text-align: left;
		padding: 0.2rem 0.3rem;
		padding-bottom: 0.1rem;
		position: relative;
		z-index: 1;
		-webkit-user-select: none;
		user-select: none;

		&.editing {
			pointer-events: none;
		}

		&.edit {
			border-color: var(--a1);
			z-index: 2;

			&::before {
				background: linear-gradient(to bottom, transparent, #0006);
				content: '';
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				z-index: 1;
			}
		}

		.data {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			width: 100%;
			overflow: hidden;

			span {
				max-width: 0;
				white-space: nowrap;
			}

			span:last-child {
				color: var(--a3);
				font-size: 0.7rem;
				opacity: 0.7;
			}
		}

		.opts {
			display: flex;
			justify-content: space-between;
			width: 100%;

			span {
				color: var(--a3);
				font-size: 0.7rem;
				opacity: 0.7;
			}
		}
	}
</style>
