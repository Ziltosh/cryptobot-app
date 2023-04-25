import '../../index.css'
import {twMerge} from 'tailwind-merge'
import {LimitDB} from '@cryptobot/shared/src/prisma-types/db-api/DB.types'

const presets = ['default', 'active'] as const

type Props = {
	preset?: (typeof presets)[number]
	limit: LimitDB
	offerName: string
}

const baseClasses = ['p-3', 'bg-slate-200', 'shadow-md', 'flex', 'flex-col', 'w-1/5', 'items-center']

const classes: Record<(typeof presets)[number], string[]> = {
	default: [...baseClasses],
	active: [...baseClasses, 'bg-amber-100'],
}

export const PortfolioLimit = (props: Props) => {
	const classesToApply = twMerge(classes[props.preset || 'default'])

	return (
		<div className={classesToApply}>
			<div className={'flex gap-1'}>
				<span className={'font-bold text-amber-500'}>
					{props.limit.data.portfolios < 61 ? props.limit.data.portfolios : '∞'}
				</span>
				portfolio{props.limit.data.portfolios > 1 ? 's' : ''}
			</div>
			<div className={'flex gap-1'}>
				<span className={'font-bold text-amber-500'}>
					{props.limit.data.ptokens < 61 ? props.limit.data.ptokens : '∞'}
				</span>
				tokens perso
			</div>
			<div className={'flex gap-1'}>
				<span className={'font-bold text-amber-500'}>
					{props.limit.data.exchanges < 61 ? props.limit.data.exchanges : '∞'}
				</span>
				exchange{props.limit.data.portfolios > 1 ? 's' : ''}
			</div>
			<div className={'flex gap-1'}>
				<span className={'font-bold text-amber-500'}>
					{props.limit.data.wallets < 61 ? props.limit.data.wallets : '∞'}
				</span>
				wallet{props.limit.data.portfolios > 1 ? 's' : ''}
			</div>
			<span className="font-bold">{props.offerName}</span>
		</div>
	)
}
