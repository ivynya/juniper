import { formatHour } from './app';
import type { Entry, Project, Report } from './schema';

export function getDataPeriod(
	entries: Entry[],
	projectMetadata: Project[],
	start: number,
	gp: 'month' | 'week' | 'day',
	gn: number,
	by: 'project' | 'task',
	ex: string[]
): Report {
	const gt = (gp === 'month' ? 30 : gp === 'week' ? 7 : 1) * 24 * 3600 * 1000;
	const ip = entries
		.filter((e) => e.start >= start && e.end <= start + gt * gn)
		.filter((p) => (ex[0] === '' ? true : ex.every((e) => e === p.project || e === p.task)));
	const kv: { [key: string]: Entry[] } = {};

	if (ip.length === 0)
		return {
			entries: [],
			time: 0,
			count: 0,
			data: { labels: [], datasets: [] }
		};

	const projs = ip.map((e) => e.project).filter((v, i, a) => a.indexOf(v) === i);
	const tasks = ip.map((e) => e.task).filter((v, i, a) => a.indexOf(v) === i);

	if (by === 'project') projs.map((p) => (kv[p] = []));
	else if (by === 'task') tasks.map((t) => (kv[t] = []));

	for (const k of ip) {
		kv[k[by]].push(k);
	}

	const kt: { [key: string]: number[] } = {};

	if (by === 'project')
		for (const p of projs) {
			kt[p] = new Array(gn).fill(0);

			for (let i = 0; i <= kv[p].length - 1; i++) {
				const a = kv[p][i];
				const n = Math.floor((a.start - start) / gt);
				kt[p][n] += a.duration / (1000 * 60 * 60);
			}
		}
	if (by === 'task')
		for (const t of tasks) {
			kt[t] = new Array(gn).fill(0);

			for (let i = 0; i <= kv[t].length - 1; i++) {
				const a = kv[t][i];
				const n = Math.floor((a.start - start) / gt);
				kt[t][n] += a.duration / (1000 * 60 * 60);
			}
		}

	const labels = Object.keys(kv);
	const time = ip.map((e) => e.duration).reduce((a, b) => a + b);

	let times: number[] = new Array(gn).fill(0);
	Object.keys(kt).map((p) => {
		kt[p].map((t, j) => (times[j] += kt[p][j]));
	});
	const chartLabels: string[][] = new Array(gn)
		.fill(0)
		.map((x, i) => new Date(new Date(start + gt * i + 36e5 * 24).setHours(0, 0, 0, 0)))
		.map((t, i) => [
			t.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
			times[i] > 99 ? `${times[i].toFixed()}hr` : formatHour(times[i] * 1000 * 60 * 60).slice(0, 5)
		]);

	const datasets = Object.keys(kt).map((s, i) => ({
		label: labels[i],
		data: kt[s],
		backgroundColor: getColor(by, labels[i], projectMetadata),
		hoverBackgroundColor: getColor(by, labels[i], projectMetadata),
		hoverBorderColor: '#f2ecca',
		borderColor: 'transparent',
		hoverBorderWidth: 2,
		borderRadius: 5
	}));

	return {
		entries: ip,
		time: time,
		count: entries.length,
		data: {
			labels: chartLabels,
			datasets: datasets
		}
	};
}

function getColor(by: 'project' | 'task', name: string, metadata: Project[]): string {
	const colors = ['#f2ecca', '#fcfbf3', '#ffffff', '#3d5b6b', '#678e98', '#c2d2d6'];

	if (by === 'project') return metadata.find((p) => p.name === name)?.color || '#fff';

	// hash the name of the task into a random number to get a random color
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 2) - hash);
	}
	const index = Math.abs(hash) % colors.length;
	return colors[index];
}
