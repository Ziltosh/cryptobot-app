import "../../index.css";
import { twMerge } from "tailwind-merge";
import { Text } from "../../Atoms/Text/Text";
import { FaTrashAlt, MdImageNotSupported, MdOutlineAddBox } from "react-icons/all";

type PresetProps = {
	default: {
		name: string
		logo: string
		onDelete?: () => void
	}
	add: object
}

type Preset = keyof PresetProps

type Props<P extends Preset> = P extends 'default'
	? PresetProps[P] & {
			preset: P
			onClick?: () => void
	  }
	: {
			preset: P
			onClick?: () => void
	  }

const baseClasses = ['p-2', 'bg-slate-200', 'grow-0', 'mb-2']

const classes: Record<keyof PresetProps, string[]> = {
	default: [
		...baseClasses,
		'aspect-square',
		'flex',
		'flex-col',
		'items-center',
		'w-32',
		'justify-center',
		'relative',
	],
	add: [...baseClasses, 'flex', 'items-center', 'justify-center', 'aspect-square', 'w-32', 'cursor-pointer'],
}

export const PortfolioToken = <P extends Preset>(props: Props<P>) => {
	const classesToApply = twMerge(classes[props.preset || 'default'])

	if (props.preset === 'default') {
		return (
			<div className={classesToApply}>
				{props.onDelete && (
					<FaTrashAlt
						size={16}
						className={'text-slate-500 absolute right-0 top-0 mr-2 mt-2 cursor-pointer'}
						onClick={(e) => {
							e.stopPropagation()
							if (props.onDelete) props.onDelete()
						}}
					/>
				)}
				{props.logo !== '' && (
					<img
						src={props.logo}
						onClick={props.onClick}
						className={'w-14 aspect-square object-contain cursor-pointer'}
						alt={props.name}
					/>
				)}
				{props.logo === '' && (
					<MdImageNotSupported
						size={48}
						className={'text-slate-300 cursor-pointer'}
						onClick={props.onClick}
					/>
				)}
				<Text text={props.name} centered />
			</div>
		)
	} else {
		return (
			<div className={classesToApply} onClick={props.onClick}>
				<MdOutlineAddBox size={60} className={'text-slate-300'} />
			</div>
		)
	}
}
