import '../../index.css'
import { twMerge } from 'tailwind-merge'
import { Currency } from '../../Atoms/Currency/Currency'

const presets = ['default', 'full', 'currency'] as const

type Props = {
	preset?: typeof presets[number]
	value: number
	text: string
}

const baseClasses = ['border-[1px]', 'border-slate-100', 'flex', 'flex-col', 'w-1/2', 'items-center', 'justify-center']

const classes: Record<typeof presets[number], string[]> = {
	default: [...baseClasses],
	full: [...baseClasses, 'w-full'],
	currency: [...baseClasses],
}

export const PortfolioStat = (props: Props) => {
	const classesToApply = twMerge(classes[props.preset || 'default'])

	return (
		<div className={classesToApply}>
			<span className={'font-bold text-amber-500 text-2xl'}>
				{props.preset === 'currency' ? (
					<Currency value={props.value} preset={'portfolio:value'} />
				) : (
					<span>{props.value}</span>
				)}
			</span>
			<span className={''}>{props.text}</span>
		</div>
	)
}
