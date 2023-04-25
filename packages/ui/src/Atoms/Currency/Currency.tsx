import '../../index.css'
import { twMerge } from 'tailwind-merge'
import { useMiscStore } from '@cryptobot/shared/src/front-desktop/renderer/stores/MiscStore'

const presets = ['default', 'portfolio:value', 'portfolio:evol:pct', 'portfolio:evol:value'] as const

type Props = {
	preset?: (typeof presets)[number]
	value: number
	colored?: boolean
	fractionDigits?: number
	enableBlur?: boolean
}

const baseClasses = ['block text-md font-medium']

const classes: Record<(typeof presets)[number], string[]> = {
	default: baseClasses,
	'portfolio:value': [...baseClasses, 'text-2xl', 'font-bold', 'text-amber-500'],
	'portfolio:evol:pct': [...baseClasses],
	'portfolio:evol:value': [...baseClasses],
}

export const Currency = (props: Props) => {
	const classesToApply = twMerge(classes[props.preset || 'default'])

	const miscStore = useMiscStore()

	let classesSpanCurrency = props.colored ? (props.value > 0 ? 'text-green-600' : 'text-red-600') : ''
	classesSpanCurrency +=
		(props.enableBlur === true || props.enableBlur === undefined) && miscStore.discretModeActivated
			? 'transition blur'
			: 'transition'

	return (
		<span className={classesToApply}>
			{props.colored ? (
				<span className={classesSpanCurrency}>
					{new Intl.NumberFormat('fr-FR', {
						style: 'currency',
						minimumFractionDigits: props.fractionDigits || 2,
						signDisplay: 'always',
						currency: 'USD',
						currencyDisplay: 'narrowSymbol',
					}).format(props.value)}
				</span>
			) : (
				<span className={classesSpanCurrency}>
					{new Intl.NumberFormat('fr-FR', {
						style: 'currency',
						currency: 'USD',
						maximumFractionDigits: props.preset === 'portfolio:value' ? 0 : props.fractionDigits || 2,
						currencyDisplay: 'narrowSymbol',
					}).format(props.value)}
				</span>
			)}
		</span>
	)
}
