import '../../index.css'
import { twMerge } from 'tailwind-merge'
import React from 'react'

const presets = ['default', 'cancel', 'link-light', 'link-dark', 'link-letter', 'link-letter-dark'] as const

type Props = {
	preset?: (typeof presets)[number]
	centered?: boolean
	onPress?: () => void
	text: string
	icon?: React.ReactNode
	disabled?: boolean
	isBold?: boolean
	tooltip?: string
	className?: string
}

const baseClasses = [
	'rounded',
	'relative',
	'flex',
	'group',
	'items-center',
	'justify-center',
	'px-3.5',
	'py-1.5',
	'm-1',
	'border-b-4',
	'hover:text-white',
	'shadow-md',
	'transition',
	'duration-300',
	'ease-in-out',
	'hover:border-white',
	'disabled:opacity-50',
]

const classes: Record<(typeof presets)[number], string[]> = {
	default: [...baseClasses, 'border-amber-500', 'hover:bg-amber-500'],
	cancel: [...baseClasses, 'border-red-500', 'hover:bg-red-500'],
	'link-light': ['text-amber-500', 'text-md', 'underline', 'disabled:opacity-50'],
	'link-dark': ['text-amber-500', 'text-md', 'underline', 'disabled:opacity-50'],
	'link-letter': ['text-amber-500', 'font-medium', 'text-md', 'px-2'],
	'link-letter-dark': ['text-amber-800', 'font-medium', 'text-md', 'px-2'],
}

export const Button = (props: Props) => {
	const classesToApply = twMerge(classes[props.preset || 'default'], props.isBold ? 'font-bold' : '', props.className)

	return (
		<div className={`flex ${props.centered ? 'justify-center' : ''}`}>
			<button onClick={props.onPress} className={classesToApply} disabled={props.disabled} title={props.tooltip}>
				{props.icon && <div className={'pr-2'}>{props.icon}</div>}
				{props.text}
			</button>
		</div>
	)
}
