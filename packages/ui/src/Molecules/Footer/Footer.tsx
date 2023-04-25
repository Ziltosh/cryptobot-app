import '../../index.css'
import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

const presets = ['default'] as const

type Props = {
	preset?: typeof presets[number]
	centered?: boolean
}

const baseClasses = ['bg-gray border-t h-fit grow-0 flex justify-between px-4 py-2']

const classes: Record<typeof presets[number], string[]> = {
	default: baseClasses,
}

export const Footer = (props: PropsWithChildren<Props>) => {
	const classesToApply = twMerge(classes[props.preset || 'default'], props.centered ? 'text-center' : '')

	return <div className={classesToApply}>{props.children}</div>
}
