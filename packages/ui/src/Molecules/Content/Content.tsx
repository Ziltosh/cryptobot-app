import '../../index.css'
import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

const presets = ['default'] as const

type Props = {
	preset?: (typeof presets)[number]
	centered?: boolean
}

const baseClasses = ['flex flex-col w-full max-h-full overflow-y-hidden relative']

const classes: Record<(typeof presets)[number], string[]> = {
	default: baseClasses,
}

export const Content = (props: PropsWithChildren<Props>) => {
	const classesToApply = twMerge(classes[props.preset || 'default'], props.centered ? 'text-center' : '')

	return <div className={classesToApply}>{props.children}</div>
}
