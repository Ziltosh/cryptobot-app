import '../../index.css'
import { twMerge } from 'tailwind-merge'

import { FaGoogle } from 'react-icons/fa'

const presets = ['default', 'withText', 'header'] as const

type Props = {
	preset?: typeof presets[number]
	centered?: boolean
	icon: React.ReactNode
	text?: string
	flex: 'row' | 'col'
	onClick?: () => void
}

const baseClasses = ['text-xl', 'hover:text-amber-500', 'flex', 'items-center']

const classes: Record<typeof presets[number], string[]> = {
	default: baseClasses,
	withText: [...baseClasses, 'gap-1', 'cursor-pointer'],
	header: [...baseClasses, 'hover:text-white', 'gap-1', 'cursor-pointer'],
}

export const Icon = (props: Props) => {
	const classesToApply = twMerge(
		classes[props.preset || 'default'],
		props.centered ? 'justify-center' : '',
		props.flex === 'row' ? 'flex-row' : 'flex-col'
	)

	return (
		<div className={classesToApply} onClick={props.onClick}>
			{props.icon || <FaGoogle />}
			<span className={'block text-sm'}>{props.text}</span>
		</div>
	)
}
