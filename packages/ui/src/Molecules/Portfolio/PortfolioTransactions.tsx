import '../../index.css'
import { twMerge } from 'tailwind-merge'
import React, { PropsWithChildren } from 'react'

type PresetProps = {
	default: {}
}

type Preset = keyof PresetProps

type Props<P extends Preset> = PresetProps[P] & {
	preset: P
}

const baseClasses = ['w-full table-fixed']

const classes: Record<keyof PresetProps, string[]> = {
	default: [...baseClasses, ''],
}

export const PortfolioTransactions = <P extends Preset>(props: PropsWithChildren<Props<P>>) => {
	const classesToApply = twMerge(classes[props.preset || 'default'])

	return (
		<table className={classesToApply}>
			<thead>
				<tr>
					<th className="text-left uppercase font-medium w-16">#</th>
					<th className="text-left uppercase font-medium w-32">type</th>
					<th className="text-left uppercase font-medium w-3/12">origine</th>
					<th className="text-left uppercase font-medium w-64">date</th>
					<th className="text-left uppercase font-medium w-fit">prix</th>
					<th className="text-left uppercase font-medium w-fit">qté</th>
					<th className="text-left uppercase font-medium w-fit">total</th>
					<th className="text-left uppercase font-medium w-8"></th>
				</tr>
			</thead>
			<tbody>{props.children}</tbody>
		</table>
	)
}
