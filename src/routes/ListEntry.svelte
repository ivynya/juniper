<script lang="ts">
	import Editor from './Editor.svelte';
	import { clients, formatHour } from '$lib/app';
	import { Kanban, Layers } from 'lucide-svelte';
	import type { Entry } from '$lib/schema';

	interface Props {
		entry: Entry;
		delEntry: (uuid: string) => void;
		updEntry: (uuid: string, entry: Entry) => void;
	}
	let { entry, delEntry, updEntry }: Props = $props();

	let entryCopy: Entry = entry;

	let client = $derived(
		$clients.find((c) => c.name === entry.client) || { color: 'var(--b3)', projects: [] }
	);
	let project = $derived(
		client.projects.find((p) => p.name === entry.project) || { color: 'var(--b3)' }
	);

	let editBtn: HTMLButtonElement;
	let edit = $state(false);
	let editY = $state(0);
	let editX = $state(0);
	function openEditor(e: MouseEvent) {
		e.preventDefault();
		entryCopy = { ...entry };
		edit = !edit;
		const rect = editBtn.getBoundingClientRect();
		editY = ((e.clientY - rect.top) / rect.height) * 100;
		editX = ((e.clientX - rect.left) / rect.width) * 100;

		const screenWidth = window.innerWidth;
		const editorWidth = 300;
		const editorHeight = 320;
		const right = e.clientX + editorWidth;
		const bottom = e.clientY + editorHeight;
		if (right > screenWidth) {
			editX -= ((right - screenWidth + 20) / rect.width) * 100;
		}
		if (bottom > window.innerHeight) {
			editY -= ((bottom - window.innerHeight + 20) / rect.height) * 100;
		}
	}
	function closeEditor() {
		if (!edit) return;
		edit = false;
		entry = entryCopy;
	}

	function del() {
		closeEditor();
		delEntry(entry.__uuid__);
	}
	function upd() {
		edit = false;
		updEntry(entry.__uuid__, entry);
	}
</script>

<button
	bind:this={editBtn}
	class="entry"
	class:edit
	onclick={closeEditor}
	oncontextmenu={openEditor}
>
	<div class="data">
		<span>{entry.task}</span>
		<span>
			<Layers size="12px" color={project.color} />{entry.project} •
			<Kanban size="12px" color={client.color} />{entry.client}
		</span>
	</div>
	<div class="meta">
		<span>{formatHour(entry.duration)}</span>
		<span>
			{#each entry.tags as tag}
				{tag}
			{/each}
		</span>
	</div>
	{#if edit}
		<Editor bind:entry y={editY} x={editX} {upd} {del} />
	{/if}
</button>

<style lang="scss">
	.entry {
		background: transparent;
		border: none;
		border-top: 1px dotted var(--b2);
		box-sizing: border-box;
		color: inherit;
		display: flex;
		justify-content: space-between;
		font-family: inherit;
		font-size: 0.8rem;
		height: 4rem;
		padding: 0.75rem 1rem;
		width: 100%;
		text-align: left;
		position: relative;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;

		&.edit {
			background: var(--b2);
			border-radius: 0.5rem;

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

		div {
			display: flex;
			flex-direction: column;
		}

		.data span:last-child {
			color: var(--b3);
			display: flex;
			align-items: center;
			gap: 0.3rem;
			font-size: 0.7rem;
		}

		.meta {
			align-items: flex-end;
		}
		.meta span:last-of-type {
			color: var(--b3);
			display: flex;
			align-items: center;
			gap: 0.5rem;
			font-size: 0.7rem;
		}
	}
</style>
