import '../../index.css'
import { twMerge } from 'tailwind-merge'

const presets = ['default', 'portfolio:value'] as const

type Props = {
	preset?: typeof presets[number]
	value: number
	colored?: boolean
}

const baseClasses = ['block text-md font-medium']

const classes: Record<typeof presets[number], string[]> = {
	default: baseClasses,
	'portfolio:value': [...baseClasses],
}

export const Percent = (props: Props) => {
	const classesToApply = twMerge(classes[props.preset || 'default'])

	return (
		<span className={classesToApply}>
			{props.colored ? (
				<span className={props.value > 0 ? 'text-green-600' : 'text-red-600'}>
					{new Intl.NumberFormat('fr-FR', {
						style: 'percent',
						maximumFractionDigits: 2,
						signDisplay: 'always',
					}).format(props.value)}
				</span>
			) : (
				<>
					{new Intl.NumberFormat('fr-FR', { style: 'percent', maximumFractionDigits: 1 }).format(props.value)}
				</>
			)}
		</span>
	)
}
