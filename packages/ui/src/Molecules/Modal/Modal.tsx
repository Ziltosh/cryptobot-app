import "../../index.css";
import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { Text, TextPresets } from "../../Atoms/Text/Text";

const presets = ['default', 'alert'] as const

type Props = {
	preset?: (typeof presets)[number]
	centered?: boolean
	title: string
	titlePreset?: (typeof TextPresets)[number]
	isOpen: boolean
	className?: string
}

const baseClasses = [
	'text-gray-800',
	'block',
	'backdrop-blur-md',
	'bg-transparent',
	'text-base',
	'absolute',
	'left-0',
	'right-0',
	'bottom-0',
	'top-0',
	'overflow-y-auto',
]

const classes: Record<(typeof presets)[number], string[]> = {
	default: baseClasses,
	alert: [...baseClasses, 'bg-red-100'],
}

export const Modal = (props: PropsWithChildren<Props>) => {
	const classesToApply = twMerge(
		classes[props.preset || 'default'],
		props.centered ? 'text-center' : '',
		props.className
	)

	return (
		<>
			{props.isOpen && (
				<div className={classesToApply}>
					<div className="absolute left-10 right-10 bottom-10 top-10 bg-white shadow-md">
						<div className="p-4 bg-white flex flex-col grow">
							<Text preset={props.titlePreset} text={props.title} />
							{props.children}
						</div>
					</div>
				</div>
			)}
		</>
	)
}
