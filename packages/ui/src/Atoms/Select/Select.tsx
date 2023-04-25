import '../../index.css'
import RSelect from 'react-select'
import { GroupOptionWithImage, OptionBase, OptionWithImage } from '@cryptobot/shared/src/ui/select/Option.types'

type PresetProps = {
	default: {
		options: OptionBase[]
		onChange: (option: OptionBase | null) => void
	}
	'with-image': {
		options: OptionWithImage[]
		onChange: (option: OptionWithImage | null) => void
	}
	'group-with-image': {
		options: GroupOptionWithImage[]
		onChange: (option: OptionWithImage | null) => void
	}
}

type Preset = keyof PresetProps

type Props<P extends Preset> = PresetProps[P] & {
	preset: P
	isMulti?: boolean
	selected?: string
	className?: string
}

// const baseClasses: string[] = []

// const classes: Record<keyof PresetProps, string[]> = {
// 	default: [...baseClasses],
// 	'with-image': [...baseClasses],
// }

export const Select = <P extends Preset>(props: Props<P>) => {
	// const classesToApply = twMerge(classes[props.preset || 'default'])

	if (props.preset === 'with-image' || props.preset === 'group-with-image') {
		return (
			<RSelect
				options={(props as Props<'with-image'>).options}
				// defaultValue={
				// 	props.selected
				// 		? (props.options as OptionWithImage[]).filter((o) => o.value === props.selected)
				// 		: props.options[0]
				// }
				isClearable={true}
				classNames={{
					control: (base) =>
						[
							base,
							'rounded-md',
							'border-2',
							'border-gray-300',
							'py-1',
							'focus:border-amber-500',
							'text-gray-800',
							'shadow-inner',
							'focus:border-amber-500',
						].join(' '),
				}}
				isMulti={props.isMulti}
				defaultValue={(props as Props<'with-image'>).options.find((o) => o.value === props.selected)}
				isOptionDisabled={(option) => option.disabled || false}
				formatOptionLabel={(option) => {
					return (
						<div className="flex items-center">
							<img
								className={'w-6 h-6 aspect-square object-contain rounded-full'}
								src={option.image}
								alt={option.value}
							/>
							<span className={'ml-2'}>{option.label}</span>
						</div>
					)
				}}
				onChange={(newValue) => {
					props.onChange(newValue as OptionWithImage)
				}}
			/>
		)
	} else {
		return (
			<RSelect
				options={(props as Props<'default'>).options}
				classNames={{
					control: (base) =>
						[
							base,
							'rounded-md',
							'border-2',
							'border-gray-300',
							'py-1',
							'focus:border-amber-500',
							'text-gray-800',
							'shadow-inner',
							'focus:border-amber-500',
						].join(' '),
				}}
				defaultValue={(props as Props<'default'>).options.find((o) => o.value === props.selected)}
				isClearable={true}
				isOptionDisabled={(option) => option.disabled ?? false}
				onChange={(newValue) => {
					props.onChange(newValue as OptionWithImage)
				}}
				isMulti={props.isMulti}
			/>
		)
	}
}
