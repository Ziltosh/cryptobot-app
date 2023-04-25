import '../../index.css'
import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

const presets = ['default'] as const

type Props = {
	preset?: typeof presets[number]
	label: string
	for: string
}

const baseClasses = ['']

const classes: Record<typeof presets[number], string[]> = {
	default: baseClasses,
}

export const FormInput = (props: PropsWithChildren<Props>) => {
	const classesToApply = twMerge(classes[props.preset || 'default'])

	return (
		<>
			<div className={classesToApply}>{props.children}</div>
		</>
	)
}
