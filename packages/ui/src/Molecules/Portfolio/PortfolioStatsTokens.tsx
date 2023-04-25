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

const baseClasses = ['table-fixed mb-4 overflow-y-scroll bg-slate-50']

const classes: Record<keyof PresetProps, string[]> = {
	default: [...baseClasses, ''],
}

export const PortfolioStatsTokens = <P extends Preset>(props: PropsWithChildren<Props<P>>) => {
	const classesToApply = twMerge(classes[props.preset || 'default'])

	return (
		<table className={classesToApply}>
			<thead>
				<tr>
					<th className="text-left text-amber-500 uppercase font-medium p-1">token</th>
					<th className="text-left text-amber-500 uppercase font-medium p-1">prix</th>
					<th className="text-left text-amber-500 uppercase font-medium p-1">valeur</th>
					<th className="text-left text-amber-500 uppercase font-medium p-1">in</th>
					<th className="text-left text-amber-500 uppercase font-medium p-1">out</th>
					{/*<th className="text-left uppercase font-medium">fees</th>*/}
					<th className="text-left text-amber-500 uppercase font-medium p-1">pru</th>
					<th className="text-left text-amber-500 uppercase font-medium p-1">dispo</th>
					<th className="text-left text-amber-500 uppercase font-medium p-1 w-24">alloc.</th>
					<th className="text-left text-amber-500 uppercase font-medium p-1 w-24">pnl.</th>
				</tr>
			</thead>
			<tbody>{props.children}</tbody>
		</table>
	)
}
