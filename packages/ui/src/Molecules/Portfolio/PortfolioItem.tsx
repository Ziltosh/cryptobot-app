import '../../index.css'
import { twMerge } from 'tailwind-merge'
import { Currency } from '../../Atoms/Currency/Currency'
import { Text } from '../../Atoms/Text/Text'
import { FaTrashAlt, MdOutlineAddBox } from 'react-icons/all'
import { Percent } from '../../Atoms/Percent/Percent'
import React from 'react'
import { PortfolioStatsLocalDB } from '@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types'
import { usePortfolioLogs } from '@cryptobot/shared/src/hooks/blink/portfolio'

type PresetProps = {
	default: {
		name: string
		stats: PortfolioStatsLocalDB[]
		type: 'local' | 'cloud'
		isUpdating: boolean
		onDelete?: () => void
	}
	add: {}
}

type Preset = keyof PresetProps

type Props<P extends Preset> = PresetProps[P] & {
	preset: P
	onClick: () => void
}

const baseClasses = ['p-3', 'bg-slate-200', 'shadow-sm', 'grow', 'cursor-pointer']

const classes: Record<keyof PresetProps, string[]> = {
	default: [...baseClasses, 'grow', 'w-1/4', 'xl:w-1/5', '2xl:w-1/6'],
	add: [...baseClasses, 'flex', 'items-center', 'justify-center', 'w-1/4', 'xl:w-1/5', '2xl:w-1/6'],
}

export const PortfolioItem = <P extends Preset>(props: Props<P>) => {
	const classesToApply = twMerge(classes[props.preset || 'default'])

	const [isLoading, setIsLoading] = React.useState(false)

	const { currentMessage } = usePortfolioLogs()

	if (props.preset === 'default') {
		const castProps = props as Props<'default'>

		return (
			<div
				className={classesToApply}
				onClick={(_e) => {
					if (isLoading) return
					props.onClick()
					setIsLoading(true)
				}}
			>
				<div className="flex flex-row justify-between">
					<Text text={castProps.name} />
					<FaTrashAlt
						size={20}
						className={'text-slate-500'}
						onClick={(e) => {
							e.stopPropagation()
							const castProps = props as Props<'default'>
							if (castProps.onDelete) castProps.onDelete()
						}}
					/>
				</div>
				{!castProps.isUpdating && (
					<>
						<Currency value={castProps.stats[0]?.total} preset={'portfolio:value'} />
						<div className="flex flex-row justify-between">
							{castProps.stats[0]?.evolutionPct > 0 && (
								<div className={'text-green-700 flex'}>
									<Percent value={castProps.stats[0]?.evolutionPct} /> &nbsp; (
									<Currency value={castProps.stats[0]?.evolutionValue} />)
								</div>
							)}
							{castProps.stats[0]?.evolutionPct < 0 && (
								<div className={'text-red-700 flex'}>
									<Percent value={castProps.stats[0]?.evolutionPct} /> &nbsp; (
									<Currency value={castProps.stats[0]?.evolutionValue} />)
								</div>
							)}
							<Text preset={'small'} text={castProps.type === 'local' ? 'local' : 'serveur'} />
						</div>
					</>
				)}

				{castProps.isUpdating && (
					<Text
						text={'Mise à jour en cours...'}
						preset={'default'}
						className={'font-bold py-2 text-amber-500'}
					/>
				)}

				{isLoading && (
					<Text text={currentMessage || ''} preset={'default'} className={'font-bold py-2 text-amber-500'} />
				)}
			</div>
		)
	} else {
		return (
			<div className={classesToApply} onClick={props.onClick}>
				<MdOutlineAddBox size={50} className={'text-slate-300'} />
			</div>
		)
	}
}
