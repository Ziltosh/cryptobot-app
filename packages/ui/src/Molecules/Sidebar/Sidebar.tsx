import '../../index.css'
import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

const presets = ['default'] as const

type Props = {
	preset?: typeof presets[number]
}

const baseClasses = [
	'flex flex-col sticky max-w-fit p-2 border-r border-slate-200 dark:border-slate-700 dark:bg-slate-900 bg-slate-100 text-slate-500 gap-3',
]

const classes: Record<typeof presets[number], string[]> = {
	default: baseClasses,
}

export const Sidebar = (props: PropsWithChildren<Props>) => {
	const classesToApply = twMerge(classes[props.preset || 'default'])

	return <aside className={classesToApply}>{props.children}</aside>
}
