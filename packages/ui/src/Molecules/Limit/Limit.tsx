import '../../index.css'
import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

const presets = ['default'] as const

type Props = {
	preset?: typeof presets[number]
	centered?: boolean
	forfait: string
	current: number
	max: number | string
}

const baseClasses = ['bg-gray-100', 'border', 'border-amber-300', 'flex', 'flex-col', 'grow-0', 'p-4', 'items-center']

const classes: Record<typeof presets[number], string[]> = {
	default: baseClasses,
}

export const Limit = (props: PropsWithChildren<Props>) => {
	const classesToApply = twMerge(classes[props.preset || 'default'], props.centered ? 'text-center' : '')

	return (
		<div className={classesToApply}>
			<span className="text-sm">forfait</span>
			<div className="font-bold text-amber-500 uppercase">{props.forfait}</div>
			<div>
				<span className="text-amber-500">{props.current}</span> /{' '}
				<span className="text-gray-800">{props.max}</span>
			</div>
		</div>
	)
}
