import { EChartsOption } from 'echarts-for-react'

type ChartItem = {
	name: string
	value: number
}

const colors: string[] = [
	'#f59e0b',
	'#0369a1',
	'#10b981',
	'#3b82f6',
	'#6366f1',
	'#ec4899',
	'#f87171',
	'#fbbf24',
	'#34d399',
	'#60a5fa',
	'#8b5cf6',
	'#a855f7',
	'#d946ef',
	'#ef4444',
	'#ff7a45',
]

export const generateChartOptions = (...items: ChartItem[]): EChartsOption => {
	return {
		legend: {
			top: '5%',
			left: 'center',
		},
		tooltip: {
			trigger: 'item',
			formatter(param): string {
				return (
					param.name +
					' ' +
					param.percent +
					'%' +
					' (' +
					Intl.NumberFormat('fr-FR', {
						style: 'currency',
						currency: 'USD',
						compactDisplay: 'short',
						currencyDisplay: 'narrowSymbol',
					}).format(param.value) +
					')'
				)
			},
		},
		series: [
			{
				itemStyle: {
					borderRadius: 10,
					borderColor: '#fff',
					borderWidth: 2,
				},
				type: 'pie',
				colorBy: 'data',
				blur: {
					labelLine: {
						show: true,
					},
				},
				label: {
					show: false,
				},
				data: [
					...items.map((item, index) => ({
						name: item.name,
						value: item.value,
						itemStyle: {
							color: colors.at(index % colors.length),
						},
					})),
				],
			},
		],
	}
}
