import '../../index.css'
import React, { HTMLInputTypeAttribute } from 'react'
import { twMerge } from 'tailwind-merge'
import { NumericFormat } from 'react-number-format'

const presets = ['default'] as const

type Props = {
	preset?: (typeof presets)[number]
	type: HTMLInputTypeAttribute
	currency?: boolean
	placeholder?: string
	name: string
	width?: number
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	onValueChange?: (value: number) => void
	value?: string
	minimum?: number | string
	maximum?: number | string
}

const baseClasses = [
	'rounded-md',
	'border-2',
	'border-gray-300',
	'px-1',
	'py-2',
	'focus:border-amber-500',
	'text-gray-800',
	'shadow-inner',
	'focus:border-amber-500',
	'max-w-full',
]

const classes: Record<(typeof presets)[number], string[]> = {
	default: baseClasses,
}

export const Input = (props: Props) => {
	const classesToApply = twMerge(classes[props.preset || 'default'])

	React.useEffect(() => {}, [props.value])

	if (props.type === 'number') {
		return (
			<NumericFormat
				thousandSeparator={' '}
				decimalSeparator={','}
				fixedDecimalScale={false}
				allowNegative={false}
				max={props.maximum}
				prefix={props.currency ? '$ ' : ''}
				min={props.minimum}
				valueIsNumericString={true}
				value={props.value}
				className={classesToApply}
				style={{ width: props.width }}
				onValueChange={(values) => {
					if (props.onValueChange) props.onValueChange(values.floatValue || 0)
				}}
			/>
		)
	}

	return (
		<input
			name={props.name}
			type={props.type}
			className={classesToApply}
			placeholder={props.placeholder}
			style={{ width: props.width }}
			value={props.value}
			onChange={props.onChange}
			min={props.minimum?.toString()}
			max={props.maximum?.toString()}
		/>
	)
}
