<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, type ChartConfiguration, type ChartData } from 'chart.js/auto';
	import { formatHour } from '$lib/app';

	let chartEl: HTMLCanvasElement;
	interface Props {
		data: ChartData;
	}
	let { data }: Props = $props();

	const weekChartConfig: ChartConfiguration = {
		type: 'bar',
		data: data,
		options: {
			animation: false,
			interaction: {
				mode: 'index'
			},
			responsive: true,
			plugins: {
				legend: {
					display: false,
					labels: {
						useBorderRadius: true,
						borderRadius: 5,
						boxWidth: 10,
						boxHeight: 10,
						color: '#fcfbf3',
						font: {
							family: 'cartograph-cf'
						}
					}
				},
				tooltip: {
					backgroundColor: '#fcfbf3',
					titleColor: '#3d5b6b',
					titleFont: {
						family: 'cartograph-cf'
					},
					bodyColor: '#3d5b6b',
					bodyFont: {
						family: 'cartograph-cf'
					},
					usePointStyle: true,
					mode: 'index',
					callbacks: {
						label: function (ctx) {
							let label = ctx.dataset.label || '';

							if (ctx.parsed.y === 0) {
								return '';
							}
							if (ctx.parsed.y !== null) {
								label = label.padEnd(9);
								label += ` ${formatHour(ctx.parsed.y * 36e5)}`;
							}
							return label;
						}
					}
				}
			},
			scales: {
				x: {
					stacked: true,
					ticks: {
						color: '#fcfbf3',
						font: {
							family: 'cartograph-cf',
							size: 10
						}
					}
				},
				y: {
					stacked: true,
					ticks: {
						color: '#c2d2d6',
						font: {
							family: 'cartograph-cf'
						}
					},
					grid: {
						color: '#132539',
						display: true,
						drawOnChartArea: true
					}
				}
			}
		}
	};

	let chart: Chart;
	onMount(() => {
		chart = new Chart(chartEl, weekChartConfig);
	});

	$effect(() => {
		weekChartConfig.data = data;
		chart.update();
	});
</script>

<canvas bind:this={chartEl}></canvas>

<style lang="scss">
	canvas {
		min-height: 150px;
		max-height: 250px;
	}
</style>
