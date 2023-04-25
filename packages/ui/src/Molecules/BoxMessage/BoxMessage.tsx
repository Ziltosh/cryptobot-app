import '../../index.css'
import React, { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'
import { Text, TextPresets } from '../../Atoms/Text/Text'

const presets = ['default', 'alert'] as const

type Props = {
	preset?: typeof presets[number]
	centered?: boolean
	title: string
	titlePreset?: typeof TextPresets[number]
	defaultHide?: boolean
	className?: string
}

const baseClasses = ['p-4', 'bg-slate-100', 'text-gray-800', 'block', 'text-base', 'shadow-sm']

const classes: Record<typeof presets[number], string[]> = {
	default: baseClasses,
	alert: [...baseClasses, 'bg-red-100'],
}

export const BoxMessage = (props: PropsWithChildren<Props>) => {
	const classesToApply = twMerge(
		classes[props.preset || 'default'],
		props.centered ? 'text-center' : '',
		props.className
	)

	const [isHidden, setIsHidden] = React.useState(props.defaultHide || false)

	return (
		<>
			<div className="flex justify-between mt-4">
				<Text preset={props.titlePreset} text={props.title} />
				<span className={'text-amber-500 cursor-pointer'} onClick={() => setIsHidden(!isHidden)}>
					{isHidden ? 'Afficher' : 'Cacher'}
				</span>
			</div>
			<div className={classesToApply}>{!isHidden && props.children}</div>
		</>
	)
}
