import '../../index.css'
import { twMerge } from 'tailwind-merge'
import { Text } from '../../Atoms/Text/Text'
import { FaTrashAlt, MdOutlineAddBox } from 'react-icons/all'
import { PortfolioTokensLocalDB } from '@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types'
import { PortfolioToken } from './PortfolioToken'

type PresetProps = {
	default: {
		name: string
		address: string
		tokens: PortfolioTokensLocalDB[]
		onSelectToken: (token: PortfolioTokensLocalDB) => void
		onDelete?: () => void
	}
	add: {}
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

const baseClasses = ['p-2', 'bg-slate-200', 'grow', 'cursor-pointer', 'mb-2']

const classes: Record<keyof PresetProps, string[]> = {
	default: [...baseClasses, 'grow', 'w-full', 'flex', 'justify-between', 'items-center'],
	add: [...baseClasses, 'flex', 'items-center', 'justify-center', 'w-full'],
}

export const PortfolioWallet = <P extends Preset>(props: Props<P>) => {
	const classesToApply = twMerge(classes[props.preset || 'default'])

	if (props.preset === 'default') {
		return (
			<>
				<div className={classesToApply} onClick={props.onClick}>
					<Text preset={'portfolioWallet'} text={props.name} />
					<Text preset={'portfolioAddress'} text={props.address} />
					<FaTrashAlt size={15} className={'text-slate-800'} onClick={props.onDelete} />
				</div>

				<div className="flex flex-row gap-4 flex-wrap">
					{props.tokens
						// .filter((t) => t._origine === 'wallet')
						.map((token, index) => (
							<PortfolioToken
								preset={'default'}
								key={`token-${index}`}
								name={token._tokenApiData?.name || ''}
								logo={token._tokenApiData?.logo || ''}
								onClick={(): void => props.onSelectToken(token)}
							/>
						))}
				</div>
			</>
		)
	} else {
		return (
			<div className={classesToApply} onClick={props.onClick}>
				<MdOutlineAddBox size={28} className={'text-slate-300'} />
			</div>
		)
	}
}
