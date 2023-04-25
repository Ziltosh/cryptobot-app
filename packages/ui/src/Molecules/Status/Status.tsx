import '../../index.css'
import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'
import { Text } from '../../Atoms/Text/Text'

const presets = ['portfolio', 'api', 'dca', 'bots'] as const

type Props = {
	preset?: typeof presets[number]
	name?: string
	isOk: boolean
}

const baseClasses = ['flex flex-row mx-2 items-center']

const classes: Record<typeof presets[number], string[]> = {
	portfolio: baseClasses,
	api: baseClasses,
	dca: baseClasses,
	bots: baseClasses,
}

export const Status = (props: PropsWithChildren<Props>) => {
	const classesToApply = twMerge(classes[props.preset || 'portfolio'])

	return (
		<div className={classesToApply}>
			{props.isOk ? (
				<div className={'w-2 h-2 bg-green-700 rounded-2xl mr-1'}>&nbsp;</div>
			) : (
				<div className={'w-2 h-2 bg-red-700 rounded-2xl mr-1'}>&nbsp;</div>
			)}
			<Text preset={'footer'} text={props.name || props.preset || 'portfolio'} />
		</div>
	)
}
