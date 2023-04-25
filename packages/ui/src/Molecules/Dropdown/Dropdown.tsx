import '../../index.css'
import { twMerge } from 'tailwind-merge'
import React, { ReactNode } from 'react'

const presets = ['default'] as const

type Props = {
	preset?: typeof presets[number]
	centered?: boolean
	items: {
		text: string
		url: string
		onClick?: () => void
	}[]
	element: ReactNode
}

const baseClasses = [
	'absolute top-16 -left-40 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
]

const classes: Record<typeof presets[number], string[]> = {
	default: baseClasses,
}

export const Dropdown = (props: Props) => {
	const classesToApply = twMerge(classes[props.preset || 'default'], props.centered ? 'text-center' : '')

	const [isOpen, setIsOpen] = React.useState(false)

	return (
		<>
			<div className={'relative'} onClick={() => setIsOpen(!isOpen)}>
				{props.element}
				{isOpen && (
					<div
						className={classesToApply}
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="user-menu-button"
						tabIndex={-1}
					>
						{props.items.map((item, index) => (
							<a
								href={item.url}
								key={index}
								className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								{item.text}
							</a>
						))}
					</div>
				)}
			</div>
		</>
	)
}
