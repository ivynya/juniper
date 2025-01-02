<script lang="ts">
	import {
		Clock,
		ChevronLeft,
		ChevronRight,
		MoonStar,
		Timer,
		CirclePause,
		Tag
	} from 'lucide-svelte';
	import { entries, clients, inputData, formatHour } from '$lib/app';
	import type { Entry } from '$lib/schema';
	import { nanoid } from '$lib/nanoid';

	export let resolution: number = 2;
	export let wakingHoursOnly: boolean = false;
	export let showCalControls: boolean = false;
	export let todayDate: string = new Date().toDateString();

	let todayOffset: number = 0;
	let active = false;

	$: today = $entries.filter((e) => new Date(e.start).toDateString() === todayDate);
	$: [clientName, projectName] = $inputData.clientProject.split(',');
	$: client = $clients.find((c) => c.name === clientName) || {
		color: 'var(--b3)',
		name: '',
		projects: []
	};
	$: project = client.projects.find((p) => p.name === projectName) || {
		color: 'var(--b3)',
		name: ''
	};
	$: suggestions = new Set($entries.filter((e) => e.project === project.name).map((e) => e.task));

	$: total = today.map((e) => e.duration).reduce((a, b) => a + b, 0);

	function cycleResolution() {
		resolution = (resolution % 4) * 2 || 1;
	}

	function recalculateToday(delta: number) {
		todayOffset += delta;
		const today = new Date();
		today.setDate(today.getDate() + todayOffset);
		todayDate = today.toDateString();
	}

	$: timerActive = $inputData.start != undefined;
	$: timerActive ? runTimer() : clearInterval(timerInterval);
	let duration = 0;
	let timerInterval: number;
	function startStopTimer() {
		if ($inputData.start === undefined) {
			$inputData.start = new Date().toISOString();
			duration = 0;
		} else stopTimer();
	}
	function stopTimer() {
		if ($inputData.start == undefined) return;

		const start = new Date($inputData.start);
		const end = new Date();
		const timeA = start.getHours() + start.getMinutes() / 60 + start.getSeconds() / 3600;
		const timeB = end.getHours() + end.getMinutes() / 60 + end.getSeconds() / 3600;

		$entries.push({
			__uuid__: nanoid(),
			__column__: 0,
			task: $inputData.task,
			project: projectName,
			client: clientName,
			start: timeA,
			end: timeB,
			duration: Math.abs(timeB - timeA),
			tags: []
		});
		$entries = $entries;
		clearInterval(timerInterval);
		$inputData.start = undefined;
	}
	function runTimer() {
		timerInterval = setInterval(() => {
			if ($inputData.start === undefined) return;
			const start = new Date($inputData.start);
			const now = new Date();
			duration = Math.floor((now.getTime() - start.getTime()) / 1000);
			console.log('timer running');
		}, 1000);
	}
</script>

<div class="input">
	<form class="entry" class:active class:timerActive style="--color: {project.color};">
		<input
			type="text"
			placeholder="What are you working on?"
			on:focus={() => (active = true)}
			on:blur={() => (active = false)}
			bind:value={$inputData.task}
			list="task-suggestions"
		/>
		<datalist id="task-suggestions">
			{#each suggestions as suggestion}
				<option value={suggestion} />
			{/each}
		</datalist>
		<select class="project" bind:value={$inputData.clientProject} style="color: {project.color};">
			{#each $clients as client}
				{#if client.projects.filter((p) => !p.__archived__).length > 0}
					<optgroup label={client.name}>
						{#each client.projects.filter((p) => !p.__archived__) as project}
							<option value={client.name + ',' + project.name}>{project.name}</option>
						{/each}
					</optgroup>
				{/if}
			{/each}
		</select>
		<button>
			<Tag size="16px" />
		</button>
		<button on:click={startStopTimer}>
			{#if timerActive}
				<CirclePause size="16px" />
			{:else}
				<Timer size="16px" />
			{/if}
		</button>
	</form>
	{#if timerActive}
		<section class="timer">
			<button>started</button>
			<span>{formatHour(duration / 3600)}</span>
		</section>
	{/if}
	<section class="opts">
		<span>
			<Clock size="18px" />
			{formatHour(total)} today
		</span>
		<span class="spacer" />
		{#if showCalControls}
			<button class="resolution" on:click={cycleResolution}>
				{resolution}x
			</button>
			<label for="waking-hours">
				<MoonStar size="18px" color={wakingHoursOnly ? 'var(--b4)' : 'var(--b2)'} />
				<input type="checkbox" id="waking-hours" hidden bind:checked={wakingHoursOnly} />
			</label>
			<span>{todayDate}</span>
			<button on:click={() => recalculateToday(-1)}>
				<ChevronLeft size="18px" />
			</button>
			<button on:click={() => recalculateToday(1)}>
				<ChevronRight size="18px" />
			</button>
		{:else}
			<span>{todayDate}</span>
		{/if}
	</section>
</div>

<style lang="scss">
	.input {
		background-color: var(--b0);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		position: sticky;
		top: 0;
		z-index: 5;
	}

	.entry {
		display: flex;
		align-items: center;

		&.active input {
			border: 1px dotted var(--b3);
		}

		&.timerActive input {
			border-color: var(--color);
		}
		&.timerActive select {
			border-color: var(--color);
		}
		&.timerActive button {
			background: #fa0;
			border-color: transparent;
			color: var(--b1);
		}

		input {
			background: transparent;
			border: none;
			border: 1px dotted var(--b2);
			border-top-left-radius: 20px;
			border-bottom-left-radius: 20px;
			box-sizing: border-box;
			color: inherit;
			font-family: inherit;
			font-size: 0.7rem;
			margin: 0;
			padding: 0.35rem 0;
			padding-left: 15px;
			width: 100%;
			outline: none;

			&::placeholder {
				color: var(--b2);
			}
		}

		.project {
			appearance: none;
			background: none;
			border: 1px dotted var(--b2);
			border-left: none;
			border-radius: 0;
			border-top-right-radius: 20px;
			border-bottom-right-radius: 20px;
			color: var(--b2);
			cursor: pointer;
			font-family: inherit;
			font-size: 0.7rem;
			margin-right: 2px;
			padding: 0.35rem 0.5rem;
			outline: none;
			width: 100%;
			max-width: 75px;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}

		button {
			background: transparent;
			border: 1px dotted var(--b2);
			border-radius: 20px;
			color: var(--b2);
			cursor: pointer;
			display: grid;
			place-items: center;
			margin-left: 8px;
			padding: 0.35rem;

			&:hover {
				border-color: var(--b3);
				color: var(--a2);
			}
		}
	}

	.opts {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		height: 25px;
		margin-top: 0.55rem;
		margin-bottom: 0.25rem;
		padding-bottom: 0.5rem;

		.spacer {
			flex: 1;
		}

		span {
			color: var(--b4);
			display: flex;
			align-items: center;
			gap: 0.5rem;
			font-size: 0.7rem;
		}

		label {
			display: flex;
			align-items: center;
			padding: 2px;
		}

		button {
			background: transparent;
			border: none;
			border-radius: 0.25rem;
			color: var(--b4);
			cursor: pointer;
			display: grid;
			place-items: center;
			font-family: inherit;
			font-size: 0.8rem;
			margin: 0;
			padding: 0;
		}
	}
</style>
