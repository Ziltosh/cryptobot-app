import '../../index.css'
import { twMerge } from 'tailwind-merge'

const presets = ['default'] as const

type Props = {
	preset?: typeof presets[number]
	text: string
	for: string
	className?: string
}

const baseClasses = ['block text-md font-medium text-gray-600 dark:text-gray-200']

const classes: Record<typeof presets[number], string[]> = {
	default: baseClasses,
}

export const Label = (props: Props) => {
	const classesToApply = twMerge(classes[props.preset || 'default'], props.className || '')

	return (
		<label htmlFor={props.for} className={classesToApply}>
			{props.text}
		</label>
	)
}
