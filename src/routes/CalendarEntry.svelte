<script lang="ts">
	import Editor from './Editor.svelte';
	import { clients, formatHour } from '$lib/app';
	import type { Entry } from '$lib/schema';

	interface Props {
		editing: boolean;
		entry: Entry;
		height: number;
		offset: number;
		delEntry: (uuid: string) => void;
		updEntry: (uuid: string, entry: Entry) => void;
	}
	let { editing, entry, height, offset, delEntry, updEntry }: Props = $props();

	let entryCopy: Entry = entry;

	let client = $derived(
		$clients.find((c) => c.name === entry.client) || { color: 'var(--b3)', projects: [] }
	);
	let project = $derived(
		client.projects.find((p) => p.name === entry.project) || { color: 'var(--b3)' }
	);
	let _grid = $derived(`grid-column: ${entry.__column__ + 1}; grid-row: 1 / 1`);
	let _height = $derived(`height: ${height}px`);
	let _offset = $derived(`margin-top: ${offset}px`);
	let _color = $derived(`background-color: ${project.color}`);

	let editBtn: HTMLButtonElement;
	let edit = $state(false);
	let editY = $state(0);
	let editX = $state(0);
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
		delEntry(entry.__uuid__);
	}
	function upd() {
		edit = false;
		updEntry(entry.__uuid__, entry);
	}

	function prevent(e: Event) {
		e.stopPropagation();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<button
	bind:this={editBtn}
	class="entry"
	style="{_grid}; {_height}; {_color}; {_offset}"
	class:editing
	class:edit
	onclick={closeEditor}
	oncontextmenu={openEditor}
	onmousedown={prevent}
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
